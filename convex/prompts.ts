import { mutation, query, type QueryCtx } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

async function attachPreviewUrl<T extends { previewStorageId?: string }>(
  ctx: QueryCtx,
  prompt: T
): Promise<T & { previewUrl: string | null }> {
  const previewUrl = prompt.previewStorageId
    ? await ctx.storage.getUrl(prompt.previewStorageId)
    : null;
  return { ...prompt, previewUrl };
}


export const getPrompts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const baseQuery =
      args.category && args.category !== 'All'
        ? ctx.db
            .query('prompts')
            .withIndex('by_category', (q) => q.eq('category', args.category!))
        : ctx.db.query('prompts');

    const result = await baseQuery.order('asc').paginate(args.paginationOpts);
    const page = await Promise.all(
      result.page.map((prompt) => attachPreviewUrl(ctx, prompt))
    );
    return { ...result, page };
  },
});

export const getPromptById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const prompt = await ctx.db
      .query('prompts')
      .withIndex('by_prompt_id', (q) => q.eq('id', args.id))
      .first();

    if (!prompt) {
      return null;
    }

    const withPreview = await attachPreviewUrl(ctx, prompt);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        ...withPreview,
        prompt: null,
      };
    }

    return withPreview;
  },
});

export const getCategories = query({
  handler: async (ctx) => {
    const prompts = await ctx.db.query('prompts').collect();
    const categories = [
      ...new Set(
        prompts
          .map((p) => p.category)
          .filter((c): c is string => typeof c === 'string')
      ),
    ];
    return categories.sort();
  },
});

export const getPromptsSearch = query({
  args: {
    searchQuery: v.string(),
    category: v.optional(v.string()),
    numItems: v.number(),
    offset: v.number(),
  },
  handler: async (ctx, args) => {
    const queryTrimmed = args.searchQuery.trim();
    const hasSearch = queryTrimmed.length > 0;
    const categoryFilter =
      args.category && args.category !== 'All' ? args.category : undefined;

    if (hasSearch) {
      const baseQuery = ctx.db
        .query('prompts')
        .withSearchIndex('search_prompts', (q) => {
          let expr = q.search('searchableText', queryTrimmed);
          if (categoryFilter) {
            expr = expr.eq('category', categoryFilter);
          }
          return expr;
        });

      const all = await baseQuery.take(200);
      const totalCount = all.length;
      const page = all.slice(args.offset, args.offset + args.numItems);
      const hasMore = args.offset + args.numItems < totalCount;

      const pageWithPreview = await Promise.all(
        page.map((prompt) => attachPreviewUrl(ctx, prompt))
      );

      return { page: pageWithPreview, totalCount, hasMore };
    }

    let items = await ctx.db.query('prompts').collect();
    if (categoryFilter) {
      items = items.filter((p) => p.category === categoryFilter);
    }

    const totalCount = items.length;
    const page = items.slice(args.offset, args.offset + args.numItems);
    const hasMore = args.offset + args.numItems < totalCount;

    const pageWithPreview = await Promise.all(
      page.map((prompt) => attachPreviewUrl(ctx, prompt))
    );

    return { page: pageWithPreview, totalCount, hasMore };
  },
});

