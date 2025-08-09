// src/lib/server/firebaseAdmin.js
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';


const credentials = {
    projectId: import.meta.env.FIREBASE_PROJECT_ID,
    clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
    privateKey: import.meta.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Assicura che i ritorni a capo siano corretti
};

// Inizializza Firebase Admin solo se non è già stato fatto
if (!getApps().length) {
    initializeApp({
        credential: cert(credentials)
    });
}

export const adminAuth = getAuth();
export const adminDB = getFirestore();