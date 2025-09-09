// src/lib/fcm.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app } from './firebase';
import { toast } from 'svelte-sonner';

const firebaseConfig = {
  apiKey:        import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:     import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:         import.meta.env.VITE_FIREBASE_APP_ID
};

let _initOnce: Promise<void> | null = null;
let fcmToken: string | null = null;

export function initFcm() {
  if (_initOnce) return _initOnce;

  _initOnce = (async () => {
    if (!('serviceWorker' in navigator)) return;
    const supported = await isSupported().catch(() => false);
    if (!supported) return;

    // 1) Registra il SW DEDICATO a FCM (classico)
    const fcmRegistration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      {
        // il file è alla root: puoi limitare lo scope se vuoi
        scope: '/firebase-push-notification-scope'
      }
    );

    // 2) Inizializza Firebase app e messaging
    const messaging = getMessaging(app);

    // 3) Richiedi il token passando la registration del SW FCM
    fcmToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FCM_VAPID_KEY,
      serviceWorkerRegistration: fcmRegistration
    });

    console.log('FCM token:', fcmToken);

    // 4. Invia il token al tuo server per salvarlo
    await saveFcmTokenToServer(fcmToken);

    // 4) Ascolta messaggi in FOREGROUND
    onMessage(messaging, (payload) => {
      console.log('Messaggio in foreground:', payload);
      const {notification, ...rest} = payload;
      if(!notification)return;
      const {title, body} = notification;
      toast.message(`${title}`,{
          description:`${body}`,
          action:{
            label:"OK",
            onClick:()=>console.info("notifica")
          }
      })
      // opzionale: mostra un toast/in-app notification
    });
  })();

  return _initOnce;
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