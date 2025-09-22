<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import type { CharacterClass, Skill } from "$lib/zod";
    import {faChevronDown, faChevronUp, faPencilRuler, faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import Input from "./ui/input/input.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    import Button from "./ui/button/button.svelte";
    import { getContext } from "svelte";
    import { toast } from "svelte-sonner";
    import ClassBenefits from "./classBenefits.svelte";
    import Label from "./ui/label/label.svelte";


    let { characterClass } : {characterClass : CharacterClass} = $props();
    let editHeroicSkill = $state(false);
    let heroicSkillName = $state("");
    let heroicSkillDescription = $state("");
    
    function handleSave(){
        
        const result = editHeroic(characterClass.name,heroicSkillName,heroicSkillDescription);
        if(result){
            toast.success('Abilità Eroica aggiornata con successo',{
                action:{
                    label:"OK",
                    onClick:()=>console.info("undo")
                }
            })
        }
        editHeroicSkill = false;
    }

    type Heroic =(className:string,heroicName:string,heroicDescription:string)=> boolean;
    const editHeroic = getContext<Heroic>('editHeroic');
    type ClassUp = (className:string,up:boolean)=> boolean;
    const levelClass = getContext<ClassUp>('classUp');

    type SkillUp = (skillName:string,up:boolean,className:string)=> boolean;
    const levelSkill = getContext<SkillUp>('skillUp');
    
    type DeleteClass = (className:string)=>boolean;
    const deleteClass = getContext<DeleteClass>('delete');
    

    let showBenefitSelector = $state(false);
    type benefitChoice = (className:string, benefitName:'hp' | 'mp')=> boolean;
    const chooseBenefit = getContext<benefitChoice>('benefit');
    let chosenBenefit: 'hp' | 'mp' | ''= $state("");

    function handleBenefitSelection(){
        if(chosenBenefit === '')return;
        else chooseBenefit(characterClass.name,chosenBenefit);
        showBenefitSelector = false;
        return;
    }
</script>

    <Card.Root class="border-0 bg-cafe_noir-700"> 
        <Card.Header> 
            <Card.Title class="text-white flex flex-col"> 
                <span class="flex flex-row justify-between">
                    <h1>
                        {characterClass.name.toUpperCase()}
                    </h1>
                    
                    <h1 class="flex flex-row items-center gap-2">
                        {characterClass.level} / 10
                        <div class="flex flex-col">
                            <button onclick={()=> levelClass(characterClass.name,true)}>
                                <Fa icon={faChevronUp} class="text-cafe_noir-500 cursor-pointer"/>
                            </button>
                            <button onclick={()=> levelClass(characterClass.name,false)}>
                                <Fa icon={faChevronDown} class="text-cafe_noir-500 cursor-pointer"/>
                            </button>
                        </div>
                    </h1>
                </span> 
                <span class="flex flex-row justify-between">
                    <ClassBenefits benefits = {characterClass.benefits} caller={characterClass.name}/> 
                    <button onclick={()=>showBenefitSelector = true}> 
                        <Fa class="cursor-pointer" icon={faPencilRuler}/>
                    </button>
                </span>
            </Card.Title>
        </Card.Header>
        
        <Card.Content class="bg-white py-2 grid grid-cols-2 gap-5"> 
            {#each characterClass.skills as skill}
                <div class="border p-2">
                    {@render skillRender(skill)}
                </div>
            {/each}
            {#if characterClass.level === 10}
                <div class="border p-2">
                    <span class="flex flex-row justify-between">
                        <h1 class="text-cafe_noir-600 ">ABILITÀ EROICA: {characterClass.heroic.name.toUpperCase()}</h1>
                        <button onclick={()=> editHeroicSkill = true}>
                            <Fa class="cursor-pointer" icon={faPencilRuler}></Fa>
                        </button>
                    </span>
                    <hr class="bg-cafe_noir-600 border-cafe_noir-600 h-1 rounded">
                    <div class="w-80 text-sm">
                        {characterClass.heroic.description}
                    </div>
                </div>
            {/if}
        </Card.Content>

        <Card.Footer class="flex flex-row justify-end">
            <button onclick={()=>deleteClass(characterClass.name)}>
                <Fa icon={faTrashCan}/>
            </button>
            
        </Card.Footer>

    </Card.Root>

    <Dialog.Root open={editHeroicSkill} onOpenChange={(v)=> editHeroicSkill = v}> 
        <Dialog.Content> 
            <Dialog.Header> 
                Nome Abilità Eroica: 
                <Input type="text" bind:value={heroicSkillName}/>
            </Dialog.Header>
            Descrizione Abilità
            <Textarea bind:value={heroicSkillDescription}/>
            
            <Button class="cursor-pointer" onclick={handleSave}>
                Salva
            </Button>
    
        </Dialog.Content> 

    </Dialog.Root>

{#snippet skillRender(skill: Skill)}
    <div class="flex flex-row justify-between w-auto">
        <h1 class="text-cafe_noir-600 ">{skill.name.toUpperCase()}</h1>
        
        <span class="flex flex-row gap-5">
            <h1 class="text-cafe_noir-600">{skill.level.actual} / {skill.level.max}</h1>
            <span class="flex flex-col">
                <button onclick={()=> levelSkill(skill.name,true,characterClass.name)}>
                    <Fa icon={faChevronUp} class="text-cafe_noir-500 cursor-pointer"/>
                </button>
                <button onclick={()=> levelSkill(skill.name,false,characterClass.name)}>
                    <Fa icon={faChevronDown} class="text-cafe_noir-500 cursor-pointer"/>
                </button>
            </span>
            
        </span>
            
    </div>

    <hr class="bg-cafe_noir-600 border-cafe_noir-600 h-1 rounded">

    <div class="w-80 text-sm ">
        {skill.description}
    </div>
    
{/snippet}


<Dialog.Root open={showBenefitSelector} onOpenChange={(v) => showBenefitSelector = v}> 
    
    <Dialog.Content> 
        <Dialog.Header> 
            Scegli il beneficio gratuito per la classe {characterClass.name}
        </Dialog.Header>
             <span class="flex flex-col gap-2 items-center">
                
                <!-- Toggle per scegliere se distanza o mischia -->
                <ToggleGroup.Root type="single" bind:value={chosenBenefit}> 
                    <!-- Group HP -->
                    <ToggleGroup.Item value="hp">
                        PV
                    </ToggleGroup.Item>

                    <!-- Group MP -->
                    <ToggleGroup.Item value="mp">
                        PM
                    </ToggleGroup.Item>
                    
                </ToggleGroup.Root>
            </span>
            <Dialog.Footer> 
                <Button class="cursor-pointer" onclick={handleBenefitSelection}> 
                    Conferma
                </Button>
            </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>