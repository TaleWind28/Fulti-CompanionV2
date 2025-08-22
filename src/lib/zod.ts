import type { ZodValidationSchema } from 'sveltekit-superforms/adapters';
import {z} from 'zod/v4';

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

export type Weapon = z.infer<typeof WeaponScheme>

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

export type ArmorScheme = z.infer<typeof ArmorScheme>

export const ShieldScheme = z.object({
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

export type ShieldScheme = z.infer<typeof ShieldScheme>

export const EquipScheme = z.union([ArmorScheme, ShieldScheme]);

export type Equipment = z.infer<typeof EquipScheme>

export const AccessoryScheme = z.object({
    name:z.string(),
    quality:z.string(), 
    pic:z.string().optional(),
    price:z.number(),
    code:z.number()
})

export type Accessory = z.infer<typeof AccessoryScheme>

export const traitsScheme = z.object({
    identity:z.string().default(""),
    origin:z.string().default(""),
    theme:z.string().default("")
})

export const statsScheme = z.object({
    HP:z.object({max:z.number(),actual:z.number()}).default({max:45,actual:45}),
    MP:z.object({max:z.number(),actual:z.number()}).default({max:45,actual:45}),
    IP:z.object({max:z.number(),actual:z.number()}).default({max:6,actual:6}),
    DEF:z.number().default(8),
    MDEF:z.number().default(8),
})

export type Stats = z.infer<typeof statsScheme>;

export const infoScheme = z.object({
    description:z.string().default(""),
    exp:z.number().default(0),
    zenit:z.number().default(0),
    fabulaPoints:z.number().default(3),
    level:z.number().default(5)
})

export const bondScheme = z.object({
    with:z.string(),
    affection:z.boolean().default(false),
    admiration:z.boolean().default(false),
    loyalty:z.boolean().default(false),
    hatred:z.boolean().default(false),
    mistrust:z.boolean().default(false),
    inferiority:z.boolean().default(false)

})

export const attributesScheme = z.object({
    DEX:z.number().default(8),
    INS:z.number().default(8),
    MIG:z.number().default(8),
    WLP:z.number().default(8),
})

export type Attributes = z.infer<typeof attributesScheme>;

export const benefitScheme = z.object({
    hp:z.object({active:z.boolean(),quantity:z.number()}),
    mp:z.object({active:z.boolean(),quantity:z.number()}),
    ip:z.object({active:z.boolean(),quantity:z.number()}),
    martial:z.object({
        weapons:z.object({
            melee:z.boolean(),
            ranged:z.boolean()
        }),
        equipment:z.object({
            armor:z.boolean(),
            shields:z.boolean()
        })
    }),
    rituals:z.object({
        arcanism:z.boolean(),
        chimerism:z.boolean(),
        elementalism:z.boolean(),
        entropism:z.boolean(),
        ritualism:z.boolean(),
        spiritism:z.boolean()
    }),
    other:z.object({active:z.boolean(),content:z.string()})
})

export const skillScheme = z.object({
    name:z.string(),
    description:z.string(),
    level:z.object({max:z.number(),actual:z.number()}),
    benefits:benefitScheme.optional()
}
)

export type Skill = z.infer<typeof skillScheme>

export const heroicSkillScheme = z.object({
    name:z.string(),
    description:z.string()
})

export const characterClassScheme = z.object({
    name:z.string(),
    level:z.number(),
    benefits:benefitScheme,
    skills:z.array(skillScheme),
    spellClass: z.string(),
    heroic:heroicSkillScheme
})

export type CharacterClass = z.infer<typeof characterClassScheme>;

export const vulnerabilityScheme = z.object({
    weak:z.boolean().default(false),
    resistant:z.boolean().default(false),
    immune:z.boolean().default(false),
    absorb:z.boolean().default(false),
})

export const affinitiesScheme = z.object({
    fisico:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
    aria:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
    fulmine:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
    fuoco:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
    ghiaccio:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
    luce:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
    oscurita:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
    terra:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
    veleno:z.object({weak:z.boolean(),resistant:z.boolean(),immune:z.boolean(),absorb:z.boolean()}).default({weak:false,resistant:false,immune:false,absorb:false}),
})

export type Affinity = z.infer<typeof affinitiesScheme>;

export const statusScheme = z.object({
    poisoned:z.boolean().default(false),
    dazed:z.boolean().default(false),
    shaken:z.boolean().default(false),
    enraged:z.boolean().default(false),
    slow:z.boolean().default(false),
    weak:z.boolean().default(false),
    dexUp:z.boolean().default(false),
    insUp:z.boolean().default(false),
    migUp:z.boolean().default(false),
    wlpUp:z.boolean().default(false),
})

export type Status = z.infer<typeof statusScheme>

export const inventoryScheme = z.object({
    weapons:z.array(WeaponScheme).default([]),
    accessories:z.array(AccessoryScheme).default([]),
    shields:z.array(ShieldScheme).default([]),
    armor:z.array(ArmorScheme).default([]),
})

export const FabulaUltimaCharacterScheme = z.object({
    name:z.string(),
    traits:traitsScheme,
    stats:statsScheme,
    bonds:z.array(bondScheme).default([]),
    attributes: attributesScheme,
    classes: z.array(characterClassScheme).default([]),
    affinities:affinitiesScheme,
    status:statusScheme,
    info:infoScheme,
    inventory:inventoryScheme,
    pic:z.string().optional(),
    code:z.number().default(4)
})

export type FabulaUltimaCharacter = z.infer<typeof FabulaUltimaCharacterScheme>;


//FORM SCHEMES  
export const characterSchema = z.object({
	name: z.string().min(3, { message: "Il nome deve contenere almeno 3 caratteri." }).default(""),
	prima_classe: z.string().min(1, { message: "La prima classe è obbligatoria." }).default(""),
	seconda_classe: z.string().min(1, { message: "La seconda classe è obbligatoria." }).default(""),
	terza_classe: z.string().optional()
}).superRefine((data, ctx) => {
  // 1. Controlla che prima_classe e seconda_classe siano diverse
  if (data.prima_classe === data.seconda_classe) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La seconda classe non può essere uguale alla prima.",
      path: ['seconda_classe']
    });
  }

  // 2. Se terza_classe è stata selezionata, controlla che sia diversa dalle altre
  if (data.terza_classe && data.terza_classe.length > 0) {
    if (data.prima_classe === data.terza_classe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La terza classe non può essere uguale alla prima.",
        path: ['terza_classe']
      });
    }
    if (data.seconda_classe === data.terza_classe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La terza classe non può essere uguale alla seconda.",
        path: ['terza_classe']
      });
    }
  }
}) as ZodValidationSchema;

export type FormCharacterSchema = typeof characterSchema;