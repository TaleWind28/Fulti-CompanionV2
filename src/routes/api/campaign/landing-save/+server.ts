import { adminDB } from "$lib/firebase_admin";
import { campaignScheme } from "$lib/zod";
import { error, json, type RequestHandler } from "@sveltejs/kit";


export const POST:RequestHandler = async ({request,locals})=>{
    const payload = await request.json();
    
    const currentUser = locals.user;
    if(!currentUser){
        throw error(401,'Utente non autenticato');
    }

    if(!payload){
        throw error(400,'Payload non valido');
    }

    const uid = currentUser.uid;

    try{
        const ref = adminDB.collection('campaigns').doc(payload.campaignId);
        const snapshot = await ref.get();
        
        const parse = campaignScheme.safeParse(snapshot.data());
        
        if(!parse.success)throw error(400,"campagna non valida");
        
        const campaign = parse.data;
        
        if(campaign.master !== uid){
            throw error(401,'Solo il master può modificare la landingPage');
        }

        
        

        if(campaign.pages[0].content[0].type === 'object'){
            campaign.pages[0].content[0].objectives = payload.objectives;
            campaign.pages[0].content[0].wiki = payload.wiki;
            campaign.pages[0].content[0].nextSessionAt = payload.nextSessionAt;
        }
        const pages = [...campaign.pages]
        console.log(pages[0].content,"mod");

        await ref.update({pages});

        return json({success:true,message:"Landing Salvata con successo"})

    }
    catch(err){
        console.error("errore: ",err);
        return json({success:false,message:`Errore: ${err}`});
    }

}