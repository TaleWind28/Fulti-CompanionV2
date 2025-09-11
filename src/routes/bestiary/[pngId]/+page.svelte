<script lang="ts">

    import * as Card from '$lib/components/ui/card/index';
    import * as Dialog from '$lib/components/ui/dialog/index';
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { Slider } from "bits-ui"
    import damageTypes from '$lib/data/damageTypes.json';
    import ImageUploader2 from "$lib/components/imageUploader2.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from '$lib/components/ui/label/label.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { elemGlams } from '$lib';
    import Fa from 'svelte-fa';
    import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
    import { faBullseye, faCircleMinus, faKhanda, faPlusCircle, faPlusMinus } from '@fortawesome/free-solid-svg-icons';
    import { number, string } from 'zod';
    import PngAttackDescriptor from '$lib/components/pngComps/pngAttackDescriptor.svelte';
    import SpellDescriptor from '$lib/components/spellDescriptor.svelte';

    
    let { data } = $props();
    let png = $derived(data.png);
    
    let uploadPicDialog = $state(false);
    let newImageUrl = $state("");
   

    function updateField(field:string,value:any){
        png = {
            ...png,
            [field]:value
        }
        console.log(`campo ${field}:${value}`)
        return;
    }
    
    function updateAttribute(attribute:string,field:string,value:any){
        return;
    }
    
    function handleAttackFieldChange(index:number,value:any,field:string){
        
        png.attacks[index] = value;
    }

    function handleRangeChange(index:number,range:string){
        png.attacks[index].ranged = range;
        updateField('attacks',png.attacks);
        
    }

    function handleBonusChange(field:'accuracy' | 'damage',value:number, index:number){
        png.attacks[index].bonus[field] = value;
        updateField('bonus',png.attacks);
    }
    
    function handleEffectChange(index:number,value:string){
        png.attacks[index].effect = value;
        updateField('effect',png.attacks);
    }

    function handleAttrChange(value:any,field:'first' | 'second',index:number){
        png.attacks[index].accuracy[field] = value;
        updateField('attacks',png.attacks);
    }

    function handleTypeChange(value:string, index:number){
        png.attacks[index].type = value;
        updateField('attacks',png.attacks);

    }

    function handleNameChange(index:number, value:string){
        png.attacks[index].name = value;
        updateField('attacks',png.attacks);
    }

    function addAttack(){
        png.attacks.push(
            {
                name:"",
                accuracy:{first:"DES",second:"VIG"},
                ranged:"melee",
                damage:10,
                type:"fisico",
                bonus:{accuracy:0,damage:0},
                effect:""
            }
        )
        updateField('attacks',png.attacks);
    }

    function removeAttack(index:number){
        png.attacks.splice(index,1);
        updateField('attacks',png.attacks);
    }


    
    $inspect(png.attacks)
</script>



