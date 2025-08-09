// src/routes/api/session/login/+server.js
import { adminAuth } from '$lib/firebase_admin';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const { idToken } = await request.json();

    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 giorni

    try {
        const sessionCookie = await adminAuth.createSessionCookie(idToken.toString(), { expiresIn });

        cookies.set('session', sessionCookie, {
            path: '/',
            httpOnly: true,
            secure: true, // In produzione, altrimenti false
            maxAge: expiresIn,
            sameSite: 'lax'
        });

        return json({ status: 'success' });
    } catch (error) {
        return json({ status: 'error', message: 'Token non valido' }, { status: 401 });
    }
}