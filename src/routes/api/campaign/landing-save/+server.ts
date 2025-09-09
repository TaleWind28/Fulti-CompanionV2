import { adminDB } from "$lib/firebase_admin";
import { type Campaign } from "$lib/zod";
import { error, json, type RequestHandler } from "@sveltejs/kit";



export const POST:RequestHandler = async ({request,locals, fetch})=>{

    
    const payload: Campaign = await request.json();
    
    const currentUser = locals.user;
    if(!currentUser){
        throw error(401,'Utente non autenticato');
    }

    if(!payload){
        throw error(400,'Payload non valido');
    }

    try{
        const campaignRef = adminDB.collection('campaigns').doc(payload.id);
        const doc = await campaignRef.get();

        if(!doc.exists){
            throw error(404,"Campagna non trovata");
        }

        await campaignRef.update(payload);

        console.log("aggiornato");
        if(payload.pages[0].content[0].type == 'object'){
            if(payload.pages[0].content[0].nextSessionAt){
                const title = "Data prossima sessione";
                const body = `Prossima Sessione fissata per:${payload.pages[0].content[0].nextSessionAt}`
                //manda notifica a tutti i giocatori, non al master
                for(let player of payload.players){
                    const res = await fetch('/api/fcm/send', {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({
                            userId:player.uid,
                            title: title,
                            body: body,
                            data: { url: '/dashboard' } // opzionale: link da aprire al click
                        })
                    });
                    console.info(`sent to player: ${player.nickname}`);
                }
                //provo per vedere se arriva, visto che non so come provare senza hostare:
                 const res = await fetch('/api/fcm/send', {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({
                            userId:payload.master,
                            title: title,
                            body: body,
                            data: { url: '/dashboard' } // opzionale: link da aprire al click
                        })
                    });
                    console.info(`sent to master`);

            }
        }
        return json({success:true,message:"Landing Salvata con successo"})
    }
    catch(err){
        console.error("errore: ",err);
        return json({success:false,message:`Errore: ${err}`});
    }

}