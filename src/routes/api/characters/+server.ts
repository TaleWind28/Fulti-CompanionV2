import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDB } from '$lib/firebase_admin';
import { FabulaUltimaCharacterScheme, type FabulaUltimaCharacter } from '$lib/zod';
import { success } from 'zod';

export const PUT: RequestHandler = async ({request,locals}) =>{
    const data = await request.json();

    const currentUser = locals.user;

    if(!currentUser){
        throw error(401,'Utente non autenticato');
    }

    if(!data){
        throw error(400,'Personaggio non valido');
    }

    const uid = currentUser.uid;
    
    const fuCharacter = FabulaUltimaCharacterScheme.parse(data.character);
    console.log(fuCharacter, "fuc");

    try {
            // 4. Salva l'oggetto COMPLETO nel database
            const docRef = await adminDB
                .collection('users')
                .doc(uid)
                .collection('characters')
                .add(fuCharacter); 
            console.log(`Personaggio completo salvato per l'utente ${uid}`);
            
            return json({success:true, message:"personaggio importato con successo",id:docRef.id}); 
        } catch (err) {
            console.error("Errore nel salvataggio del personaggio completo su Firestore:", err);
            return json({success:false, message:"Personaggio già presente nel database"});
        }

}

export const GET: RequestHandler = async ({url}) => {
    const classNames = url.searchParams.get('classNames');
    const userId = url.searchParams.get('id');
    if(classNames){
        const classNamesToQuery = JSON.parse(classNames);
        //console.log(classNamesToQuery,classNamesToQuery?.length,"cntq","isArray?:",!Array.isArray(classNamesToQuery));
        if (!Array.isArray(classNamesToQuery) || classNamesToQuery.length === 0) {
            throw error(400, 'classNames deve essere un array non vuoto');
        }

            // Firestore Admin SDK ha una sintassi leggermente diversa
        const characterClasses: any[] = [];
        const snapshot = await adminDB
            .collection('character_classes')
            .where('name', 'in', classNamesToQuery)
            .get();
        
        snapshot.forEach((doc) => {
            characterClasses.push({ id: doc.id, ...doc.data() });
        });

        return json({ success: true, characterClasses });
    }
    else if(userId){
        console.log(userId);
        const id = userId;
        const snapshot = await adminDB.collection('users').doc(id).collection('characters').get();

        const characters = snapshot.docs
            .map(doc => {
                console.log("provo a parsare");
                // `safeParse` tenta di validare i dati del documento
                const result = FabulaUltimaCharacterScheme.safeParse(doc.data());
                
                console.log(result.success);

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
        const validCharacters = characters.filter((character):character is FabulaUltimaCharacter & {id:string} => character !==null)
        return json({success:true, characters:validCharacters});
    }
    else{
        const snapshot = await adminDB.collection("character_classes").select("name").orderBy("name", "asc").get();
        //recupero i nomi delle classi
        const names = snapshot.docs.map(doc => doc.get("name") as string);
        return json({success:true, classNames:names});
    }
}