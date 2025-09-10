<script lang="ts">
    import PngCard from '$lib/components/pngCard.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import { toast } from 'svelte-sonner';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import * as Form from '$lib/components/ui/form/index.js';
    import * as Select from '$lib/components/ui/select/index.js';
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import { pngSchema, type FabulaUltimaPNG } from '$lib/zod.js';

    //pensare se implementare
    let communityLink = "/bestiary/communityBestiary/";

    let { data } = $props();
    //inizializzo il superform, e gestisco l'update
    const form = superForm(data.form,{
        validators: zod4Client(pngSchema),
		taintedMessage:null,
		dataType: 'json',
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				openCreationDialog = false;
                toast.success("PNG creato con successo!",{
					action:{
						label:"OK",
						onClick: () =>{console.info("png-created!")}
					}
				});
			}
		}
    })

    const { form: formData , enhance} = form;

    let searchQuery:string = $state("");
    let filteredPngs:FabulaUltimaPNG[] = $derived(
        data.pngs.filter(png => png.name.toLowerCase().includes(searchQuery.toLowerCase())) || []
    )
    let openCreationDialog = $state(false);

    let species = data.species;

    let triggerSpecies = $derived(
        species.find((p)=> p===$formData.specie || "Scegli una Specie ")
    )

    async function handleImport(){

    }

</script>
<div class="flex flex-col gap-10 bg-cafe_noir-900 items-center justify-center p-5">
    
    <!-- Action Bar per creare i png -->
    <div class="p-5 flex flex-row gap-10 bg-white items-center justify-center border rounded-2xl ">
		<Input placeholder="Ricerca col nome del Personaggio" bind:value={searchQuery}/>
		<Button id="character_creation_dialog" class="bg-cafe_noir-400 w-50" onclick={()=>{openCreationDialog = true}}>Crea un nuovo Personaggio</Button>
		<Button class="bg-cafe_noir-400 w-50" onclick={handleImport}>Carica Personaggio da Json</Button>
	</div>
    
    <!-- Mostro i png -->
    <div>
        {#if data.pngs && data.pngs.length > 0}
            {#if filteredPngs.length>0}
                {@const rows = (Math.floor(data.pngs.length))}
                <div class="grid grid-cols-2 {`grid-rows-${rows}`}  gap-4">
                    {#each data.pngs as png }
                        <PngCard png={png} showButtons={true}/> 
                    {/each}
                </div>
            {/if}
        {/if}
    </div>

    <!-- Dialog creazione PNG -->
    <Dialog.Root open={openCreationDialog} onOpenChange={(v)=>openCreationDialog = v}> 
        <Dialog.Content> 
            <Dialog.Header> 
                <Dialog.Title>  
                    Nuovo PNG
                </Dialog.Title>
                <Dialog.Description> 
                    Dai un nome al PNG e scegli la sua specie
                </Dialog.Description>
            </Dialog.Header>
        
            <form id="pngCreation" method="POST">
                <!-- Nome PNG -->
                <Form.Field {form} name="name"> 
                    <Form.Control> 
                        <Form.Label> 
                            Nome
                        </Form.Label>
                        <Input bind:value={$formData.name}/>
                        <Form.FieldErrors/>
                    </Form.Control>
                </Form.Field>

                <div> 
                    <Form.Field {form} name="specie">
                        <Form.Control> 
                            <Form.Label> 
                                Specie
                            </Form.Label>
                            <Select.Root type="single" name="specie" bind:value={$formData.specie as string} allowDeselect={true}> 
                                <Select.Trigger class="w-auto min-w-30 text-black bg-white">
                                    {triggerSpecies}
                                </Select.Trigger>
                                <Select.Content> 
                                    <Select.Group class="bg-white"> 
                                        {#each species as specie }
                                            <Select.Item
                                                value={specie}
                                                label={specie}
                                            > 
                                                {specie}
                                            </Select.Item>
                                        {/each}
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>
                        </Form.Control> 
                        <Form.FieldErrors/>
                    </Form.Field>
                </div>
            </form>

            <Dialog.Footer> 
                <Form.Button form="pngCreation" type="submit"> 
                    Crea PNG
                </Form.Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
</div>


<!-- 
<button> 
    <a href={communityLink}> cerca PNG online</a>
</button> 
-->