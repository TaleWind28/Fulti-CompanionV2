<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import Input from "./ui/input/input.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    import { Button } from "./ui/button";
    import Label from "./ui/label/label.svelte";
    import Checkbox from "./ui/checkbox/checkbox.svelte";
  import { validatePassword } from "firebase/auth";
  import Fa from "svelte-fa";
  import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
  import { exportHtmlToImage } from "$lib/utils";
  import ImageUploader2 from "./imageUploader2.svelte";

    let rework = $state(false);


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


    //rtt al server per i dati da mettere nel processore
    let requestedData = $state({
        displayArcanaName:"Arcanum Senza Nome",
        displayDescription:"Nessuna Descrizione",
        displayDomains:"Nessun Dominio",
        displayFusionName:"",
        displayFusionEffect:"Nessun Beneficio di Fusione",
        displayImpulseName:"",
        displayImpulseEffect:"Nessun Effetto di Impulso",
        displayDismissalName:"",
        displayDismissalEffect:"Nessun Beneficio di Congedo"
    })


   function handleExport(){
        return;

    }
    
    function handleImport(){

    }

    function clearFields(){
        
    }

</script>

<!-- Container -->
<div class="flex flex-row gap-10">
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
        <div id="arcanum" class="bg-white border h-auto">
            <span class="flex flex-row">
                <ImageUploader2 padre="arcanaGenerator" dimensions={"w-50 h-40 border-r border-b"} fill={true} bind:imageUrl = {arcanaImageUrl}/>
                <span class="flex flex-col w-full">
                    <p class="bg-cafe_noir-700">
                        {requestedData.displayArcanaName}
                    </p>
                    <p class="bg-cafe_noir-800">
                        {requestedData.displayDescription}
                    </p>
                    <p>
                        {requestedData.displayDomains}
                    </p>
                </span>
            </span>

            <!-- Fusione -->
            <div>
                <span class="flex flex-row">
                    <p class="bg-cafe_noir-700 text-white w-auto">
                        Fusione
                    </p>
                    <p class="bg-cafe_noir-900 w-full">
                        {requestedData.displayFusionName}
                    </p>
                </span>
                    <div class="px-2 break-words w-150">
                        {requestedData.displayFusionEffect}
                    </div>
            </div>

            <!-- Impulso -->
            {#if rework}
                <div>
                    <span class="flex flex-row">
                        <p class="bg-cafe_noir-700 text-white w-auto">
                            Impulso
                        </p>
                        <p class="bg-cafe_noir-900 w-full">
                            {requestedData.displayImpulseName}
                        </p>
                    </span>
                    <div class="px-2 break-words w-150">
                        {requestedData.displayImpulseEffect}
                    </div>
                </div>
            {/if}

            <!-- Congedo -->
            <div>
                <span class="flex flex-row">
                    <p class="bg-cafe_noir-700 text-white w-auto">
                        Congedo
                    </p>
                    <p class="bg-cafe_noir-900 w-full">
                        {requestedData.displayDismissalName}
                    </p>
                </span>
                <div class="px-2 break-words w-150">
                    {requestedData.displayDismissalEffect}
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