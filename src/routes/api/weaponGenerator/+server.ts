// src/routes/api/weaponGenerator/calculate/+server.js
import { json } from '@sveltejs/kit';

// Dati che dovrebbero essere in un database
const qualities = [
    {value:"Antistatus", label:"PippoBaudo", effect:"pino", price:100},
    {value:"q2", label:"PippoBudo", effect:"ino", price:10},
    {value:"q3", label:"PippoBdo", effect:"pin", price:1},
    {value:"q4", label:"PippoBau", effect:"pno", price:20},
];

const baseWeapons = [
    // Pesanti
    {name:"Pesanti",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Martello di Ferro",
        cost: 200,
        attr1: "VIG",
        attr2: "VIG",
        damage: 6,
        type: "Fisico",
        category: "Pesanti",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    {
        name: "Ascia",
        cost: 250,
        attr1: "VIG",
        attr2: "VIG",
        damage: 10,
        type: "Fisico",
        category: "Pesanti",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    {
        name: "Ascia da Guerra",
        cost: 250,
        attr1: "VIG",
        attr2: "VIG",
        damage: 14,
        type: "Fisico",
        category: "Pesanti",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due Mani"
    },
    
    // Pugnali
    {name:"Pugnali",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Pugnale d'Acciaio",
        cost: 150,
        attr1: "DES",
        attr2: "INT",
        damage: 4,
        type: "Fisico",
        category: "Pugnali",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    
    // Da Rissa
    {name:"Da Rissa",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Colpo Senz'Armi",
        cost: 0,
        attr1: "DES",
        attr2: "VIG",
        damage: 0,
        type: "Fisico",
        category: "Da Rissa",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    {
        name: "Improvvisata (Misc.)",
        cost: 0,
        attr1: "DES",
        attr2: "VIG",
        damage: 2,
        type: "Fisico",
        category: "Da Rissa",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    {
        name: "Tirapugni di Ferro",
        cost: 150,
        attr1: "DES",
        attr2: "VIG",
        damage: 6,
        type: "Fisico",
        category: "Da Rissa",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    
    // Spada
    {name:"Spada",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Katana",
        cost: 200,
        attr1: "DES",
        attr2: "INT",
        damage: 10,
        type: "Fisico",
        category: "Spada",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due Mani"
    },
    {
        name: "Spada di Bronzo",
        cost: 200,
        attr1: "DES",
        attr2: "VIG",
        damage: 6,
        type: "Fisico",
        category: "Spada",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    {
        name: "Spadone",
        cost: 200,
        attr1: "DES",
        attr2: "VIG",
        damage: 10,
        type: "Fisico",
        category: "Spada",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due Mani"
    },
    {
        name: "Stocco",
        cost: 200,
        attr1: "DES",
        attr2: "INT",
        damage: 6,
        type: "Fisico",
        category: "Spada",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    
    // Arcana
    {name:"Arcana",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Bastone",
        cost: 100,
        attr1: "VOL",
        attr2: "VOL",
        damage: 6,
        type: "Fisico",
        category: "Arcana",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due Mani"
    },
    {
        name: "Tomo",
        cost: 100,
        attr1: "INT",
        attr2: "INT",
        damage: 6,
        type: "Fisico",
        category: "Arcana",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due Mani"
    },
    
    // Arco
    {name:"Arco",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Balestra",
        cost: 150,
        attr1: "DES",
        attr2: "INT",
        damage: 8,
        type: "Fisico",
        category: "Arco",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Due Mani"
    },
    {
        name: "Arco Corto",
        cost: 200,
        attr1: "DES",
        attr2: "DES",
        damage: 8,
        type: "Fisico",
        category: "Arco",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Due Mani"
    },
    
    // Flagello
    {name:"Flagello",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Frusta-Catena",
        cost: 150,
        attr1: "DES",
        attr2: "DES",
        damage: 8,
        type: "Fisico",
        category: "Flagello",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due Mani"
    },
    
    // Da Fuoco
    {name:"Da Fuoco",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Pistola",
        cost: 250,
        attr1: "DES",
        attr2: "INT",
        damage: 8,
        type: "Fisico",
        category: "Da Fuoco",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Una Mano"
    },
    
    {name:"Lancia",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Lancia Leggera",
        cost: 200,
        attr1: "DES",
        attr2: "VIG",
        damage: 8,
        type: "Fisico",
        category: "Lancia",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una Mano"
    },
    {
        name: "Lancia Pesante",
        cost: 200,
        attr1: "DES",
        attr2: "VIG",
        damage: 12,
        type: "Fisico",
        category: "Lancia",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due Mani"
    },
    
    // Da Lancio
    {name:"Da Lancio",cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""},
    {
        name: "Improvvisata (Dist.)",
        cost: 0,
        attr1: "DES",
        attr2: "VIG",
        damage: 2,
        type: "Fisico",
        category: "Da Lancio",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Una Mano"
    },
    {
        name: "Shuriken",
        cost: 150,
        attr1: "DES",
        attr2: "INT",
        damage: 4,
        type: "Fisico",
        category: "Da Lancio",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Una Mano"
    }
    ];

export async function POST({ request }) {
    try {
        const data = await request.json();
        
        const {
            weapon,
            baseQuality,
            customQuality,
            customCost,
            additionalDamage,
            additionalAccuracy,
            attr1,
            attr2,
            damageType,
            selectedHands,
            weaponName
        } = data;

        // Calcoli server-side
        const selectedWeapon = baseWeapons.find(w => w.name === weapon);
        const selectedQualityData = qualities.find(q => q.value === baseQuality);
        
        if (!selectedWeapon) {
            return json({ error: 'Arma non trovata' }, { status: 400 });
        }

        // Calcolo qualità
        const quality = customQuality !== "" ? customQuality : selectedQualityData?.effect ?? "Nessuna Qualità";
        
        // Calcolo costo
        let totalCost = selectedWeapon.cost + customCost;
        if (customQuality === "" && selectedQualityData) {
            totalCost += selectedQualityData.price;
        }
        if (additionalAccuracy) totalCost += 100;
        if (additionalDamage) totalCost += 200;

        // Calcolo danno
        let totalDamage = selectedWeapon.damage;
        if (additionalDamage) totalDamage += 4;

        // Calcolo precisione
        const accuracy = additionalAccuracy ? "+1" : "";

        // Costruzione formule
        const formulaRow = [
            `[${attr1} + ${attr2}]${accuracy}`,
            `[ TM+${totalDamage}]${damageType}`,
            `${totalCost}z`
        ];

        const thirdRowElement = [
            selectedWeapon.category,
            "*",
            selectedWeapon.hands,
            "*",
            selectedWeapon.range
        ];

        return json({
            success: true,
            calculations: {
                quality,
                cost: totalCost,
                damage: totalDamage,
                accuracy,
                formulaRow,
                thirdRowElement,
                category: selectedWeapon.category,
                weaponData: selectedWeapon
            }
        });

    } catch (error) {
        console.error('Errore nel calcolo:', error);
        return json({ error: 'Errore interno del server' }, { status: 500 });
    }
}

// GET per ottenere i dati base (armi, qualità, ecc.)
export async function GET() {
    return json({
        baseWeapons,
        qualities,
        damageTypes: [
            {value:"fisico",label:"Fisico"},
            {value:"aria",label:"Aria"},
            {value:"fulmine",label:"Fulmine"},
            {value:"ombra",label:"Ombra"},
            {value:"terra",label:"Terra"},
            {value:"fuoco",label:"Fuoco"},
            {value:"ghiaccio",label:"Ghiaccio"},
            {value:"luce",label:"Luce"},
            {value:"veleno",label:"Veleno"}
        ],
        attributes: [
            {value:"DES",label:"DES"},
            {value:"VIG",label:"VIG"},
            {value:"INT",label:"INT"},
            {value:"VOL",label:"VOL"}
        ],
        handNumber: [
            {value:"Una Mano",label:"Una Mano"},
            {value:"Due Mani",label:"Due Mani"}
        ]
    });
}