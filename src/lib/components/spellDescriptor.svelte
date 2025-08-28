<script lang="ts">
    import { cn } from "$lib/utils";
    import { faBoltLightning, faTrash } from "@fortawesome/free-solid-svg-icons";
    import Separator from "./ui/separator/separator.svelte";
    import Fa from "svelte-fa";
    import type { Spell } from "$lib/zod";

    let { spell, class: className = "", onDelete = null } : {spell: Spell, class?: string, onDelete?:any} = $props();
    let tableRow = [spell.cost + "MP per bersaglio", "⬥" , spell.targets.description, "⬥", spell.duration]
</script>


<div class="flex flex-col {cn(className)}">
    <h1 class="flex flex-col bg-lion-500 ">
        <span class="flex flex-row justify-between  items-center gap-2 p-2">
            <span class="flex flex-row items-center gap-2 p-2">
                <p class="font-bold"> {spell.name} </p>
                {#if spell.offensive}
                    <Fa icon={faBoltLightning} class="text-red-600"/>
                {/if}
            </span>

            {#if onDelete}
                <button class="cursor-pointer" onclick={ ()=> onDelete(spell)}>
                    <Fa icon={faTrash} />
                </button>
            {/if}
                
        </span>
        
        <span class="flex flex-row gap-5 items-center justify-center p-2">
            {#each tableRow as row}
                <p>{row}</p>
            {/each}
        </span>
    </h1>
    <Separator orientation="horizontal" class="bg-lion-500"> </Separator>
    <h2 class="p-2">
        {spell.description}
    </h2>
</div>
