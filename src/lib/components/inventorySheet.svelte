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
        {@render inventoryPiece("Armi", weapons, viewWeapons, () => viewWeapons = !viewWeapons)}
        {@render inventoryPiece("Armature", armor, viewArmor, () => viewArmor = !viewArmor)}
        {@render inventoryPiece("Scudi", shields, viewShields, () => viewShields = !viewShields)}
        {@render inventoryPiece("Accessori", accessories, viewAccessories, () => viewAccessories = !viewAccessories)}
    </div>
</div>


{#snippet inventoryPiece(name: string, inventory: Array<Weapon|Armor|Shield|Accessory>, showContent: boolean, toggleFn: () => void)}
    <Card.Root class="bg-cafe_noir-600 border-0"> 
        <Card.Header class="flex flex-row justify-between items-center"> 
            <p class="text-white">{name.toUpperCase()}</p>
            <button onclick={toggleFn}> 
                {#if !showContent}
                    <Fa icon={faArrowDown}/>
                {:else}
                    <Fa icon={faArrowUp}/>
                {/if}
            </button>
        </Card.Header>
        {#if showContent}
            <Card.Content class="bg-white">
                {#each inventory as item}
                    <div class="p-2 border-b">
                        <!-- Qui puoi aggiungere la visualizzazione dell'item -->
                        {JSON.stringify(item)}
                    </div>
                {/each}
                {#if inventory.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
            </Card.Content>
        {/if}
    </Card.Root>
{/snippet}