// src/hooks.server.js
import { adminAuth } from '$lib/firebase_admin'; // Importa l'admin auth che hai già configurato

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session');

    if (!sessionCookie) {
        event.locals.user = null;
        return resolve(event);
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

        // 🔑 qui prendi i dati completi dell’utente
        const userRecord = await adminAuth.getUser(decodedClaims.uid);
        let displayName = null;
       
        if (userRecord.displayName){
            displayName = userRecord.displayName;
        }

        event.locals.user = {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: displayName// finalmente corretto
        };
    } catch (err) {
        event.locals.user = null;
        event.cookies.delete('session', { path: '/' });
    }

    return resolve(event);
};
