<script lang="ts">
    import CharacterCard from "../characterCard.svelte";
    import * as Card from "$lib/components/ui/card/index";
    import Button from "../ui/button/button.svelte";
    import { toast } from "svelte-sonner";
    import { number } from "zod";
    let { character } = $props();

    function handleHPChange(number:number){
        if(character.stats.HP.max === character.stats.HP.actual && number>0){
            toast.error("La vita è già al massimo",{
                action:{
                    label:"OK",
                    onClick:()=>console.info("Too Much Health")
                }
            });
            return;
        }
        if(number === character.stats.HP.max || character.stats.HP.actual + number > character.stats.HP.max) character.stats.HP.actual = character.stats.HP.max;  
        else character.stats.HP.actual = character.stats.HP.actual + number 
    }

    function handleMPChange(number:number){
        if(character.stats.MP.max === character.stats.MP.actual && number>0){
            toast.error("Il mana è già al massimo",{
                action:{
                    label:"OK",
                    onClick:()=>console.info("Too Much Mana")
                }
            });
            return;
        }
        if(number === character.stats.MP.max || character.stats.MP.actual + number > character.stats.MP.max) character.stats.MP.actual = character.stats.MP.max; 
        else character.stats.MP.actual = character.stats.MP.actual + number 
    }

    function handleIPChange(number:number){
        if(character.stats.IP.max===character.stats.IP.actual && number>0){
            toast.error("I punti inventario sono già al massimo",{
                action:{
                    label:"OK",
                    onClick:()=>console.info("Dunno use it")
                }
            });
            return;
        }
        if(number === character.stats.IP.max || character.stats.IP.actual + number > character.stats.IP.max) character.stats.IP.actual = character.stats.IP.max; 
        else character.stats.IP.actual = character.stats.IP.actual + number 
    }

</script>

<div class="flex flex-col gap-5">
    <!-- Scheda Personaggio -->
    <CharacterCard character={character}/> 
    <!-- Controllo Statistiche -->
    <Card.Root class="bg-lion-600 border-0"> 
        <Card.Header> 
            Modifiche Manuali
        </Card.Header>
        <Card.Content class="bg-white flex flex-col gap-2 items-center justify-end py-5">
            {@render renderStat(character.stats.HP.max,handleHPChange, "bg-red-400 hover:bg-red-500 text-white", "bg-red-700 text-white hover:bg-red-800","HP")}
            {@render renderStat(character.stats.MP.max,handleMPChange, "bg-blue-400 hover:bg-blue-500 text-white", "bg-blue-700 hover:bg-blue-800 text-white","MP")}
            {@render renderIp(character.stats.IP.max,handleIPChange,"bg-green-400 hover:bg-green-500 text-white", "bg-green-700 hover:bg-green-800 text-white","IP")}
        </Card.Content>
    </Card.Root>
</div>

{#snippet renderStat(max:number,clickFun:any, color:string,darker:string, label:string)}
    <div class="flex flex-col items-center justify-center">
        <p>
            {label}
        </p>
        <span class="flex flex-row items-center justify-between  gap-5">
            {@render renderButton(clickFun,color,-10)}
            {@render renderButton(clickFun,color,-5)}
            {@render renderButton(clickFun,color,-2)}
            {@render renderButton(clickFun,color,-1)}
            {@render renderButton(clickFun,color, -(max/2))}
            {@render renderButton(clickFun,darker,max)}
            {@render renderButton(clickFun,darker, 1)}
            {@render renderButton(clickFun,darker, 2)}
            {@render renderButton(clickFun,darker, 5)}
            {@render renderButton(clickFun,darker, 10)}
        </span>
    </div>
{/snippet}

{#snippet renderIp(max:number,clickFun:any,color:string,darker:string,label:string)}
    <div class="flex flex-col items-center justify-center">
        <p>
            {label}
        </p>
        <span class="flex flex-row items-center justify-between  gap-5">
            {@render renderButton(clickFun,color,-5)}
            {@render renderButton(clickFun,color,-2)}
            {@render renderButton(clickFun,color,-1)}
            {@render renderButton(clickFun,darker,max)}
            {@render renderButton(clickFun,darker, 1)}
            {@render renderButton(clickFun,darker, 2)}
            {@render renderButton(clickFun,darker, 5)}
        </span>
    </div>
{/snippet}

{#snippet renderButton(clickFun:any, color:string, value:number)}
    <Button onclick={()=>clickFun(value)} class={color}> 
        {#if value>0}
            +{value}
        {:else}
            {value}
        {/if}
    </Button>
    
{/snippet}
