
import { mutation } from './_generated/server';

export default mutation(async ({ db }, { messageContent, messageUser }) => {
  const message = {
	  conversationId: 22,
    messageContent,
    messageUser
  };

  await db.insert('messages', message);
});

