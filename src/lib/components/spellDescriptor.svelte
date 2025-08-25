<script lang="ts">
    import { cn } from "$lib/utils";
    import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
    import Separator from "./ui/separator/separator.svelte";
    import Fa from "svelte-fa";

    let { name,isOffensive = true ,cost,targets,duration,description, class:className = "" } = $props();
    let tableRow = [cost + "MP per bersaglio", "⬥" , targets, "⬥", duration]
</script>


<div class="flex flex-col {cn(className)}">
    <h1 class="flex flex-col bg-lion-500 ">
        <span class="flex flex-row items-center gap-2 p-2">
            <p class="font-bold"> {name} </p>
            {#if isOffensive}
                <Fa icon={faBoltLightning} class="text-red-600"/>
            {/if}
        </span>
        
        <span class="flex flex-row gap-5 items-center justify-center p-2">
            {#each tableRow as row}
                <p>{row}</p>
            {/each}
        </span>
    </h1>
    <Separator orientation="horizontal" class="bg-lion-500"> </Separator>
    <h2>
        {description}
    </h2>   
</div>
