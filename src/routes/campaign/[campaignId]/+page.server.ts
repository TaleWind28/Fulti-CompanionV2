import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { adminDB } from "$lib/firebase_admin";
import { campaignScheme, type FabulaUltimaCharacter } from "$lib/zod";

export const load: PageServerLoad = async ({params,locals,url,fetch})=>{
    const {campaignId} = params;
    const currentUser = locals.user;
    let userCharacters:{name:string,id:string}[] = [];

    if(!currentUser){
        console.info("Unknown User: Redirecting");
        throw redirect(302,`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
    }

    const snapshot = await adminDB.collection('campaigns').doc(campaignId).get();

    if(!snapshot) throw error(404,"campagna non trovata");
    
    const raw = {id:snapshot.id, ...snapshot.data()};

    const parsed = campaignScheme.safeParse(raw)

    if(!parsed.success){
        console.error(parsed.error.flatten());
        throw error(500,"dati non validi");
    }

    const response = await fetch(`/api/characters?id=${currentUser.uid}`,{
            method:'GET',
            headers:{
                'Content-Type' : 'application/json'
            },
        })
    
        if(response.ok){
            const result = await response.json();
            if(!result.success){
                throw Error("La richiesta non ha avuto successo");
            }
            
            const validCharacters:[] = result.characters;
            console.log(validCharacters);
            userCharacters = validCharacters.map(({id,name})=> ({id,name}));
           
        }

    return {
        campaignId:params.campaignId,
        campaign: parsed.data,
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        characters: userCharacters
    }
}