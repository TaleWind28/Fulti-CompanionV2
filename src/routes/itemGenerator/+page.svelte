<script lang="ts">
    import ShieldGenerator from "$lib/components/shieldGenerator.svelte";
    import WeaponGenerator from "$lib/components/weaponGenerator.svelte";
    import AccessoryGenerator from "$lib/components/accessoryGenerator.svelte";
    import ArcanaGenerator from "$lib/components/arcanaGenerator.svelte";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    
    afterNavigate(({ to, from }) => {
        console.log('ho navigato da', from?.url.pathname, 'a', to?.url.pathname);
	
    });

	beforeNavigate(({ to, from, cancel }) => {
		console.log('Sto per navigare da', from?.url.pathname, 'a', to?.url.pathname);
    });

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
    <span class="flex -ml-5 ">
        <ArcanaGenerator></ArcanaGenerator>
    </span>
    
</div>
