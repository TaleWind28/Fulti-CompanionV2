import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDB } from '$lib/firebase_admin'; // Assumendo che tu abbia inizializzato l'Admin SDK qui

export const DELETE: RequestHandler = async ({ params, locals }) => {
  // --- Sicurezza: Verifica che l'utente sia autenticato ---
  // Questo 'locals' è un esempio. La tua logica di autenticazione potrebbe essere diversa.
  // Qui assumiamo che tu abbia un middleware che popola `locals.user` con i dati dell'utente loggato.
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
    // Questo previene tentativi di cancellazione su ID inesistenti e conferma l'appartenenza.
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