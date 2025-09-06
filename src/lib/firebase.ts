import { browser } from "$app/environment";
import { initializeApp } from "firebase/app";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User, onAuthStateChanged} from "firebase/auth";
import {updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { writable, type Writable } from "svelte/store";
import { user } from "./stores/user";

// Configurazione Firebase utilizzando le variabili d'ambiente
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);

//npm install -g firebase-tools
export const auth = getAuth(app);

export const db = getFirestore(app);

// Funzione helper per sincronizzare la sessione con il server
async function syncSessionWithServer(user: User | null) {
  if (user) {
    // L'utente ha fatto il login, invia il token al server per creare il cookie
    const idToken = await user.getIdToken();
    await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
    });
  } else {
    // L'utente ha fatto il logout, dì al server di cancellare il cookie
    await fetch('/api/session/logout', { method: 'POST' });
  }
}

// Funzione di Login AGGIORNATA
export async function login(email:string, password:string){
  if(email === null || password === null) return null;

  const result = await signInWithEmailAndPassword(auth, email, password);
  user.set(result.user); // Aggiorna lo store Svelte
  await syncSessionWithServer(result.user); // Sincronizza con il server

  return result;
}

// Funzione di Registrazione AGGIORNATA
export async function registerUser(email: string, password: string, username: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (username === null) throw new Error("invalid username");
    
    await updateProfile(userCredential.user, {
      displayName: username
    });
     //ricarica i dati aggiornati dal server per ottenere displayName
    await userCredential.user.reload();
    user.set(userCredential.user); // Aggiorna lo store Svelte
    await syncSessionWithServer(userCredential.user); // Sincronizza con il server
    return userCredential;
}

// Funzione di Logout AGGIORNATA
export async function logout() {
    await signOut(auth); // Esegui il logout dal client Firebase
    user.set(null); // Pulisci lo store Svelte
    await syncSessionWithServer(null); // Sincronizza con il server (per cancellare il cookie)
    return true;
}


// Questa parte è CRUCIALE per mantenere l'utente loggato al ricaricamento della pagina
if (browser) {
    onAuthStateChanged(auth, (currentUser) => {
        user.set(currentUser);
    });
}
export const loading :Writable<boolean>= writable(true);

export const isAuthenticated = writable(false);
