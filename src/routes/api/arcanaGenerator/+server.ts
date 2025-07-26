import { json } from '@sveltejs/kit';

export async function POST({ request }){
    try{
        const data = await request.json();

        let {
            arcanaName,
            description,
            domain,
            fusionName,
            fusionEffect,
            impulseName,
            impulseEffect,
            dismissalName,
            dismissalEffect
        } = data;

        if(arcanaName=== "")arcanaName = "Arcanum Senza Nome";
        if(description === "")description = "Nessuna Descrizione";
        if(domain==="")domain = "Nessun Dominio";
        if(fusionEffect === "")fusionEffect="Nessun Beneficio di Fusione";
        if(impulseEffect === "")impulseEffect="Nessun Effetto di Impulso";
        if(dismissalEffect === "")dismissalEffect="Nessun Beneficio di Congedo";

        return json({
            success: true,
            data: {
                arcanaName,
                description,
                domain,
                fusionName,
                fusionEffect,
                impulseName,
                impulseEffect,
                dismissalName,
                dismissalEffect
            }
        });
    }
    catch(error){

    }
}
