import { adminDB } from '$lib/firebase_admin';
import { FabulaUltimaPNGScheme, pngSchema, type FabulaUltimaPNG } from '$lib/zod';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({url,locals,fetch}){
    const form = await superValidate(zod4(pngSchema));
    const currentUser = locals.user;

    if(!currentUser){
        console.log(url.pathname);
        throw redirect(302,`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }
    let species: string[] = [];
    //recupero le specie dal db
    // const response = await fetch('/api/png',{
    //     method:'GET',
    //     headers:{
    //         'Content-Type' : 'application/json'
    //     }
    // })

    // const result = await response.json();
    
    // if(!result.success){
    //     console.error("Errore nel recupero delle specie: ",result.message);
    // }
    // else{
    //     species = result.data
    // }

    
    let validPNGS:FabulaUltimaPNG[] = [];

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

export const actions: Actions = {
    default: async ({request,locals,fetch}) =>{
        const form = await superValidate(request,zod4(pngSchema));
        
        if(!form.valid){
            return fail(400,{form,message:'Form non valido'});
        }

        const currentUser = locals.user;
        if(!currentUser){
            return fail(401,{form,message:'devi essere loggato per creare un personaggio'});
        }

        const uid = currentUser.uid;

        const response = await fetch(`/api/png?speciesName=${form.data.specie}`);
        const result = await response.json();
        let specie;
        if(result.success){
            console.log(result);
            specie = result.species
        }

        const createdPng = FabulaUltimaPNGScheme.parse({
            name:form.data.name,
            level:5,
            description:"",
            species:specie,
            status:{},
            affinities:{},
            stats:{},
            id:"notyetCreated"
        })

        try{
            await  adminDB.collection('users').doc(uid).collection('png').add(createdPng)
        }
        catch(err){
            console.error("Errore nel salvataggio del PNG completo su Firestore",err);
            return fail(500, {form, message:"Impossibile salvare il personaggio nel database"});
        }

        return {form};
    }
}