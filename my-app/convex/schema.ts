import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    conversationId: v.float64(),
    messageContent: v.string(),
    messageUser: v.string(),
  }),
  documents: defineTable({
    url: v.string(),
    text: v.string(),
  }).index("byUrl", ["url"]),
});
