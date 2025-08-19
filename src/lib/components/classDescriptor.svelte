<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import type { CharacterClass, Skill } from "$lib/zod";
    import {faChevronDown, faChevronUp, faPencilRuler } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import Input from "./ui/input/input.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    import Button from "./ui/button/button.svelte";
  import { getContext } from "svelte";

    let { characterClass } : {characterClass : CharacterClass} = $props();
    let editHeroicSkill = $state(false);
    let heroicSkillName = $state("");
    let heroicSkillDescription = $state("");
    function handleSave(){
        editHeroicSkill = false;
    }
    type SkillUp = (skillName:string,up:boolean)=> boolean;
    const levelSkill = getContext<SkillUp>('skillUp');
    
</script>

    <Card.Root class="border-0 bg-cafe_noir-700"> 
        <Card.Header> 
            <Card.Title class="text-white flex flex-row justify-between"> 
                <h1>
                    {characterClass.name.toUpperCase()}
                </h1>
                
                <h1>
                    {characterClass.level} / 10
                </h1> 
                
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
                <button onclick={()=>levelSkill(skill.name,true)}>
                    <Fa icon={faChevronUp} class="text-cafe_noir-500 cursor-pointer"/>
                </button>
                <button onclick={()=>levelSkill(skill.name,false)}>
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