import { v } from 'convex/values';
import {
  internalMutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from './_generated/server';

const DAILY_CREDITS_LIMIT = 10;
const PENDING_TTL_MS = 10 * 60 * 1000;
const CREDIT_RESET_WINDOW_MS = 24 * 60 * 60 * 1000;

function getUtcDayKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function getResetAtFrom(timestamp: number) {
  return timestamp + CREDIT_RESET_WINDOW_MS;
}

function isPendingStale(
  pendingCount: number,
  pendingStartedAt: number | undefined,
  now: number
) {
  if (pendingCount <= 0 || pendingStartedAt === undefined) {
    return false;
  }

  return now - pendingStartedAt > PENDING_TTL_MS;
}

function buildMetadataPatch(model: string, promptId?: string) {
  return {
    lastModel: model,
    lastSource: 'credits',
    ...(promptId ? { lastPromptId: promptId } : {}),
  };
}

function getDocActivityTimestamp(doc: {
  cooldownStartedAt?: number;
  lastUsedAt?: number;
  pendingStartedAt?: number;
  _creationTime: number;
}) {
  return (
    doc.cooldownStartedAt ??
    doc.lastUsedAt ??
    doc.pendingStartedAt ??
    doc._creationTime
  );
}

async function getLatestUsageDoc(ctx: QueryCtx | MutationCtx, userId: string) {
  const usageDocs = await ctx.db
    .query('dailyGenerationUsage')
    .withIndex('by_user_id', (q) => q.eq('userId', userId))
    .collect();

  if (usageDocs.length === 0) {
    return null;
  }

  return usageDocs.reduce((latest: (typeof usageDocs)[number], current: (typeof usageDocs)[number]) =>
    getDocActivityTimestamp(current) > getDocActivityTimestamp(latest)
      ? current
      : latest
  );
}

function getEffectiveUsageState(
  usageDoc:
    | {
        usedCount: number;
        pendingCount: number;
        pendingStartedAt?: number;
        resetAt?: number;
      }
    | null,
  now: number
) {
  if (!usageDoc) {
    return {
      usedCount: 0,
      pendingCount: 0,
      hasPendingGeneration: false,
      remainingCount: DAILY_CREDITS_LIMIT,
      resetAtUtc: null as number | null,
      cooldownExpired: false,
    };
  }

  const cooldownExpired =
    usageDoc.usedCount >= DAILY_CREDITS_LIMIT &&
    usageDoc.resetAt !== undefined &&
    usageDoc.resetAt <= now;

  if (cooldownExpired) {
    return {
      usedCount: 0,
      pendingCount: 0,
      hasPendingGeneration: false,
      remainingCount: DAILY_CREDITS_LIMIT,
      resetAtUtc: null as number | null,
      cooldownExpired: true,
    };
  }

  const hasPendingGeneration =
    usageDoc.pendingCount > 0 &&
    !isPendingStale(usageDoc.pendingCount, usageDoc.pendingStartedAt, now);

  return {
    usedCount: usageDoc.usedCount,
    pendingCount: hasPendingGeneration ? usageDoc.pendingCount : 0,
    hasPendingGeneration,
    remainingCount: Math.max(DAILY_CREDITS_LIMIT - usageDoc.usedCount, 0),
    resetAtUtc:
      usageDoc.usedCount >= DAILY_CREDITS_LIMIT ? (usageDoc.resetAt ?? null) : null,
    cooldownExpired: false,
  };
}

export const getDailyCreditsStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized: You must be logged in');
    }

    const now = Date.now();
    const usageDoc = await getLatestUsageDoc(ctx, identity.subject);
    const effectiveState = getEffectiveUsageState(usageDoc, now);

    return {
      dayUtc: getUtcDayKey(now),
      limit: DAILY_CREDITS_LIMIT,
      usedCount: effectiveState.usedCount,
      pendingCount: effectiveState.pendingCount,
      remainingCount: effectiveState.remainingCount,
      hasPendingGeneration: effectiveState.hasPendingGeneration,
      resetAtUtc: effectiveState.resetAtUtc,
    };
  },
});

