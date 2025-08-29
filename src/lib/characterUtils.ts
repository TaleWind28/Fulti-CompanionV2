import type { Benefits, FabulaUltimaCharacter, ritualKey, statusKey } from "./zod";

export function getClassBenefits(character:FabulaUltimaCharacter, className:string) {
    if (!character.classes) return null;
    
    const targetClass = character.classes.find(characterClass => 
        characterClass.name.toLowerCase() === className.toLowerCase()
    );
    
    return targetClass ? targetClass.benefits : null;
}

// Controlla se il personaggio ha uno status specifico
export function hasStatus(character:FabulaUltimaCharacter, statusName:statusKey) {
  return character.status && character.status[statusName] === true;
}

// Controlla se il personaggio ha accesso a rituali di un tipo specifico
export function hasRitualAccess(character:FabulaUltimaCharacter, ritualType:ritualKey) {
  if (!character.classes) return false;
  
  return character.classes.some(characterClass => 
    characterClass.benefits && 
    characterClass.benefits.rituals && 
    characterClass.benefits.rituals[ritualType] === true
  );
}

// Ottieni tutti i benefici "altri" attivi
export function getActiveMiscBenefits(character:FabulaUltimaCharacter) {
  const miscBenefits:any[] = [];
  
  if (character.classes) {
    character.classes.forEach(characterClass => {
      if (characterClass.benefits && 
          characterClass.benefits.other && 
          characterClass.benefits.other.active) {
        miscBenefits.push({
          className: characterClass.name,
          benefit: characterClass.benefits.other.content
        });
      }
    });
  }
  
  return miscBenefits;
}


export function retriveBenefits(character:FabulaUltimaCharacter){
  //variabile ausiliaria per memorizzare tutti i benefici gratuiti
  let totals = {hp:0,mp:0,ip:0}

  for(const classe of character.classes){
    const benefits:Benefits | null = getClassBenefits(character,classe.name);
    
    if (!benefits) continue;
    
    if(benefits.hp.active)totals.hp += benefits.hp.quantity;
    if(benefits.mp.active)totals.mp += benefits.mp.quantity;
    if(benefits.ip.active)totals.ip += benefits.ip.quantity;

    
  }
  return totals;
}