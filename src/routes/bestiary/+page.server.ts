import { adminDB } from '$lib/firebase_admin';
import { FabulaUltimaPNGScheme, pngSchema, type FabulaUltimaPNG } from '$lib/zod';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({url,locals,fetch}){
    const form = await superValidate(zod4(pngSchema));
    const currentUser = locals.user;

    if(!currentUser){
        console.log(url.pathname);
        throw redirect(302,`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }
    let species: string[] = [];
    //recupero i nomi delle specie dal db
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
    else{
        species = result.species
    }

    
    let validPNGS:FabulaUltimaPNG[] = [];

    try{
        const snapshot = await adminDB.collection('users').doc(currentUser.uid).collection('png').get();
        const png = snapshot.docs.map( doc =>{
            const result = FabulaUltimaPNGScheme.safeParse(doc.data());

            if(!result.success){
                console.warn(`Dati non validi per il documento ${doc.id}`);
                return null;
            }
            console.log(result,"result");
            return result.data;
        })
        validPNGS = png.filter((png):png is FabulaUltimaPNG => png !== null)
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

        const response = await fetch(`/api/png?speciesName=${form.data.species}`);
        const result = await response.json();
        let specie;
        if(result.success){
            console.log(result);
            specie = result.species
        }else{
            return fail(400,{form,message:"specie non riconosciuta"});
        }

        console.log(specie,"specie");

        try{
            const docRef =   adminDB.collection('users').doc(uid).collection('png').doc()
             
            const id = docRef.id;

            const createdPng = FabulaUltimaPNGScheme.parse({
                name:form.data.name,
                level:5,
                description:"",
                species:specie,
                statuses:{},
                affinities:{},
                stats:{},
                skills:[],
                specialRules:[],
                bonus:{hp:0,mp:0,def:0,mdef:0},
                id:id
            })

            await docRef.set(createdPng);
        }
        catch(err){
            console.error("Errore nel salvataggio del PNG completo su Firestore",err);
            return fail(500, {form, message:"Impossibile salvare il personaggio nel database"});
        }

        return {form};
    }
}