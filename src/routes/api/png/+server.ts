import { adminDB } from "$lib/firebase_admin";
import type { RequestHandler } from "@sveltejs/kit";
import { json} from "@sveltejs/kit";


export const GET: RequestHandler = async ({url}) =>{
    const speciesName = url.searchParams.get('speciesName');
    if(speciesName){
        const speciesArray = [speciesName]
        //questo è da aggiustare
        const snapshot = await adminDB.collection('species').where('name','in',speciesArray).get();
        const fullSpecimen = snapshot.docs.map(doc => doc.data());
        return json({success:true,species:fullSpecimen[0]})
    }
    else{
        const snapshot = await adminDB.collection('species').select('name').orderBy('name','asc').get();
        const names = snapshot.docs.map(doc => doc.get('name') as string);
        return json({success:true,species:names})
    }
}

