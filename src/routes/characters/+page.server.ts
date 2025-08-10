// src/routes/characters/+page.server.js

import { adminDB } from '$lib/firebase_admin'; // Importa l'istanza del DB admin
import { characterSchema, FabulaUltimaCharacterScheme, type FabulaUltimaCharacter } from '$lib/zod.js';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';



export async function load({ locals }) {
    const form = await superValidate(zod4(characterSchema))
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
            characters: validCharacters,
            form: form
        };

    } catch (err) {
        console.error("Errore nel recuperare i personaggi da Firestore:", err);
        throw error(500, "Non è stato possibile caricare i dati dei personaggi.");
    }
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        console.log("ricevuto");
        const form = await superValidate(request, zod4(characterSchema));
        console.log("superformato")

        console.log(form.data,"formData",form.valid);
        
		if (!form.valid) {
			return fail(400, { form, message:'Form non valido' });
		}
        console.log("valido");

        const currentUser = locals.user;
        console.log("valido");
        if (!currentUser) {
            return fail(401, { form, message: 'Devi essere loggato per creare un personaggio.' });
        }
        console.log("valido");
        const uid = currentUser.uid;
		console.log("pino");
        // Logica per salvare su DB...
        const createdCharacter = FabulaUltimaCharacterScheme.parse({
            name:form.data.name,
            traits:{},
            stats:{},
            attributes:{},
        });
        console.log(createdCharacter,"default");
        
         try {
            // 4. Salva l'oggetto COMPLETO nel database
            await adminDB
                .collection('users')
                .doc(uid)
                .collection('characters')
                .add(createdCharacter); // Usa `finalCharacterData` invece di `form.data`

            console.log(`Personaggio completo salvato per l'utente ${uid}`);

        } catch (err) {
            console.error("Errore nel salvataggio del personaggio completo su Firestore:", err);
            return fail(500, { form, message: 'Impossibile salvare il personaggio nel database.' });
        }

console.log("valido");
		return {form};
    }
}