<script lang="ts">
    import CharacterCard from '$lib/components/characterCard.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
	$inspect(data.characters,"dati", data,"dati2 ");

</script>

<h1> pippo</h1>

{#if data.characters && data.characters.length > 0}
    
        {#each data.characters as char}
			<CharacterCard character={char}>

			</CharacterCard>
        {/each}
{:else}
    <p>Non hai ancora creato nessuna Personaggio.</p>
{/if}