import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
      await ctx.db.insert("prompts", prompt);
    }
  },
});

export const getPrompts = query({
  handler: async (ctx) => {
    return await ctx.db.query("prompts").collect();
  },
});
