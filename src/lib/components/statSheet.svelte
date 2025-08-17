<script lang="ts">
    import { elemGlams, type StatsSheetProps } from "$lib";
    import * as Card from "$lib/components/ui/card/index"
    import {Slider} from "bits-ui"
    import { toast } from "svelte-sonner";
    
    import Fa from "svelte-fa";
    import { Root } from "./ui/button";
    import { cn } from "$lib/utils";

    let {
        attributes,
        affinity,
        statuses,
        callbacks
    } : StatsSheetProps = $props();

    let singleValue = $state(50);
  let rangeValue = [25, 75];

  function handleValueChange(value:any) {
    console.log("Nuovo valore:", value);
  }


</script>
<div class="gap-2">
    <!-- Caratteristiche -->
    <Card.Root class="border-0 bg-cafe_noir-800"> 
        <Card.Header class="flex flex-row justify-between"> 
            <p>Caratteristiche</p>
        </Card.Header>
        <Card.Content class="flex flex-row gap-30 bg-white py-2"> 
            <div class="flex flex-col gap-2">    
                {@render attributeRender("DES",attributes.DEX)}
                {@render attributeRender("INT",attributes.INS)}
                {@render attributeRender("VIG",attributes.MIG)}
                {@render attributeRender("VOL",attributes.WLP)}
            </div>

            



            <!-- 
            fare un gradiente
            bg-gradient-to-r from-lion-500  to-lion-700 
            -->
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
        <Card.Content class="flex flex-col gap-2 bg-white py-2"> 
            {@render affinityRender("Fisico",affinity.fisico,elemGlams)}
            {@render affinityRender("Fulmine",affinity.fulmine,elemGlams)}
            {@render affinityRender("Aria",affinity.aria,elemGlams)}
            {@render affinityRender("Terra",affinity.terra,elemGlams)}
            {@render affinityRender("Fuoco",affinity.fuoco,elemGlams)}
            {@render affinityRender("Ghiaccio",affinity.ghiaccio,elemGlams)}
            {@render affinityRender("Oscurità",affinity.oscurità,elemGlams)}
            {@render affinityRender("Luce",affinity.luce,elemGlams)}
            {@render affinityRender("Veleno",affinity.veleno,elemGlams)}
        </Card.Content>
    </Card.Root>


</div>








{#snippet attributeRender(attribute:string,value:number)}
    <div class="flex flex-row">
        <p class="w-20">{attribute}</p>
        <div class="flex flex-col w-50">
        <Slider.Root type="single" class="relative flex w-full touch-none select-none items-center" value={value} onValueChange={()=>{toast.error("fare callback")}} max={12} min={6} step={2}>
            {#snippet children({ tickItems, thumbItems })}
            <!-- Traccia dello slider -->
                <div class="relative h-2 w-full grow rounded-full bg-gray-200">
                    <Slider.Range class="absolute h-full rounded-full bg-blue-500" />
                </div>
                    
                <!-- Thumb -->
                {#each thumbItems as { index } (index)}
                <Slider.Thumb 
                    {index}
                    class="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                />
                {/each}
                
                    <!-- Ticks e Labels -->
                    {#each tickItems as { index, value } (index)}
                        <Slider.Tick 
                            {index}
                            class="absolute h-2 w-0.5 bg-gray-400 z-0"
                        />
                        {#if attribute === "VOL"}    
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
    </div>
           
{/snippet}

{#snippet affinityRender(affinity:string,value:any,elemGlams:any)}
    {@const glam = elemGlams[affinity.toLowerCase()]}    
    {@const affinityValue = value.weak ? 1	: value.resistant ? 2	: value.absorb ? 3 	: value.immune ? 4 	: 0}
    <div class="flex flex-col gap-1">
        <div class="flex flex-row gap-2 items-center">
            <Fa icon={glam.icon} class={glam.color}/>
            <p class="w-50">{affinity}</p>
            <Slider.Root type="single" value={affinityValue} min={0} max={4} onValueChange={()=>toast.error("fare Callback")}>
                <Slider.Range>
                </Slider.Range>
            </Slider.Root>
        </div>
    </div>
{/snippet}





	
<!-- <Slider.Root type="single" step={[0, 4, 8, 16, 24]}>
  {#snippet children({ tickItems })}
    {#each tickItems as { value, index } (index)}
      <Slider.Tick {index} />
      <Slider.TickLabel {index} position="top">
        {value}
      </Slider.TickLabel>
    {/each}
  {/snippet}
  {@render children({value:"Immune",index:0})}
</Slider.Root> -->

<Slider.Root type="single" class="relative flex w-full touch-none select-none items-center" value={attributes.DEX} onValueChange={()=>{toast.error("fare callback")}} max={12} min={6} step={2}>
    {#snippet children({ tickItems, thumbItems })}
        <!-- Traccia dello slider -->
        <div class="relative h-2 w-full grow rounded-full bg-gray-200">
          <Slider.Range class="absolute h-full rounded-full bg-blue-500" />
        </div>

        <!-- Thumb -->
        {#each thumbItems as { index } (index)}
          <Slider.Thumb 
            {index}
            class="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          />
        {/each}

        <!-- Ticks e Labels -->
        {#each tickItems as { index, value } (index)}
          <Slider.Tick 
            {index}
            class="absolute h-2 w-0.5 bg-gray-400 z-0"
          />
          <Slider.TickLabel 
            {index}
            position="bottom"
            class="text-xs text-gray-600 mt-2 font-medium"
          >
            d{value}
          </Slider.TickLabel>
        {/each}
      {/snippet}
</Slider.Root>
