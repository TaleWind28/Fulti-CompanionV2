<script lang="ts">
    import ShieldGenerator from "$lib/components/shieldGenerator.svelte";
    import WeaponGenerator from "$lib/components/weaponGenerator.svelte";
    import AccessoryGenerator from "$lib/components/accessoryGenerator.svelte";
    import ArcanaGenerator from "$lib/components/arcanaGenerator.svelte";
    
</script>

<div class="p-5 flex flex-col gap-10 bg-cafe_noir-900 items-center justify-center">
    <WeaponGenerator></WeaponGenerator>
    <ShieldGenerator></ShieldGenerator>
    <AccessoryGenerator></AccessoryGenerator>
    <ArcanaGenerator></ArcanaGenerator>
</div>
