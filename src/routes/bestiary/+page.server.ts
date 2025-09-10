import { adminDB } from '$lib/firebase_admin';
import { FabulaUltimaPNGScheme, pngSchema, type FabulaUltimaPNG } from '$lib/zod';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({url,locals,fetch}){
    const form = superValidate(zod4(pngSchema));
    const currentUser = locals.user;

    if(!currentUser){
        console.log(url.pathname);
        throw redirect(302,`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }
    let species: string[] = [];
    //recupero le specie dal db
    const response = await fetch('/api/png',{
        method:'GET',
        headers:{
            'Content-Type' : 'application/json'
        }
    })

    const result = await response.json();
    
    if(!result.success){
        console.error("Errore nel recupero delle specie: ",result.message);
    }

    let validPNGS;

    try{
        const snapshot = await adminDB.collection('users').doc(currentUser.uid).collection('pngs').get();
        const pngs = snapshot.docs.map( doc =>{
            const result = FabulaUltimaPNGScheme.safeParse(doc.data());

            if(!result.success){
                console.warn(`Dati non validi per il documento ${doc.id}`);
                return null;
            }
            return result.data;
        })
        validPNGS = pngs.filter((png):png is FabulaUltimaPNG => png !== null)
    }
    catch(err){
        console.error("Errore nel recuperare i PNG da firestore");
    }
    finally{
        return{
            pngs:validPNGS,
            form:form,
            species:species
        }
    }
}