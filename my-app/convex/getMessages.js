import { query } from "./_generated/server";

export const listTasks = query({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    console.log(messages);
    return messages;
  },
});
