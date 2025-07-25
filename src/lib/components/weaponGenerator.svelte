<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js"        
    import Input from "./ui/input/input.svelte";
    import Checkbox from "./ui/checkbox/checkbox.svelte";
    import Label from "./ui/label/label.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    import ImageUploader2 from "./imageUploader2.svelte";
    import Fa from "svelte-fa";
    import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
    import { onMount } from "svelte";
    import type { Quality, SelectionItem, Weapon } from "$lib";
    import { blobUrlToBase64, downloadFile, exportHtmlToImage, uploadFile } from "$lib/utils";
    import Button from "./ui/button/button.svelte";
    import { WeaponScheme } from "$lib/zod";
    
    // Fetch dei dati iniziali
    onMount(async () => {
        try {
            console.log("initialFetch");
            //recupero i dati dal db
            const response = await fetch('/api/weaponGenerator');
            const data = await response.json();
            
            //array di dati per personalizzare l'arma
            baseWeapons = data.baseWeapons;
            qualities = data.qualities;
            damageTypes = data.damageTypes;
            attributes = data.attributes;
            handNumber = data.handNumber;
            //arma di default
            weapon = "Martello di Ferro";
            //invocazione di base per dare un default
            calculateParams()
        } catch (error) {
            console.error('Errore nel caricamento dati:', error);
        }
    });
    

    //variabile per evitare che effect impedisca di modificare manualmente i valori dopo aver selezionato l'arma;
    let oldWeapon = "";
    //qualità da fetchare
    let qualities:Quality[] = $state([]);
    //tipi di danno da fetchare
    let damageTypes:SelectionItem[] = $state([]);
    //armi base
    let baseWeapons:Weapon[] = $state([]);
    //numero di mani da fetchare
    let handNumber:SelectionItem[] = $state([]);
    //attributi da fetchare
    let attributes:SelectionItem[] = $state([]);

    // Variabili del form
    let weapon = $state("");  //arma attualmente selezionata
    let baseQuality = $state("");
    let customQuality = $state("");
    let customCost = $state(0);
    let additionalDamage = $state(false);
    let additionalAccuracy = $state(false);
    let attr1 = $state("VIG");
    let attr2 = $state("VIG");
    let damageType = $state("fisico");
    let selectedHands = $state("");
    let weaponName = $state("");
    let weaponImageUrl = $state();
    let isMartial = $state(false);


    // Risultati dei calcoli del server
    let calculatedResults = $state({
        cost: 0,
        damage: 0,
        accuracy: "",
        formulaRow: [],
        thirdRowElement: [],
        category: "",
        weaponData: null
    });

    //trigger per select

    const triggerQuality = $derived(
        qualities.find((q)=> q.name === baseQuality)?.name ?? "Scegli una qualità"
    );

    const triggerWeapon = $derived(
        baseWeapons.find(w =>w.name === weapon)?.name ?? "Scegli un'arma"
    )

    const triggerAttr1 = $derived(
        attributes.find(attr=>attr.value === attr1)?.label ?? "Attr1"
    );

    const triggerAttr2 = $derived(
        attributes.find(attr=>attr.value === attr2)?.label ?? "Attr2"
    );

    const triggerDamageType = $derived(
        damageTypes.find(dt => dt.value === damageType)?.label ?? "Tipo di Danno"
    )
    
    //imageProcessor
    let quality = $derived.by(()=>{
        if(customQuality!=="")return customQuality
        else return qualities.find((q)=> q.name === baseQuality)?.effect ?? "Nessuna Qualità";
    });

    //effect per aggiornamento dinamico dei dati nell'imageProcessor
    $effect(()=>{
        calculateParams();
    })

    async function handleExport() {
        if( weaponImageUrl !== undefined)weaponImageUrl = await blobUrlToBase64(weaponImageUrl) as string
        else weaponImageUrl = undefined;
        const propWeapon = {
            name:weapon,
            nickname:weaponName,
            cost:calculatedResults.cost,
            attr1:attr1,
            attr2:attr2,
            damage:calculatedResults.damage,
            type:damageType,
            category:calculatedResults.category,
            quality:quality,
            range:calculatedResults.thirdRowElement[4],
            hands:calculatedResults.thirdRowElement[2],
            pic:weaponImageUrl,
            isMartial:isMartial
        }
        const downloadableWeapon = JSON.stringify(propWeapon, null, 2);

        downloadFile(downloadableWeapon,`${weaponName.replace(/\s+/g, '') || 'arma'}.json`,'application/json')
    }


    async function calculateParams() {
        if (!weapon) return;
        try {
            //richiesta HTTP
            const response = await fetch('/api/weaponGenerator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    weapon,
                    baseQuality,
                    customQuality,
                    customCost,
                    additionalDamage,
                    additionalAccuracy,
                    attr1,
                    attr2,
                    damageType,
                    selectedHands,
                    weaponName
                })
            });

            //Risposta HTTP
            const result = await response.json();
            
            if (result.success) {
                calculatedResults = result.calculations;
                // Aggiorna gli attributi solo se è stata selezionata un'altra arma
                if (result.calculations.weaponData && oldWeapon != weapon) {
                    attr1 = result.calculations.weaponData.attr1;
                    attr2 = result.calculations.weaponData.attr2;
                    selectedHands = result.calculations.weaponData.hands;
                    oldWeapon = weapon;
                }
            }
        } catch (error) {
            console.error('Errore nella richiesta:', error)
        }
    }

    async function handleImport(){
        try{
            const {name, content} = await uploadFile('.json');
            const parsed = await JSON.parse(content);
            const parsedWeapon = WeaponScheme.parse(parsed);

            weapon = parsedWeapon.name;
            weaponName = parsedWeapon.nickname !== undefined ? parsedWeapon.nickname : "" ;
            calculatedResults.cost = parsedWeapon.cost;
            attr1 = parsedWeapon.attr1;
            attr2 = parsedWeapon.attr2;
            damageType = parsedWeapon.type;
            calculatedResults.damage = parsedWeapon.damage;
            customQuality = quality = parsedWeapon.quality; 
            isMartial = parsedWeapon.isMartial !==undefined ? parsedWeapon.isMartial : false;
            weaponImageUrl = parsedWeapon.pic !== undefined ? parsedWeapon.pic : "";
            
        }
        catch(error){
            console.log(error);
        }

    }   

    function clearFields(){
        oldWeapon = "";
        weapon = "Martello di Ferro";
        weaponName = "";
        customQuality = "";
        customCost = 0;
        baseQuality = "";
        additionalAccuracy = false;
        additionalDamage = false;
        weaponImageUrl = "";
        damageType = "fisico";
        isMartial = false;
        calculateParams();
    }
