import { adminDB } from '$lib/firebase_admin';
import { FabulaUltimaPNGScheme } from '$lib/zod';
import { error, redirect } from '@sveltejs/kit';

export async function load({url,locals,fetch, params}){
    if(!locals.user){
        throw redirect(303,'/login');
    }

    //ottieni l'id del png
    const pgnId = params.pngId;
    const uid = locals.user.uid;

    try{
        const docRef= adminDB.collection('users').doc(uid).collection('png').doc(pgnId);
        const docSnap = await docRef.get();

        if(!docSnap.exists){
            throw error(404,'PNG non trovato');
        }

        const result = FabulaUltimaPNGScheme.safeParse(docSnap.data());

        if(!result.success){
            console.error(`Dati corrotti per il png: ${pgnId}: ${result.error}`);
            console.log(docSnap.data());
            throw error(500,'I dati di questo personaggio sono corrotti o illeggibili');
        }

        const pngData = result.data;

        return{
            png:pngData
        }


    }
    catch(error){

    }
}