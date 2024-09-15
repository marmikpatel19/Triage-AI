
import { mutation } from './_generated/server';

export default mutation(async ({ db }, { summaryContent }) => {
  const summary = {
	  conversationId: 22,
    summaryContent
  };

  await db.insert('summary', summary);
});
