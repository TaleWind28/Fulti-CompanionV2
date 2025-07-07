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
    import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
  import { ssrDynamicImportKey } from "vite/module-runner";
   

    

    //fetchare db
    const fruits = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grapes", label: "Grapes" },
        { value: "pineapple", label: "Pineapple" }
    ];

    //qualità da fetchare
    const qualities = [
        {value:"Antistatus",label:"PippoBaudo",effect:"pino",price:100},
        {value:"q2",label:"PippoBudo",effect:"ino",price:10},
        {value:"q3",label:"PippoBdo",effect:"pin",price:1},
        {value:"q4",label:"PippoBau",effect:"pno",price:20},
    ]

    //tipi di danno da fetchare
    const damageTypes = [
        {value:"fisico",label:"Fisico"},{value:"aria",label:"Aria"},{value:"fulmine",label:"Fulmine"},{value:"ombra",label:"Ombra"},{value:"terra",label:"Terra"},
        {value:"fuoco",label:"Fuoco"},{value:"ghiaccio",label:"Ghiaccio"},{value:"luce",label:"Luce"},{value:"veleno",label:"Veleno"}
    ];

    
    //Armi Base da fetchare dal db
    const baseWeapons = [
    // Pesanti
    {name:"Pesanti"},
    {
        name: "Martello di Ferro",
        cost: 200,
        attr1: "VIG",
        attr2: "VIG",
        damage: 6,
        type: "Fisico",
        category: "Pesanti",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "una mano"
    },
    {
        name: "Ascia",
        cost: 250,
        attr1: "VIG",
        attr2: "VIG",
        damage: 10,
        type: "Fisico",
        category: "Pesanti",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "una mano"
    },
    {
        name: "Ascia da Guerra",
        cost: 250,
        attr1: "VIG",
        attr2: "VIG",
        damage: 14,
        type: "Fisico",
        category: "Pesanti",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due mani"
    },
    
    // Pugnali
    {name:"Pugnali"},
    {
        name: "Pugnale d'Acciaio",
        cost: 150,
        attr1: "DES",
        attr2: "INT",
        damage: 4,
        type: "Fisico",
        category: "Pugnali",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "una mano"
    },
    
    // Da Rissa
    {name:"Da Rissa"},
    {
        name: "Colpo Senz'Armi",
        cost: 0,
        attr1: "DES",
        attr2: "VIG",
        damage: 0,
        type: "Fisico",
        category: "Da Rissa",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "una mano"
    },
    {
        name: "Improvvisata (Misc.)",
        cost: 0,
        attr1: "DES",
        attr2: "VIG",
        damage: 2,
        type: "Fisico",
        category: "Da Rissa",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "una mano"
    },
    {
        name: "Tirapugni di Ferro",
        cost: 150,
        attr1: "DES",
        attr2: "VIG",
        damage: 6,
        type: "Fisico",
        category: "Da Rissa",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "una mano"
    },
    
    // Spada
    {name:"Spada"},
    {
        name: "Katana",
        cost: 200,
        attr1: "DES",
        attr2: "INT",
        damage: 10,
        type: "Fisico",
        category: "Spada",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due mani"
    },
    {
        name: "Spada di Bronzo",
        cost: 200,
        attr1: "DES",
        attr2: "VIG",
        damage: 6,
        type: "Fisico",
        category: "Spada",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una mano"
    },
    {
        name: "Spadone",
        cost: 200,
        attr1: "DES",
        attr2: "VIG",
        damage: 10,
        type: "Fisico",
        category: "Spada",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due mani"
    },
    {
        name: "Stocco",
        cost: 200,
        attr1: "DES",
        attr2: "INT",
        damage: 6,
        type: "Fisico",
        category: "Spada",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una mano"
    },
    
    // Arcana
    {name:"Arcana"},
    {
        name: "Bastone",
        cost: 100,
        attr1: "VOL",
        attr2: "VOL",
        damage: 6,
        type: "Fisico",
        category: "Arcana",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due mani"
    },
    {
        name: "Tomo",
        cost: 100,
        attr1: "INT",
        attr2: "INT",
        damage: 6,
        type: "Fisico",
        category: "Arcana",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due mani"
    },
    
    // Arco
    {name:"Arco"},
    {
        name: "Balestra",
        cost: 150,
        attr1: "DES",
        attr2: "INT",
        damage: 8,
        type: "Fisico",
        category: "Arco",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Due mani"
    },
    {
        name: "Arco Corto",
        cost: 200,
        attr1: "DES",
        attr2: "DES",
        damage: 8,
        type: "Fisico",
        category: "Arco",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Due mani"
    },
    
    // Flagello
    {name:"Flagello"},
    {
        name: "Frusta-Catena",
        cost: 150,
        attr1: "DES",
        attr2: "DES",
        damage: 8,
        type: "Fisico",
        category: "Flagello",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due mani"
    },
    
    // Da Fuoco
    {name:"Da Fuoco"},
    {
        name: "Pistola",
        cost: 250,
        attr1: "DES",
        attr2: "INT",
        damage: 8,
        type: "Fisico",
        category: "Da Fuoco",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Una mano"
    },
    
    {name:"Lancia"},
    {
        name: "Lancia Leggera",
        cost: 200,
        attr1: "DES",
        attr2: "VIG",
        damage: 8,
        type: "Fisico",
        category: "Lancia",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Una mano"
    },
    {
        name: "Lancia Pesante",
        cost: 200,
        attr1: "DES",
        attr2: "VIG",
        damage: 12,
        type: "Fisico",
        category: "Lancia",
        quality: "Nessuna Qualità",
        range: "Mischia",
        hands: "Due mani"
    },
    
    // Da Lancio
    {name:"Da Lancio"},
    {
        name: "Improvvisata (Dist.)",
        cost: 0,
        attr1: "DES",
        attr2: "VIG",
        damage: 2,
        type: "Fisico",
        category: "Da Lancio",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Una mano"
    },
    {
        name: "Shuriken",
        cost: 150,
        attr1: "DES",
        attr2: "INT",
        damage: 4,
        type: "Fisico",
        category: "Da Lancio",
        quality: "Nessuna Qualità",
        range: "Distanza",
        hands: "Una mano"
    }
];
    //numero di mani da fetchare
    const handNumber = [{value:"Una Mano",label:"Una Mano"},{value:"Due Mani",label:"Due Mani"}];
    
    //attributi da fetchare
    const attributes = [{value:"DES",label:"DES"},{value:"VIG",label:"VIG"},{value:"INT",label:"INT"},{value:"VOL",label:"VOL"}];

    let value = $state("");
    //logica della select
    const triggerContent = $derived(
        fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
    );

    
    
    //logica della select per le qualità
    let baseQuality = $state("");
    const triggerQuality = $derived(
        qualities.find((q)=> q.value === baseQuality)?.label ?? "Scegli una qualità"
    );

    let weapon = $state("");
    const triggerWeapon = $derived(
        baseWeapons.find(w =>w.name === weapon)?.name ?? "Scegli un'arma"
    )

    let selectedHands = $state("");
    const triggerHands = $derived(
        handNumber.find((h)=>h.value === selectedHands)?.label ?? "# di mani"
    )

    let attr1 = $state("VIG");
    
    const triggerAttr1 = $derived(
        attributes.find(attr=>attr.value === attr1)?.label ?? "Attr1"
    );
    let attr2 = $state("VIG");

    const triggerAttr2 = $derived(
        attributes.find(attr=>attr.value === attr2)?.label ?? "Attr2"
    );

    let damageType = $state("fisico");
    const triggerDamageType = $derived(
        damageTypes.find(dt => dt.value === damageType)?.label ?? "Tipo di Danno"
    )
    
    //imageProcessor
    let customQuality = $state("");
    let quality = $derived.by(()=>{
        if(customQuality!=="")return customQuality
        else return qualities.find((q)=> q.value === baseQuality)?.effect ?? "Nessuna Qualità";
    });

    let customCost = $state(0);
    let weaponCost = $state(0);
    let additionalDamage = $state(false);
    let additionalAccuracy = $state(false);
    let weaponDamage =$state(0);

    let weaponName = $state("");

    let accuracy = $derived.by(()=>{
        if(additionalAccuracy)return "+"+1;
        else return "";
    }

    )

    let damage = $derived.by(()=>{
        let additions = 0;
        if(additionalDamage)additions += 4;
        return weaponDamage+additions;
    })

    let cost = $derived.by(()=>{
        let additions = customCost;
        if(customQuality === "") additions += (qualities.find((q)=>q.value=== baseQuality)?.price ?? 0);
        if(additionalAccuracy)additions += 100;
        if(additionalDamage)additions += 200;
        return additions+weaponCost;
    }); 

    let weaponImageUrl = $state();
    
    //variabili da fetchare
    let formulaRow = $derived(["["+attr1+" + "+attr2+"]"+accuracy,"[ TM+"+damage+"]"+damageType,cost+"z"]);
    let thirdRowElement = $derived(["Categoria","*",selectedHands,"*","Range"]);

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
                    <Select.Root type="single" name="arma_base" bind:value={weapon}>
                        <Select.Trigger class="w-[180px]">
                            {triggerWeapon}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group >
                                <Select.Label>Fruits</Select.Label>
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
                    <Checkbox id="martial"/>
                </div>
                <!-- nome arma -->
                <span class="flex flex-col gap-2 ">
                    <Label for="nome_arma">Nome</Label>
                    <Input type="text" id="nome_arma" placeholder="Nome Arma" bind:value={weaponName}/>
                </span>
            </div>

            <!-- Seconda Riga: Tipo di danno, Numero di Mani ed Attributi di precisione  -->
            <div class="flex flex-row gap-5">
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

                <!-- Numero di Mani -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Numero mani</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value={selectedHands}>
                        <Select.Trigger class="w-auto min-w-30">
                            {triggerHands}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>#Mani</Select.Label>
                                {#each handNumber as hand (hand.value)}
                                    <Select.Item
                                    value={hand.value}
                                    label={hand.label}
                                    >
                                        {hand.label}
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
                    <Label for="price">Costi Aggiuntivi</Label>
                    <Input id="price" type="number" min="0" class="w-20" bind:value={customCost}/>  
                </span>


                <!-- Modificatori -->
                <div class="flex flex-col gap-2">
                    <Label class="border-0"> Qualità Personalizzata</Label>
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
    </Card.Root>

    <!-- ImageProcesor -->
    <div>
        <div  id={"pippo"} class="bg-white border h-auto ">
            <div class="bg-cafe_noir-700 grid grid-cols-6">
                <p class="col-span-1 px-2">
                    {weaponName}
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


