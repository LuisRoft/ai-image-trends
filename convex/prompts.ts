import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

export const addPrompts = mutation({
  args: {
    prompts: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        category: v.string(),
        prompt: v.string(),
        inputs: v.array(
          v.object({
            key: v.string(),
            type: v.string(),
            description: v.string(),
            required: v.boolean(),
            placeholder: v.optional(v.string()),
          })
        ),
        outputType: v.string(),
        difficulty: v.string(),
        tags: v.array(v.string()),
        author: v.string(),
        sourceUrl: v.string(),
        imageUrl: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const prompt of args.prompts) {
      const searchableText = [
        prompt.title,
        prompt.description,
        prompt.category,
        ...prompt.tags,
      ].join(' ');
      await ctx.db.insert('prompts', { ...prompt, searchableText });
    }
  },
});

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

    return await baseQuery.order('asc').paginate(args.paginationOpts);
  },
});

export const getPromptById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('prompts')
      .withIndex('by_prompt_id', (q) => q.eq('id', args.id))
      .first();
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

      return { page, totalCount, hasMore };
    }

    let items = await ctx.db.query('prompts').collect();
    if (categoryFilter) {
      items = items.filter((p) => p.category === categoryFilter);
    }

    const totalCount = items.length;
    const page = items.slice(args.offset, args.offset + args.numItems);
    const hasMore = args.offset + args.numItems < totalCount;

    return { page, totalCount, hasMore };
  },
});

export const backfillSearchableText = mutation({
  handler: async (ctx) => {
    const prompts = await ctx.db.query('prompts').collect();
    let updated = 0;
    for (const p of prompts) {
      if (!p.searchableText) {
        const searchableText = [
          p.title,
          p.description,
          p.category,
          ...p.tags,
        ].join(' ');
        await ctx.db.patch(p._id, { searchableText });
        updated++;
      }
    }
    return { updated, total: prompts.length };
  },
});
