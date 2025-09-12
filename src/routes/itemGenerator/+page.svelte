<script lang="ts">
    import ShieldGenerator from "$lib/components/generators/shieldGenerator.svelte";
    import WeaponGenerator from "$lib/components/generators/weaponGenerator.svelte";
    import AccessoryGenerator from "$lib/components/generators/accessoryGenerator.svelte";
    import ArcanaGenerator from "$lib/components/generators/arcanaGenerator.svelte";
    import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
    
    let offline = $derived( !navigator.onLine)
    
	
  
</script>

<div class="p-5 flex flex-col gap-10 bg-cafe_noir-900 items-center justify-center">
    
    <!-- Generatore di armi -->
    <WeaponGenerator offline={offline}></WeaponGenerator>
    
    <!-- Generatore di Scudi -->
    <ShieldGenerator offline={offline}></ShieldGenerator>       

    <!-- Generatore di Accessori -->
    <span class=" flex -ml-72  ">
        <AccessoryGenerator offline={offline}></AccessoryGenerator>
    </span>
    {#if !offline}
        <!-- Generatore di Arcana -->
        <span class="flex -ml-5 ">
            <ArcanaGenerator></ArcanaGenerator>
        </span>
    {/if}
</div>
