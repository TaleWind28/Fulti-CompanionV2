<script lang="ts">

    import * as Card from '$lib/components/ui/card/index';
    import * as Dialog from '$lib/components/ui/dialog/index';
    import { Slider } from "bits-ui"
    import ImageUploader2 from "$lib/components/imageUploader2.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from '$lib/components/ui/label/label.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { elemGlams } from '$lib';
    import Fa from 'svelte-fa';
    import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
    import {  faPlusCircle, faSave } from '@fortawesome/free-solid-svg-icons';

    import PngAttackDescriptor from '$lib/components/pngComps/pngAttackDescriptor.svelte';
    import SimpleDescriptor from '$lib/components/pngComps/simpleDescriptor.svelte';
    import SpellCrafter from '$lib/components/pngComps/spellCrafter.svelte';
    import type { Spell } from '$lib/zod.js';
    import { toast } from 'svelte-sonner';
    import { invalidateAll } from '$app/navigation';

    
    let { data } = $props();
    let png = $derived(data.png);
    
    let uploadPicDialog = $state(false);
    let newImageUrl = $state("");
    let hasBeenChanged = $state(false);

    $inspect(png)
   

    function updateField(field:string,value:any){
        png = {
            ...png,
            [field]:value
        }
        checkUp();
        console.log(`campo ${field}:${value}`)
        return;
    }
    
    function updateAttribute(attribute:'DEX' | 'INS' | 'MIG' | 'WLP',field:'max' | 'actual',value:any){
        png.attributes[attribute][field] = value;
        updateField('attributes',png.attributes);
        return;
    }

    function updateAffinity(affinity: "fisico"|"aria"|"fulmine"|"fuoco"|"ghiaccio"|"luce"|"oscurita"|"terra"|"veleno", value:any){
        let affinityType = value === 0 ? "immune" : value === 1 ? "weak" : value === 3 ? "resistant" : value === 4 ? "absorb" : "";
        png.affinities = {
            ...png.affinities,
            [affinity]:{
                weak:false,
                immune:false,
                resistant:false,
                absorb:false,
            }
        };

        if( affinityType === "") return;

        png.affinities = {
            ...png.affinities,
            [affinity]:{
                ...png.affinities[affinity],
                [affinityType]:true
            }
        }

        updateField('affinities',png.affinities);
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

    function handleDescriptorChange(superField: 'skills' |'specialRules', field:'name'|'effect', value:any, index:number){
        png[superField][index][field] = value;
        updateField(superField,png[superField]);
    }

    function handleStatusUpdate(status:'poisoned'|'dazed'|'shaken'|'enraged'|'slow'|'weak'|'dexUp'| 'insUp'| 'migUp'|'wlpUp', value:any){
        png.statuses[status] = value;
        updateField('statuses',png.statuses)
    }

    function handleDescriptorDelete(superField:'skills' | 'specialRules', index:number){
       png[superField].splice(index,1);
        updateField(superField,png[superField]);
    }

    function addDescriptor(superField:'skills' | 'specialRules'){
        png[superField].push({name:"",effect:""});
        updateField(superField,png[superField]);
    }

    function addSpell(){
        png.spells.push(
            {
                name:"",
                description:"",
                targets:{max:0,description:""},
                cost:0,
                duration:"",
                special:"",
                offensive:false,
                list:"png"
            }
        )
        updateField('spells',png.spells);
    }

    const spellBacks = {
        updateSpell: handleSpellChange,
        updateMaxTargets: handleSpellMaxTargetsChange,
        updateTargetsDescription: handleSpellTargetsDescriptionChange,
        updateOffensiveSpell:(index:number,value:string) => { 
            if(value === 'offensive')png.spells[index].offensive = true;
            else png.spells[index].offensive = false;

            updateField('spells',png.spells);
        },
        removeSpell: (index:number) => { 
            png.spells.splice(index,1);
            updateField('spells',png.spells);
        }
    }

    function handleSpellChange<K extends Exclude<keyof Spell, 'targets'>>(index: number,field: K,value: Spell[K]) {
        png.spells[index][field] = value;
        updateField('spells', png.spells);
    }
    
    function handleSpellMaxTargetsChange(index:number, value: number){
        png.spells[index].targets.max = value
        updateField('spells',png.spells)
    }

    function handleSpellTargetsDescriptionChange(index:number, value: string){
        png.spells[index].targets.description = value
        updateField('spells',png.spells)
    }
    
    async function save(){
         try {
            const response = await fetch(`/api/png`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(png)
            });
            
            if (response.ok) {
                
                toast.success('Personaggio salvato con successo!',{
                    action:{
                        label:"OK",
                        onClick:()=>console.info("Undo")
                    }
                })
                await invalidateAll();
                hasBeenChanged = false;
            } else {
                console.error(response.status);
                let errorMessage = "";
                switch(response.status){
                    case 404:errorMessage = 'PNG non trovato o non appartenente a te';break;
                    case 500: errorMessage = 'Errore del Server'
                }
                toast.error(`${response.status}: ${errorMessage}`,{
                    action:{
                        label:"OK",
                        onClick:()=>console.info(`Save Error: ${response.status}: ${errorMessage}`)
                    }
                })
                console.error('Errore nel salvataggio');
            }
        } catch (error) {
            console.error('Errore di rete:', error);
        }
        return;
    }

    function updateActuals(){
        png.attributes.DEX.actual = png.attributes.DEX.max;
        png.attributes.INS.actual = png.attributes.INS.max;
        png.attributes.MIG.actual = png.attributes.MIG.max;
        png.attributes.WLP.actual = png.attributes.WLP.max;
        png.stats.HP.actual = png.stats.HP.max;
        png.stats.MP.actual = png.stats.MP.max;
        png.stats.DEF = png.stats.DEF;
        png.stats.MDEF = png.stats.MDEF;
    }

    function updateBonus(field:'hp' | 'mp' | 'def' | 'mdef', value:number){
        png.bonus[field] = value;
        updateField('bonus',png.bonus);
    }
    
    function checkUp() {        
        //calcolo HP ed MP 
        png.stats.HP.max = (5*png.attributes.MIG.max) + Number(png.level);
        png.stats.MP.max = (5*png.attributes.WLP.max) + Number(png.level);
        
        //applico i valori aggiuntivi 
        let totals = png.bonus;

        //aggiorno i massimi
        png.stats.HP.max += totals.hp
        png.stats.MP.max += totals.mp
        //calcolo difesa e difesa magica 
        png.stats.DEF = png.attributes.DEX.actual + totals.def;
        png.stats.MDEF = png.attributes.INS.actual +totals.mdef; 
    
        //controllo se gli attuali sono maggiori dei massimi ed in caso li normalizzo
        png.stats.HP.actual = Math.min(png.stats.HP.max,png.stats.HP.actual);
        png.stats.MP.actual = Math.min(png.stats.MP.max,png.stats.MP.actual);

        //aggiorno i valori attuali con i massimi -> il png non deve "usato" online
        updateActuals();
    }


    $effect( ()=>{        
        if(JSON.stringify($state.snapshot(png)) !== JSON.stringify(data.png)){
            hasBeenChanged = true;
            console.info("cambiato");
        }
        else{
            hasBeenChanged = false;
            console.info("annullato");
        }
    });

