import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  prompts: defineTable({
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
    searchableText: v.optional(v.string()),
  })
    .index('by_prompt_id', ['id'])
    .index('by_category', ['category'])
    .searchIndex('search_prompts', {
      searchField: 'searchableText',
      filterFields: ['category'],
    }),

  userApiKeys: defineTable({
    userId: v.string(),
    geminiApiKey: v.string(), // Encriptada
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user_id', ['userId']),

  dailyGenerationUsage: defineTable({
    userId: v.string(),
    dayUtc: v.optional(v.string()),
    usedCount: v.number(),
    pendingCount: v.number(),
    pendingStartedAt: v.optional(v.number()),
    cooldownStartedAt: v.optional(v.number()),
    resetAt: v.optional(v.number()),
    lastUsedAt: v.optional(v.number()),
    lastModel: v.optional(v.string()),
    lastPromptId: v.optional(v.string()),
    lastSource: v.optional(v.string()),
  })
    .index('by_user_id', ['userId'])
    .index('by_user_day', ['userId', 'dayUtc']),
});
