import { adminDB } from "$lib/firebase_admin";
import { campaignScheme, type Campaign } from "$lib/zod";
import type { Page } from "$lib/zodPages";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PUT:RequestHandler = async({request, locals}) =>{
    const payload = await request.json();
        
    const currentUser = locals.user;
    if(!currentUser){
        throw error(401,'Utente non autenticato');
    }

    if(!payload){
        throw error(400,'Payload non valido');
    }

    try{
        const campaignRef = adminDB.collection('campaigns').doc(payload.campaignId);
        const doc = await campaignRef.get();

        if(!doc.exists){
            throw error(404,"Campagna non trovata");
        }

        const result = campaignScheme.safeParse(doc.data());
        if(!result.success){
            throw error(400,'Dati non validi');
        }
        let campaign = result.data;

          // cerca la pagina giusta dentro l'array pages
        const pages = campaign.pages ?? [];
        const pageIndex = pages.findIndex((p: any) => p.id === payload.page.id);
        

        if (pageIndex === -1) {
            throw error(404, 'Pagina non trovata');
        }

        // aggiorna i campi necessari
        pages[pageIndex] = {
            ...payload.page,
        };

        // salva l'array aggiornato
        await campaignRef.update({ pages })

        console.log("aggiornato");

        return json({success:true,message:"Pagina Salvata con successo"})
    }
    catch(err){
        console.error("errore: ",err);
        return json({success:false,message:`Errore: ${err}`});
    }
}