</script>



<div class="flex m-5 items-center justify-center ">
    <!-- PNG -->
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
                    {@render attributeRender("DES","DEX",png.attributes.DEX.max)}
                    {@render attributeRender("INT","INS",png.attributes.INS.max)}
                    {@render attributeRender("VIG","MIG",png.attributes.MIG.max)}
                    {@render attributeRender("VOL","WLP",png.attributes.WLP.max)}
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

            <!-- Terzo Blocco: Modifica Manuale -->
            <div class="grid grid-cols-2 gap-5 items-center bg-white rounded p-5">
                <!-- Colonna Sx: Visualizzazione Statistiche -->
                <span class="flex flex-col gap-5">
                    <!-- HP ed MP -->
                    <span class="flex flex-row items-center gap-5">
                        <span class="flex flex-col gap-2">
                            <Label>HP</Label>
                            <p>{png.stats.HP.max}</p>
                        </span>
                        <span class="flex flex-col gap-2">
                            <Label>MP</Label>
                            <p>{png.stats.MP.max}</p>
                        </span>
                    </span>

                    <!-- DEF, MDEF -->
                    <span class="flex flex-row items-center gap-5">
                        <span class="flex flex-col gap-2">
                            <Label>DEF</Label>
                            <p>{png.stats.DEF}</p>
                        </span>
                        <span class="flex flex-col gap-2">
                            <Label>MDEF</Label>
                            <p>{png.stats.MDEF}</p>
                        </span>
                    </span>
                </span> 
                
                
                <!-- Colonna Dx: Modifica Statistiche -->
                <span class="flex flex-col gap-5">
                    <!-- HP ed MP -->
                    <span class="flex flex-row items-center gap-5">
                        <span class="flex flex-col gap-2">
                            <Label>HP</Label>
                            <Input
                                value={png.bonus.hp}
                                type='number'
                                oninput={(e)=>updateBonus('hp',Number((e.target as HTMLInputElement).value))}
                            />
                        </span>
                        <span class="flex flex-col gap-2">
                            <Label>MP</Label>
                            <Input
                                value={png.bonus.mp}
                                type='number'
                                oninput={(e)=>updateBonus('mp',Number((e.target as HTMLInputElement).value))}
                            />
                        </span>
                    </span>

                    <!-- DEF, MDEF -->
                    <span class="flex flex-row items-center gap-5">
                        <span class="flex flex-col gap-2">
                            <Label>DEF</Label>
                            <Input
                                value={png.bonus.def}
                                type='number'
                                oninput={(e)=>updateBonus('def',Number((e.target as HTMLInputElement).value))}
                            />
                        </span>
                        <span class="flex flex-col gap-2">
                            <Label>MDEF</Label>
                            <Input
                                value={png.bonus.mdef}
                                type='number'
                                oninput={(e)=>updateBonus('mdef',Number((e.target as HTMLInputElement).value))}
                            />
                        </span>
                    </span>
                </span>
            </div>
            
            <!-- Terzo Blocco: Affinità -->
            <Label class="text-white"> Affinità Elementali</Label>
            <div class="flex flex-col gap-2 bg-white py-4 rounded p-4">
                {@render affinityRender({label:"Fisico",value:"fisico"},png.affinities.fisico,elemGlams)}
                {@render affinityRender({label:"Fulmine",value:"fulmine"},png.affinities.fulmine,elemGlams)}
                {@render affinityRender({label:"Aria",value:"aria"},png.affinities.aria,elemGlams)}
                {@render affinityRender({label:"Terra",value:"terra"},png.affinities.terra,elemGlams)}
                {@render affinityRender({label:"Fuoco",value:"fuoco"},png.affinities.fuoco,elemGlams)}
                {@render affinityRender({label:"Ghiaccio",value:"ghiaccio"},png.affinities.ghiaccio,elemGlams)}
                {@render affinityRender({label:"Oscurita",value:"oscurita"},png.affinities.oscurita,elemGlams)}
                {@render affinityRender({label:"Luce",value:"luce"},png.affinities.luce,elemGlams)}
                {@render affinityRender({label:"Veleno",value:"veleno"},png.affinities.veleno,elemGlams)}
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

            <Separator orientation="horizontal"/> 
            
            <!-- Incantesmi -->
            <Label class="text-white"> Incantesimi </Label>
            <div class="flex flex-col gap-5 border p-2 bg-white rounded">
                <!-- Display Incantesimi -->
                {#each png.spells as spell,index }
                    <SpellCrafter
                        spell={spell}
                        index={index}
                        callbacks={spellBacks}
                    />
                    <Separator orientation="horizontal"/>
                {/each}
                
                <!-- Aggiungi Incantesimo -->
                <button onclick={addSpell}>
                    <Fa icon={faPlusCircle}/>
                 </button>
            </div> 
            
            <Separator orientation="horizontal"/> 

            <!-- Skill -->
            <Label class="text-white">Azioni/Abilità</Label>
            <div class="rounded bg-white p-2 flex flex-col gap-5">
                <!-- Display Abilità -->
                {#each png.skills as skill, index}
                    <SimpleDescriptor
                        obj={skill}
                        index={index}
                        handleChange={handleDescriptorChange}
                        superField={'skills'}
                        onDelete={handleDescriptorDelete}
                    />
                {/each}
                <!-- Aggiungi Azione -->
                 <button onclick={()=>addDescriptor('skills')}>
                    <Fa icon={faPlusCircle}/>
                 </button>
            </div>    
            
            <Separator orientation="horizontal"/> 

            <!-- Regole Speciali -->
            <Label class="text-white">Regole Speciali</Label>
            <div class="rounded bg-white p-2 flex flex-col gap-5">
                <!-- Display Regole -->
                {#each png.specialRules as rule, index}     
                    <SimpleDescriptor
                        obj={rule}
                        index={index}
                        handleChange={handleDescriptorChange}
                        superField={'specialRules'}
                        onDelete={handleDescriptorDelete}
                    />
                    
                    <Separator orientation="horizontal"/>
                {/each}
                <!-- Aggiungi Regole -->
                <button onclick={()=>addDescriptor('specialRules')}>
                    <Fa icon={faPlusCircle}/>
                </button>
            </div>
        </Card.Content>    
    </Card.Root>
    <!-- Pulsante per salvare modifiche -->
    {#if hasBeenChanged}
        <button 
            onclick={save}
            class="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label="Salva modifiche"
        >
            <Fa icon={faSave}/>
        </button>
    {/if}
</div>



{#snippet attributeRender(attribute:string,field:'DEX' | 'INS' | 'MIG' | 'WLP',value:number)}
    <div class="flex flex-row items-center justify-center">
        <p class="w-20">{attribute}</p>
        <Slider.Root 
            type="single" 
            class="relative flex w-full touch-none select-none items-center" 
            value={value}  
            max={12} min={6} step={2}
            onValueCommit={(value)=>{updateAttribute(field,"max",value)}}
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
                    {#if attribute === "VOL"}    
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

{#snippet affinityRender(affinity:{label:string,value:"fisico"|"aria"|"fulmine"|"fuoco"|"ghiaccio"|"luce"|"oscurita"|"terra"|"veleno"},value:any,elemGlams:any)}
    {@const glam = elemGlams[affinity.value]}
    {@const affinityValue = value.weak ? 1	: value.resistant ? 3	: value.absorb ? 4 	: value.immune ? 0 	: 2}
    <div class="flex flex-row gap-2 items-center w-auto justify-center">
        <Fa icon={glam.icon} class={glam.color}/>
        <p class="w-20">{affinity.label}</p>
        <Slider.Root 
            type="single" 
            class=" relative flex w-full touch-none select-none items-center" 
            value={affinityValue} 
            min={0} max={4} step={1} 
            onValueCommit={(value)=>updateAffinity(affinity.value,value)}
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
                    {#if affinity.label === "Veleno"}    
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


{#snippet statusRender(status:string,field:'poisoned'|'dazed'|'shaken'|'enraged'|'slow'|'weak'|'dexUp'| 'insUp'| 'migUp'|'wlpUp',value:any,description:string)}
    <div class="flex flex-row items-center justify-start gap-5">
        <p class="w-20 font-semibold ">{status}</p>
        <Checkbox checked={value} onCheckedChange={(checked)=>handleStatusUpdate(field,checked)}></Checkbox>
        <p class="text-xs">{description}</p>
    </div>
{/snippet}