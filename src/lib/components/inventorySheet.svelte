<script lang="ts">
    import { faArrowDown, faArrowUp, faGem, faKhanda, faShield, faShieldAlt, faShieldHalved, faUserShield,type IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Button from "./ui/button/button.svelte";
    import * as Card from "./ui/card/index";
    import * as Dialog from "./ui/dialog/index";
    import Fa from "svelte-fa";
    import type { Weapon, Armor, Shield, Accessory } from "$lib";
    import WeaponGenerator from "./weaponGenerator.svelte";
    import { Header } from "./ui/table";
    //props
    let {weapons, shields, armor, accessories}: {weapons:Weapon[],armor:Armor[],shields:Shield[],accessories:Accessory[]} = $props();
    //dialogVariable
    let openWeaponCreator = $state(false);
    let openArmorCreator = $state(false);
    let openShieldCreator = $state(false);
    let openAccessoryCreator = $state(false);

    let viewWeapons = $state(false);
    let viewArmor = $state(false);
    let viewShields = $state(false);
    let viewAccessories = $state(false);

    let btnStyle = "bg-cafe_noir-600 hover:bg-cafe_noir-500 flex flex-row items-center";
</script>

<div class="flex flex-col gap-5 justify-center">
    <!-- ActionBar per creare Armi ed Equipaggiamento -->
    <Card.Root> 
        <Card.Header> 
            Azioni Rapide
        </Card.Header>
        <Card.Content class="flex flex-row items-center justify-center gap-5">
            {@render actionButton(btnStyle,()=>openWeaponCreator=true,faKhanda,"Nuova Arma")}
            {@render actionButton(btnStyle,()=>openArmorCreator=true,faUserShield,"Nuova Armatura")}
            {@render actionButton(btnStyle,()=>openShieldCreator=true,faShieldHalved,"Nuovo Scudo")}
            {@render actionButton(btnStyle,()=>openAccessoryCreator=true,faGem,"Nuovo Accessorio")}            
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

<Dialog.Root open={openWeaponCreator} onOpenChange={(v)=> openWeaponCreator=v}>
    <Dialog.Content class="flex items-center justify-center w-700">
        <WeaponGenerator showImageProcessor={false} dim={"w-120"}></WeaponGenerator>
    </Dialog.Content>
</Dialog.Root>


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
                    <p>{item.name}</p>
                {/each}
                {#if inventory.length === 0}
                    <p class="text-gray-500 p-4">Nessun elemento presente</p>
                {/if}
            </Card.Content>
        {/if}
    </Card.Root>
{/snippet}

{#snippet actionButton(styleClass:string,clickFun: ()=>void,icon:IconDefinition, description:string)} 
    <Button onclick={clickFun} class={styleClass}> 
        <p>{description}</p>
        <Fa icon={icon}/>
    </Button>
{/snippet}