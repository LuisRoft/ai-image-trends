import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';

const DAILY_CREDITS_LIMIT = 10;
const PENDING_TTL_MS = 10 * 60 * 1000;

function getUtcDayKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function getNextUtcReset(timestamp: number) {
  const date = new Date(timestamp);
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() + 1,
    0,
    0,
    0,
    0
  );
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

export const getDailyCreditsStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized: You must be logged in');
    }

    const now = Date.now();
    const dayUtc = getUtcDayKey(now);
    const usageDoc = await ctx.db
      .query('dailyGenerationUsage')
      .withIndex('by_user_day', (q) =>
        q.eq('userId', identity.subject).eq('dayUtc', dayUtc)
      )
      .first();

    const hasPendingGeneration = usageDoc
      ? usageDoc.pendingCount > 0 &&
        !isPendingStale(usageDoc.pendingCount, usageDoc.pendingStartedAt, now)
      : false;

    return {
      dayUtc,
      limit: DAILY_CREDITS_LIMIT,
      usedCount: usageDoc?.usedCount ?? 0,
      pendingCount: hasPendingGeneration ? usageDoc?.pendingCount ?? 0 : 0,
      remainingCount: Math.max(
        DAILY_CREDITS_LIMIT - (usageDoc?.usedCount ?? 0),
        0
      ),
      hasPendingGeneration,
      resetAtUtc: getNextUtcReset(now),
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
    const dayUtc = getUtcDayKey(now);
    const existingUsage = await ctx.db
      .query('dailyGenerationUsage')
      .withIndex('by_user_day', (q) =>
        q.eq('userId', args.userId).eq('dayUtc', dayUtc)
      )
      .first();

    const stalePending = existingUsage
      ? isPendingStale(
          existingUsage.pendingCount,
          existingUsage.pendingStartedAt,
          now
        )
      : false;

    const currentUsedCount = existingUsage?.usedCount ?? 0;
    const currentPendingCount = stalePending ? 0 : existingUsage?.pendingCount ?? 0;

    if (currentPendingCount > 0) {
      return {
        ok: false,
        reason: 'pending_in_progress' as const,
        remainingCount: Math.max(DAILY_CREDITS_LIMIT - currentUsedCount, 0),
        resetAtUtc: getNextUtcReset(now),
      };
    }

    if (currentUsedCount >= DAILY_CREDITS_LIMIT) {
      return {
        ok: false,
        reason: 'limit_reached' as const,
        remainingCount: 0,
        resetAtUtc: getNextUtcReset(now),
      };
    }

    if (existingUsage) {
      await ctx.db.patch(existingUsage._id, {
        pendingCount: 1,
        pendingStartedAt: now,
        ...buildMetadataPatch(args.model, args.promptId),
      });
    } else {
      await ctx.db.insert('dailyGenerationUsage', {
        userId: args.userId,
        dayUtc,
        usedCount: 0,
        pendingCount: 1,
        pendingStartedAt: now,
        ...buildMetadataPatch(args.model, args.promptId),
      });
    }

    return {
      ok: true,
      remainingCount: Math.max(DAILY_CREDITS_LIMIT - currentUsedCount, 0),
      resetAtUtc: getNextUtcReset(now),
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
    const dayUtc = getUtcDayKey(now);
    const usageDoc = await ctx.db
      .query('dailyGenerationUsage')
      .withIndex('by_user_day', (q) =>
        q.eq('userId', args.userId).eq('dayUtc', dayUtc)
      )
      .first();

    if (!usageDoc) {
      throw new Error('No credit reservation found for this user');
    }

    const nextPendingCount = Math.max(usageDoc.pendingCount - 1, 0);
    const nextUsedCount = usageDoc.usedCount + 1;

    await ctx.db.patch(usageDoc._id, {
      usedCount: nextUsedCount,
      pendingCount: nextPendingCount,
      ...(nextPendingCount > 0 && usageDoc.pendingStartedAt !== undefined
        ? { pendingStartedAt: usageDoc.pendingStartedAt }
        : {}),
      lastUsedAt: now,
      ...buildMetadataPatch(args.model, args.promptId),
    });

    return {
      ok: true,
      usedCount: nextUsedCount,
      remainingCount: Math.max(DAILY_CREDITS_LIMIT - nextUsedCount, 0),
      resetAtUtc: getNextUtcReset(now),
    };
  },
});

export const releaseDailyCreditGeneration = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const dayUtc = getUtcDayKey(now);
    const usageDoc = await ctx.db
      .query('dailyGenerationUsage')
      .withIndex('by_user_day', (q) =>
        q.eq('userId', args.userId).eq('dayUtc', dayUtc)
      )
      .first();

    if (!usageDoc || usageDoc.pendingCount <= 0) {
      return {
        ok: true,
        remainingCount: Math.max(DAILY_CREDITS_LIMIT - (usageDoc?.usedCount ?? 0), 0),
      };
    }

    const nextPendingCount = Math.max(usageDoc.pendingCount - 1, 0);

    await ctx.db.patch(usageDoc._id, {
      pendingCount: nextPendingCount,
      ...(nextPendingCount > 0 && usageDoc.pendingStartedAt !== undefined
        ? { pendingStartedAt: usageDoc.pendingStartedAt }
        : {}),
    });

    return {
      ok: true,
      remainingCount: Math.max(DAILY_CREDITS_LIMIT - usageDoc.usedCount, 0),
      resetAtUtc: getNextUtcReset(now),
    };
  },
});
