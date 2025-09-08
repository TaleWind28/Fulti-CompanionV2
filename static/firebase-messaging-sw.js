/* static/firebase-messaging-sw.js */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

// 👇 Metti qui la tua config Firebase (la stessa del client)
firebase.initializeApp({
  apiKey: "AIzaSyBhwsUL8Dmskb7R5V8dmwI7WgVZ3m9bEHI",
  authDomain: "fulti-companion-62917.firebaseapp.com",
  projectId: "fulti-companion-62917",
  storageBucket: "fulti-companion-62917.firebasestorage.app",
  messagingSenderId: "47789604784",
  appId: "1:47789604784:web:4f4a7e6779aa4fb535a075"
});

// Ottieni messaging
const messaging = firebase.messaging();

// Notifiche quando la pagina è in BACKGROUND
messaging.onBackgroundMessage((payload) => {
  // Personalizza il body/icon in base al payload.data o payload.notification
  const title = payload.notification?.title ?? 'Nuovo messaggio';
  const options = {
    body: payload.notification?.body ?? '',
    icon: '/icons/icon-192.png', // opzionale
    data: payload.data ?? {}
  };
  self.registration.showNotification(title, options);
});

// (Facoltativo) click sulle notifiche
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});

console.info("Service-Worker(FCM)Attivo");
