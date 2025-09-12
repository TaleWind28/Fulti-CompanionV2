<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { campaignSchema, type Campaign} from "$lib/zod";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import * as Form from "$lib/components/ui/form/index";
    import { superForm } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    import type { PageData } from "./$types";
    import { goto, invalidateAll } from "$app/navigation";
    
    let {data} : {data: PageData} = $props();
    $inspect(data);

    let searchCampaign = $state("");
    let filteredCampaigns:Campaign[] = $derived(
        data.campaigns?.filter( (campaign) => campaign.name.toLowerCase().includes(searchCampaign.toLowerCase())) || []    
    )

    const form = superForm(data.form,{
        validators: zod4Client(campaignSchema),
        taintedMessage:null,
        dataType:'json',
        onResult: async ({result}) => {
            console.info("Result Received", result);
            if(result.type === 'success' && result.data?.id){
                console.info("Campaign Created");
                openCreateCampaign = false;
                console.info("awaiting reload...")
                await invalidateAll();
                console.info("reloaded");
                const campaignId = result.data?.id;
                toast.success("Campagna creata con successo!",{
                    action:{
                        label:"Mostra",
                        onClick: ()=> goto(`/campaign/${campaignId}`)
                    }
                })

            }
        }
    })

    const {form: formData, enhance} = form;

    async function handleNewCampaign() {
        openCreateCampaign = true;
    }

    let openCreateCampaign = $state(false);
    $inspect(data,"data")
</script>
<div class="flex flex-col gap-5 bg-cafe_noir-900">
    <!-- Intestazione della pagina e pulsante per creare campagne -->
    <div class=" h-full flex justify-center items-center flex-col py-2">
        <section class="text-center max-w-2xl flex flex-col gap-5">
            <h1 class="flex justify-center">
                <img src="/images/Logo5.1.png" alt="Logo" class="w-auto h-auto">
            </h1>

            <p class=" font-semibold">Dei mondi sconfinati si aprono davanti a te, quale sceglierai?</p>
            
            <span class="flex flex-row gap-5">
                <Input bind:value={searchCampaign} placeholder="Cerca una campagna"/>
                <Button class="bg-lion-300 hover:bg-lion-200 " onclick={handleNewCampaign}>Oppure creane una</Button>
            </span>
        </section>
    </div>

    

    <div class=" flex justify-center py-5">
        <section class="grid grid-cols-3 gap-5">
            {#each filteredCampaigns as campaign}
                <span class="w-100 flex flex-col items-center justify-center">
                    <a href="/campaign/{campaign.id}" class="flex flex-col items-center justify-center">
                        
                        {campaign.name}
                        <img 
                            src={"/images/map-2.png"} 
                            alt={`immagine ${campaign.name}`}
                            class="w-80"    
                        />
                    </a>
                </span>
                
            {/each}
        </section>
    </div>
</div>

<Dialog.Root open={openCreateCampaign} onOpenChange={(v)=>{openCreateCampaign = v}}> 
    <Dialog.Header> 

    </Dialog.Header>
    <Dialog.Content>
        <form id="campaignCreation" method="POST" use:enhance>

            <!-- Nome Campagna -->
            <Form.Field {form} name="name"> 
                <Form.Control> 
                    <Form.Label> 
                        Nome Campagna
                    </Form.Label>
                    <Input bind:value={$formData.name}/> 
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>

            <!-- Descrizione Campagna -->
            <Form.Field {form} name="description"> 
                <Form.Control> 
                    <Form.Label> 
                        Descrizione
                    </Form.Label>
                    <Input bind:value={$formData.description}/> 
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </form>

        <Dialog.Footer> 
            <Form.Button form="campaignCreation" type='submit'> 
                Crea Campagnia
            </Form.Button>
        </Dialog.Footer>

    </Dialog.Content>
</Dialog.Root>


