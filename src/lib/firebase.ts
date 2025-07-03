import { initializeApp } from "firebase/app";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User, onAuthStateChanged} from "firebase/auth";
import {updateProfile } from "firebase/auth";
import { writable, type Writable } from "svelte/store";

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

export async function login(email:string, password:string){
  if(email===null || password === null) return null;
  return signInWithEmailAndPassword(auth, email,password);
}

export async function registerUser(email: string, password: string, username: string) {
  try {
    // Crea l'utente con email e password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Aggiorna il profilo con l'username
    await updateProfile(userCredential.user, {
      displayName: username
    });
    
    return userCredential;
  } catch (error) {
    return null;    
  }
}

export async function logout() {
  try {
      await signOut(auth);
      return true;
  } catch (error) {
      console.error("Errore durante il logout:", error);
      throw error;
  }
}


export const loading :Writable<boolean>= writable(true);

export const isAuthenticated = writable(false);
