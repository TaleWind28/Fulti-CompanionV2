import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/firebase_admin';
import { FabulaUltimaCharacterScheme } from '$lib/zod';
export const load: PageServerLoad = async ({locals, params, fetch, url}) => {
    if(!locals.user)throw redirect(303,'/login');

    const characterId = params.characterId;
    const uid = locals.user.uid;

    const docRef = adminDB.collection('users').doc(uid).collection('characters').doc(characterId);
    const docSnap = await docRef.get();

    if(!docSnap.exists)throw error(404,'Personaggio non trovato')
    const result = FabulaUltimaCharacterScheme.safeParse(docSnap.data())

    if (!result.success) {
        console.error(`Dati corrotti per il personaggio ${characterId}:`, result.error);
        console.log(docSnap.data());
        throw error(500, 'I dati di questo personaggio sono corrotti o illeggibili.');
    }



    // 5. Restituisci il singolo personaggio, includendo il suo ID
    const characterData = {
        id: docSnap.id,
        ...result.data
    };
        console.log("finito")
    return{
        character:characterData
    }

}