<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import Input from "../ui/input/input.svelte";
    import Textarea from "../ui/textarea/textarea.svelte";
    import { Button } from "../ui/button";
    import Label from "../ui/label/label.svelte";
    import Checkbox from "../ui/checkbox/checkbox.svelte";
    import Fa from "svelte-fa";
    import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
    import { exportHtmlToImage } from "$lib/utils";
    import ImageUploader2 from "../imageUploader3.svelte";
    import { onMount } from "svelte";

    //Arcana markdown Variables
    let arcanaName = $state("");
    let domain = $state("");
    let description = $state("");
    let fusionName = $state("");
    let fusionEffect = $state("");
    let impulseName = $state("");
    let impulseEffect = $state("");
    let dismissalName = $state("");
    let dismissalEffect = $state("");
    let arcanaImageUrl = $state("");
    let rework = $state(false);

    //rtt al server per i dati da mettere nel processore
    let requestedData = $state({
        arcanaName:"",
        description:"",
        domain:"",
        fusionName:"",
        fusionEffect:"",
        impulseName:"",
        impulseEffect:"",
        dismissalName:"",
        dismissalEffect:""
    })

    onMount(async ()=>{
        calculateParams();
    })


   function handleExport(){
        return;

    }
    
    function handleImport(){

    }

    function clearFields(){
        arcanaName = "";
        domain = "";
        description ="";
        fusionName = "";
        fusionEffect = "";
        impulseName = "";
        impulseEffect = "";
        dismissalName = "";
        dismissalEffect = "";
        arcanaImageUrl = "";
    }

    //effect per aggiornamento dinamico dei dati
    $effect( ()=>{
        calculateParams();
    });

    async function calculateParams(){
        try{
            //Richiesta HTTP
            const response = await fetch('/api/arcanaGenerator', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    arcanaName,
                    description,
                    domain,
                    fusionName,
                    fusionEffect,
                    impulseName,
                    impulseEffect,
                    dismissalName,
                    dismissalEffect
                })
            });

            //Risposta HTTP
            const result = await response.json();
            
            if(result.success){
                requestedData = result.data;
                console.log(result.data);

            }
        }
        catch(error){

        }
    }

</script>

<!-- Container -->
<div class="flex flex-row gap-5">
    <!-- Generatore -->
    <Card.Root class="w-150 bg-cafe_noir-700 border-0">
        <Card.Header> 
            Generatore di Arcanum
        </Card.Header>
        <Card.Content  class=" py-5 flex flex-col gap-5 bg-white">
            <div class="flex flex-col gap-5">
                
                <!-- Nome e Dominio dell'Arcanum -->    
                <div class="flex flex-row justify-between gap-5">
                    <!-- Nome -->
                    <span class="gap-2 flex flex-col">
                        <Label>Nome</Label>
                        <Input bind:value={arcanaName}/>
                    </span>

                    <!-- Dominio -->
                    <span class="gap-2 flex flex-col">
                        <Label>Dominio</Label>
                        <Input class="w-full" bind:value={domain}/>
                    </span>
                    
                </div>

            
                <!-- Descrizione -->
                <span class="gap-2 flex flex-col">
                    <Label>Descrizione</Label>
                    <Input bind:value={description}/>
                </span>

                <!-- Fusione -->
                
                <!-- Nome Fusione -->
                <span class="gap-2 flex flex-col">
                    <Label>Nome Fusione</Label>
                    <Input bind:value={fusionName}/>
                </span>

                    <!-- Benefici di Fusione -->
                <span class="gap-2 flex flex-col">
                    <Label>Benefici di Fusione</Label>
                    
                    <Textarea bind:value={fusionEffect}>
                    </Textarea>
                </span>
                
                {#if rework}

                    <!-- Impulso -->
                    <span class="gap-2 flex flex-col">
                        <Label>Nome Impulso</Label>
                        
                        <!-- Nome Impulso -->
                        <Input bind:value={impulseName}/>
                    </span>
                    
                    <span class="gap-2 flex flex-col">
                        <Label>Effetto Impulso</Label>
                        
                        <!-- Effetto Impulso -->
                        <Textarea bind:value = {impulseEffect}>

                        </Textarea>
                    </span>
                {/if}    
                
                <!-- Congedo -->
                <span class="gap-2 flex flex-col">
                    <Label>Nome Congedo</Label>
                    
                    <!-- Nome Congedo -->
                    <Input bind:value={dismissalName}/>
                </span>

                <span class="gap-2 flex flex-col">
                    <Label>Benefici di Congedo</Label>
                    <!-- Effetto Congedo -->
                    <Textarea bind:value={dismissalEffect}>

                    </Textarea>
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
            <span class="flex flex-row gap-2 ">
                <Label for="rework_cb">Rework?</Label>
                <Checkbox id="rework_cb" bind:checked={rework}  class="bg-amber-100 !accent-cafe_noir-500   "/>
            </span>
            
                
        </Card.Footer>
    </Card.Root>
    
    <!-- ImageProcessor -->
    <div>
        <!-- Immagine Scaricabile-->
        <div id="arcanum" class="bg-white border-black h-auto">

            <div class="flex">
                <div class="flex-shrink-0">
                    <ImageUploader2 padre="arcanumGenerator" dimensions={"w-20 h-20 border-r border-b"} fill={true} bind:imageUrl = {arcanaImageUrl}/>
                </div>
                <div class="flex-1">
                    <div class="bg-cafe_noir-700">
                        {requestedData.arcanaName}
                    </div>
                    <div class="items-center justify-start px-2 bg-cafe_noir-800 flex w-150 break-words">
                        {requestedData.description}
                    </div>
                    <hr>
                    <div class="px-2">
                        {requestedData.domain}
                    </div>
                </div>
            </div>


            <!-- Fusione -->
            <div>
                <span class="flex flex-row">
                    <p class="bg-cafe_noir-700 text-white w-auto px-2">
                        Fusione
                    </p>
                    <p class="bg-cafe_noir-800 w-full px-2">
                        {requestedData.fusionName}
                    </p>
                </span>
                    <div class="px-2 break-words w-150">
                        {requestedData.fusionEffect}
                    </div>
            </div>

            <!-- Impulso -->
            {#if rework}
                <div>
                    <span class="flex flex-row">
                        <p class="bg-cafe_noir-700 text-white w-auto px-2">
                            Impulso
                        </p>
                        <p class="bg-cafe_noir-800 w-full px-2">
                            {requestedData.impulseName}
                        </p>
                    </span>
                    <div class="px-2 break-words w-150">
                        {requestedData.impulseEffect}
                    </div>
                </div>
            {/if}

            <!-- Congedo -->
            <div>
                <span class="flex flex-row">
                    <p class="bg-cafe_noir-700 text-white w-auto px-2">
                        Congedo
                    </p>
                    <p class="bg-cafe_noir-800 w-full">
                        {requestedData.dismissalName}
                    </p>
                </span>
                <div class="px-2 break-words w-150">
                    {requestedData.dismissalEffect}
                </div>            
            </div>
            
        </div>

        <!-- Pulsanti Azione -->
        <span class="flex flex-row">
            <span>
                <button onclick={()=>exportHtmlToImage('arcanum')}>
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