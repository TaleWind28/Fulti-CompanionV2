import { adminDB } from "$lib/firebase_admin";
import { error, json, type RequestHandler } from "@sveltejs/kit";

// DELETE /api/campaigns/[id]
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const payload = await request.json();
    if (!payload) {
      throw error(400, 'ID mancante');
    }

    const campaignRef = adminDB.collection('campaigns').doc(payload.campaignId);
    const campaign = await campaignRef.get();
    console.log(campaign,"campagna");
    if(!campaign.exists){
      throw error(404,"Campagna inesistente");
    }
    
    await campaignRef.delete(); 
    return json({ success: true, message: `Documento ${payload.campaignId} eliminato con successo` });
  } catch (err) {
    console.error('Errore nella cancellazione:', err);
    throw error(500, 'Errore interno nella cancellazione');
  }
};