// src/routes/dashboard/+page.server.js

import { adminDB } from '$lib/firebase_admin'; // Importa l'istanza del DB admin
import { FabulaUltimaCharacterScheme, type FabulaUltimaCharacter } from '$lib/zod.js';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    // 1. Controlla `locals.user`. Questo oggetto è stato popolato dal nostro hook!
    const currentUser = locals.user;

    // 2. **Guardia di sicurezza**: Se non c'è un utente, significa che non è loggato.
    // Lo reindirizziamo immediatamente alla pagina di login.
    if (!currentUser) {
        throw redirect(303, '/login');
    }

    // 3. Se siamo qui, l'utente è autenticato. Possiamo usare il suo UID in modo sicuro.
    const uid = currentUser.uid;

    // 4. Esegui la query a Firestore usando l'Admin SDK.
    // Esempio: recuperiamo una collezione chiamata 'tue-note' per questo utente.
    // La struttura del DB potrebbe essere: /utenti/{uid}/tue-note/{id-nota}
    
    // try {///users/l6aEYMp5iQbxX7ap7LhpjxMP5TP2/characters
    //     const collectionRef = adminDB.collection('users').doc(uid).collection('characters');
    //     const snapshot = await collectionRef.get();
       

    //     // 5. Formatta i dati per passarli al componente Svelte.
    //     // `snapshot.docs` è un array, lo mappiamo per estrarre i dati.
    //     const characters = snapshot.docs.map(doc => {
    //         return {
    //             id: doc.id,
    //             ...doc.data()
    //         };
    //     });
    //     console.log(characters);
    //     // 6. Restituisci i dati. Saranno disponibili nel componente Svelte tramite la prop `data`.
    //     return {
    //         characters,
    //         userEmail: currentUser.email, // Possiamo passare anche altri dati dell'utente
    //         uid:currentUser.uid
    //     };

    // } catch (error) {
    //     console.error("Errore nel recuperare i dati da Firestore:", error);
    //     // Restituisci un errore o un oggetto vuoto per gestire il caso nel frontend.
    //     return {
    //         notes: [],
    //         error: "Impossibile caricare i dati."
    //     };
    // }

      try {
        const snapshot = await adminDB.collection('users').doc(uid).collection('characters').get();

        // 2. USA LO SCHEMA PER MAPPARE E VALIDARE I DATI
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