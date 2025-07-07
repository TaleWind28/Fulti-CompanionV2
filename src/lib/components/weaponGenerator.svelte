<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js"        
    import * as Table from "$lib/components/ui/table/index.js";
    import Input from "./ui/input/input.svelte";
    import Checkbox from "./ui/checkbox/checkbox.svelte";
    import Label from "./ui/label/label.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    import ImageUploader2 from "./imageUploader2.svelte";
  import Fa from "svelte-fa";
  import { faDownload, faFileExcel, faFileExport } from "@fortawesome/free-solid-svg-icons";
  import { base } from "$app/paths";


    //fetchare db
    const fruits = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grapes", label: "Grapes" },
        { value: "pineapple", label: "Pineapple" }
    ];

    const qualities = [
        {value:"Antistatus",label:"PippoBaudo",effect:"pino"},
        {value:"q2",label:"PippoBudo",effect:"ino"},
        {value:"q3",label:"PippoBdo",effect:"pin"},
        {value:"q4",label:"PippoBau",effect:"pno"},
    ]

    let value = $state("");
    //logica della select
    const triggerContent = $derived(
        fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
    );

    //variabili da fetchare
    let formulaRow = $state(["[DES+VIG]","TM+10","100z"]);
    let thirdRowElement = $state(["Categoria","*","#Mani","*","Range"]);
    
    //logica della select per le qualità
    let baseQuality = $state("");
    const triggerQuality = $derived(
        qualities.find((q)=> q.value === baseQuality)?.label ?? "Scegli una qualità"
    )
    let customQuality = $state("");
    let quality = $derived.by(()=>{
        if(customQuality!=="")return customQuality
        else return qualities.find((q)=> q.value === baseQuality)?.effect ?? "Nessuna Qualità";
    });

    let weaponImageUrl = $state();
    

    async function handleDownload() {
        console.log("scarico");
    }

    async function handleExport() {
        console.log("esporto");
    }

</script>

<div class="flex flex-row gap-5">

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
                    <Select.Root type="single" name="arma_base" bind:value>
                        <Select.Trigger class="w-[180px]">
                            {triggerContent}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group >
                                <Select.Label>Fruits</Select.Label>
                                {#each fruits as fruit (fruit.value)}
                                    <Select.Item
                                    value={fruit.value}
                                    label={fruit.label}
                                    disabled={fruit.value === "grapes"}
                                    >
                                        {fruit.label}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </span>
                <!-- checkbox marziale -->
                <div class="flex items-center flex-col gap-2">
                    <Label for="martial">Marziale</Label>
                    <Checkbox id="martial"/>
                </div>
                <!-- nome arma -->
                <span class="flex flex-col gap-2 ">
                    <Label for="nome_arma">Nome</Label>
                    <Input type="text" id="nome_arma" placeholder="Nome Arma"/>
                </span>
            </div>

            <!-- Seconda Riga: Tipo di danno, Numero di Mani ed Attributi di precisione  -->
            <div class="flex flex-row gap-5">
                <!-- Tipo di danno -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Tipo di danno</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value>
                        <Select.Trigger class="w-auto min-w-30">
                            {triggerContent}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Fruits</Select.Label>
                                {#each fruits as fruit (fruit.value)}
                                    <Select.Item
                                    value={fruit.value}
                                    label={fruit.label}
                                    disabled={fruit.value === "grapes"}
                                    >
                                        {fruit.label}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </span>

                <!-- Numero di Mani -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Numero di mani</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value>
                        <Select.Trigger class="w-auto min-w-30">
                            {triggerContent}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Fruits</Select.Label>
                                {#each fruits as fruit (fruit.value)}
                                    <Select.Item
                                    value={fruit.value}
                                    label={fruit.label}
                                    disabled={fruit.value === "grapes"}
                                    >
                                        {fruit.label}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </span>

                <!-- Prima Caratteristica -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Attr1</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value>
                        <Select.Trigger class="w-auto min-w-30">
                            {triggerContent}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Fruits</Select.Label>
                                {#each fruits as fruit (fruit.value)}
                                    <Select.Item
                                    value={fruit.value}
                                    label={fruit.label}
                                    disabled={fruit.value === "grapes"}
                                    >
                                        {fruit.label}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </span>

                <!-- Seconda Caratteristica -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Attr2</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value>
                        <Select.Trigger class="w-auto min-w-30">
                            {triggerContent}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Fruits</Select.Label>
                                {#each fruits as fruit (fruit.value)}
                                    <Select.Item
                                    value={fruit.value}
                                    label={fruit.label}
                                    disabled={fruit.value === "grapes"}
                                    >
                                        {fruit.label}
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
                    <Select.Trigger class="w-50 min-w-50">
                        {triggerQuality}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Qualità Standard</Select.Label>
                            {#each qualities as quality (quality.value)}
                                <Select.Item
                                value={quality.value}
                                label={quality.label}
                                disabled={quality.value === "grapes"}
                                >
                                    {quality.label}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                    </Select.Root>
                </span>

                <!-- Prezzo -->
                <span class="flex flex-col gap-5 w-30 items-center">
                    <Label for="price">Costo Qualità</Label>
                    <Input id="price" type="number" min="0" class="w-20"/>  
                </span>


                <!-- Modificatori -->
                <div class="flex flex-col gap-2">
                    <Label class="border-0"> Qualità Personalizzata</Label>
                    <!-- Accuracy -->
                    <span class="flex flex-row gap-2">
                        <Checkbox id="damageMod"></Checkbox>
                        <Label for="damageMod">+4 Danno</Label>
                    </span>
                    <!-- Damage -->  
                    <span class="flex flex-row gap-2">
                        <Checkbox id="accuracyMod"></Checkbox>
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
    </Card.Root>

    <!-- ImageProcesor -->
    <div>
        <div  id={"pippo"} class="bg-white border h-auto ">
            <div class="bg-cafe_noir-700 grid grid-cols-6">
                <p class="col-span-1 px-2">
                    pippo
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
                        {#each formulaRow as formula}
                            <p> {formula} </p>
                        {/each}
                    </div>
                    <hr>
                    <div class="flex flex-row items-center justify-between px-2 ">
                        {#each thirdRowElement as element }
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
                <button onclick={handleDownload}>
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


