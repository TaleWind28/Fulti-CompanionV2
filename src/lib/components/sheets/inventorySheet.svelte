<script lang="ts">

    import { faArrowDown, faArrowUp, faGem, faKhanda, faUserShield,type IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Button from "../ui/button/button.svelte";
    import * as Card from "../ui/card/index";
    import * as Dialog from "../ui/dialog/index";
    import Fa from "svelte-fa";
    import type { Weapon, Armor, Shield, Accessory } from "$lib";
    import WeaponGenerator from "../generators/weaponGenerator.svelte";
    
    import ShieldGenerator from "../generators/shieldGenerator.svelte";
    import AccessoryGenerator from "../generators/accessoryGenerator.svelte";
    import { type Equipment } from "$lib/zod";
    import WeaponProcessor from "../imageProcessors/weaponProcessor.svelte";  
    import AccessoryProcessor from "../imageProcessors/accessoryProcessor.svelte";
    import EquipProcessor from "../imageProcessors/equipProcessor.svelte";

    //props
    let {weapons, shields, armor, accessories}: {weapons:Weapon[],armor:Armor[],shields:Shield[],accessories:Accessory[]} = $props();
    //dialogVariable
    let openWeaponCreator = $state(false);
    let openEquipCreator = $state(false);
    let openAccessoryCreator = $state(false);

    let viewWeapons = $state(false);
    let viewArmor = $state(false);
    let viewShields = $state(false);
    let viewAccessories = $state(false);

    let btnStyle = "bg-cafe_noir-600 hover:bg-cafe_noir-500 flex flex-row items-center";


    function saveWeapon(weapon:Weapon){
        openWeaponCreator = false;
        weapons.push(weapon);
        
    }

    function saveAccessory(accessory:Accessory){
        openAccessoryCreator = false;
        accessories.push(accessory);
        
    }

    function saveEquipment(equip:Equipment){
        if(equip.code == 1){
            shields.push(equip as Shield);
            openEquipCreator = false;
            return;
        }
        if(equip.code == 2){
            armor.push(equip);
            openEquipCreator = false;
            return;
        }
    }

    $inspect(accessories,"armi");

</script>

<div class="flex flex-col gap-5 justify-center">
    <!-- ActionBar per creare Armi ed Equipaggiamento -->
    <Card.Root> 
        <Card.Header> 
            Azioni Rapide
        </Card.Header>
        <Card.Content class="flex flex-row items-center justify-center gap-5">
            {@render actionButton(btnStyle,()=>openWeaponCreator=true,faKhanda,"Nuova Arma")}
            {@render actionButton(btnStyle,()=>openEquipCreator=true,faUserShield,"Nuova Armatura/Scudo")}
            {@render actionButton(btnStyle,()=>openAccessoryCreator=true,faGem,"Nuovo Accessorio")}            
        </Card.Content>
    </Card.Root>

    <!-- Container per le visualizzazioni dell'inventario -->
    <div class="flex flex-col gap-5">
        {@render weaponsDisplay(weapons)}
        
        {@render displayArmor(armor)}

        {@render displayShields(shields)}
        
        {@render displayAccessory(accessories)}
    </div>
</div>

<!-- Creazione Arma -->
<Dialog.Root open={openWeaponCreator} onOpenChange={(v)=> openWeaponCreator=v}>
    <Dialog.Content class="flex items-center justify-center w-700">
        <WeaponGenerator showImageProcessor={false} dim={"w-120"} onSave={saveWeapon}/>
    </Dialog.Content>
</Dialog.Root>

<!-- Creazione Armatura -->
<Dialog.Root open={openEquipCreator} onOpenChange={(v)=> openEquipCreator=v}>
    <Dialog.Content class="flex items-center justify-center w-700">
        <ShieldGenerator showImageProcessor={false} dim={"w-120"} onSave={saveEquipment}/>
    </Dialog.Content>
</Dialog.Root>

<!-- Creazione Accessorio -->
<Dialog.Root open={openAccessoryCreator} onOpenChange={(v)=> openAccessoryCreator=v}>
    <Dialog.Content class="flex items-center justify-center w-700">
        <AccessoryGenerator showImageProcessor={false} dim="w-100" onSave={saveAccessory}/>
    </Dialog.Content>
</Dialog.Root>

{#snippet displayAccessory(accessory: Accessory[])}
    <Card.Root class="bg-cafe_noir-600 border-0"> 
        <Card.Header class="flex flex-row justify-between items-center"> 
            <p class="text-white">ACCESSORI</p>
            <button onclick={()=>viewAccessories=!viewAccessories}> 
                {#if !viewAccessories}
                    <Fa icon={faArrowDown}/>
                {:else}
                    <Fa icon={faArrowUp}/>
                {/if}
            </button>
        </Card.Header>
        {#if viewAccessories}
            <Card.Content class="bg-white">
                {#each accessory as item}
                    <AccessoryProcessor
                        requestedData={
                            {
                                accessoryName:item.name,
                                price:item.price,
                                quality:item.quality,

                            }
                        }
                        accessoryImageUrl={item.pic}
                        onDelete={(accessoryName:string)=>{
                            let removeIndex = accessories.findIndex((a)=>a.name === accessoryName);
                            accessories.splice(removeIndex,1);
                        }}
                    />
                {/each}
                {#if accessories.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
            </Card.Content>
        {/if}
    </Card.Root>
{/snippet}

{#snippet displayShields(shields:Shield[])}
<Card.Root class="bg-cafe_noir-600 border-0"> 
        <Card.Header class="flex flex-row justify-between items-center"> 
            <p class="text-white">SCUDI</p>
            <button onclick={()=> viewShields=!viewShields}> 
                {#if !viewShields}
                    <Fa icon={faArrowDown}/>
                {:else}
                    <Fa icon={faArrowUp}/>
                {/if}
            </button>
        </Card.Header>
        {#if viewShields}
            <Card.Content class="bg-white">
                {#each shields as item}
                    <EquipProcessor
                     isMartial={item.martial}
                     equipImageUrl={item.pic}
                     requestedData={{
                        equipName:item.nickname || item.name,
                        tableRow:[
                            item.def+"",
                            item.mdef+"",
                            item.price+"z"
                        ],
                        quality:item.quality
                     }}
                        onDelete={(equipName:string)=>{
                                let removeIndex = shields.findIndex((s)=>s.name === equipName);
                                shields.splice(removeIndex,1);
                            }
                        }
                    >

                    </EquipProcessor>
                {/each}
                 {#if shields.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
                
            </Card.Content>
        {/if}
    </Card.Root>
    
{/snippet}

{#snippet displayArmor(armor:Armor[])}
    <Card.Root class="bg-cafe_noir-600 border-0"> 
        <Card.Header class="flex flex-row justify-between items-center"> 
            <p class="text-white">ARMATURE</p>
            <button onclick={()=>viewArmor = !viewArmor}> 
                {#if !viewArmor}
                    <Fa icon={faArrowDown}/>
                {:else}
                    <Fa icon={faArrowUp}/>
                {/if}
            </button>
        </Card.Header>
        {#if viewArmor}
            <Card.Content class="bg-white">
                {#each armor as item}
                    <EquipProcessor
                        isMartial={item.martial}
                        equipImageUrl={item.pic}
                        requestedData={{
                            equipName:item.nickname || item.name,
                            tableRow:[
                                item.def+"",
                                item.mdef+"",
                                item.price+"z"
                            ],
                            quality:item.quality
                        }}
                        onDelete={(armorName:string)=>
                            {
                                let removeIndex = armor.findIndex((ar)=>ar.name === armorName);
                                armor.splice(removeIndex,1)
                            }
                        }     
                    >

                    </EquipProcessor>
                {/each}
                {#if armor.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
            </Card.Content>
        {/if}
    </Card.Root>
{/snippet}

{#snippet weaponsDisplay(weapon:Weapon[])}
<Card.Root class="bg-cafe_noir-600 border-0"> 
        <Card.Header class="flex flex-row justify-between items-center"> 
            <p class="text-white">ARMI</p>
            <button onclick={()=> viewWeapons = !viewWeapons}> 
                {#if !viewWeapons}
                    <Fa icon={faArrowDown}/>
                {:else}
                    <Fa icon={faArrowUp}/>
                {/if}
            </button>
        </Card.Header>
        {#if viewWeapons}
            <Card.Content class="bg-white">
                {#each weapon as item}
                    <WeaponProcessor 
                        weaponName={item.name}
                        weaponImageUrl={item.pic} 
                        quality={item.quality}
                        isMartial = {item.isMartial}
                        calculatedResults={
                            {
                                cost:item.cost,
                                damage:item.damage,
                                accuracy:"non viene usato",
                                formulaRow:[
                                    `[${item.attr1} + ${item.attr2}]`,
                                    `[ TM+${item.damage}]${item.type}`,
                                    `${item.cost}z`
                                ],
                                thirdRowElement:[ 
                                    item.category,
                                    "*",
                                    item.hands,
                                    "*",
                                    item.range
                                ],
                                category:item.category,
                                weaponData:item
                            }
                        }
                        onDelete={(weaponName:string)=>
                            {
                                let removeIndex = weapons.findIndex((w)=>w.name === weaponName);
                                weapons.splice(removeIndex,1)
                            }
                        } 
                    />

                {/each}
                {#if weapon.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
            </Card.Content>
        {/if}
    </Card.Root>
    
{/snippet}

{#snippet actionButton(styleClass:string,clickFun: ()=>void,icon:IconDefinition, description:string)} 
    <Button onclick={clickFun} class={styleClass}> 
        <p>{description}</p>
        <Fa icon={icon}/>
    </Button>
{/snippet}