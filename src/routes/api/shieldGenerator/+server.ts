import { json } from "@sveltejs/kit";
import qualities from '$lib/data/qualities.json';
import shields from '$lib/data/shield.json';
import armor from '$lib/data/armor.json';
import { success } from "zod";

// GET per ottenere i dati base (armi, qualità, ecc.)
export async function GET() {
    //prende solo l'ultimo oggetto
    
    const {offensive, ...rest} = qualities;
    
    const requested = [
        {name:"Qualità Difensive",effect:"",price:0},...rest.difensive,
        {name:"Qualità di Potenziamento",effect:"",price:0},...rest.potenziamento
    ]
    console.log(requested,"Request");
    return json({
        equipment:
        [
            {name:"Scudo",def:"",mdef:"",quality:"",martial:"",price:0},
            ...shields,
            {name:"Armatura",def:"",mdef:"",quality:"",martial:"",price:0},
            ...armor
        ],
        qualities:requested
    })
}

export async function POST({request}) {
    const data = await request.json();
    let {
        equipName,
        equip,
        customCost,
        quality
    } = data

    let equipment = [...shields,...armor]
    let selectedEquip = equipment.find((eq)=> eq.name === equip)
    
    if(selectedEquip === undefined) selectedEquip = armor[0];
    let selectedQuality = [...qualities.difensive, ...qualities.potenziamento].find((q)=>q.name === quality)
    
    if(selectedQuality === undefined) selectedQuality = {name:"",effect:"Nessuna Qualità", price:0};

    let price = selectedEquip?.price+customCost+selectedQuality.price;

    let formulaRow = [selectedEquip?.def+"",selectedEquip?.mdef+"",price+"z"];
    console.log(selectedEquip);
    if(equipName === undefined || equipName === null || equipName === "") equipName = selectedEquip.name;
    console.log(equipName);
    return json({
        success:true,
        data:{
            equipName,
            
            tableRow:formulaRow,
            quality:selectedQuality.effect,
            totalPrice: price,

        }
    })
}