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
    pic:z.string().optional()
});
