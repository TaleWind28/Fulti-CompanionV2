<script lang="ts">
    import type { Spell, Spellbook } from "$lib/zod";
    import * as Card from "$lib/components/ui/card/index";
    import * as Select from "$lib/components/ui/select/index";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import { buttonVariants } from "../ui/button/index";
    import ScrollArea from "../ui/scroll-area/scroll-area.svelte";
    import Separator from "../ui/separator/separator.svelte";
    import SpellDescriptor from "../spellDescriptor.svelte";

    /*  PROP  */
    let {spellBook, callbacks} : {spellBook:Spellbook, callbacks:any} =$props();
    /* FINE PROP */
    
    let selectedSpellClass = $state("");
    let spellClasses = ["Elementalista","Chimerista","Entropista","Spiritista"];
    const spellClassTrigger = $derived(
        spellClasses.find(sp=>sp === selectedSpellClass) || "Nessuna Lista Selezionata"
    );
    
    /* LO SCRIPT è SOLO PER TESTARE LA PAGINA DOPO VA AGGIORNATO CON I FETCH DAL DB E LE CALLBACK PER AGGIORNARE LA SCHEDA*/
    let spells = 
    [
        {
            name:"Fulgur",
            description:"Plasmi l'elettricità in un'onda di energia crepitante.\nCiascun bersaglio subisce [TM+15] danni da Fulmine\nOpportunità: Ciascun bersaglio subisce lo status Confuso",
            targets:{max:3,description:"Fino a tre creature"},
            cost:10,
            duration:"Istantanea",
            special:"None",
            offensive:true,
            list:"elementalista"
        }
    ]

    let selectedSpell:Spell = $state({
            name:"Fulgur",
            description:"Plasmi l'elettricità in un'onda di energia crepitante.\nCiascun bersaglio subisce [TM+15] danni da Fulmine\nOpportunità: Ciascun bersaglio subisce lo status Confuso",
            targets:{max:3,description:"Fino a tre creature"},
            cost:10,
            duration:"Istantanea",
            special:"None",
            offensive:true,
            list:"elementalista"
        });
    let selectedButton = $state();


    let incantesimi:any = $state([  {name:"Fulgur",description:"Plasmi l'elettricità in un'onda di energia crepitante. Ciascun bersaglio colpito subisce【TM + 15】 danni da fulmine. Opportunità: ciascun bersaglio colpito subisce lo status confuso.",cost:10,targets:"una creatura",duration:"istantanea"}]);
    let acquiredSpellClasses = $state(
    [
        {name:"Elementalista", spellList:[...incantesimi]}
    ])

    function handleSpellAdd(){
        incantesimi.push(selectedSpell);
        acquiredSpellClasses[0].spellList = incantesimi;
    }

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
                        {#each spellClasses as list}
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
                <Dialog.Trigger class={buttonVariants({ variant: "default" })}> 
                    Aggiungi un'incantesimo
                </Dialog.Trigger>
                <Dialog.Content class="!max-w-none w-250 bg-lion-600"> 
                    <div class="flex flex-row border bg-white">
                        <ScrollArea class="h-80 w-50 rounded-md gap-5"> 
                            {#each spells as spell,index}
                                <button onclick={()=>{selectedSpell=spell,selectedButton = index}} 
                                    class="flex flex-col w-full justify-start text-start text-white border {selectedButton === index ? 'bg-lion-300' : 'bg-lion-400'}">
                                    <p>{spell.name}</p>
                                </button>
                            {/each}
                        </ScrollArea>
                        <Separator orientation="vertical"/>
                        <div class="w-190">
                            <SpellDescriptor 
                                name={selectedSpell.name} 
                                description={selectedSpell.description} 
                                targets={selectedSpell.targets} 
                                duration={selectedSpell.duration} 
                                cost={selectedSpell.cost}
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

    <!-- Render delle spell acquisite dal giocatore -->
    <!-- {#each acquiredSpellClasses as sorceries}
        {@render spellBookSections(sorceries.name,sorceries.spellList)}
    {/each}
     -->
    {#each Object.entries(spellBook) as [sectionName, spellsArray]}
        {@render spellBookSections(sectionName, spellsArray)}
    {/each}

    
    
</div>

{#snippet spellBookSections(section:string,incantesimi:Spell[])}
    <Card.Root class="bg-cafe_noir-600 border-0">  
        <Card.Header class="text-white font-bold"> 
            <p>{section}</p>
        </Card.Header>
        <Card.Content class="bg-white py-5"> 
            <div class="w-180 flex flex-col gap-5">
                {#each incantesimi as spell}
                    <SpellDescriptor
                        class="border"
                        name={spell.name}
                        description={spell.description}
                        targets={spell.targets}
                        duration={spell.duration}
                        cost={spell.cost}
                    />
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
{/snippet}