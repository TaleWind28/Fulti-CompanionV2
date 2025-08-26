import { faBoltLightning, faFire, faFistRaised, faKhanda, faMoon, faMountain, faSkullCrossbones, faSnowflake, faSun, faWind } from "@fortawesome/free-solid-svg-icons"
import type { Affinity, Attributes, Status } from "./zod"

// place files you want to import through the `$lib` alias in this folder.
export type Quality ={name:string, effect:string, price:number}
export type SelectionItem = {label:string,value:string}
export type Weapon = {name:string,nickname?:string,isMartial?:boolean,cost:number,attr1:string,attr2:string,damage:number,type:string,category:string,quality:string,range:string,hands:string, pic?:string,code:number}
export type Armor = {name:string,nickname?:string,def:string,mdef:string,quality:string,martial:boolean,price:number,pic?:string,code:number}
export type Shield = {name:string,nickname?:string,def:string,mdef:string,quality:string,martial:boolean,price:number,pic?:string,code:number}
export type Accessory = {name:string,quality:string, pic?:string, price:number, code:number}

export type Traits = {identity:string, origin:string, theme:string}

export type Stats = {
    HP:{max:number,actual:number},
    MP:{max:number,actual:number},
    IP:{max:number,actual:number},
    DEF:{max:number,actual:number},
    MDEF:{max:number,actual:number},
    LV:{max:number,actual:number}
}

export interface Bond {
    with:string,
    affection:boolean,
    admiration:boolean,
    loyalty:boolean,
    hatred:boolean,
    mistrust:boolean,
    inferiority:boolean
}


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

export let elemGlams = {
  veleno: {
    icon: faSkullCrossbones,
    color: 'text-purple-500', // Esempio di classe Tailwind per il colore
  },
  luce: {
    icon: faSun,
    color: 'text-yellow-300',
  },
  oscurita: {
    icon: faMoon,
    color: 'text-indigo-500',
  },
  ghiaccio: {
    icon: faSnowflake,
    color: 'text-blue-300',
  },
  fuoco: {
    icon: faFire,
    color: 'text-red-500',
  },
  terra: {
    icon: faMountain,  // o faGlobeEurope, faSeedling
    color: 'text-yellow-700', // o 'text-lime-700'
  },
  aria: {
    icon: faWind,
    color: 'text-teal-400',
  },
  fulmine: {
    icon: faBoltLightning,
    color: 'text-yellow-400',
  },
  fisico: {
    icon: faFistRaised, // o faShieldAlt, faFistRaised
    color: 'text-lion-500',
  },
}

export type StatsSheetProps = {
  attributes: Attributes;
  affinity:Affinity;
  statuses: Status;
  callbacks:any;
}