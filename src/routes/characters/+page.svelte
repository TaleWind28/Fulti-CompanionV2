<script lang="ts">
    import CharacterCard from '$lib/components/characterCard.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { toast } from 'svelte-sonner';
	import * as Dialog from "$lib/components/ui/dialog/index.js";
    import type { PageData } from './$types';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
	import * as Form from "$lib/components/ui/form/index.js";
    import { superForm } from 'sveltekit-superforms';
    import { enhance } from '$app/forms';
    import { zod, zod4, zod4Client, zodClient } from 'sveltekit-superforms/adapters';
    import { characterSchema } from '$lib/zod';


    let { data }: { data: PageData } = $props();
	$inspect(data.characters,"dati", data,"dati2 ");

	 const form = superForm(data.form,{validators:zod4Client(characterSchema)});

	let openCreationDialog = $state(false);

</script>


<div class="p-5 flex flex-col gap-10 bg-cafe_noir-900 items-center justify-center">
    
	<div class="p-5 flex flex-row gap-10 bg-white items-center justify-center border  rounded-2xl ">
		<Input placeholder="Ricerca col nome del Personaggio" oninput={()=>toast.error("implementami")}/>
		<Button id="character_creation_dialog" class="bg-cafe_noir-400 w-50" onclick={()=>{openCreationDialog = true}}>Crea un nuovo Personaggio</Button>
		<Button class="bg-cafe_noir-400 w-50" onclick={()=>toast.error("implementami")}>Carica Personaggio da Json</Button>

	</div>	

	{#if data.characters && data.characters.length > 0}
    
        {#each data.characters as char}
			<CharacterCard character={char}>

			</CharacterCard>
        {/each}
	{:else}
		<p>Non hai ancora creato nessuna Personaggio.</p>
	{/if}
    

	<Dialog.Root bind:open={openCreationDialog}>
		
		<Dialog.Content>
			<Dialog.Header>
      			<Dialog.Title>Crea un Personaggio</Dialog.Title>
				<Dialog.Description>
					Dai un nome al tuo Eroe e scegli le sue prime classi.
				</Dialog.Description>
    		</Dialog.Header>
			<!-- <div class="grid gap-4 py-4">
				
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" value="3 Stelle" class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="prima_classe" class="text-right">Prima Classe</Label>
					<Input id="prima_classe" value="Maestro D'armi" class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="seconda_classe" class="text-right">Seconda Classe</Label>
					<Input id="seconda_classe" value="Elementalista" class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="terza_classe" class="text-right">Terza Classe</Label>
					<Input id="terza_classe" value="Entropista" class="col-span-3" />
				</div>

    		</div> -->

			<form method="POST" use:enhance>
				
			</form>	
			<Dialog.Footer>
				<Button type="submit">Save changes</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

</div>
