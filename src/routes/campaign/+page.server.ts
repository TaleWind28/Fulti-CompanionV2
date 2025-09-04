import { campaignSchema, campaignScheme } from '$lib/zod';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase_admin';


export const load:PageServerLoad = async ({url, locals}) => {
    console.info("chiamato");
    const form = await superValidate(zod4(campaignSchema));
    const currentUser = locals.user;

    if(!currentUser){
        console.info("Unkown User: Redirecting...");
        throw redirect(302,`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
    }

    //fetcho le campagne esistenti  
    const snapshot = await adminDB.collection('campaigns').get();

    const raws = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))
    console.log(raws,"raws");

    const parsed =  campaignScheme.array().safeParse(raws);
    console.log(parsed);
    if(parsed.success){
            return {
            form:form,
            campaigns: parsed.data
        }
    }else{
        return {
            form:form,
            campaigns:[]
        }
    }
    
}

export const actions:Actions ={
    default: async ({request, locals, fetch}) =>{
        const form = await superValidate(request,zod4(campaignSchema));

        if(!form.valid){
            return fail(400, {form, message:'Form non valido'});
        }

        const currentUser = locals.user;
        
        if (!currentUser) {
            return fail(401, { form, message: 'Devi essere loggato per creare una campagna.' });
        }

        const uid = currentUser.uid;
        const {name, description} = form.data;
        

        try{
            //creo il documento per avere l'id generato da firestore
            const docRef = adminDB.collection('campaigns').doc() 

            const id = docRef.id;

            //creo una landing page di defaul che poi il master potrà stilare
            const landingPage = {
                id:"landing",
                title:"landing",
                summary:description,
                coverImage:"",
                content:[{type:'object',objectives:[],wiki:[]}],
                tags:[],
                masterId:uid,//solo il master può creare la campagna e di conseguenza la landing
                ownerId: uid,//forse è meglio avere questo del displayname
                visibility:"private",
                status:"draft",
            }

            //creo la campagna aggiungendo l'id ottenuto da firestore
            const campaign = {
                name: name,
                description: description,
                pic: "/images/map-2.png",
                players: [],
                master: uid,
                pages: [landingPage],
                id:id 
            }
            //aggiorno il documento creato
            await docRef.set(campaign);
            console.info("form valido");

            return {
                form,
                id:campaign.id
            }
        }
        catch{
            return null;
        }

    }
}