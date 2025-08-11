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
    identity:z.string().default(""),
    origin:z.string().default(""),
    theme:z.string().default("")
})

export const statsScheme = z.object({
    HP:z.number().default(45),
    MP:z.number().default(45),
    IP:z.number().default(6),
    DEF:z.number().default(8),
    MDEF:z.number().default(8),
    LV:z.number().default(5),
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



export const FabulaUltimaCharacterScheme = z.object({
    name:z.string(),
    traits:traitsScheme,
    stats:statsScheme,
    bonds:z.array(bondScheme).default([]),
    attributes: attributesScheme,
    classes: z.array(characterClassScheme).default([]),
    pic:z.string().optional(),
    code:z.number().default(4)
})


export type FabulaUltimaCharacter = z.infer<typeof FabulaUltimaCharacterScheme>;


//FORM SCHEMES  

export const characterSchema = z.object({
	name: z.string().min(3, { message: "Il nome deve contenere almeno 3 caratteri." }),
	prima_classe: z.string().min(1, { message: "La prima classe è obbligatoria." }),
	seconda_classe: z.string().min(1, { message: "La seconda classe è obbligatoria." }),
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