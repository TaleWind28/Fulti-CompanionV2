// src/routes/characters/+page.server.js

import type { CharacterClasses } from '$lib';
import { db } from '$lib/firebase';
import { adminDB } from '$lib/firebase_admin'; // Importa l'istanza del DB admin
import { affinitiesScheme, characterSchema, FabulaUltimaCharacterScheme, statsScheme, traitsScheme, type FabulaUltimaCharacter } from '$lib/zod.js';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import z, { url } from 'zod/v4';



export async function load({url, locals, fetch}) {
    const form = await superValidate(zod4(characterSchema))
    const currentUser = locals.user;

    if (!currentUser) {
        console.log(url.pathname,"pathname")
        throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }
    // //recupero i documenti ordinati per nome
    // const snapshot = await adminDB.collection("character_classes").select("name").orderBy("name", "asc").get();
    // //recupero i nomi delle classi
    // const names = snapshot.docs.map(doc => doc.get("name") as string);
    let classNames: string[] = [];

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
    }
    else {
        classNames = result.classNames;
    }

    //memorizzo l'uid dell'utente
    const uid = currentUser.uid;

    let validCharacters;

    
    //recupero personaggi per mostrarli nella pagina
    try {
        const snapshot = await adminDB.collection('users').doc(uid).collection('characters').get();

        const characters = snapshot.docs
            .map(doc => {
                // `safeParse` tenta di validare i dati del documento
                const result = FabulaUltimaCharacterScheme.safeParse(doc.data());

                // Se la validazione ha successo, restituisci l'oggetto validato e tipizzato, aggiungendo l'ID del documento che non fa parte dello schema.
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
            
        validCharacters = characters.filter((character):character is FabulaUltimaCharacter & {id:string} => character !==null)

    } catch (err) {
        console.error("Errore nel recuperare i personaggi da Firestore:", err);
    }
    finally{
        return {
            characters: validCharacters,
            form: form,
            classNames:classNames
        };
    }

}

export const actions: Actions = {
    default: async ({ request, locals, fetch }) => {
        
        const form = await superValidate(request, zod4(characterSchema));
        
		if (!form.valid) {
			return fail(400, { form, message:'Form non valido' });
        }

        const currentUser = locals.user;
        
        if (!currentUser) {
            return fail(401, { form, message: 'Devi essere loggato per creare un personaggio.' });
        }
        
        const uid = currentUser.uid;
		
        const {prima_classe, seconda_classe, terza_classe} = form.data;

        //preparo la query per recuperare le classi dal db
		const classNamesToQuery = [prima_classe, seconda_classe];
		if (terza_classe) {
			classNamesToQuery.push(terza_classe);
		}
        
        //recupero le classi dal db
        console.log(classNamesToQuery,"")
        const response = await  fetch(`/api/characters?classNames=${JSON.stringify(classNamesToQuery)}`);
        const result = await response.json();

        console.log(result,"result");
        let characterClasses;
        if(result.success){
            console.log(result.characterClasses,"cc")
            characterClasses = result.characterClasses;
        }
        else{
            return fail(400,{message:"le classi non esistono"});
        }

        const createdCharacter = FabulaUltimaCharacterScheme.parse({
            name:form.data.name,
            traits:{},
            stats:{},
            attributes:{},
            affinities:{},
            status:{},
            info:{},
            inventory:{},
            classes:characterClasses,
        });
        
        try {
            // 4. Salva l'oggetto COMPLETO nel database
            await adminDB
                .collection('users')
                .doc(uid)
                .collection('characters')
                .add(createdCharacter);

            console.log(`Personaggio completo salvato per l'utente ${uid}`);

        } catch (err) {
            console.error("Errore nel salvataggio del personaggio completo su Firestore:", err);
            return fail(500, { form, message: 'Impossibile salvare il personaggio nel database.' });
        }

		return {form};
    }
}