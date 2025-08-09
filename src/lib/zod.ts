import {z} from 'zod';

/* codici per schemi zod
    0 - Arma,
    1 - Scudo,
    2 - Armatura,
    3 - Accessorio
    4 - Personaggio
*/

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



export const traitsScheme = z.object({
    identity:z.string(),
    origin:z.string(),
    theme:z.string()
})

export const statsScheme = z.object({
    HP:z.number(),
    MP:z.number(),
    IP:z.number(),
    DEF:z.number(),
    MDEF:z.number(),
    LV:z.number(),
})

export const bondScheme = z.object({
    with:z.string(),
    affection:z.boolean(),
    admiration:z.boolean(),
    loyalty:z.boolean(),
    hatred:z.boolean(),
    mistrust:z.boolean(),
    inferiority:z.boolean()

})

export const attributesScheme = z.object({
    DEX:z.number(),
    INS:z.number(),
    MIG:z.number(),
    WLP:z.number(),
})

export const skillScheme = z.object({
    name:z.string(),
    description:z.string(),
    level:z.object({max:z.number(),actual:z.number()})
}
)

export const heroicSkillScheme = z.object({
    name:z.string(),
    description:z.string()
})

export const characterClassScheme = z.object({
    name:z.string(),
    level:z.number(),
    skills:z.array(skillScheme),
    spellClass: z.string(),
    heroic:heroicSkillScheme
})



export const FabulaUltimaCharacterScheme = z.object({
    name:z.string(),
    traits:traitsScheme,
    stats:statsScheme,
    bonds:z.array(bondScheme),
    attributes: attributesScheme,
    classes: z.array(characterClassScheme),
    pic:z.string().optional(),
    code:z.number()
})


export type FabulaUltimaCharacter = z.infer<typeof FabulaUltimaCharacterScheme>;