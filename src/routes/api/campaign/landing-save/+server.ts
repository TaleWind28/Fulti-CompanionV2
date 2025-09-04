import { adminDB } from "$lib/firebase_admin";
import { campaignScheme, type Campaign } from "$lib/zod";
import { error, json, type RequestHandler } from "@sveltejs/kit";


export const POST:RequestHandler = async ({request,locals})=>{
    const payload: Campaign = await request.json();
    
    const currentUser = locals.user;
    if(!currentUser){
        throw error(401,'Utente non autenticato');
    }

    if(!payload){
        throw error(400,'Payload non valido');
    }

    const uid = currentUser.uid;

    try{
        const campaignRef = adminDB.collection('campaigns').doc(payload.id);
        const doc = await campaignRef.get();

        if(!doc.exists){
            throw error(404,"Campagna non trovata");
        }

        /* QUESTO HA POCO SENSO PERCHè QUANDO UN GIOCATORE SI AGGIUNGE LA PAGINA DEVE SALVARE SU FIRESTORE */
        // const parse = campaignScheme.safeParse(doc.data());
        
        // if(!parse.success)throw error(400,"campagna non valida");
        
        // const parsedCampaign = parse.data;
        

        // if(parsedCampaign.master !== uid){
        //     throw error(401,'Solo il master può modificare la landingPage');
        // }
        
        await campaignRef.update(payload);

        console.log("aggiornato");

        return json({success:true,message:"Landing Salvata con successo"})
    }
    catch(err){
        console.error("errore: ",err);
        return json({success:false,message:`Errore: ${err}`});
    }

}