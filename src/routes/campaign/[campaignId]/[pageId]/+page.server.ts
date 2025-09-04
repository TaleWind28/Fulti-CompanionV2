import { adminDB } from "$lib/firebase_admin";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { campaignScheme } from "$lib/zod";


export const load: PageServerLoad  = async ({url, locals, params})=> {
    
    const snapshot = await adminDB.collection('campaigns').doc(params.campaignId).get();
    
    if(!snapshot) throw error(404,"campagna non trovata");
        
    const raw = {id:snapshot.id, ...snapshot.data()};

    const parsed = campaignScheme.safeParse(raw)

    if(!parsed.success){
        console.error(parsed.error.flatten());
        throw error(500,"dati non validi");
    }

    const pages = parsed.data.pages;

    const requiredPage = pages.find((page) => page.id === params.pageId);
    if(!requiredPage) throw redirect(304,`/campaigns/${params.campaignId}`)

    return {
        pageId:params.pageId,
        page:requiredPage,
        campaignId:params.campaignId
    }
}