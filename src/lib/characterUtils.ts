import { FabulaUltimaCharacterScheme, type Benefits, type FabulaUltimaCharacter, type FabulaUltimaPNG, type ritualKey, type statusKey } from "./zod";

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

export function pngHasStatus(png:FabulaUltimaPNG, statusName:statusKey) {
  return png.statuses && png.statuses[statusName] === true;
}

export function hasAbility(character:FabulaUltimaCharacter,skillName:string){
  for(const classe of character.classes){
    for(const abilità of classe.skills){
      const abilitàFlat = abilità.name.toLowerCase().replace(/\s+/g, "");
      const skillNameFlat = skillName.toLowerCase();
      if(abilitàFlat === skillNameFlat)return abilità.level.actual;
    }
  }
  return 0;
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

export function hasAlreadyEquippedArmor(character:FabulaUltimaCharacter){
  for(let armor of character.inventory.armor){
    if(armor.equipped)return true;
  }
  return false;
}

export function canEquipMartialArmor(character:FabulaUltimaCharacter){
  for(const classe of character.classes){
    let benefit = getClassBenefits(character,classe.name);
    if(benefit?.martial.equipment.armor){
      return true;
    }
  }
  return false;
}

export function canEquipMartialShield(character:FabulaUltimaCharacter){
  for(const classe of character.classes){
    let benefit = getClassBenefits(character,classe.name);
    if(benefit?.martial.equipment.shields){
      return true;
    }
  }
  return false;
}

export function hasAlreadyEquippedShield(character:FabulaUltimaCharacter){
  for(let shield of character.inventory.shields){
    if(shield.equipped)return true;
  }
  return false;
}

export function hasMartialArmorEquipped(character:FabulaUltimaCharacter){
  for(let shield of character.inventory.shields){
    if(shield.equipped)return true;
  }
  for(let armor of character.inventory.armor){
    if(armor.equipped && armor.martial)return true;
  }
  console.log("ritorno");
  return false;
}