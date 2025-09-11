import { createPage } from "$lib/utils";
import type { Campaign } from "$lib/zod";
import { PageScheme } from "$lib/zodPages";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PUT:RequestHandler = async ({request,locals}) =>{
    const payload : {name:string, masterId:string} = await request.json();
    const currentUser = locals.user;
    if(!currentUser){
        throw error(401,"Devi essere autenticato");
    }
    
    const page = createPage({
        id:payload.name,
        title:payload.name,
        masterId:payload.masterId,
        ownerId:currentUser.uid
    })
    console.log(page);
    return json({success:true,message:"pagina creata con successo",page:page});
}