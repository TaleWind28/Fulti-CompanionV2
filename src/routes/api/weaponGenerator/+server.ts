// src/routes/api/weaponGenerator/calculate/+server.js
import { json } from '@sveltejs/kit';
import weapons from '$lib/data/weapons.json';
import damageTypes from '$lib/data/damageTypes.json';
import qualities from '$lib/data/qualities.json';
import attributes from '$lib/data/attributes.json';

//Ricalcolo tramite i parametri inseriti dal client
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
        const selectedWeapon = weapons.find(w => w.name === weapon);
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
    let baseWeapons = addCategoryToWeapons();
    return json({
        baseWeapons,
        qualities,
        damageTypes,
        attributes,
        handNumber: [
            {value:"Una Mano",label:"Una Mano"},
            {value:"Due Mani",label:"Due Mani"}
        ]
    });
}

function addCategoryToWeapons(){
    let currentCategory = "";
    let weaponWithCategory = [];
    for(let i = 0;i<weapons.length;i++){
        if(currentCategory!== weapons[i].category){
            weaponWithCategory.push({name:weapons[i].category,cost:0,attr1:"",attr2:"",damage:0,type:"",category:"",quality:"",range:"",hands:""})
            currentCategory = weapons[i].category;
        }
        weaponWithCategory.push(weapons[i]);
    }
    return weaponWithCategory;
}