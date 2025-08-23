<script lang="ts">
    import { elemGlams, type StatsSheetProps } from "$lib";
    import * as Card from "$lib/components/ui/card/index"
    import { Slider } from "bits-ui"
    import Fa from "svelte-fa";
    import Checkbox from "../ui/checkbox/checkbox.svelte";

    let {
        attributes,
        affinity,
        statuses,
        callbacks
    } : StatsSheetProps = $props();

</script>
<div class="flex flex-col gap-10">
    <!-- Caratteristiche -->
    <Card.Root class="border-0 bg-cafe_noir-800"> 
        <Card.Header class="flex flex-row justify-between"> 
            <p>Caratteristiche</p>
        </Card.Header>
        <!-- Slider e Spiegazione Spread -->
        <Card.Content class="flex flex-row gap-30 bg-white py-2"> 
            <!-- Slider per modificare le caratteristiche -->
            <div class="flex flex-col item-center gap-2 w-50">    
                {@render attributeRender(["DES","DEX"],attributes.DEX)}
                {@render attributeRender(["INT","INS"],attributes.INS)}
                {@render attributeRender(["VIG","MIG"],attributes.MIG)}
                {@render attributeRender(["VOL","WLP"],attributes.WLP)}
            </div>

            <!-- Spiegazione delle spread -->
            <div class="rounded-md border border-lion-300 bg-lion-500  p-4 text-sm text-white">
                <p>
                    <span class="font-semibold">Tuttofare:</span> d8, d8, d8, d8
                </p>
                <p>
                    <span class="font-semibold">Standard:</span> d10, d8, d8, d6
                </p>
                <p>
                    <span class="font-semibold">Specializzato:</span> d10, d10, d6, d6
                </p>

                <hr class="my-2 border-gray-300" />

                <p class="w-80">
                    Al raggiungimento dei livelli <span class="font-semibold">20</span> e <span class="font-semibold">40</span>, 
                    il Personaggio sceglie uno dei suoi Attributi e lo aumenta di una taglia di dado 
                    (fino a un massimo di d12).
                </p>
            </div>

        </Card.Content>
    </Card.Root>

    <!-- Affintà Elementali -->
    <Card.Root class="border-0 bg-cafe_noir-800"> 
        <Card.Header class="flex flex-row justify-between"> 
            <p>Affinità Elementali</p>
        </Card.Header>
        <!-- Slider per modificare le affinità Elementali -->
        <Card.Content class="flex flex-col gap-2 bg-white py-4">
            {@render affinityRender("Fisico",affinity.fisico,elemGlams)}
            {@render affinityRender("Fulmine",affinity.fulmine,elemGlams)}
            {@render affinityRender("Aria",affinity.aria,elemGlams)}
            {@render affinityRender("Terra",affinity.terra,elemGlams)}
            {@render affinityRender("Fuoco",affinity.fuoco,elemGlams)}
            {@render affinityRender("Ghiaccio",affinity.ghiaccio,elemGlams)}
            {@render affinityRender("Oscurita",affinity.oscurita,elemGlams)}
            {@render affinityRender("Luce",affinity.luce,elemGlams)}
            {@render affinityRender("Veleno",affinity.veleno,elemGlams)}
        </Card.Content>
    </Card.Root>

    <!-- Status -->
    <Card.Root class="border-0 bg-cafe_noir-800"> 
        <Card.Header class="flex flex-row justify-between"> 
            <p>Status</p>
        </Card.Header>
        <!-- Slider per modificare le affinità Elementali -->
        <Card.Content class="grid grid-cols-2 gap-2 bg-white py-4">
            {@render statusRender(["Lento","slow"],statuses.slow,"Destrezza ridotta di 2")}
            {@render statusRender(["Confuso","dazed"],statuses.dazed,"Intuito ridotto di 2")}
            {@render statusRender(["Furente","enraged"],statuses.enraged,"Destrezza ed Intuito sono ridotti di 2")}
            {@render statusRender(["Debole","weak"],statuses.weak,"Vigore ridotto di 2")}
            {@render statusRender(["Scosso","shaken"],statuses.shaken,"Volonta ridotta di 2")}
            {@render statusRender(["Avvelenato","poisoned"],statuses.poisoned,"Vigore e Volontà sono ridotti di 2")}
            <hr><hr>
            {@render statusRender(["DES UP","dexUp"],statuses.dexUp,"Destrezza aumentata di 2")}
            {@render statusRender(["INT UP","insUp"],statuses.insUp,"Intuito aumentato di 2")}
            {@render statusRender(["VIG UP","migUp"],statuses.migUp,"Vigore aumentato di 2")}
            {@render statusRender(["VOL UP","wlpUp"],statuses.wlpUp,"Volontà aumentata di 2")}
        </Card.Content>
    </Card.Root>

