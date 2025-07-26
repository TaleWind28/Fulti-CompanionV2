import { json } from "@sveltejs/kit";
import qualities from '$lib/data/qualities.json';
import shields from '$lib/data/shield.json';
import armor from '$lib/data/armor.json';
import { success } from "zod";
import type { Quality } from "$lib";

// GET per ottenere i dati base (armi, qualità, ecc.)
export async function GET() {
    //prende solo l'ultimo oggetto
    
    const {offensive, ...rest} = qualities;
    
    const requested = [
        {name:"Qualità Difensive",effect:"",price:0},...rest.difensive,
        {name:"Qualità di Potenziamento",effect:"",price:0},...rest.potenziamento
    ]

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
        quality,
        customQuality
    } = data

    let equipment = [...shields,...armor];
    let validQualities = [...qualities.difensive, ...qualities.potenziamento];
    
    let selectedEquip = equipment.find((eq)=> eq.name === equip)
    //se non ho trovato l'equipaggiamento ritorno un'errore
    if (!selectedEquip) {
        return json({ error: 'Arma non trovata' }, { status: 400 });
    }

    
    

    let selectedQuality:Quality  = customQuality || {name:"",effect:"Nessuna Qualità", price:0};
    //se non ho qualità custom cerco in quelle standard a patto che ci siano
    if(customQuality === undefined && quality!== undefined){
        let found  = validQualities.find((q)=>q.name === quality.name)
        found && (selectedQuality = found);
    }
    
    
    //calcolo il prezzo totale in base a qualità ed equipaggiamento
    let price = selectedEquip?.price+selectedQuality.price;
    //definisco la riga della tabella
    let formulaRow = [selectedEquip?.def+"",selectedEquip?.mdef+"",price+"z"];
    
    if(equipName === undefined || equipName === null || equipName === "") equipName = selectedEquip.name;
    
    return json({
        success:true,
        data:{
            equip,
            equipName,
            tableRow:formulaRow,
            quality:selectedQuality.effect,
            totalPrice: price,


        }
    })
}