<script lang="ts">
    import type { FabulaUltimaCharacter, Spell, Spellbook } from "$lib/zod";
    import * as Card from "$lib/components/ui/card/index";
    import * as Select from "$lib/components/ui/select/index";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import { buttonVariants } from "../ui/button/index";
    import ScrollArea from "../ui/scroll-area/scroll-area.svelte";
    import Separator from "../ui/separator/separator.svelte";
    import SpellDescriptor from "../spellDescriptor.svelte";
  import Button from "../ui/button/button.svelte";

    /*  PROP  */
    let {
        spellBook = {},
        callbacks,
        availableSpells
    
    } : {spellBook:Spellbook, callbacks:any, availableSpells:any, character:FabulaUltimaCharacter} =$props();
    /* FINE PROP */

    let noSpell = $state(false);
    //controllo necessario per le classi non magiche
    if (Object.keys(availableSpells).length === 0){
        noSpell = true;
    }


    let lists:string[] = $derived(Object.keys(availableSpells));
    console.log(availableSpells,"spells");

    let selectedSpellClass = $derived(lists[0]);
    const spellClassTrigger = $derived(
        lists.find(sp=>sp === selectedSpellClass) || lists[0]
    );
    
    let selectedSpell:Spell = $derived(
        Object.keys(availableSpells).length !== 0
        ? availableSpells[selectedSpellClass].spells[0]
        : null
    );
    let selectedButton = $state();


    $inspect(availableSpells,"spData");
</script>

<div class="flex flex-col gap-5">
    <!-- Action Buttons per selezione classe da incantatore ed aggiunta spell -->
    <Card.Root> 
        <Card.Content class="flex flex-row gap-5 justify-center">
            <!-- Selezione Liste di Incantesimi -->
            <Select.Root type="single" name="SpellListSelector" bind:value={selectedSpellClass}> 
                <Select.Trigger> 
                    {spellClassTrigger}
                </Select.Trigger>
                <Select.Content> 
                    <Select.Group> 
                        <Select.Label> 
                            Liste di incantesimi
                        </Select.Label>
                        {#each lists as list}
                            <Select.Item
                                value={list}
                                label={list}    
                            > 
                                {list}
                            </Select.Item>
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>

            <!-- Aggiunta Incantesimo -->
            <Dialog.Root>
                <Dialog.Trigger  onclick={(e) => {
                    if (Object.keys(availableSpells).length === 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        }
                    }
                }>
                    <Button disabled={Object.keys(availableSpells).length === 0} >Aggiungi un'incantesimo</Button>
                </Dialog.Trigger>
                <Dialog.Content class="!max-w-none w-250 bg-lion-600 border-0"> 
                    <div class="flex flex-row border bg-white">
                        <ScrollArea class="h-80 w-50 rounded-md gap-5 border-0  "> 
                            {#each availableSpells[selectedSpellClass].spells as spell,index}
                                <button onclick={()=>{selectedSpell=spell,selectedButton = index}} 
                                    class="flex flex-col w-full justify-start text-start text-white border {selectedButton === index ? 'bg-lion-300' : 'bg-lion-400'}">
                                    <p>{spell.name}</p>
                                </button>
                            {/each}
                        </ScrollArea>
                        <Separator orientation="vertical"/>
                        <div class="w-190">
                            <SpellDescriptor 
                                spell={selectedSpell}
                            />
                        </div>
                    </div>
                    <Dialog.Footer> 
                        <Dialog.Close  class={buttonVariants(
                                { variant: "default"},
                                
                                )}
                                
                                onclick={()=>callbacks.spell.update(selectedSpell)}
                                > 
                            Aggiungi
                        </Dialog.Close>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Root>
        </Card.Content>
    </Card.Root>
    {#each Object.entries(spellBook) as [sectionName, spellsArray]}
        {@render spellBookSections(sectionName, spellsArray)}
    {/each}

    
    
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
                        onDelete={callbacks.spell.remove}
                    />
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
{/snippet}