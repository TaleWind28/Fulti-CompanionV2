// src/routes/characters/[characterId]/+page.server.ts
import { adminDB } from '$lib/firebase_admin';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { FabulaUltimaCharacterScheme, type FabulaUltimaCharacter } from '$lib/zod.js';
import { retrieveSpellClasses } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, params, fetch, url }) => {
    // Guardia di sicurezza: l'utente deve essere loggato
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // 1. Ottieni l'ID del personaggio direttamente dall'URL
    const characterId = params.characterId;
    const uid = locals.user.uid;
    const otherPlayerUid = url.searchParams.get('uid');
    const master = url.searchParams.get('master') || "";

    let classNames:string[] = [];
    //fetcho l'api per il recupero delle classi e le memorizzo nella variabile classnames
    const response = await fetch('/api/characters',{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();
    if (!result.success) {
        console.error("Errore nel recupero delle classi:", result.message);
    }else{
        classNames = result.classNames;
    }
    
    
    try {
        // 2. Interroga Firestore per ottenere UN SOLO documento
        let docRef;

        //controllo se l'utente che sta accedendo alla pagina è il "proprietario"
        if(otherPlayerUid){
            docRef = adminDB.collection('users').doc(otherPlayerUid).collection('characters').doc(characterId);
        }
        else{
            docRef = adminDB.collection('users').doc(uid).collection('characters').doc(characterId);
        }


        
        const docSnap = await docRef.get();


        // 3. Gestisci il caso in cui il personaggio non esista
        if (!docSnap.exists) {
            throw error(404, 'Personaggio non trovato'); // Lancia un errore 404
        }
        
        // 4. Valida i dati con Zod, come prima
        const result = FabulaUltimaCharacterScheme.safeParse(docSnap.data());

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

        //recupero le lise disponibili
        const characterSpellList:string[] = retrieveSpellClasses(characterData);

        const spellListParams = encodeURIComponent(JSON.stringify(characterSpellList))
        // Costruisci l'URL con i parametri
        const url = `/api/spells?spellList=${spellListParams}`;
        // Crea l'URL con i parametri
        
        /*recupero le liste di incantesimi dal db*/
        const spellResponse = await fetch(url,{
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        })

        const spellResult = await spellResponse.json();
        let availableSpells;
        if(!spellResult.success){
            console.error("Errore nel recupero delle liste di incatesimi");    
            availableSpells = []
        }else{
            availableSpells = spellResult.spells;
        }

        return {
            character: characterData,
            classNames: classNames,
            availableSpells: availableSpells,
            master: master,
            owner:otherPlayerUid
        };

    } catch (err:any) {
        // Se l'errore non è quello che abbiamo lanciato noi, è un errore del server
        if (err.status !== 404 && err.status !== 500) {
           console.error("Errore del server nel caricare il personaggio:", err);
           throw error(500, "Impossibile caricare il personaggio in questo momento.");
        }
        // Altrimenti, ri-lancia l'errore che abbiamo già creato (404 o 500)
        throw err;
    }
};


