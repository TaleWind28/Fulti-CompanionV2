import { error, json } from '@sveltejs/kit';

import { adminDB } from '$lib/firebase_admin';
import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async ({url}) => {
    //recupero le liste a cui il personaggio ha accesso
    const spellList = url.searchParams.get('spellList');
    //se non ho liste no faccio niente
    if(spellList){
        const  spellNamesToQuery = JSON.parse(spellList);
        
        if (!Array.isArray(spellNamesToQuery) || spellNamesToQuery.length === 0) {
            throw error(400, 'spellList deve essere un array non vuoto');
        }
        
        const spells: any = {};
        //recupero solo le liste a cui il pg ha accesso
        const namesSnapshot = await adminDB
        .collection('spells').where('name','in', spellNamesToQuery)
        .get();

        namesSnapshot.forEach((doc) => {
            const data = doc.data();
            const {name,...spell} = data;
            spells[name] = spell;
        });

        return json({ success: true,spells: spells });
    }
    return json({success:false,spells:{}});
}