<script lang="ts">
    import type { StatsSheetProps } from "$lib";
    import * as Card from "$lib/components/ui/card/index"
    import { toast } from "svelte-sonner";
    import Slider from "./ui/slider/slider.svelte";

    let {
        attributes,
        affinity,
        statuses,
        callbacks
    } : StatsSheetProps = $props();
    </script>

    <!-- Legami -->
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

{#snippet attributeRender(attribute:string,value:number)}
    <div class="flex flex-row">
        <p class="w-20">{attribute}</p>
        <div class="flex flex-col">
            <Slider type="single" class="w-50 py-3" value={value} onValueChange={()=>{toast.error("fare callback")}} max={12} min={6} step={2}></Slider>
            {#if attribute === "VOL"}
                <!-- il div serve solo per occupare una colonna -->
                <div class="flex justify-between text-xs text-gray-500 mt-1 pl-1">
                    <span>d6</span>
                    <span>d8</span>
                    <span>d10</span>
                    <span>d12</span>
                </div>
            {/if}
        </div>
    </div>
           
{/snippet}