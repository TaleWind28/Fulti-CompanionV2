import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { adminDB } from "$lib/firebase_admin";
import { campaignScheme } from "$lib/zod";

export const load: PageServerLoad = async ({params,locals,url})=>{
    const {campaignId} = params;
    const currentUser = locals.user;
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

    

    return {
        campaignId:params.campaignId,
        campaign: parsed.data
    }
}