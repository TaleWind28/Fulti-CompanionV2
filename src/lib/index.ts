// place files you want to import through the `$lib` alias in this folder.
export type Quality ={value:string, label:string, effect:string, price:number}
export type SelectionItem = {label:string,value:string}
export type Weapon = {name:string,nickname?:string,isMartial?:boolean,cost:number,attr1:string,attr2:string,damage:number,type:string,category:string,quality:string,range:string,hands:string, pic?:string}