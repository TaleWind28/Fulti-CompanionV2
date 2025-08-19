<script lang="ts">
    import * as Select from "$lib/components/ui/select/index";
  import ClassDescriptor from "./classDescriptor.svelte";
    import Button from "./ui/button/button.svelte";
    import * as Card from "./ui/card/index";
    import SelectContent from "./ui/select/select-content.svelte";
    import SelectGroup from "./ui/select/select-group.svelte";

    let {classNames, classes, callbacks} = $props();
    //logica della select
    let selectedClass = $state("");
    const triggerClass = $derived(
        classNames.find(( c:string )=> c === selectedClass) || "Scegli una Classe"
    )
</script>


<div class="flex flex-col gap-5">
    <!-- Pulsanti per aggiungere le classi o caricare una classe da json --> 
     
    <Card.Root class=" border-0">
        <Card.Header>
            <Card.Title> 
                Classi
            </Card.Title>
        </Card.Header>
        <Card.Content class="bg-white flex flex-row items-center justify-center gap-5">
            <Select.Root
                type="single"
                name="classe_selezionata"
                bind:value={selectedClass}
                allowDeselect={true}
            >
            <Select.Trigger> 
                {triggerClass}
            </Select.Trigger>
            <SelectContent> 
                <SelectGroup> 
                    {#each classNames as characterClass}
                        <Select.Item 
                            value={characterClass}
                            label={characterClass}
                            disabled={characterClass.includes("Manuale")}
                        > 
                            {characterClass}
                        </Select.Item>
                        
                    {/each}
                </SelectGroup>
            </SelectContent>
        </Select.Root>

            <Button class="bg-cafe_noir-600 hover:bg-cafe_noir-500" onclick={()=>callbacks.classes.update(selectedClass)}>
                Aggiungi Classe
            </Button>
        </Card.Content>
    </Card.Root>

    <hr class="bg-caribbean_current-500  border-caribbean_current-500 h-0.5  rounded">
    <div class="flex flex-col gap-10">
        {#each classes as clas}
            
                <ClassDescriptor characterClass = {clas}/>
            
            
        {/each}
    </div>
</div>