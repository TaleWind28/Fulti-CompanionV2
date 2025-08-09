// place files you want to import through the `$lib` alias in this folder.
export type Quality ={name:string, effect:string, price:number}
export type SelectionItem = {label:string,value:string}
export type Weapon = {name:string,nickname?:string,isMartial?:boolean,cost:number,attr1:string,attr2:string,damage:number,type:string,category:string,quality:string,range:string,hands:string, pic?:string,code:number}
export type Armor = {name:string,nickname?:string,def:string,mdef:string,quality:string,martial:boolean,price:number,pic?:string,code:number}
export type Shield = {name:string,nickname?:string,def:number,mdef:number,quality:string,martial:boolean,price:number,pic?:string,code:number}
export type Accessory = {name:string,quality:string, pic?:string, price:number, code:number}

// export interface FabulaUltimaCharacter {
//     name:string,
//     traits:Traits,
//     stats:Stats,
//     bonds:Bond[],
//     attributes:Attributes,
//     classes:CharacterClasses[],
//     code:4
// }

export type Traits = {identity:string, origin:string, theme:string}

export type Stats = {HP:number,MP:number,IP:number,DEF:number,MDEF:number,LV:number}

export interface Bond {
    with:string,
    affection:boolean,
    admiration:boolean,
    loyalty:boolean,
    hatred:boolean,
    mistrust:boolean,
    inferiority:boolean
}

export type Attributes = {DEX:number,INS:number,MIG:number,WLP:number}

export interface CharacterClasses{
    name:string,
    level:number,
    skills:Skill[],
    spellClass: SpellClass,
    heroic:HeroicSkill
}

export type SpellClass = "Elementalista" | "Spiritista" | "Entropista"

export type HeroicSkill = {
    name: string,
    description:string
}

export type Skill = {
    name:string,
    description:string,
    level:{
        max:number,
        actual:number
    }
}

