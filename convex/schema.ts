import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
  }).index("by_prompt_id", ["id"]),
});
