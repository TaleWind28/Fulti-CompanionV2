import {z} from 'zod';

// 3. Definisci lo schema `Weapon` come estensione di `Item`
export const WeaponScheme = z.object({
    name:z.string(),
    nickname:z.string().optional(),
    isMartial:z.boolean().optional(),
    cost: z.number(),
    attr1: z.string(),
    attr2:z.string(),
    damage:z.number(),
    type:z.string(),
    category:z.string(),
    quality:z.string(),
    range:z.string(),
    hands:z.string(),
    pic:z.string().optional(),
    code:z.number()
});


export const ArmorScheme = z.object({
    name:z.string(),
    nickname:z.string().optional(),
    def:z.string(),
    mdef:z.string(),
    quality:z.string(),
    martial:z.boolean(),
    price:z.number(),
    pic:z.string().optional(),
    code:z.number()
})

export const ShieldScheme = z.object({
    name:z.string(),
    nickname:z.string().optional(),
    def:z.number(),
    mdef:z.number(),
    quality:z.string(),
    martial:z.boolean(),
    price:z.number(),
    pic:z.string().optional(),
    code:z.number()
})

export const EquipScheme = z.union([ArmorScheme, ShieldScheme]);


export const AccessoryScheme = z.object({
    name:z.string(),
    quality:z.string(), 
    pic:z.string().optional(),
    price:z.number(),
    code:z.number()
})


/* codici per schemi zod
    0 - Arma,
    1 - Scudo,
    2 - Armatura,
    3 - Accessorio
*/