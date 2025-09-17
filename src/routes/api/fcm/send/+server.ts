// src/routes/api/fcm/send/+server.ts
import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase_admin';
import type { RequestHandler } from '@sveltejs/kit';
import { getMessaging } from 'firebase-admin/messaging';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { userId, title, body, data = {} } = await request.json();

    if (!userId || !title) {
      return json({ error: 'UserId e title sono richiesti' }, { status: 400 });
    }

    // Ottieni il token FCM dell'utente
    const tokenDoc = await adminDB.collection('fcm_tokens').doc(userId).get();
    
    if (!tokenDoc.exists) {
      return json({ error: 'Token FCM non trovato per l\'utente' }, { status: 404 });
    }
    
    const { token } = tokenDoc.data()!;

    console.log(`token fcm: ${token}`);
    
    // Prepara il messaggio
    const message = {
      token,
      notification: {
        title,
        body: body || '',
      },
      data: {
        ...data,
        timestamp: Date.now().toString()
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          title,
          body: body || '',
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          requireInteraction: true,
          actions: [
            {
              action: 'open',
              title: 'Apri'
            }
          ]
        }
      }
    };

    // Invia la notifica
    const messaging = getMessaging();
    const response = await messaging.send(message);

    return json({ 
      success: true, 
      messageId: response,
      sentTo: userId 
    });

  } catch (error: any) {
    console.error('Errore invio notifica FCM:', error);
    
    // Se il token non è valido, rimuovilo dal database
    if (error?.code === 'messaging/registration-token-not-registered') {
      const { userId } = await request.json();
      if (userId) {
        await adminDB.collection('fcm_tokens').doc(userId).delete();
      }
    }
    
    return json({ error: 'Errore invio notifica' }, { status: 500 });
  }
};