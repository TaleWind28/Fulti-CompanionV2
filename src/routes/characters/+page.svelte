<script lang="ts">
    import CharacterCard from '$lib/components/characterCard.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { toast } from 'svelte-sonner';
	import * as Dialog from "$lib/components/ui/dialog/index.js";
    import type { PageData } from './$types';
    import Input from '$lib/components/ui/input/input.svelte';
	import * as Form from "$lib/components/ui/form/index.js";
    import { message, superForm } from 'sveltekit-superforms';
    import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
    import { characterSchema } from '$lib/zod';



    let { data }: { data: PageData } = $props();
	

	const form = superForm(data.form, {
		validators: zod4Client(characterSchema),
		taintedMessage:null,
		SPA:true,
		dataType: 'json',
		onUpdated: ({ form: f }) => {
			console.log("inviato");
			if (f.valid) {
				console.log("inviato");
				openCreationDialog = false;
				
                toast.success("Personaggio creato con successo!");
			}
		}
	});

	const { form: formData , enhance} = form;
	let openCreationDialog = $state(false);
	$inspect($formData)
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
    

	<form id="characterCreation" method="POST" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control>
						<Form.Label>Name</Form.Label>
						<Input bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="prima_classe">
					<Form.Control >
						<Form.Label>Prima Classe</Form.Label>
						<Input  bind:value={$formData.prima_classe} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="seconda_classe">
					<Form.Control >
						<Form.Label>Seconda Classe</Form.Label>
						<Input bind:value={$formData.seconda_classe} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="terza_classe">
					<Form.Control>
						<Form.Label>Terza Classe</Form.Label>
						<Input bind:value={$formData.terza_classe} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<!-- Button DENTRO il form -->
				<Form.Button form="characterCreation" type='submit'>Crea Personaggio</Form.Button>
		</form>
		
	<!-- <Dialog.Root open={openCreationDialog} onOpenChange={(v)=> {openCreationDialog=v}}>
		
		<Dialog.Content>
			<Dialog.Header>
      			<Dialog.Title>Nuovo Personaggio</Dialog.Title>
				<Dialog.Description>
					Dai un nome al tuo Eroe e scegli le sue prime classi.
				</Dialog.Description>
    		</Dialog.Header>
			
			
			
			<Dialog.Footer>
				<Form.Button form="characterCreation">
					crea
				</Form.Button>
			</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root> -->

</div>
