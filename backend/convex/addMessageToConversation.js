import { mutation } from './_generated/server';

export default mutation(async ({ db }, { conversationId, message }) => {
  const conversation = await db.query('conversations').filter(q => q.eq(q.field('id'), conversationId)).first();

  if (!conversation) {
    throw new Error(`Conversation with id ${conversationId} not found`);
  }

  // Append the new message to the existing messages array
  const updatedMessages = [...conversation.messages, message];

  // Update the conversation with the new messages array
  await db.patch(conversation._id, {
    messages: updatedMessages,
  });
});