export const reserveDailyCreditGeneration = internalMutation({
  args: {
    userId: v.string(),
    model: v.string(),
    promptId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existingUsage = await getLatestUsageDoc(ctx, args.userId);
    const effectiveState = getEffectiveUsageState(existingUsage, now);

    if (effectiveState.hasPendingGeneration) {
      return {
        ok: false,
        reason: 'pending_in_progress' as const,
        remainingCount: effectiveState.remainingCount,
        resetAtUtc: effectiveState.resetAtUtc,
      };
    }

    if (effectiveState.usedCount >= DAILY_CREDITS_LIMIT) {
      return {
        ok: false,
        reason: 'limit_reached' as const,
        remainingCount: 0,
        resetAtUtc: effectiveState.resetAtUtc,
      };
    }

    const nextValues = {
      usedCount: effectiveState.usedCount,
      pendingCount: 1,
      pendingStartedAt: now,
      dayUtc: getUtcDayKey(now),
      ...buildMetadataPatch(args.model, args.promptId),
    };

    if (existingUsage) {
      await ctx.db.patch(existingUsage._id, nextValues);
    } else {
      await ctx.db.insert('dailyGenerationUsage', {
        userId: args.userId,
        ...nextValues,
      });
    }

    return {
      ok: true,
      remainingCount: effectiveState.remainingCount,
      resetAtUtc: effectiveState.resetAtUtc,
    };
  },
});

export const confirmDailyCreditGeneration = internalMutation({
  args: {
    userId: v.string(),
    model: v.string(),
    promptId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const usageDoc = await getLatestUsageDoc(ctx, args.userId);

    if (!usageDoc) {
      throw new Error('No credit reservation found for this user');
    }

    const effectiveState = getEffectiveUsageState(usageDoc, now);
    const nextPendingCount = Math.max(effectiveState.pendingCount - 1, 0);
    const nextUsedCount = effectiveState.usedCount + 1;
    const hasReachedLimit = nextUsedCount >= DAILY_CREDITS_LIMIT;
    const resetAtUtc = hasReachedLimit ? getResetAtFrom(now) : null;

    await ctx.db.patch(usageDoc._id, {
      usedCount: nextUsedCount,
      pendingCount: nextPendingCount,
      ...(nextPendingCount > 0 ? { pendingStartedAt: usageDoc.pendingStartedAt } : {}),
      ...(hasReachedLimit
        ? {
            cooldownStartedAt: now,
            resetAt: resetAtUtc!,
          }
        : {}),
      lastUsedAt: now,
      dayUtc: getUtcDayKey(now),
      ...buildMetadataPatch(args.model, args.promptId),
    });

    return {
      ok: true,
      usedCount: nextUsedCount,
      remainingCount: Math.max(DAILY_CREDITS_LIMIT - nextUsedCount, 0),
      resetAtUtc,
    };
  },
});

export const releaseDailyCreditGeneration = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const usageDoc = await getLatestUsageDoc(ctx, args.userId);

    if (!usageDoc) {
      return {
        ok: true,
        remainingCount: DAILY_CREDITS_LIMIT,
        resetAtUtc: null as number | null,
      };
    }

    const effectiveState = getEffectiveUsageState(usageDoc, now);

    if (effectiveState.pendingCount <= 0) {
      return {
        ok: true,
        remainingCount: effectiveState.remainingCount,
        resetAtUtc: effectiveState.resetAtUtc,
      };
    }

    const nextPendingCount = Math.max(effectiveState.pendingCount - 1, 0);

    await ctx.db.patch(usageDoc._id, {
      pendingCount: nextPendingCount,
      ...(nextPendingCount > 0 ? { pendingStartedAt: usageDoc.pendingStartedAt } : {}),
      dayUtc: getUtcDayKey(now),
    });

    return {
      ok: true,
      remainingCount: effectiveState.remainingCount,
      resetAtUtc: effectiveState.resetAtUtc,
    };
  },
});
