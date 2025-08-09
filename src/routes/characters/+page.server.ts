// src/routes/dashboard/+page.server.js

import { adminDB } from '$lib/firebase_admin'; // Importa l'istanza del DB admin
import { FabulaUltimaCharacterScheme, type FabulaUltimaCharacter } from '$lib/zod.js';
import { error, redirect } from '@sveltejs/kit';


export async function load({ locals }) {

    const currentUser = locals.user;

    if (!currentUser) {
        throw redirect(303, '/login');
    }

    const uid = currentUser.uid;

    try {
        const snapshot = await adminDB.collection('users').doc(uid).collection('characters').get();

        const characters = snapshot.docs
            .map(doc => {
                // `safeParse` tenta di validare i dati del documento
                console.log(doc.data());
                const result = FabulaUltimaCharacterScheme.safeParse(doc.data());
                

                // Se la validazione ha successo, restituisci l'oggetto validato e tipizzato,
                // aggiungendo l'ID del documento che non fa parte dello schema.
                if (result.success) {
                    return {
                        id: doc.id,
                        ...result.data
                    };
                } else {
                    // Se i dati non sono validi, logga l'errore per il debug
                    console.warn(`Dati non validi per il documento ${doc.id}:`, result.error.flatten());
                    return null; // Restituisci null per i dati non validi
                }
            })
            
            const validCharacters = characters.filter((character):character is FabulaUltimaCharacter & {id:string} => character !==null)


        return {
            characters: validCharacters
        };

    } catch (err) {
        console.error("Errore nel recuperare i personaggi da Firestore:", err);
        throw error(500, "Non è stato possibile caricare i dati dei personaggi.");
    }
}