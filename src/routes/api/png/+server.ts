import { adminDB } from "$lib/firebase_admin";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json} from "@sveltejs/kit";
import { success } from "zod";


export const GET: RequestHandler = async ({url}) =>{
    const speciesName = url.searchParams.get('speciesName');
    if(speciesName){
        const speciesArray = [speciesName]
        //questo è da aggiustare 
        const snapshot = await adminDB.collection('species').where('name','in',speciesArray).get();
        const fullSpecimen = snapshot.docs.map(doc => doc.data());
        return json({success:true,species:fullSpecimen[0]})
    }
    else{
        const snapshot = await adminDB.collection('species').select('name').orderBy('name','asc').get();
        const names = snapshot.docs.map(doc => doc.get('name') as string);
        return json({success:true,species:names})
    }
}

export const PUT: RequestHandler = async ({ locals, request}) => {
  // --- Sicurezza: Verifica che l'utente sia autenticato ---
  if (!locals.user) {
    throw error(401, 'Non autorizzato');
  }

    const userId = locals.user.uid;

  try {
    // Ottieni i dati dal body della richiesta
    const data = await request.json();
    const pngData = data.png;
    console.log(pngData,"data");
    
    // Validazione di base dei dati (opzionale ma consigliata)
    if (!pngData || typeof pngData !== 'object') {
      throw error(400, 'Dati del personaggio non validi');
    }
      
    const  pngRef = adminDB.collection('users')
      .doc(userId)
      .collection('png')
      .doc(pngData.id);
    

    // --- Sicurezza: Verifica dell'esistenza prima di aggiornare ---
    const doc = await pngRef.get();
    //se non esiste lo creo
    if (!doc.exists) {
      await pngRef.set(pngData);
      console.log("settato")
      return json({
        success:true,
        message:'PNG Importato con successo',
        png:pngData
      })
    }

    console.log(pngData);
  

    // Esegui l'aggiornamento
    await pngRef.update(pngData);
    
    console.log(`Utente ${userId} ha aggiornato il personaggio ${pngData.id}`);

    // Restituisci il personaggio aggiornato
    const updatedDoc = await pngRef.get();
    const updatedPng = updatedDoc.data() ;


    return json({ 
      success: true, 
      message: 'Personaggio aggiornato con successo',
      png: updatedPng 
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

export const DELETE: RequestHandler = async ({locals,request}) => {
   // --- Sicurezza: Verifica che l'utente sia autenticato ---
   console.log("entro")
  if (!locals.user) {
    throw error(401, 'Non autorizzato');
  }

  const userId = locals.user.uid;
  const data = await request.json();
  console.log(data);
  const pngId = data.pngId;

  if (!pngId) {
    throw error(400, 'ID del personaggio non fornito');
  }

  try {
    const characterRef = adminDB.collection('users')
      .doc(userId)
      .collection('png')
      .doc(pngId);
    // --- Sicurezza: Verifica dell'esistenza prima di cancellare ---
    const doc = await characterRef.get();
    if (!doc.exists) {
      throw error(404, 'Personaggio non trovato o non ti appartiene');
    }

    // Esegui la cancellazione
    await characterRef.delete();

    console.log(`Utente ${userId} ha cancellato il personaggio ${pngId}`);

    // Restituisci una risposta di successo
    return json({ success: true, message: 'PNG eliminato con successo' });

  } catch (err:any) {
    console.error("Errore durante l'eliminazione del personaggio:", err);
    // Se non è un errore gestito da noi (es. 401, 404), lancia un errore generico
    if (err.status) throw err;
    throw error(500, 'Errore interno del server durante l\'eliminazione');
  }
}