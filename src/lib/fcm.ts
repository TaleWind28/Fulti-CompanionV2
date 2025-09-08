// src/lib/fcm.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app } from './firebase';

const firebaseConfig = {
  apiKey:        import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:     import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:         import.meta.env.VITE_FIREBASE_APP_ID
};

let _initOnce: Promise<void> | null = null;

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
    // const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // 3) Richiedi il token passando la registration del SW FCM
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FCM_VAPID_KEY,
      serviceWorkerRegistration: fcmRegistration
    });

    console.log('FCM token:', token);

    // 4) Ascolta messaggi in FOREGROUND
    onMessage(messaging, (payload) => {
      console.log('Messaggio in foreground:', payload);
      // opzionale: mostra un toast/in-app notification
    });
  })();

  return _initOnce;
}
