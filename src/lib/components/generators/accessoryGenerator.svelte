<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js";     
    import { blobUrlToBase64, downloadFile, uploadFile } from "$lib/utils";
    import { Button } from "../ui/button";
    import { Label } from "../ui/label";
    import type { Quality } from "$lib";
    import Input from "../ui/input/input.svelte";
    import Textarea from "../ui/textarea/textarea.svelte";
    import { onMount } from "svelte";
    import { AccessoryScheme } from "$lib/zod";
    import { toast } from "svelte-sonner";
    import AccessoryProcessor from "../imageProcessors/accessoryProcessor.svelte";

    let {showImageProcessor = true,dim = "w-150",onSave=null} = $props();


    let accessoryName = $state("");
    let accessoryImageUrl = $state();
    let customQuality = $state("");
    let customCost = $state(0);
    let isRealCustomQuality = $state(false);
    //sarà da fetchare
    let requestedData = $state({
        accessoryName:"",
        quality:"Nessuna Qualità",
        price:0
    }
        

    )

    let baseQualities:Quality[] = $state([]);
    let baseQuality = $state("");

    const triggerQuality = $derived(
        baseQualities.find((q)=> q.name === baseQuality)?.name ?? "Scegli una qualità"
    );

    async function createAccessoryObject(){
        if (accessoryImageUrl !== undefined)accessoryImageUrl = await blobUrlToBase64(accessoryImageUrl) as string
        else accessoryImageUrl = undefined;
        
        const propAccessory = {
            name:accessoryName,
            price:requestedData.price,
            quality:requestedData.quality,
            pic:accessoryImageUrl,
            code:3
        }
        return propAccessory;
    }
    async function handleExport(){

        const propAccessory = await createAccessoryObject();
        console.log(propAccessory)
        if (!onSave){
            const downloadableAccessory = JSON.stringify(propAccessory, null, 2);
            downloadFile(downloadableAccessory,`${accessoryName.replace(/\s+/g, '') || 'accessorio'}.json`,'application/json')
        }else{

            if (!accessoryName.trim()) {
                toast.error("Inserisci un nome per l'accessorio!");
                return;
            }
            onSave(propAccessory);
            toast.success(`Accessorio "${accessoryName}" aggiunto all'inventario!`);
            clearFields();
        }
        return;
    }
    
    async function handleImport(){
        try{
            const {name, content} = await uploadFile('.json');
            const parsed = await JSON.parse(content);
            console.log(parsed);
            const parsedAccessory = AccessoryScheme.parse(parsed);
            if(parsed.code !== 3) throw new Error()

            //parametri dell'accessorio
            accessoryName = parsedAccessory.name;
            accessoryImageUrl = parsedAccessory.pic;
            customQuality = parsedAccessory.quality;
            customCost = parsedAccessory.price;

            toast.success("Accessorio importato Correttamente!");
        }
        catch(error){
            toast.error("Errore nell'importazione del file",{
                description: "Il file selezionato non rappresenta un'accessorio Json",
                action: {
                    label: "OK",
                    onClick: () => console.info("Undo")
                }
            });
        }
        

    }   

    function clearFields(){
        accessoryImageUrl = "";
        accessoryName = "";
        baseQuality = "";
        customCost = 0;
        customQuality = "";
        isRealCustomQuality = false;
    }

    async function calculateParams(){
        let quality = baseQualities.find((q)=>q.name === baseQuality);
        let userQuality;
        if(customQuality !== "" && isRealCustomQuality) userQuality = {name:"customQuality",effect:customQuality,price:customCost}
        else userQuality = undefined;
        
        const response = await fetch('/api/accessoryGenerator',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                accessoryName,
                quality,
                customQuality:userQuality,
                customCost
            })
        })

        //risposta HTTP 
        const result = await response.json();

        if(result.success){
            requestedData = result.data;
            if(requestedData.quality !== "Nessuna Qualità" && isRealCustomQuality === false){
                customQuality = requestedData.quality;
                customCost = requestedData.price;
            }
        }
    }

    onMount(async ()=>{
        console.log("initial Fetch");
        //recupero i dati dal db
        const response = await fetch('/api/accessoryGenerator');
        const data = await response.json();
        baseQualities = data.qualities; 
        console.log(data);
    });

    $effect(()=>{    
        calculateParams();
    })

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
                        <Label for="nome_accessorio">Nome</Label>
                        <Input type="text" id="nome_accessorio" placeholder="Nome Accessorio" bind:value={accessoryName}/>
                    </span>
                
                    <!-- Qualità Standard -->
                    <span class="flex flex-col gap-2 ">    
                        <Label for="accessorio_base">Qualità</Label>
                        <Select.Root type="single" name="accessorio_base" bind:value={baseQuality}>
                            <Select.Trigger class="w-auto min-w-30">
                                {triggerQuality}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Group >
                                    {#each baseQualities as quality (quality.name)}
                                        <Select.Item
                                        value={quality.name}
                                        label={quality.name}
                                        disabled={quality.name==="Qualità Offensive" || quality.name ==="Qualità Difensive" || quality.name === "Qualità di Potenziamento"}
                                        >
                                            {quality.name}
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
                        <Textarea bind:value={customQuality} oninput = {()=> isRealCustomQuality =  customQuality.trim()!== ""}></Textarea>
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
                {#if onSave}
                    <Button class="bg-cafe_noir-400 w-30" onclick={handleExport}>
                        Salva Accessorio                    </Button>
                {/if}
            </Card.Footer>
        </Card.Root>
    </div>

    <!-- ImageProcessor -->
    {#if showImageProcessor}
        
        <AccessoryProcessor
            requestedData = {requestedData}
            accessoryImageUrl={accessoryImageUrl}
            handleExport={handleExport}
        />
    {/if}
    
</div>