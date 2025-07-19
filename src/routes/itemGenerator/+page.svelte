<script lang="ts">
    import ShieldGenerator from "$lib/components/shieldGenerator.svelte";
    import WeaponGenerator from "$lib/components/weaponGenerator.svelte";
    import AccessoryGenerator from "$lib/components/accessoryGenerator.svelte";
    import ArcanaGenerator from "$lib/components/arcanaGenerator.svelte";
    
</script>

<div class="p-5 flex flex-col gap-10 bg-cafe_noir-900 items-center justify-center">
    <!-- Generatore di armi -->
    <WeaponGenerator></WeaponGenerator>
    <!-- Generatore di Scudi -->
    <ShieldGenerator></ShieldGenerator>        
    <!-- Generatore di Accessori -->
    <span class=" flex -ml-72  ">
        <AccessoryGenerator></AccessoryGenerator>
    </span>
        
    <!-- Generatore di Arcana -->
    <ArcanaGenerator></ArcanaGenerator>
</div>
