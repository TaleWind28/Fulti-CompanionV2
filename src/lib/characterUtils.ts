import type { FabulaUltimaCharacter, ritualKey, statusKey } from "./zod";

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