// src/lib/fcm.ts
import { browser } from "$app/environment";
import { getMessagingSafe } from "$lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

// La tua VAPID key (da Firebase Console > Project Settings > Cloud Messaging)
const VAPID_KEY = "BPnmcs24YrSHrC-gFC_7bFIfBXpmwkXfqpHs46kERh3bvurt3_HgR99gCTOMuvXGlJ9WvexVztAwvXwBe4hDSYc"; 

let fcmToken: string | null = null;

export async function initFcm() {
  if (!browser) return null;
  
  const messaging = getMessagingSafe();
  if (!messaging) {
    console.log('Messaging non supportato');
    return null;
  }

  try {
    // 1. Richiedi il permesso per le notifiche
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permesso notifiche negato');
      return null;
    }

    // 2. Registra il service worker
    if ('serviceWorker' in navigator) {
        // Prima registra il SW per FCM 
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/firebase-push-notification-scope'
      });
      console.log('Service Worker registrato per FCM');
      
      // 3. Ottieni il token FCM
      fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });
      
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        
        // 4. Invia il token al tuo server per salvarlo
        await saveFcmTokenToServer(fcmToken);
        
        // 5. Gestisci i messaggi in foreground
        onMessage(messaging, (payload) => {
          console.log('Messaggio ricevuto in foreground:', payload);
          
          // Mostra notifica custom quando app è aperta
          if (payload.notification) {
            showNotification(
              payload.notification.title || 'Nuova notifica',
              payload.notification.body || '',
              payload.notification.icon
            );
          }
        });
        
        return fcmToken;
      }
    }
  } catch (error) {
    console.error('Errore inizializzazione FCM:', error);
    return null;
  }
  
  return null;
}

// Salva il token sul tuo server
async function saveFcmTokenToServer(token: string) {
  try {
    await fetch('/api/fcm/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
  } catch (error) {
    console.error('Errore salvando token FCM:', error);
  }
}

// Mostra notifica personalizzata
function showNotification(title: string, body: string, icon?: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/icon-192x192.png',
      badge: '/badge-72x72.png'
    });
  }
}

// Ottieni il token attuale
export function getFcmToken(): string | null {
  return fcmToken;
}

// Rimuovi il token (per logout)
export async function clearFcmToken() {
  if (fcmToken) {
    try {
      await fetch('/api/fcm/token', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: fcmToken })
      });
      fcmToken = null;
    } catch (error) {
      console.error('Errore rimozione token FCM:', error);
    }
  }
}