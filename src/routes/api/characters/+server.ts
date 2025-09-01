import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDB } from '$lib/firebase_admin'; // Assumendo che tu abbia inizializzato l'Admin SDK qui
import { message } from 'sveltekit-superforms';
import { FabulaUltimaCharacterScheme } from '$lib/zod';
import { success } from 'zod';

export const PUT: RequestHandler = async ({request,locals}) =>{
    const character = await request.json();

    const currentUser = locals.user;

    if(!currentUser){
        throw error(401,'Utente non autenticato');
    }

    if(!character){
        throw error(400,'Personaggio non valido');
    }

    const uid = currentUser.uid;
    // console.log(character);
    
    // const {id, ...characterWithoutId} = character;
    // console.log(characterWithoutId);
    const fuCharacter = FabulaUltimaCharacterScheme.parse(character.character);
    

    try {
            // 4. Salva l'oggetto COMPLETO nel database
            await adminDB
                .collection('users')
                .doc(uid)
                .collection('characters')
                .add(fuCharacter); 

            console.log(`Personaggio completo salvato per l'utente ${uid}`);

        } catch (err) {
            console.error("Errore nel salvataggio del personaggio completo su Firestore:", err);
            return json({success:false, message:"Personaggio già presente nel database"});
        }

    return json({success:true, message:"personaggio importato con successo"});
}

export const GET: RequestHandler = async ({url}) => {
    const classNames = url.searchParams.get('classNames');
    if(classNames){
        const classNamesToQuery = JSON.parse(classNames);
        console.log(classNamesToQuery,classNamesToQuery?.length,"cntq","isArray?:",!Array.isArray(classNamesToQuery));
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
    else{
        const snapshot = await adminDB.collection("character_classes").select("name").orderBy("name", "asc").get();
        //recupero i nomi delle classi
        const names = snapshot.docs.map(doc => doc.get("name") as string);
        return json({success:true, classNames:names});
    }
}