<div class="flex m-5 items-center justify-center ">
    <!-- Nome, Descrizione Attributi, Livello, Specie -->
    <Card.Root class="flex flex-col w-180 bg-tyrian_purple-700 border-0"> 
        <Card.Content class="flex flex-col gap-5"> 
            <!-- Primo Blocco: Pic, Nome Livello e Descrizione -->
            <div class="flex flex-row justify-start gap-20 bg-white   p-5  rounded">
                <!-- Immagine PNG -->
                <span class="flex flex-col gap-2">
                    <img src={png?.pic} alt="charPic" class="w-40 h-40 border border-black">
                    <Button onclick={()=>uploadPicDialog = true}> Aggiorna Immagine </Button>
                </span>
                <!-- Dialog Modifica Immagine PNG-->
                <Dialog.Root open={uploadPicDialog} onOpenChange={(v)=> {uploadPicDialog = v}}> 
                        <Dialog.Content class="bg-cafe_noir-700 border-0"> 
                        <Dialog.Header> 
                            <Dialog.Title class="text-black"> 
                                Premi sull'immagine per caricarne una locale oppure usa una URL
                            </Dialog.Title>                
                        </Dialog.Header>
                        <div class="bg-cafe_noir-900 border items-center justify-center flex">
                            <ImageUploader2
                                bind:imageUrl={newImageUrl}
                                padre="myUploader"
                                allowUrlInput={true}
                                placeholder="Inserisci URL immagine..."
                                dimensions="w-64 h-64"
                                showButtons={true}
                                showDeletion={true}
                            />
                        </div> 
                            
                                
                        <Dialog.Footer class="flex items-center justify-center "> 
                            <Button onclick={()=>{updateField("pic",newImageUrl);uploadPicDialog=false;}}> Aggiorna Immagine </Button>
                        </Dialog.Footer>         
                    </Dialog.Content>
                    
                </Dialog.Root>
                
                <!-- Nome, Livello e descrizione -->
                <div class="flex flex-col w-70 gap-5">
                    <!-- Nome e Livello -->
                    <section class="flex flex-row items-center gap-5">
                        <!-- Nome -->
                        <span class="flex flex-col">
                            <Label for="name" class="block text-sm font-medium mb-2"> 
                                Nome
                            </Label>
                            <Input 
                                id="name"
                                value={png.name}
                                oninput={(e)=> updateField('name',(e.target as HTMLInputElement).value)}
                            />
                        </span>
                        <!-- Livello -->
                        <span class="flex flex-col">
                            <Label for="name" class="block text-sm font-medium mb-2"> 
                                Livello
                            </Label>
                            <Input 
                                id="name"
                                value={png.level}
                                type="number"
                                oninput={(e)=> updateField('level',(e.target as HTMLInputElement).value)}
                            />
                        </span>
                    </section>
                        
                    <!-- Descrizione -->
                    <span class="flex flex-col">
                        <Label for="description" class="block text-sm font-medium mb-2"> 
                            Descrizione
                        </Label>
                        <Textarea 
                            id="description"
                            value={png.description}
                            oninput={(e)=> updateField('description',(e.target as HTMLTextAreaElement).value)}
                        />
                    </span>
                </div>
            </div>

            <Separator orientation="horizontal"/>

            <!-- Secondo Blocco: Caratteristiche -->
            <Label class="text-white"> Caratteristiche</Label>
            <div class="flex flex-row gap-5 bg-white justify-between p-5 items-center rounded">
                <div class="flex flex-col item-center gap-2 w-50">    
                    {@render attributeRender(["DES","DEX"],png.attributes.DEX.max)}
                    {@render attributeRender(["INT","INS"],png.attributes.INS.max)}
                    {@render attributeRender(["VIG","MIG"],png.attributes.MIG.max)}
                    {@render attributeRender(["VOL","WLP"],png.attributes.WLP.max)}
                </div>
                <!-- Spiegazione delle spread -->
                <div class="rounded-md border border-tyrian_purple-700  bg-tyrian_purple-600   p-4 text-sm text-white">
                    <p>
                        <span class="font-semibold">Tuttofare:</span> d8, d8, d8, d8
                    </p>
                    <p>
                        <span class="font-semibold">Standard:</span> d10, d8, d8, d6
                    </p>
                    <p>
                        <span class="font-semibold">Specializzato:</span> d10, d10, d6, d6
                    </p>

                    <p>
                        <span class="font-semibold">Iperspecializzato:</span> d12, d8, d6, d6
                    </p>

                    <hr class="my-2 border-gray-300" />

                    <p class="w-80">
                        Al raggiungimento dei livelli <span class="font-semibold">20</span>, <span class="font-semibold">40</span> e <span class="font-semibold">60</span>, 
                        il Personaggio sceglie uno dei suoi Attributi e lo aumenta di una taglia di dado 
                        (fino a un massimo di d12).
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal"/>
            
            <!-- Terzo Blocco: Affinità -->
            <Label class="text-white"> Affinità Elementali</Label>
            <div class="flex flex-col gap-2 bg-white py-4 rounded p-4">
                {@render affinityRender("Fisico",png.affinities.fisico,elemGlams)}
                {@render affinityRender("Fulmine",png.affinities.fulmine,elemGlams)}
                {@render affinityRender("Aria",png.affinities.aria,elemGlams)}
                {@render affinityRender("Terra",png.affinities.terra,elemGlams)}
                {@render affinityRender("Fuoco",png.affinities.fuoco,elemGlams)}
                {@render affinityRender("Ghiaccio",png.affinities.ghiaccio,elemGlams)}
                {@render affinityRender("Oscurita",png.affinities.oscurita,elemGlams)}
                {@render affinityRender("Luce",png.affinities.luce,elemGlams)}
                {@render affinityRender("Veleno",png.affinities.veleno,elemGlams)}
            </div>
            <Separator orientation='horizontal' />
            
            <Label class="text-white">Status</Label>
            <!-- Quarto Blocco: Status -->
            <div class="grid grid-cols-2 bg-white py-4 gap-5 rounded p-2">
                {@render statusRender(["Lento","slow"],png.statuses.slow,"Destrezza ridotta di 2")}
                {@render statusRender(["Confuso","dazed"],png.statuses.dazed,"Intuito ridotto di 2")}
                {@render statusRender(["Furente","enraged"],png.statuses.enraged,"Destrezza ed Intuito sono ridotti di 2")}
                {@render statusRender(["Debole","weak"],png.statuses.weak,"Vigore ridotto di 2")}
                {@render statusRender(["Scosso","shaken"],png.statuses.shaken,"Volonta ridotta di 2")}
                {@render statusRender(["Avvelenato","poisoned"],png.statuses.poisoned,"Vigore e Volontà sono ridotti di 2")}
                <!-- <Separator orientation='horizontal' /> <Separator orientation='horizontal' /> -->
                 <hr> <hr>
                {@render statusRender(["DES UP","dexUp"],png.statuses.dexUp,"Destrezza aumentata di 2")}
                {@render statusRender(["INT UP","insUp"],png.statuses.insUp,"Intuito aumentato di 2")}
                {@render statusRender(["VIG UP","migUp"],png.statuses.migUp,"Vigore aumentato di 2")}
                {@render statusRender(["VOL UP","wlpUp"],png.statuses.wlpUp,"Volontà aumentata di 2")}

            </div>
            <Separator orientation='horizontal' />
             
            <!-- Attacchi -->
            <Label class="text-white">Attacchi</Label>
            <div class="flex flex-col gap-5 border p-2 bg-white rounded">
                <!-- Display Attacchi -->
                {#each png.attacks as attack, index }
                    <!-- Visualizzazione con possibilità di modifica degli attacchi del personaggio -->
                    <PngAttackDescriptor
                        index={index}
                        attack={attack}
                        removeAttack={removeAttack}
                        handleNameChange={handleNameChange}
                        handleRangeChange={handleRangeChange}
                        handleAttrChange={handleAttrChange}
                        handleTypeChange={handleTypeChange}
                        handleBonusChange={handleBonusChange}
                        handleEffectChange={handleEffectChange}
                    
                    />
                    <Separator orientation="horizontal"/> 
                {/each}

                <!-- Aggiungi Attacco -->
                <button onclick={addAttack}>
                    <Fa icon={faPlusCircle}/>
                </button>

            </div>

            <!-- Incantesmi -->
            <div>
                <!-- Display Incantesimi -->
                {#each png.spells as spell,index }
                    <SpellDescriptor
                        spell={spell}
                        onDelete={removeSpell}
                        
                    />
                {/each}
                <!-- Aggiungi Incantesimo -->
            </div> 
            
            <!-- Skill -->
            <div>
                <!-- Display Azioni -->
                <!-- Aggiungi Azione -->
            </div>    
            
            <!-- Regole Speciali -->
            <div>
                <!-- Display Regole -->
                <!-- Aggiungi Regole -->
            </div>
        </Card.Content>    
    </Card.Root>
</div>



{#snippet attributeRender(attribute:string[],value:number)}
    <div class="flex flex-row items-center justify-center">
        <p class="w-20">{attribute[0]}</p>
        <Slider.Root 
            type="single" 
            class="relative flex w-full touch-none select-none items-center" 
            value={value}  
            max={12} min={6} step={2}
            onValueCommit={(value)=>{updateAttribute(attribute[1],"max",value)}}
        >
            {#snippet children({ tickItems, thumbItems })}
                <!-- Traccia dello slider -->
                <div class="relative h-2 w-full grow rounded-full bg-gray-200">
                    <Slider.Range class="absolute h-full rounded-full bg-tyrian_purple-500 " />
                </div>
                    
                <!-- Thumb -->
                {#each thumbItems as { index } (index)}
                <Slider.Thumb 
                    {index}
                    class="block h-5 w-5 rounded-full border-2 border-white border-rounded bg-white shadow transition-colors focus:outline-none  z-10"
                />
                {/each}
                
                <!-- Ticks e Labels -->
                {#each tickItems as { index, value } (index)}
                    <Slider.Tick 
                        {index}
                        class="absolute h-2 w-0.5 bg-gray-400 z-0"
                    />
                    {#if attribute[0] === "VOL"}    
                        <Slider.TickLabel 
                            {index}
                            position="bottom"
                            class="text-xs text-gray-600 mt-2 font-medium"
                        >
                            d{value}
                        </Slider.TickLabel>
                    {/if}
                {/each}
                
            {/snippet}

        </Slider.Root>
    </div>
           
{/snippet}

{#snippet affinityRender(affinity:string,value:any,elemGlams:any)}
    {@const glam = elemGlams[affinity.toLowerCase()]}
    {@const affinityValue = value.weak ? 1	: value.resistant ? 3	: value.absorb ? 4 	: value.immune ? 0 	: 2}
    <div class="flex flex-row gap-2 items-center w-auto justify-center">
        <Fa icon={glam.icon} class={glam.color}/>
        <p class="w-20">{affinity}</p>
        <Slider.Root 
            type="single" 
            class=" relative flex w-full touch-none select-none items-center" 
            value={affinityValue} 
            min={0} max={4} step={1} 
            onValueCommit={(value)=>updateField(affinity.toLowerCase(),value)}
            >
            {#snippet children({ tickItems, thumbItems })}
                <!-- Traccia dello slider -->
                <div class="relative h-2 w-full grow rounded-full bg-gray-200">
                    <Slider.Range class="absolute h-full rounded-full bg-tyrian_purple-500" />
                </div>
                    
                <!-- Thumb -->
                {#each thumbItems as { index } (index)}
                <Slider.Thumb 
                    {index}
                    class="block h-5 w-5 rounded-full border-2 border-white border-rounded bg-white shadow transition-colors focus:outline-none  z-10"
                />
                {/each}
                
                <!-- Ticks e Labels -->
                {#each tickItems as { index } (index)}
                {@const labels = ["Immune","Debole","Normale","Resistente","Assorbe"]}
                    <Slider.Tick 
                        {index}
                        class="absolute h-2 w-0.5 bg-gray-400 z-0"
                    />
                    {#if affinity === "Veleno"}    
                        <Slider.TickLabel 
                            {index}
                            position="bottom"
                            class="text-xs text-gray-600 mt-2 font-medium"
                        >
                            {labels[index]}
                        </Slider.TickLabel>
                    {/if}
                {/each}
            {/snippet}
        </Slider.Root>
    </div>
{/snippet}


{#snippet statusRender(status:string[],value:any,description:string)}
    <div class="flex flex-row items-center justify-start gap-5">
        <p class="w-20 font-semibold ">{status[0]}</p>
        <Checkbox checked={value} onCheckedChange={(checked)=>updateField(status[1],checked)}></Checkbox>
        <p class="text-xs">{description}</p>
    </div>
    
{/snippet}