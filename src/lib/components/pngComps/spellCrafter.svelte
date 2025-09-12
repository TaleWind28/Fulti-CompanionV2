<script lang="ts">
    import type { Spell } from "$lib/zod";
    import { faBolt, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import Input from "../ui/input/input.svelte";
    import Label from "../ui/label/label.svelte";
    import Textarea from "../ui/textarea/textarea.svelte";
    import Fa from "svelte-fa";

    let {
        spell,
        index,
        callbacks
    } :{spell:Spell, index:number, callbacks:any}= $props()

    let offensive = $state("");

</script>

<div class="flex flex-col gap-5">
    <!-- Prima Riga: Nome, Offensivo, Costo, #Bersagli -->
    <span class="flex flex-row itmes-center gap-5">
    
        <button onclick={()=>callbacks.removeSpell(index)}>
            <Fa icon={faMinusCircle}/>
        </button>
        <span class="flex flex-col">
            <Label> Nome </Label>
            <Input
                value={spell.name}
                oninput={(e)=>callbacks.updateSpell(index,'name',(e.target as HTMLInputElement).value)}
            />
        </span>

        <!-- Toggle -->
        <span class="flex flex-col gap-2 items-center">
                <Label></Label>
                <!-- Toggle per scegliere se distanza o mischia -->
                <ToggleGroup.Root type="single" value={offensive} onValueChange={(v)=>callbacks.updateOffensiveSpell(index,v)}> 
                    <!-- Group offensive -->
                    <ToggleGroup.Item value="offensive">
                        <!-- Tooltip per far capire all'utente che sta selezionando la mischia -->
                        <Tooltip.Provider>
                            <Tooltip.Root> 
                                <Tooltip.Trigger> 
                                    <Fa icon={faBolt}></Fa>
                                </Tooltip.Trigger>
                                <Tooltip.Content> 
                                    <p>È offensivo?</p>
                                </Tooltip.Content>
                                
                            </Tooltip.Root> 
                        </Tooltip.Provider>
                    </ToggleGroup.Item>
                </ToggleGroup.Root>
        </span>


        <!-- Costo -->
        <span class="flex flex-col">
            <Label> MP * Bers </Label>
            <Input
                value={spell.cost}
                type='number'
                min='0'
                oninput={(e)=>callbacks.updateSpell(index,'cost',Number((e.target as HTMLInputElement).value))}
            />
        </span>

        <!-- Max Bersagli -->
        <span class="flex flex-col">
            <Label> # Max Bers </Label>
            <Input
                value={spell.targets.max}
                oninput={(e)=>callbacks.updateMaxTargets(index,Number((e.target as HTMLInputElement).value))}
                type='number'
                min='0'
                />
        </span>
    </span>

    <!-- Seconda Riga: Descrizione Bersagli e Durata incantesimo -->
    <span class="flex flex-row items-center justify-start gap-30 ">
        <!-- Descrizione Bersagli -->
        <span class="flex flex-col">
            <Label> Descrizione Bersagli </Label>
            <Input
                value={spell.targets.description}
                oninput={(e)=>callbacks.updateTargetsDescription(index,(e.target as HTMLInputElement).value)}
            />
        </span>
        
        <!-- Durata Incantesimo -->
        <span class="flex flex-col">
            <Label> Durata Incantesimo </Label>
            <Input
                value={spell.duration}
                oninput={(e)=>callbacks.updateSpell(index,'duration',(e.target as HTMLInputElement).value)}
            />
        </span>
    </span>
    <!-- Quarta Riga: Effetto incantesimo -->
    <Label>Effetto</Label>
    <Textarea
        value={spell.special}
        oninput={(e)=>callbacks.updateSpell(index,'description',(e.target as HTMLTextAreaElement).value)}
    />
</div>