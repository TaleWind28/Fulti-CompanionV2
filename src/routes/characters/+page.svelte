<script lang="ts">
    import CharacterCard from '$lib/components/characterCard.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { toast } from 'svelte-sonner';
	import * as Dialog from "$lib/components/ui/dialog/index.js";
    import type { PageData } from './$types';
    import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Select from "$lib/components/ui/select/index";
    import { message, superForm } from 'sveltekit-superforms';
    import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
    import { characterSchema } from '$lib/zod';



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
				
                toast.success("Personaggio creato con successo!");
			}
		}
	});

	const { form: formData , enhance} = form;
	let openCreationDialog = $state(false);
	//fetchare da db;
	let classes:string[] = $state(["Elementalista","MAestro d'armi","Pippo"]);

	const triggerFirstClass = $derived(
		classes.find((c)=> c === $formData.prima_classe) || "Scegli una Classe"
	)

	const triggerSecondClass = $derived(
		classes.find((c)=> c === $formData.seconda_classe) || "Scegli una Classe"
	)

	const triggerThirdClass = $derived(
		classes.find((c)=> c === $formData.terza_classe) || "Scegli una Classe"
	)
	$inspect($formData)
</script>

<div class="p-5 flex flex-col gap-10 bg-cafe_noir-900 items-center justify-center">
    
	<div class="p-5 flex flex-row gap-10 bg-white items-center justify-center border  rounded-2xl ">
		<Input placeholder="Ricerca col nome del Personaggio" oninput={()=>toast.error("implementami")}/>
		<Button id="character_creation_dialog" class="bg-cafe_noir-400 w-50" onclick={()=>{openCreationDialog = true}}>Crea un nuovo Personaggio</Button>
		<Button class="bg-cafe_noir-400 w-50" onclick={()=>toast.error("implementami")}>Carica Personaggio da Json</Button>

	</div>	

	{#if data.characters && data.characters.length > 0}
		{@const rows = (Math.floor(data.characters.length))}
		<div class="grid grid-cols-3 {`grid-rows-${rows}`} gap-4">
			{#each data.characters as char}
				<CharacterCard character={char}>

				</CharacterCard>
        {/each}
		</div>
        
	{:else}
		<p>Non hai ancora creato nessuna Personaggio.</p>
	{/if}
    
	<!-- Dialog Creazione Personaggio -->
	<Dialog.Root open={openCreationDialog} onOpenChange={(v)=> {openCreationDialog=v}}>
		
		<Dialog.Content>
			<Dialog.Header>
      			<Dialog.Title>Nuovo Personaggio</Dialog.Title>
				<Dialog.Description>
					Dai un nome al tuo Eroe e scegli le sue prime classi.
				</Dialog.Description>
    		</Dialog.Header>

			<form id="characterCreation" method="POST" use:enhance>

				<!-- Nome Personaggio -->
				<Form.Field {form} name="name">
					<Form.Control>
						<Form.Label>Name</Form.Label>
						<Input bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Prime due classi, le uniche richieste -->
				<div class="flex flex-row items-center gap-5">
					<!-- Prima Classe -->
					<Form.Field {form} name="prima_classe">
						<Form.Control >
							<Form.Label>Prima Classe</Form.Label>    
							<Select.Root type="single" name="prima_classe" bind:value={$formData.prima_classe}>
								<Select.Trigger class="w-auto min-w-30">
									{triggerFirstClass}
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

					<!-- Seconda Classe -->
					<Form.Field {form} name="seconda_classe">
						<Form.Control >
							<Form.Label>Seconda Classe</Form.Label>    
							<Select.Root type="single" name="prima_classe" bind:value={$formData.seconda_classe}>
								<Select.Trigger class="w-auto min-w-30">
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
						<Select.Root type="single" name="prima_classe" bind:value={$formData.terza_classe}>
							<Select.Trigger class="w-auto min-w-30">
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
