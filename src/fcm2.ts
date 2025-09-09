// src/lib/fcm.ts
import { browser } from "$app/environment";
import { getMessagingSafe } from "$lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

// La tua VAPID key (da Firebase Console > Project Settings > Cloud Messaging)
const VAPID_KEY = "BPnmcs24YrSHrC-gFC_7bFIfBXpmwkXfqpHs46kERh3bvurt3_HgR99gCTOMuvXGlJ9WvexVztAwvXwBe4hDSYc"; 

let fcmToken: string | null = null;



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