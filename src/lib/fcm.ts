import { browser } from '$app/environment';
import { getMessagingSafe } from '$lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { onMessage, getToken } from 'firebase/messaging';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const VAPID_PUBLIC_KEY = "BPnmcs24YrSHrC-gFC_7bFIfBXpmwkXfqpHs46kERh3bvurt3_HgR99gCTOMuvXGlJ9WvexVztAwvXwBe4hDSYc" // da Console → Cloud Messaging

async function ensureFcmTokenForUser(uid: string) {
  const messaging = getMessagingSafe();
  if (!messaging) return null;

  // 1) Chiedi permesso
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const fcmSwReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
  // 2) Token
  const token = await getToken(messaging, {
    vapidKey: VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: fcmSwReg // usa il tuo SW già pronto
  });

  // 3) Salva token su Firestore (sotto l’utente)
  const db = getFirestore();
  // Uso una subcollection per evitare racing e gestire più device
  await setDoc(
    doc(db, `users/${uid}/fcmTokens/${token}`),
    { token, updatedAt: serverTimestamp(), ua: navigator.userAgent },
    { merge: true }
  );

  return token;
}

export function initFcm() {
  if (!browser || !('Notification' in window)) return;

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      const token = await ensureFcmTokenForUser(user.uid);
      console.info('FCM token', token);
    } catch (err) {
      console.error('FCM error', err);
    }
  });

  // Messaggi in FOREGROUND (toast, badge, ecc.)
  const messaging = getMessagingSafe();
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log('FCM foreground:', payload);
      // es: mostrare un toast
      const title = payload.notification?.title ?? 'Notifica';
      const body = payload.notification?.body ?? '';
      // qui integri il tuo sistema di toast / modal
    });
  }
}
