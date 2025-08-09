// src/hooks.server.js

import { adminAuth } from '$lib/firebase_admin'; // Importa l'admin auth che hai già configurato

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // 1. Tenta di leggere il cookie di sessione dalla richiesta in arrivo.
    const sessionCookie = event.cookies.get('session');

    // 2. Se non c'è nessun cookie, l'utente non è loggato.
    // Impostiamo `event.locals.user` a `null` e procediamo.
    if (!sessionCookie) {
        event.locals.user = null;
        return resolve(event);
    }

    // 3. Se il cookie esiste, dobbiamo verificarlo con Firebase Admin.
    try {
        // `verifySessionCookie` decodifica il cookie e ne controlla la validità (es. scadenza).
        // Il secondo parametro `true` controlla anche se l'utente è stato disabilitato o cancellato.
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        
        // 4. Se la verifica ha successo, popoliamo `event.locals.user` con i dati dell'utente.
        // `event.locals` è un oggetto che SvelteKit rende disponibile in tutte le funzioni `load` e API del server.
        event.locals.user = {
            uid: decodedClaims.uid,
            email: decodedClaims.email,
            // Puoi aggiungere qualsiasi altro dato presente nel token, come il nome
            displayName: decodedClaims.name
        };
    } catch (error) {
        // 5. Se la verifica fallisce (cookie scaduto, non valido, ecc.), l'utente non è valido.
        // Impostiamo l'utente a `null` e per sicurezza cancelliamo il cookie "rotto" dal browser.
        event.locals.user = null;
        event.cookies.delete('session', { path: '/' });
    }

    // 6. Infine, `resolve(event)` passa la richiesta (ora arricchita con i dati utente) al prossimo gestore
    // (che sarà la nostra funzione `load`).
    return resolve(event);
}