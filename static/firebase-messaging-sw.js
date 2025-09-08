// static/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configurazione Firebase (sostituisci con i tuoi valori)
const firebaseConfig = {
  apiKey: 'AIzaSyBhwsUL8Dmskb7R5V8dmwI7WgVZ3m9bEHI',
  authDomain: "fulti-companion-62917.firebaseapp.com", 
  projectId: "fulti-companion-62917",
  storageBucket: "fulti-companion-62917.firebasestorage.app",
  messagingSenderId: "47789604784",
  appId: "1:47789604784:web:4f4a7e6779aa4fb535a075"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gestione messaggi in background
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message ricevuto:', payload);
  
  const notificationTitle = payload.notification?.title || 'Notifica';
  const notificationOptions = {
    body: payload.notification?.body || 'Hai ricevuto una nuova notifica',
    icon: 'favicon.png',
    badge: 'favicon.png',
    tag: 'notification-tag',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Apri'
      },
      {
        action: 'close', 
        title: 'Chiudi'
      }
    ]
  };
  console.log("sto per mostrare")
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestione click sulle notifiche
self.addEventListener('notificationclick', (event) => {
  console.log('Notifica cliccata:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Se c'è già una finestra aperta, focusla
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // Altrimenti apri una nuova finestra
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

console.log('Firebase Messaging Service Worker caricato');