</script>

<div class="flex flex-row gap-5 justify-evenly">

    <!-- Generatore -->
    <Card.Root class="w-150 bg-cafe_noir-700 border-0">
        <Card.Header class="">
            <Card.Title>Generatore di Armi  </Card.Title>
        </Card.Header>
        <Card.Content class=" py-5 flex flex-col gap-5 bg-white">
           
            <!-- Prima riga: Arma base, Nome e Marziale -->
            <div class="flex flex-row gap-5 items-center justify-between">
                <!-- Arma Base -->
                <span class="flex flex-col gap-2 ">
                    <Label for="arma_base">Arma</Label>
                    <Select.Root type="single" name="arma_base" bind:value={weapon}>
                        <Select.Trigger class="w-[180px]">
                            {triggerWeapon}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group >
                                {#each baseWeapons as weapon (weapon.name)}
                                    <Select.Item
                                    value={weapon.name}
                                    label={weapon.name}
                                    disabled={weapon.name==="Pesanti" || weapon.name==="Pugnali" ||weapon.name==="Da Rissa" ||weapon.name==="Spada" ||weapon.name==="Arcana" || weapon.name ==="Arco"||weapon.name==="Flagello" ||weapon.name==="Da Fuoco" ||weapon.name==="Lancia" || weapon.name ==="Da Lancio"}
                                    >
                                        {weapon.name}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </span>
                <!-- checkbox marziale -->
                <div class="flex items-center flex-col gap-2">
                    <Label for="martial">Marziale</Label>
                    <Checkbox id="martial" bind:checked={isMartial}/>
                </div>
                <!-- nome arma -->
                <span class="flex flex-col gap-2 ">
                    <Label for="nome_arma">Nome</Label>
                    <Input type="text" id="nome_arma" placeholder="Nome Arma" bind:value={weaponName}/>
                </span>
            </div>

            <!-- Seconda Riga: Tipo di danno, ed Attributi di precisione  -->
            <div class="flex flex-row gap-5 justify-between">
                <!-- Tipo di danno -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Tipo di danno</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value={damageType}>
                        <Select.Trigger class="w-auto min-w-30">
                            {triggerDamageType}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Tipi di Danno</Select.Label>
                                {#each damageTypes as dt (dt.value)}
                                    <Select.Item
                                    value={dt.value}
                                    label={dt.label}
                                    >
                                        {dt.label}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </span>

                <!-- Prima Caratteristica -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Attr1</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value={attr1}>
                        <Select.Trigger class="w-auto min-w-30">
                            {triggerAttr1}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Caratteritiche</Select.Label>
                                {#each attributes as attr (attr.value)}
                                    <Select.Item
                                    value={attr.value}
                                    label={attr.label}
                                    >
                                        {attr.label}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </span>

                <!-- Seconda Caratteristica -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Attr2</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value={attr2}>
                        <Select.Trigger class="w-auto min-w-30">
                            {triggerAttr2}
                        </Select.Trigger>
                        <Select.Content>
                                <Select.Group>
                                <Select.Label>Caratteritiche</Select.Label>
                                {#each attributes as attr (attr.value)}
                                    <Select.Item
                                    value={attr.value}
                                    label={attr.label}
                                    >
                                        {attr.label}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </span>

            </div>

            <!-- Terza Riga: Qualità Standard, Prezzo,Modificatori Precisione e Danno -->
            <div class="flex flex-row justify-between items-center">
                <!-- Qualità Standard -->
                <span class="flex flex-col gap-2">
                    <Label>Qualità</Label>
                    <Select.Root type="single" name="qualità" bind:value = {baseQuality}>
                    <Select.Trigger class="w-auto min-w-50">
                        {triggerQuality}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Qualità Standard</Select.Label>
                            {#each qualities as quality (quality.name)}
                                <Select.Item
                                value={quality.name}
                                label={quality.name}
                                disabled={quality.name==="Offensive" || quality.name ==="Difensive" || quality.name === "Potenziamento"}
                                        >
                                    {quality.name}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                    </Select.Root>
                </span>

                <!-- Prezzo -->
                <span class="flex flex-col gap-5 w-30 items-center">
                    <Label for="price">Costi Aggiuntivi</Label>
                    <Input id="price" type="number" min="0" class="w-20" bind:value={customCost}/>  
                </span>

                <!-- Modificatori -->
                <div class="flex flex-col gap-2">
                    <Label class="border-0"> Modificatori </Label>
                    <!-- Accuracy -->
                    <span class="flex flex-row gap-2">
                        <Checkbox id="damageMod" bind:checked={additionalDamage}></Checkbox>
                        <Label for="damageMod">+4 Danno</Label>
                    </span>
                    <!-- Damage -->  
                    <span class="flex flex-row gap-2">
                        <Checkbox id="accuracyMod" bind:checked={additionalAccuracy} ></Checkbox>
                        <Label for="accuracymod">+1 Precisione</Label>
                    </span>
                </div>

            </div>
            
            <!-- Quarta riga: Qualità Custom -->
            <div class="flex flex-row gap-30 justify-start w-full">
                <span class="flex flex-col gap-4 w-full">
                    <Label> Qualità Personalizzata</Label>
                    <Textarea bind:value={customQuality}>

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
        </Card.Footer>
    </Card.Root>

    <!-- ImageProcesor -->
    <div>
        <div  id={"arma"} class="bg-white border-black h-auto ">
            <!-- Intestazione tabella -->
            <div class="bg-cafe_noir-700 grid grid-cols-6">
                <p class="col-span-1 px-2">
                    {weaponName}
                    {#if isMartial}
                        <span class="text-red-600 " style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">♦</span>
                    {/if}
                </p>
                <span class="grid grid-cols-3  col-span-5 gap-30 px-10">
                    {#each ["PRECISIONE","DANNO","COSTO"] as header}
                        <p> {header} </p>
                    {/each}
                </span>
            </div>
            <div class="flex">
                <div class="flex-shrink-0">
                    <ImageUploader2 padre="weaponGenerator" dimensions={"w-25 h-25 border-r"} fill={true} bind:imageUrl = {weaponImageUrl}/>
                </div>
                <div class="flex-1">
                    <div class="justify-around bg-cafe_noir-800 flex ">
                        {#each calculatedResults.formulaRow as formula}
                            <p> {formula} </p>
                        {/each}
                    </div>
                    <hr>
                    <div class="flex flex-row items-center justify-between px-2 ">
                        {#each calculatedResults.thirdRowElement as element }
                            <p class="text-center"> {element} </p>
                        {/each}
                    </div>
                    <hr>
                    <div class="px-2 break-words w-150">
                        {quality}
                    </div>
                </div>
            </div>
        
            
        </div>
        <span class="flex flex-row">
            <span>
                <button onclick={()=>exportHtmlToImage('arma')}>
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


