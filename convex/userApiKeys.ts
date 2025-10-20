import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Simple XOR encryption for API key storage
// Works in Convex without "use node" - compatible with V8 runtime
function encryptApiKey(apiKey: string): string {
  const secretKey = process.env.ENCRYPTION_SECRET;

  if (!secretKey) {
    throw new Error("ENCRYPTION_SECRET environment variable is required");
  }

  // XOR encryption - simple but effective for our use case
  let encrypted = "";
  for (let i = 0; i < apiKey.length; i++) {
    const keyChar = secretKey.charCodeAt(i % secretKey.length);
    const apiKeyChar = apiKey.charCodeAt(i);
    encrypted += String.fromCharCode(apiKeyChar ^ keyChar);
  }

  // Convert to base64 using btoa (available in V8)
  return btoa(encrypted);
}

function decryptApiKey(encryptedData: string): string {
  const secretKey = process.env.ENCRYPTION_SECRET;

  if (!secretKey) {
    throw new Error("ENCRYPTION_SECRET environment variable is required");
  }

  // Decode from base64 using atob (available in V8)
  const encrypted = atob(encryptedData);
  let decrypted = "";

  for (let i = 0; i < encrypted.length; i++) {
    const keyChar = secretKey.charCodeAt(i % secretKey.length);
    const encryptedChar = encrypted.charCodeAt(i);
    decrypted += String.fromCharCode(encryptedChar ^ keyChar);
  }

  return decrypted;
}

// Save or update user's Gemini API key
export const saveApiKey = mutation({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user from Clerk
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized: You must be logged in to save an API key");
    }

    const userId = identity.subject; // This is the Clerk user ID

    // Encrypt the API key before storing
    const encryptedKey = encryptApiKey(args.apiKey);

    // Check if user already has an API key
    const existingKey = await ctx.db
      .query("userApiKeys")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingKey) {
      // Update existing key
      await ctx.db.patch(existingKey._id, {
        geminiApiKey: encryptedKey,
        updatedAt: Date.now(),
      });
      return { success: true, message: "API key updated successfully" };
    } else {
      // Insert new key
      await ctx.db.insert("userApiKeys", {
        userId: userId,
        geminiApiKey: encryptedKey,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { success: true, message: "API key saved successfully" };
    }
  },
});

// Get user's Gemini API key (returns masked version for display)
export const getApiKey = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user from Clerk
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const userId = identity.subject;

    const apiKeyDoc = await ctx.db
      .query("userApiKeys")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!apiKeyDoc) {
      return null;
    }

    // Return a masked version for display purposes
    const decrypted = decryptApiKey(apiKeyDoc.geminiApiKey);
    const masked = `${decrypted.substring(0, 8)}${"*".repeat(
      20
    )}${decrypted.substring(decrypted.length - 4)}`;

    return {
      hasKey: true,
      maskedKey: masked,
      createdAt: apiKeyDoc.createdAt,
      updatedAt: apiKeyDoc.updatedAt,
    };
  },
});

// Get user's actual API key (for backend use)
export const getActualApiKey = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // This query is called from the API route with the authenticated userId
    // No need to re-verify here since auth is already done in the API route
    const apiKeyDoc = await ctx.db
      .query("userApiKeys")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!apiKeyDoc) {
      return null;
    }

    return {
      apiKey: decryptApiKey(apiKeyDoc.geminiApiKey),
    };
  },
});

// Delete user's API key
export const deleteApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user from Clerk
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const userId = identity.subject;

    const apiKeyDoc = await ctx.db
      .query("userApiKeys")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (apiKeyDoc) {
      await ctx.db.delete(apiKeyDoc._id);
      return { success: true, message: "API key deleted successfully" };
    }

    return { success: false, message: "No API key found" };
  },
});
