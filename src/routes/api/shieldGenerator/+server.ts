import { json } from "@sveltejs/kit";
import qualities from '$lib/data/qualities.json';
import shields from '$lib/data/shield.json';
import armor from '$lib/data/armor.json';

// GET per ottenere i dati base (armi, qualità, ecc.)
export async function GET() {
    //prende solo l'ultimo oggetto
    console.log({...qualities.difensive,...qualities.potenziamento});
    return json({
        equipment:
        [
            {name:"Scudo",def:"",mdef:"",quality:"",martial:"",price:0},
            ...shields,
            {name:"Armatura",def:"",mdef:"",quality:"",martial:"",price:0},
            ...armor
        ],
        qualities:{...qualities.difensive,...qualities.potenziamento}
    })
}