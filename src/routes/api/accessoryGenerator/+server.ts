import { json } from "@sveltejs/kit";
import qualities from '$lib/data/qualities.json';
import type { Quality } from "$lib";
import { success } from "zod";

let validQualities = [{name:"Qualità Offensive",effect:"",price:0},...qualities.offensive,
    {name:"Qualità Difensive",effect:"",price:0},...qualities.difensive,
    {name:"Qualità di Potenziamento",effect:"",price:0},...qualities.potenziamento
];

export async function GET(){
    return json({
        qualities:validQualities
    })
}


export async function POST({request}){
    const data = await request.json();
    let {
        accessoryName,
        quality,
        customQuality,
    } = data;

    
    let selectedQuality:Quality  = customQuality || {name:"",effect:"Nessuna Qualità", price:0};

    //se non ho qualità custom cerco in quelle standard a patto che ci siano
    if(customQuality === undefined && quality!== undefined){
        let found  = validQualities.find((q)=>q.name === quality.name)
        found && (selectedQuality = found);
    }

    return json({
        success:true,
        data:{
            offline:false,
            accessoryName,
            quality: selectedQuality.effect,
            price:selectedQuality.price,
            
        }
    })
}