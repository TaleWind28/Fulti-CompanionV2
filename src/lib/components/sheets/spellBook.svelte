<script lang="ts">
    import type { Spell } from "$lib/zod";
    import * as Card from "$lib/components/ui/card/index";
    import * as Select from "$lib/components/ui/select/index";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import { buttonVariants } from "../ui/button/index";
    import ScrollArea from "../ui/scroll-area/scroll-area.svelte";
    import Separator from "../ui/separator/separator.svelte";
    let {spellBook} : {spellBook:Spell} =$props();

    let selectedSpellClass = $state("");
    let spellClasses = ["Elementalista","Chimerista","Entropista","Spiritista"];
    const spellClassTrigger = $derived(
        spellClasses.find(sp=>sp === selectedSpellClass) || "Nessuna Lista Selezionata"
    );

    let spells = [
        {name:"Fulgur",description:"soffio gelido"},
        {name:"Fulgur",description:"soffio gelido"},
        {name:"Fulgur",description:"soffio gelido"},
        {name:"Fulgur",description:"soffio gelido"},
        {name:"Fulgur",description:"soffio gelido"},
        {name:"Fulgur",description:"soffio gelido"},
        {name:"Fulgur",description:"soffio gelido"},
        {name:"Fulgur",description:"soffio gelido"},
        {name:"Ultimagia",description:"Magia Meno Finale"},
        {name:"Cometa",description:"Magia Finale"},
    ]

    let selectedSpell = $state("Fulgur");

    const spellDescription = $derived(
        spells.find((s)=>s.name === selectedSpell)?.description || "soffio Gelido"
    )
    

</script>

<div>
    <Card.Root> 
        <Card.Header> 
            Aggiungi un'incantesimo dalle Liste
        </Card.Header>
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
                <Dialog.Trigger class={buttonVariants({ variant: "outline" })}> 
                    Aggiungi un'incantesimo
                </Dialog.Trigger>
                <Dialog.Content> 
                    <div class="flex flex-row border">
                        <ScrollArea class="h-80 w-48 rounded-md  gap-5"> 
                            {#each spells as spell}
                                <button onclick={()=>selectedSpell=spell.name} class="flex flex-col">
                                    <p>{spell.name}</p>
                                </button>
                            {/each}
                        </ScrollArea>
                        <Separator orientation="vertical"/>
                        <div>
                            <p>
                                {spellDescription}
                            </p>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Root>
        </Card.Content>
    </Card.Root>
</div>