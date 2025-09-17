<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js"     
    import { blobUrlToBase64, downloadFile,uploadFile } from "$lib/utils";
    import { Button } from "../ui/button";
    import { Label } from "../ui/label";
    import type { Armor, Quality, Shield } from "$lib";
    import Input from "../ui/input/input.svelte";
    import Textarea from "../ui/textarea/textarea.svelte";
    import { onMount } from "svelte";
    import { EquipScheme } from "$lib/zod";
    import { toast } from "svelte-sonner";
    import EquipProcessor from "../imageProcessors/equipProcessor.svelte";

    let {showImageProcessor = true, dim="w-150", onSave=null,offline=false} = $props();

    let equipName = $state("");
    let equipImageUrl = $state();
    let customCost =$state(0);
    let customQuality = $state("");
    let isRealCustomQuality = $state(false);
    
    //dati da richiedere al Server
    let requestedData = $state({
        equipName: "",
        tableRow:["","",""],
        quality:"Nessuna Qualità",
        totalPrice:0
    })

    let baseQualities:Quality[] = $state([]);
    let baseQuality = $state("");

    let equip = $state(""); //equipaggiamento attualmente selezionato
    let baseEquipment:(Shield | Armor)[] = $state([]);
    
    const triggerEquipment = $derived(
        baseEquipment.find((eq)=> eq.name === equip)?.name ?? "Scegli un'equipaggiamento"
    )

    let isMartial = $derived(
        baseEquipment.find((eq)=>eq.name === equip)?.martial ?? false
    )

    const triggerQuality = $derived(
        baseQualities.find((q)=> q.name === baseQuality)?.name ?? "Scegli una qualità"
    );

    onMount(async () => {
        try {
            //recupero i dati dal db
            const response = await fetch('/api/shieldGenerator');
            const data = await response.json();
            //array di dati per personalizzare l'arma
            baseQualities = data.qualities;
            baseEquipment = data.equipment;
            equip = "Camicia di Seta";
            calculateParams();
        } catch (error) {
            console.error('Errore nel caricamento dati:', error);
        }
    });

    async function createEquipmentObject(){
        if( equipImageUrl !== undefined)equipImageUrl = await blobUrlToBase64(equipImageUrl) as string
        else equipImageUrl = undefined;
        
        const propEquipment = {
            name:equip,
            nickname:equipName,
            def: requestedData.tableRow[0],
            mdef:requestedData.tableRow[1],
            quality: requestedData.quality,
            martial:isMartial,
            price:requestedData.totalPrice,
            pic:equipImageUrl,
            isMartial:isMartial,
            equipped:false,
            code:triggerEquipment.toLowerCase().includes("scudo") ?  1 : 2 
        }
        return propEquipment;
    }

    async function handleExport(){

        const propEquipment = await createEquipmentObject();
        if(!onSave){
            const downloadableEquipment = JSON.stringify(propEquipment, null, 2);

            downloadFile(downloadableEquipment,`${equipName.replace(/\s+/g, '') || 'equipaggiamento'}.json`,'application/json')
        }else{
            if (!equipName.trim() && propEquipment.code === 2) {
                toast.error("Inserisci un nome per l'armatura!");
                return;
            }
            if (!equipName.trim() && propEquipment.code === 1) {
                toast.error("Inserisci un nome per lo scudo!");
                return;
            }
            onSave(propEquipment);
            toast.success(` "${equipName}" aggiunto all'inventario!`);
            clearFields();
        }
        return;
    }
    
    async function handleImport(){
        try{
            const {name, content} = await uploadFile('.json');
            const parsed = await JSON.parse(content);
            const parsedEquip = EquipScheme.parse(parsed);
            


            //parametri dell'equipaggiamento.
            equip = parsedEquip.name;
            equipName = parsedEquip.nickname || "";
            customCost = parsedEquip.price;
            customQuality = parsedEquip.quality;
            isMartial = parsedEquip.martial;
            isRealCustomQuality = true;
            equipImageUrl = parsedEquip.pic;
            
            calculateParams();

            if (parsedEquip.code === 1 )toast.success("Scudo importato Correttamente!");
            else toast.success("Armatura importata Correttamente!");
        }
        catch(error){
            console.log(error);
            toast.error("Errore nell'importazione del file",{
                description: "Il file selezionato non rappresenta nè uno scudo nè un'armatura Json",
                action: {
                    label: "OK",
                    onClick: () => console.info("Undo")
                }
            });

        }
    }

    function clearFields(){
        equipName = "";
        equip = "Camicia di Seta";
        baseQuality = "";
        customQuality ="";
        customCost = 0;
        isRealCustomQuality = false;
        equipImageUrl = "";
        
    }

    async function calculateParams(){
        let quality = baseQualities.find((q)=>q.name === baseQuality);
        let userQuality;
        if(customQuality !== "" && isRealCustomQuality) userQuality = {name:"customQuality",effect:customQuality,price:customCost}
        else userQuality = undefined;
        const response = await fetch('/api/shieldGenerator',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                equipName,
                equip,
                quality,
                customQuality:userQuality,
            })
        })

        //risposta HTTP 
        const result = await response.json();

        if(result.success){
            requestedData = result.data;
             if(requestedData.quality !== "Nessuna Qualità" && isRealCustomQuality === false){
                customCost = requestedData.totalPrice;
                customQuality = requestedData.quality;
            }
        }
    }

    $effect(()=>{
        calculateParams();
    })
</script>

<div class="flex gap-5 justify-evenly">
    <!-- Generatore -->
    <div>
        <Card.Root  class="{dim} bg-cafe_noir-700 border-0">
            <Card.Header>
                Generatore di Armature e Scudi
            </Card.Header>
            <Card.Content class=" py-5 flex flex-col gap-5 bg-white">

                <!-- Equipaggiamento, Qualità Standard e Nome equipaggiamento -->
                <div class="flex flex-row gap-5 items-center">

                     <!-- Nome Equipaggiamento -->
                    <span class="flex flex-col gap-2 ">
                        <Label for="nome_arma">Nome</Label>
                        <Input type="text" id="nome_arma" placeholder="Nome Equipaggiamento" bind:value={equipName}/>
                    </span>

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
                            <Select.Trigger class="w-50 min-w-50">
                                {triggerQuality}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Group >
                                    {#each baseQualities as quality (quality.name)}
                                        <Select.Item
                                        value={quality.name}
                                        label={quality.name}
                                        disabled={quality.name ==="Qualità Difensive" || quality.name === "Qualità di Potenziamento"}
                                        >
                                            {quality.name}
                                        </Select.Item>
                                    {/each}
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                    </span>                   
                </div>

                <!-- Qualità custom e Costo -->
                <div class="flex flex-row gap-30 justify-start w-full">
                    <!-- Qualità Custom -->
                    <span class="flex flex-col gap-4 w-full">
                        <Label> Qualità Personalizzata</Label>
                        <Textarea bind:value={customQuality} oninput = { ()=> isRealCustomQuality = customQuality.trim()!== ""}></Textarea>
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
                <Button class="bg-cafe_noir-400 w-38" onclick={handleExport}>
                    Salva Equipaggiamento
                </Button>
            {/if}
            {#if offline}
                <Button class="bg-cafe_noir-400 w-38" onclick={handleExport}>
                    Esporta in Json
                </Button>
            {/if}
            </Card.Footer>
        </Card.Root>
    </div>

    <!--ImageProcessor -->
    <div>
        {#if showImageProcessor && !offline}
        
            <EquipProcessor requestedData={requestedData} isMartial={isMartial} equipImageUrl={equipImageUrl}/>

        {/if}
    </div>

</div>

