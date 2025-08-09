<script lang="ts">
    import CharacterCard from '$lib/components/characterCard.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { toast } from 'svelte-sonner';
    import type { PageData } from './$types';
    import Input from '$lib/components/ui/input/input.svelte';

    let { data }: { data: PageData } = $props();
	$inspect(data.characters,"dati", data,"dati2 ");

</script>


<div class="p-5 flex flex-col gap-10 bg-cafe_noir-900 items-center justify-center">
    
	<div class="p-5 flex flex-row gap-10 bg-white items-center justify-center border  rounded-2xl ">
		<Input placeholder="Ricerca col nome del Personaggio" oninput={()=>toast.error("implementami")}/>
			
		
		<Button class="bg-cafe_noir-400 w-50" onclick={()=>toast.error("implementami")}>
			Crea un nuovo Personaggio
		</Button>
		<Button class="bg-cafe_noir-400 w-50" onclick={()=>toast.error("implementami")}>
			Carica Personaggio da Json
		</Button>

	</div>	

	{#if data.characters && data.characters.length > 0}
    
        {#each data.characters as char}
			<CharacterCard character={char}>

			</CharacterCard>
        {/each}
	{:else}
		<p>Non hai ancora creato nessuna Personaggio.</p>
	{/if}
    
</div>
