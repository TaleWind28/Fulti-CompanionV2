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

// Funzione per salvare il token nei cookie
async function setAuthCookie(user: User) {
  if (browser) {
    const idToken = await user.getIdToken();
    document.cookie = `__session=${idToken}; path=/; max-age=${5 * 24 * 60 * 60}; samesite=strict`;
  }
}

export async function login(email:string, password:string){
  if(email===null || password === null) return null;

  const result  = await signInWithEmailAndPassword(auth, email,password);
  // Salva il token per il server e aggiorna lo store
  await setAuthCookie(result.user);
  user.set(result.user);

  return result;
}

export async function registerUser(email: string, password: string, username: string) {
  try {
    // Crea l'utente con email e password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Aggiorna il profilo con l'username
    if (username === null) throw new Error("invalid username");
    await updateProfile(userCredential.user, {
      displayName: username
    });
    
    // Salva il token per il server e aggiorna lo store
    await setAuthCookie(userCredential.user);
    user.set(userCredential.user);
    

    return userCredential;
  } catch (error) {
    console.log(error,"errore");
    throw error;    
  }
}

export async function logout() {
  try {
      await signOut(auth);

    if (browser) {
      // Rimuovi il cookie
      document.cookie = '__session=; path=/; max-age=0';
      user.set(null);
    }
      return true;
  } catch (error) {
      console.error("Errore durante il logout:", error);
      throw error;
  }
}


export const loading :Writable<boolean>= writable(true);

export const isAuthenticated = writable(false);
