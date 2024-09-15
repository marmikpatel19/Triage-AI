import { mutation } from './_generated/server';

export default mutation(async ({ db }, { id, isLive, EMSName, medicalEmergencyType }) => {
  const conversation = {
    id,
    isLive,
    summary: null,
    title: null,
    urgency: null,
    dispatchConnected: false,
    EMSName,
    messages: [], // Empty array to store future messages
    medicalEmergencyType,
  };

  await db.insert('conversations', conversation);
});

