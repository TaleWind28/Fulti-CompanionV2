import { json } from "@sveltejs/kit";
import qualities from '$lib/data/qualities.json';
import shields from '$lib/data/shield.json';
import armor from '$lib/data/armor.json';

// GET per ottenere i dati base (armi, qualità, ecc.)
export async function GET() {
    return json({
        equipment:
        [
            {name:"Scudo",def:"",mdef:"",quality:"",martial:"",price:0},
            ...shields,
            {name:"Armatura",def:"",mdef:"",quality:"",martial:"",price:0},
            ...armor
        ],
        qualities
    })
}