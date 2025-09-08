// src/routes/api/fcm/token/+server.ts
import { json } from '@sveltejs/kit';
import { adminAuth, adminDB } from '$lib/firebase_admin';
import type { RequestHandler } from '../$types';

// Salva token FCM
export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return json({ error: 'Token mancante' }, { status: 400 });
    }

    // Verifica l'utente dalla sessione
    const sessionCookie = cookies.get('session');
    if (!sessionCookie) {
      return json({ error: 'Non autenticato' }, { status: 401 });
    }

    // Verifica il cookie di sessione
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
    const userId = decodedToken.uid;

    // Salva il token nel database
    await adminDB.collection('fcm_tokens').doc(userId).set({
      token,
      userId,
      updatedAt: new Date(),
      device: request.headers.get('user-agent') || 'unknown'
    }, { merge: true });

    return json({ success: true });
    
  } catch (error) {
    console.error('Errore salvando token FCM:', error);
    return json({ error: 'Errore interno del server' }, { status: 500 });
  }
};

// Rimuovi token FCM (per logout)
export const DELETE: RequestHandler = async ({ request, cookies }) => {
  try {
    const sessionCookie = cookies.get('session');
    if (!sessionCookie) {
      return json({ error: 'Non autenticato' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
    const userId = decodedToken.uid;

    // Rimuovi il token dal database
    await adminDB.collection('fcm_tokens').doc(userId).delete();

    return json({ success: true });
    
  } catch (error) {
    console.error('Errore rimuovendo token FCM:', error);
    return json({ error: 'Errore interno del server' }, { status: 500 });
  }
};