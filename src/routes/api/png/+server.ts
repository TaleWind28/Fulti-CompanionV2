import { adminDB } from "$lib/firebase_admin";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json} from "@sveltejs/kit";


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
    const pngData = await request.json();
    
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
    if (!doc.exists) {
      throw error(404,{message:'Personaggio non trovato o non ti appartiene' });
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
      character: updatedPng 
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