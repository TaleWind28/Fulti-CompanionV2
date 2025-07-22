<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js"     
    import ImageUploader2 from "./imageUploader2.svelte";
    import { exportHtmlToImage } from "$lib/utils";
    import Fa from "svelte-fa";
    import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
    import { Button } from "./ui/button";
    import { Label } from "./ui/label";
    import type { Quality } from "$lib";
    import Input from "./ui/input/input.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";

    let equipName = $state("");
    //imageProcessor
    let cost = $state(0);
    let dataRow = $derived(["7","5",cost+"z"]);
    let equipImageUrl = $state("");
    let quality = $state("");
    let isMartial = $state(false);
    let customCost =$state(0);
    let customQuality = $state("");


    const baseQualities:Quality[] = $state([]);
    let baseQuality = $state("");

    let equip = $state("");
    let baseEquipment:any = $state([]);


    const triggerEquipment = $derived(
        baseEquipment.find((eq:any)=> eq.value === equip)?.label ?? "Scegli un'equipaggiamento"
    )

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

<div class="flex gap-5 justify-evenly">
    <!-- Generatore -->
    <div>
        <Card.Root  class="w-150 bg-cafe_noir-700 border-0">
            <Card.Header>
                Generatore di Armature e Scudi
            </Card.Header>
            <Card.Content class=" py-5 flex flex-col gap-5 bg-white">

                <!-- Equipaggiamento, Qualità Standard e Nome equipaggiamento -->
                <div class="flex flex-row gap-5 items-center">
                    <!-- Equipaggiamenti-->
                    <span class="flex flex-col gap-2 ">
                        <Label for="arma_base">Armatura/Scudo</Label>
                        <Select.Root type="single" name="arma_base" bind:value={equip}>
                            <Select.Trigger class="w-auto min-w-30">
                                {triggerEquipment}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Group >
                                    {#each baseEquipment as equip (equip.name)}
                                        <Select.Item
                                        value={equip.name}
                                        label={equip.name}
                                        disabled={equip.name==="Armatura" || equip.name ==="Scudo"}
                                        >
                                            {equip.name}
                                        </Select.Item>
                                    {/each}
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
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

                    <!-- Nome Equipaggiamento -->
                    <span class="flex flex-col gap-2 ">
                        <Label for="nome_arma">Nome</Label>
                        <Input type="text" id="nome_arma" placeholder="Nome Arma" bind:value={equipName}/>
                    </span>
                </div>

                <!-- Qualità custom e Costo -->
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
    <!--ImageProcessor -->
    <div>
        <div id="equipaggiamento" class="bg-white border h-auto">
            <!-- intestazione tabella -->
            <div class="bg-cafe_noir-700 grid grid-cols-6">
            <p class="col-span-1 px-2">
                {equipName}
                {#if isMartial}
                    <span class="text-red-600 " style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">♦</span>
                {/if}
            </p>
            <span class="grid grid-cols-3  col-span-5 gap-30 px-10">
                {#each ["DIFESA","DIFESA M.","COSTO"] as header}
                    <p> {header} </p>
                {/each}
            </span>
        </div>

        <!-- Corpo Tabella -->
        <div class="flex">
            <div class="flex-shrink-0">
                <ImageUploader2 padre="shieldGenerator" dimensions={"w-25 h-25 border-r"} fill={true} bind:imageUrl = {equipImageUrl}/>
            </div>
            <div class="flex-1">
                <div class="justify-around bg-cafe_noir-800 flex ">
                    {#each ["Def","*","MDef","*","costo"] as formula}
                        <p> {formula} </p>
                    {/each}
                </div>
                <hr>
                <!-- <div class="flex flex-row items-center justify-between px-2 ">
                    {#each calculatedResults.thirdRowElement as element }
                        <p class="text-center"> {element} </p>
                    {/each}
                </div>
                <hr> -->
                <div class="px-2 break-words w-150">
                    {quality}
                </div>
            </div>
        </div>
        </div>
        

        <span class="flex flex-row">
            <span>
                <button onclick={()=>exportHtmlToImage('equipaggiamento')}>
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

