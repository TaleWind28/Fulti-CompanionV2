// place files you want to import through the `$lib` alias in this folder.
export type Quality ={name:string, effect:string, price:number}
export type SelectionItem = {label:string,value:string}
export type Weapon = {name:string,nickname?:string,isMartial?:boolean,cost:number,attr1:string,attr2:string,damage:number,type:string,category:string,quality:string,range:string,hands:string, pic?:string}
export type Armor = {name:string,nickname?:string,def:string,mdef:string,quality:string,martial:boolean,price:number,pic?:string}
export type Shield = {name:string,nickname?:string,def:number,mdef:number,quality:string,martial:boolean,price:number,pic?:string}
export type Accessory = {name:string,quality:string, pic?:string, price:number}