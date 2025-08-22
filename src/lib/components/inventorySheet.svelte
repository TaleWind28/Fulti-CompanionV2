<script lang="ts">
    import { faArrowDown, faArrowUp, faGem, faKhanda, faShield, faUserShield } from "@fortawesome/free-solid-svg-icons";
    import Button from "./ui/button/button.svelte";
    import * as Card from "./ui/card/index";
    import Fa from "svelte-fa";
    import type { Weapon, Armor, Shield, Accessory } from "$lib";
    let {weapons, shields, armor, accessories}: {weapons:Weapon[],armor:Armor[],shields:Shield[],accessories:Accessory[]} = $props();
    let openWeaponCreator = $state(false);
    let openArmorCreator = $state(false);
    let openShieldCreator = $state(false);
    let openAccessoryCreator = $state(false);

    let viewWeapons = $state(false);
    let viewArmor = $state(false);
    let viewShields = $state(false);
    let viewAccessories = $state(false);

    function handleSnippet(visibility:boolean){
        console.log(visibility)
        visibility = !visibility;
        console.log(visibility)
    }

    $inspect(viewAccessories,viewArmor,viewShields,viewWeapons);
</script>

<div class="flex flex-col gap-5 justify-center">
    <!-- ActionBar per creare Armi ed Equipaggiamento -->
    <Card.Root> 
        <Card.Header> 
            Azioni Rapide
        </Card.Header>
        <Card.Content class="flex flex-row justify-center gap-5"> 
            <Button onclick={()=>openWeaponCreator = true} class="bg-cafe_noir-600 hover:bg-cafe_noir-500"> 
                Nuova Arma
                <Fa icon={faKhanda}></Fa>
            </Button>
            <Button onclick={()=>openArmorCreator = true } class="bg-cafe_noir-600 hover:bg-cafe_noir-500"> 
                Nuova Armatura
                <Fa icon={faUserShield}></Fa>
            </Button>
            <Button onclick={()=>openShieldCreator = true} class="bg-cafe_noir-600 hover:bg-cafe_noir-500"> 
                Nuovo Scudo
                <Fa icon={faShield}></Fa>
            </Button>
            <Button onclick={()=>openAccessoryCreator = true} class="bg-cafe_noir-600 hover:bg-cafe_noir-500"> 
                Nuovo accessorio
                <Fa icon={faGem}/>
            </Button>
        </Card.Content>
    </Card.Root>

    <!-- Container per le visualizzazioni dell'inventario -->
    <div class="flex flex-col gap-5">
        {@render inventoryPiece("Armi",weapons,viewWeapons)}
        {@render inventoryPiece("Armature",armor,viewArmor)}
        {@render inventoryPiece("Scudi",shields,viewShields)}
        {@render inventoryPiece("Accessori",accessories,viewAccessories)}
    </div>
</div>


{#snippet inventoryPiece(name:string,inventory:Array<Weapon|Armor|Shield|Accessory>,showContent:boolean = $bindable(false))}
    <Card.Root class="bg-cafe_noir-600 border-0"> 
        <Card.Header class="flex flex-row justify-between items-center"> 
            <p class="text-white ">{name.toUpperCase()}</p>
            {#if !showContent}
                <button onclick={()=>showContent = !showContent}> 
                    <Fa icon={faArrowDown}/>
                </button>
                
            {:else}
                <button onclick={()=>handleSnippet(showContent)}>
                    <Fa icon={faArrowUp}></Fa>
                </button>    
            {/if}
        </Card.Header>
        {#if showContent}
            <Card.Content class="bg-white">
                pino
                {#each inventory as item}
                    pino
                {/each}
            </Card.Content>
        {/if}
    </Card.Root>
{/snippet}