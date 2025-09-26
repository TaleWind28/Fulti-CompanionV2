<script lang="ts">
    import CharacterCard from '$lib/components/characterCard.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { toast } from 'svelte-sonner';
	import * as Dialog from "$lib/components/ui/dialog/index.js";
    import type { PageData } from './$types';
    import Input from '$lib/components/ui/input/input.svelte';
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Select from "$lib/components/ui/select/index";
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import { characterSchema } from '$lib/zod';
    import { uploadFile } from '$lib/utils';
    import { invalidateAll } from '$app/navigation';

    let { data }: { data: PageData } = $props();
	

	const form = superForm(data.form, {
		validators: zod4Client(characterSchema),
		taintedMessage:null,
		dataType: 'json',
		onUpdated: ({ form: f }) => {
			console.log("inviato");
			if (f.valid) {
				console.log("inviato");
				openCreationDialog = false;
				
                toast.success("Personaggio creato con successo!",{
					action:{
						label:"OK",
						onClick: () =>{console.info("undo")}
					}
				});
			}
		}
	});

	const { form: formData , enhance} = form;
	let openCreationDialog = $state(false);

	//fetchare da db;
	let classes:string[] = data.classNames;

	const triggerFirstClass = $derived(
		classes.find((c)=> c === $formData.prima_classe) || "Scegli una Classe"
	)

	const triggerSecondClass = $derived(
		classes.find((c)=> c === $formData.seconda_classe) || "Scegli una Classe"
	)

	const triggerThirdClass = $derived(
		classes.find((c)=> c === $formData.terza_classe) || "Scegli una Classe"
	)

	
	async function handleImport(){
		try{
			
			const {name, content} = await uploadFile('.json');
			
			const parsedCharacter = await JSON.parse(content);
			

			if(parsedCharacter.code !== 4) throw new Error()

			const response = await fetch('/api/characters',{
				method:'PUT',
				headers:{
					'Content-Type':'application/json'
				},
				body:JSON.stringify({
					character: parsedCharacter
				})
				
			});

			if(!response.ok){

				toast.error( 'Impossibile importare il personaggio.',{
					action:{
						label:"OK",
						onClick: () =>{console.info("undo")}
					}
				});
				return;
			}

			await invalidateAll();
			toast.success('Personaggio importato con successo',{
				action:{
						label:"OK",
						onClick: () =>{console.info("undo")}
					}
			});

		}catch(error){
			toast.error(`Errore nell'importazione del file: ${error}`,{
				description: "Il file selezionato non rappresenta Personaggio Json",
				action: {
					label: "OK",
					onClick: () => console.info("Undo")
				}
			});
		}
	}
	
	let searchQuery = $state('');

	let filteredCharacters= $derived(
		data.characters.filter(character => character.name.toLowerCase().includes(searchQuery.toLowerCase())) || []
	)
	   
</script>

<div class=" flex flex-col gap-10 bg-cafe_noir-900 items-center justify-center p-5">
    <!-- Action Bar per aggiungere un Personaggio -->
	<div class="p-5 flex flex-row gap-10 bg-white items-center justify-center border rounded-2xl ">
		<Input placeholder="Ricerca col nome del Personaggio" bind:value={searchQuery}/>
		<Button id="character_creation_dialog" class="bg-cafe_noir-400 w-50" onclick={()=>{openCreationDialog = true}}>Crea un nuovo Personaggio</Button>
		<Button class="bg-cafe_noir-400 w-50" onclick={handleImport}>Carica Personaggio da Json</Button>
	</div>
	<!-- Mostro le card dei Personaggi presenti in data che rispettano la query di ricerca -->
	{#if data.characters && data.characters.length > 0}
		{#if filteredCharacters.length>0}
			{@const rows = (Math.floor(data.characters.length))}
			<div class="grid grid-cols-2 {`grid-rows-${rows}`}  gap-4">
				{#each filteredCharacters as char}
					<div class="w-130">
						<CharacterCard character={char} showButtons={true}>

						</CharacterCard>
					</div>
				{/each}
			</div>
		{:else}
			<p class="font-bold"> Non è stato trovato alcun personaggio</p>
		{/if}
	{:else}
		<p class="font-bold">Non hai ancora creato nessun Personaggio.</p>
	{/if}
    
	<!-- Dialog Creazione Personaggio -->
	<Dialog.Root open={openCreationDialog} onOpenChange={(v)=> {openCreationDialog=v}} >
		
		<Dialog.Content class="bg-cafe_noir-600 border-0">

			<Dialog.Header>
      			<Dialog.Title>Nuovo Personaggio</Dialog.Title>
				<Dialog.Description class="text-black">
					Dai un nome al tuo Eroe e scegli le sue prime classi.
				</Dialog.Description>
    		</Dialog.Header>

			<form id="characterCreation" method="POST" use:enhance>

				<!-- Nome Personaggio -->
				<Form.Field {form} name="name">
					<Form.Control>
						<Form.Label>Nome</Form.Label>
						<Input bind:value={$formData.name}/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Prime due classi, le uniche richieste -->
				<div class="flex flex-row items-center gap-5">
					<!-- Prima Classe -->
					<Form.Field {form} name="prima_classe" >
						<Form.Control>
							<Form.Label >Prima Classe</Form.Label>
							
							<Select.Root type="single" name="prima_classe" bind:value={$formData.prima_classe as string} allowDeselect={true}>
								
								<Select.Trigger class="w-auto min-w-30 text-black bg-white">
									{triggerFirstClass}
								</Select.Trigger>
								<Select.Content>
									<Select.Group class="bg-white">
										{#each classes as characterClass}
											<Select.Item
											value={characterClass}
											label={characterClass}
											disabled={characterClass.includes("Manuale")}
											>
												{characterClass}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
							
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Seconda Classe -->
					<Form.Field {form} name="seconda_classe">
						<Form.Control >
							<Form.Label>Seconda Classe</Form.Label>    
							<Select.Root type="single" name="prima_classe" bind:value={$formData.seconda_classe as string}>
								<Select.Trigger class="w-auto min-w-30 text-black bg-white">
									{triggerSecondClass}
								</Select.Trigger>
								<Select.Content>
									<Select.Group >
										{#each classes as characterClass}
											<Select.Item
											value={characterClass}
											label={characterClass}
											disabled={characterClass.includes("Manuale")}
											>
												{characterClass}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				
				<!-- Terza Classe (Opzionale) -->
				<Form.Field {form} name="terza_classe">
					<Form.Control >
						<Form.Label>Terza Classe</Form.Label>    
						<Select.Root type="single" name="prima_classe" bind:value={$formData.terza_classe as string}>
							<Select.Trigger class="w-39 min-w-30 text-black bg-white">
								{triggerThirdClass}
							</Select.Trigger>
							<Select.Content>
								<Select.Group >
									{#each classes as characterClass}
										<Select.Item
										value={characterClass}
										label={characterClass}
										disabled={characterClass.includes("Manuale")}
										>
											{characterClass}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

			</form>

			<Dialog.Footer>
				<Form.Button form="characterCreation" type='submit'>
					Crea Personaggio
				</Form.Button>
			</Dialog.Footer>

		</Dialog.Content>
	</Dialog.Root>
</div>
