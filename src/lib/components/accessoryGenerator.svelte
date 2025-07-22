<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js";     
    import ImageUploader2 from "./imageUploader2.svelte";
    import { exportHtmlToImage } from "$lib/utils";
    import Fa from "svelte-fa";
    import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
    import { Button } from "./ui/button";
    import { Label } from "./ui/label";
    import type { Quality } from "$lib";
    import Input from "./ui/input/input.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";

    let accessoryName = $state("");
    let cost = $state(0);
    let accessoryImageUrl = $state("");
    let customQuality = $state("");
    let customCost = $state(0);
    //sarà da fetchare
    let calculations = $derived([cost+"z"])

    const baseQualities:Quality[] = $state([]);
    let baseQuality = $state("");

    const triggerQuality = $derived(
        baseQualities.find((q)=> q.value === baseQuality)?.label ?? "Scegli una qualità"
    );

    function handleExport(){
        return;
    }
    
    function handleImport(){

    }

    function clearFields(){
        
    }
</script>

<div class=" flex gap-5 justify-evenly">
    <!-- Generatore -->
    <div>
        <Card.Root class="w-150 bg-cafe_noir-700 border-0"> 
            <Card.Header> 
                Generatore di Accessori
            </Card.Header>
            <Card.Content class=" py-5 flex flex-col gap-5 bg-white">
                <!-- Prima Riga: Nome Accessorio e Qualità Standard-->
                <div class="flex flex-row gap-5 items-center justify-between">
                    <!-- Nome Accessorio -->
                    <span class="flex flex-col gap-2 ">
                        <Label for="nome_arma">Nome</Label>
                        <Input type="text" id="nome_accessorio" placeholder="Nome Accessorio" bind:value={accessoryName}/>
                    </span>
                
                    <!-- Qualità Standard -->
                    <span class="flex flex-col gap-2 ">    
                        <Label for="arma_base">Qualità</Label>
                        <Select.Root type="single" name="arma_base" bind:value={baseQuality}>
                            <Select.Trigger class="w-auto min-w-30">
                                {triggerQuality}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Group >
                                    {#each baseQualities as quality (quality.value)}
                                        <Select.Item
                                        value={quality.value}
                                        label={quality.value}
                                        disabled={quality.value==="Armatura" || quality.value ==="Scudo"}
                                        >
                                            {quality.value}
                                        </Select.Item>
                                    {/each}
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                    </span>
                </div>

                <!-- Seconda Riga: Qualità Custom e Costo -->
                <div class="flex flex-row gap-30 justify-start w-full">
                    <!-- Qualità Custom -->
                    <span class="flex flex-col gap-4 w-full">
                        <Label> Qualità Personalizzata</Label>
                        <Textarea bind:value={customQuality}></Textarea>
                    </span>
                    <!-- Prezzo -->
                    <span class="flex flex-col gap-5 w-30 items-center">
                        <Label for="price">Costi Aggiuntivi</Label>
                        <Input id="price" type="number" min="0" class="w-20" bind:value={customCost}/>  
                    </span>
                </div>
                    

            </Card.Content>

            <Card.Footer class="flex justify-center gap-10">
                <Button class="bg-cafe_noir-400 w-30" onclick={handleImport}>
                Carica Json
                </Button>
                <Button class="bg-cafe_noir-400 w-30" onclick={clearFields}>
                    Pulisci i Campi
                </Button>
            </Card.Footer>
        </Card.Root>
    </div>

    <!-- ImageProcessor -->
    <div>
        <div id="accessorio" class="bg-white border h-auto">
            <!-- Intestazione Tabella -->
            <div class="bg-cafe_noir-700 grid grid-cols-5">
                <p class="col-span-4 px-2">
                    {accessoryName}
                </p>
                <span class="flex justify-end px-4 gap-30 ">
                    {#each ["COSTO"] as header}
                        <p> {header} </p>
                    {/each}
                </span>
        </div>

            <!-- Corpo Tabella -->
        <div class="flex">
                <div class="flex-shrink-0">
                    <ImageUploader2 padre="accessoryGenerator" dimensions={"w-20 h-20 border-r"} fill={true} bind:imageUrl = {accessoryImageUrl}/>
                </div>
                <div class="flex-1">
                    <div class="items-center justify-end  px-5  bg-cafe_noir-800 flex">
                        {#each calculations as data}
                            <p> {data} </p>
                        {/each}
                    </div>
                    <hr>
                    <div class="px-2">
                        "Nesuna Qualità"
                    </div>
                </div>
            </div>
        </div>

        <span class="flex flex-row">
            <span>
                <button onclick={()=>exportHtmlToImage('accessorio')}>
                    <Fa icon={faDownload} class="cursor-pointer px-2 w-auto"/>
                </button>
            </span>
            
            <span>
                <button onclick={handleExport}>
                    <Fa icon={faFileExport} class="cursor-pointer px-2 w-auto"></Fa>
                </button>
            </span>
        </span>
    </div>
    
</div>