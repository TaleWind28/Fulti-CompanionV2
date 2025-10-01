<script lang="ts">
    import Bond from '$lib/components/bond.svelte';
    import CharacterCard from '$lib/components/characterCard.svelte';
    import ClassDescriptor from '$lib/components/classDescriptor.svelte';
    import EconomicInfo from '$lib/components/economicInfo.svelte';
    import AccessoryProcessor from '$lib/components/imageProcessors/accessoryProcessor.svelte';
    import ArcanaProcessor from '$lib/components/imageProcessors/arcanaProcessor.svelte';
    import EquipProcessor from '$lib/components/imageProcessors/equipProcessor.svelte';
    import WeaponProcessor from '$lib/components/imageProcessors/weaponProcessor.svelte';
    import Note from '$lib/components/note.svelte';
    import SpellDescriptor from '$lib/components/spellDescriptor.svelte';
    import html2pdf from "html2pdf.js";
    import * as Card from '$lib/components/ui/card/index.js';
    import type { Spell } from '$lib/zod.js';
    import { setContext } from 'svelte';
  import Button from '$lib/components/ui/button/button.svelte';

    let {data} = $props();

    type WearArmor = (equipName:string)=>boolean;
    type EquipArmor = (equipName:string,value:boolean) => boolean;
    setContext<WearArmor>('CheckArmor',ArmorUp);
    setContext<EquipArmor>('WearArmor',EquipArmor);

    const character = data.character;
    const shields = character.inventory.shields;
    const armor = character.inventory.armor;
    const weapon = character.inventory.weapons;
    const arcana = character.inventory.arcanas;
    const notes = character.notes;
  
    function EquipArmor(equipName:string,value:boolean){
        return false;
    }
    
    function ArmorUp(equipName:string){
        return false;
    }
</script>
    <div class="flex flex-wrap p-5 justify-center items-start gap-5" id="pdf">
        <!-- Card Personaggio-->    
        <CharacterCard character={character}/>
        <span class="flex flex-col items-center justify-center gap-10">
            <!-- EconomicInfo -->
            <Card.Root> 
                <Card.Content> 
                    <EconomicInfo info={character.info} callbacks={()=>console.log("moio")}/>
                </Card.Content>
            </Card.Root>

            <!-- Bonds -->
            <Card.Root class="border-0 bg-cafe_noir-800"> 
                <Card.Header class="flex flex-row justify-between"> 
                    <p>Legami</p>
                </Card.Header>
                <Card.Content class="flex flex-col gap-7"> 
                    {#each character.bonds as bond,i }
                        <Bond bond={bond} updateBond={()=>console.log()} removeBond={()=>console.log()} id={i}/> 
                    {/each}
                </Card.Content>
            </Card.Root>
        </span>

        
        <!-- Weapons -->
        <Card.Root class="bg-cafe_noir-600 border-0 w-150"> 
            <Card.Header class="flex flex-row justify-between items-center"> 
                <p class="text-white">ARMI</p>
            </Card.Header>
            <Card.Content class="bg-white flex flex-col gap-5 py-5">
                    {#each weapon as item}
                        <div> 
                            <WeaponProcessor 
                                weaponName={item.nickname || item.name}
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
                            />
                        </div>
                        

                    {/each}
                    {#if weapon.length === 0}
                        <p class="text-gray-500 p-4">Nessun elemento presente</p>
                    {/if}
            </Card.Content>
        </Card.Root>
<div class="break-before-page"></div>
        <!-- Armature -->
        <Card.Root class="bg-cafe_noir-600 border-0 w-150"> 
            <Card.Header class="flex flex-row justify-between items-center"> 
                <p class="text-white">ARMATURE</p>
            </Card.Header>
                <Card.Content class="bg-white flex flex-col gap-5 py-5">
                    {#each armor as item}
                        <div>
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
                                equip={item.equipped}
                            />
                        </div>
                        
                    {/each}
                    {#if armor.length === 0}
                        <p class="text-gray-500 p-4">Nessun elemento presente</p>
                    {/if}
                </Card.Content>
        </Card.Root>

        <!-- Scudi -->
        <Card.Root class="bg-cafe_noir-600 border-0 w-150"> 
            <Card.Header class="flex flex-row justify-between items-center"> 
                <p class="text-white">SCUDI</p>
            </Card.Header>

            <Card.Content class="bg-white flex flex-col gap-5 py-5">
                {#each shields as item}
                    <div>   
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
                        
                        equip={item.equipped}
                    />
                    </div>
                {/each}
                 {#if shields.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
                
            </Card.Content>
        </Card.Root>

        <!-- Accessori -->
        <Card.Root class="bg-cafe_noir-600 border-0 w-150"> 
            <Card.Header class="text-white "> 
                ACCESSORI
            </Card.Header>
            <Card.Content class="bg-white flex flex-col gap-5 py-5">
                {#each character.inventory.accessories as item}
                    <div>
                        <AccessoryProcessor
                            requestedData={
                                {
                                    accessoryName:item.name,
                                    price:item.price,
                                    quality:item.quality,

                                }
                            }
                            accessoryImageUrl={item.pic}
                        />
                    </div>
                {/each}
                {#if character.inventory.accessories.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
            </Card.Content>
        </Card.Root>
        
        <!-- Arcanum -->
        <Card.Root class="bg-cafe_noir-600 border-0 w-150"> 
            <Card.Header class="flex flex-row justify-between items-center"> 
                <p class="text-white">ARCANUM</p>
            </Card.Header>
        
            <Card.Content class="bg-white flex flex-col gap-5 py-5">
                {#each arcana as item}
                    <div>
                        <ArcanaProcessor
                            requestedData={
                                {
                                    name:item.name,
                                    domain:item.domain,
                                    description:item.description,
                                    fusionName:item.fusion.name,
                                    fusionEffect:item.fusion.effect,
                                    impulseName:item.impulse?.name,
                                    impulseEffect:item.impulse?.effect,
                                    dismissalName:item.dismissal.name,
                                    dismissalEffect:item.dismissal.effect,
                                }
                            }
                            rework = {item.reworked}
                            arcanaImageUrl={item.pic}
                            
                        />
                    </div>
                {/each}
                {#if arcana.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
            </Card.Content>
        </Card.Root>

        <div class="break-before-page"></div>

        <!-- Classi -->
        {#each character.classes as clas}
            <ClassDescriptor characterClass = {clas}/>
        {/each}
        
        <div class="break-before-page"></div>
        
        <!-- Incantesimi -->
        {#each Object.entries(character.spellbook) as [sectionName, spellsArray]}
            {@render spellBookSections(sectionName, spellsArray)}
        {/each}

        <div class="break-before-page"></div>

        <!-- Notes -->
        <Card.Root class="bg-cafe_noir-700 border-0 w-150">
            <Card.Header class="text-white text-xl flex flex-row justify-between"> 
                <p>NOTE</p>        
            </Card.Header>
            <Card.Content class="flex flex-col gap-5 bg-white"> 
                {#each notes as note }
                    <Note note={note}/>
                    <hr>
                {/each}
            </Card.Content>    
            
        </Card.Root>

</div>




{#snippet spellBookSections(section:string,incantesimi:Spell[])}
    <Card.Root class="bg-cafe_noir-600 border-0">  
        <Card.Header class="text-white font-bold"> 
            <p>{section.toUpperCase()}</p>
        </Card.Header>
        <Card.Content class="bg-white py-5"> 
            <div class="w-180 flex flex-col gap-5">
                {#each incantesimi as spell}
                    <SpellDescriptor
                        class="border"
                        spell={spell}
                    />
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
{/snippet}

