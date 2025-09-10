import { adminDB } from "$lib/firebase_admin";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({url}) =>{
    const speciesName = url.searchParams.get('speciesName');
    if(speciesName){
        return json({success:false})
    }
    else{
        const snapshot = await adminDB.collection('png_species').select('name').orderBy('name','asc').get();
        const names = snapshot.docs.map(doc => doc.get('name') as string);
        return json({success:true,speciesNames:names})
    }
}