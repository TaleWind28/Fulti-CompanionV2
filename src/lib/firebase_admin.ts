// src/lib/server/firebaseAdmin.js
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';


import {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY
} from '$env/static/private';

const credentials = {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    // Questa riga è FONDAMENTALE perché le variabili d'ambiente non gestiscono bene
    // le interruzioni di riga. Il file .env le trasforma in stringa "\\n".
    // Noi le ripristiniamo al formato originale "\n" che Firebase Admin si aspetta.
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Inizializza Firebase Admin solo se non è già stato fatto
if (!getApps().length) {
    initializeApp({
        credential: cert(credentials)
    });
}

export const adminAuth = getAuth();
export const adminDB = getFirestore();