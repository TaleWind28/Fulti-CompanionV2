import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDB } from '$lib/firebase_admin'; // Assumendo che tu abbia inizializzato l'Admin SDK qui

export const DELETE: RequestHandler = async ({ params, locals }) => {
  // --- Sicurezza: Verifica che l'utente sia autenticato ---
  if (!locals.user) {
    throw error(401, 'Non autorizzato');
  }

  const userId = locals.user.uid;
  const characterId = params.characterId;

  if (!characterId) {
    throw error(400, 'ID del personaggio non fornito');
  }

  try {
    const characterRef = adminDB.collection('users')
      .doc(userId)
      .collection('characters')
      .doc(characterId);
    // --- Sicurezza: Verifica dell'esistenza prima di cancellare ---
    const doc = await characterRef.get();
    if (!doc.exists) {
      throw error(404, 'Personaggio non trovato o non ti appartiene');
    }

    // Esegui la cancellazione
    await characterRef.delete();

    console.log(`Utente ${userId} ha cancellato il personaggio ${characterId}`);

    // Restituisci una risposta di successo
    return json({ success: true, message: 'Personaggio eliminato con successo' });

  } catch (err:any) {
    console.error("Errore durante l'eliminazione del personaggio:", err);
    // Se non è un errore gestito da noi (es. 401, 404), lancia un errore generico
    if (err.status) throw err;
    throw error(500, 'Errore interno del server durante l\'eliminazione');
  }
};

export const PUT: RequestHandler = async ({ params, locals, request, url}) => {
  // --- Sicurezza: Verifica che l'utente sia autenticato ---
  if (!locals.user) {
    throw error(401, 'Non autorizzato');
  }

  const userId = locals.user.uid;
  const characterId = params.characterId;
  const master = url.searchParams.get('master');
  const owner = url.searchParams.get('ownerId');
  console.log(owner,master);

  if (!characterId) {
    throw error(400, 'ID del personaggio non fornito');
  }

  try {
    // Ottieni i dati dal body della richiesta
    const characterData = await request.json();
    
    // Validazione di base dei dati (opzionale ma consigliata)
    if (!characterData || typeof characterData !== 'object') {
      throw error(400, 'Dati del personaggio non validi');
    }
    
    let characterRef;

    if(master !== "" && owner){
      characterRef = adminDB.collection('users')
      .doc(owner)
      .collection('characters')
      .doc(characterId);
    }else{
      characterRef = adminDB.collection('users')
      .doc(userId)
      .collection('characters')
      .doc(characterId);
    }
    

    // --- Sicurezza: Verifica dell'esistenza prima di aggiornare ---
    const doc = await characterRef.get();
    if (!doc.exists) {
      throw error(404,{message:'Personaggio non trovato o non ti appartiene' });
    }

    console.log(characterData);
    const {id,...characterToUpdate} = characterData;

    // Esegui l'aggiornamento
    await characterRef.update(characterToUpdate);
    
    console.log(`Utente ${userId} ha aggiornato il personaggio ${characterId}`);

    // Restituisci il personaggio aggiornato
    const updatedDoc = await characterRef.get();
    const updatedCharacter = { id: updatedDoc.id, ...updatedDoc.data() };

    console.log(updatedCharacter,"aggiornato\n");

    return json({ 
      success: true, 
      message: 'Personaggio aggiornato con successo',
      character: updatedCharacter 
    });

  } catch (err: any) {
    console.error("Errore durante l'aggiornamento del personaggio:", err);
    
    // Se è un errore di parsing JSON
    if (err instanceof SyntaxError) {
      throw error(400, 'Formato JSON non valido');
    }
    
    // Se è un errore gestito da noi (es. 401, 404), rilancia
    if (err.status) throw err;
    
    // Errore generico del server
    throw error(500, 'Errore interno del server durante l\'aggiornamento');
  }
};