</div>

{#snippet attributeRender(attribute:string[],value:number)}
    <div class="flex flex-row items-center justify-center">
        <p class="w-20">{attribute[0]}</p>
        <Slider.Root 
            type="single" 
            class="relative flex w-full touch-none select-none items-center" 
            value={value}  
            max={12} min={6} step={2}
            onValueCommit={(value)=>{callbacks.attributes.update(attribute[1],value)}}
            >
            {#snippet children({ tickItems, thumbItems })}
                <!-- Traccia dello slider -->
                <div class="relative h-2 w-full grow rounded-full bg-gray-200">
                    <Slider.Range class="absolute h-full rounded-full bg-lion-300 " />
                </div>
                    
                <!-- Thumb -->
                {#each thumbItems as { index } (index)}
                <Slider.Thumb 
                    {index}
                    class="block h-5 w-5 rounded-full border-2 border-white border-rounded bg-white shadow transition-colors focus:outline-none  z-10"
                />
                {/each}
                
                <!-- Ticks e Labels -->
                {#each tickItems as { index, value } (index)}
                    <Slider.Tick 
                        {index}
                        class="absolute h-2 w-0.5 bg-gray-400 z-0"
                    />
                    {#if attribute[0] === "VOL"}    
                        <Slider.TickLabel 
                            {index}
                            position="bottom"
                            class="text-xs text-gray-600 mt-2 font-medium"
                        >
                            d{value}
                        </Slider.TickLabel>
                    {/if}
                {/each}
                
            {/snippet}

        </Slider.Root>
    </div>
           
{/snippet}

{#snippet affinityRender(affinity:string,value:any,elemGlams:any)}
    {@const glam = elemGlams[affinity.toLowerCase()]}
    {@const affinityValue = value.weak ? 1	: value.resistant ? 3	: value.absorb ? 4 	: value.immune ? 0 	: 2}
    <div class="flex flex-row gap-2 items-center w-auto justify-center">
        <Fa icon={glam.icon} class={glam.color}/>
        <p class="w-20">{affinity}</p>
        <Slider.Root 
            type="single" 
            class=" relative flex w-full touch-none select-none items-center" 
            value={affinityValue} 
            min={0} max={4} step={1} 
            onValueCommit={(value)=>callbacks.affinity.update(affinity.toLowerCase(),value)}
            >
            {#snippet children({ tickItems, thumbItems })}
                <!-- Traccia dello slider -->
                <div class="relative h-2 w-full grow rounded-full bg-gray-200">
                    <Slider.Range class="absolute h-full rounded-full bg-lion-300 " />
                </div>
                    
                <!-- Thumb -->
                {#each thumbItems as { index } (index)}
                <Slider.Thumb 
                    {index}
                    class="block h-5 w-5 rounded-full border-2 border-white border-rounded bg-white shadow transition-colors focus:outline-none  z-10"
                />
                {/each}
                
                <!-- Ticks e Labels -->
                {#each tickItems as { index } (index)}
                {@const labels = ["Immune","Debole","Normale","Resistente","Assorbe"]}
                    <Slider.Tick 
                        {index}
                        class="absolute h-2 w-0.5 bg-gray-400 z-0"
                    />
                    {#if affinity === "Veleno"}    
                        <Slider.TickLabel 
                            {index}
                            position="bottom"
                            class="text-xs text-gray-600 mt-2 font-medium"
                        >
                            {labels[index]}
                        </Slider.TickLabel>
                    {/if}
                {/each}
            {/snippet}
        </Slider.Root>
    </div>
{/snippet}

{#snippet statusRender(status:string[],value:any,description:string)}
    <div class="flex flex-row items-center justify-start gap-5">
        <p class="w-20 font-semibold ">{status[0]}</p>
        <Checkbox checked={value} onCheckedChange={(checked)=>callbacks.status.update(status[1],checked)}></Checkbox>
        <p class="text-xs">{description}</p>
    </div>
    
{/snippet}