<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import DatePicker from '$lib/components/datePicker.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import Switch from '$lib/components/ui/switch/switch.svelte';
    import EditableLink from '$lib/components/utility/editableLink.svelte';
    import EditableLists from '$lib/components/utility/editableLists.svelte';
    import { isoToDateValue } from '$lib/utils.js';
    import type { Campaign } from '$lib/zod.js';
    import { getLocalTimeZone, type DateValue } from '@internationalized/date';
    import { toast } from 'svelte-sonner';

    let {data} = $props();

    let isPlayer= $state(false);
    let campaign : Campaign  = $derived(data.campaign);

    type LinkItem = {name:string,link:string}
    
    let landing = $derived(campaign.pages[0]);
    let objectives = $derived<string[]>(
    landing.content[0]?.type === 'object' ? landing.content[0].objectives ?? [] : []);
    
    let wiki = $derived<LinkItem[]>(
    landing.content[0]?.type === 'object' ? (landing.content[0].wiki ?? []) : []
  );

    let isMaster = $state(true);
    let allowModify = $state(false);

    //sta cosa è oscena ma va bene -> si aggiusta a fine lavorazione
    let retrievedData: DateValue | undefined = $derived(undefined);
    if(landing.content[0].type === 'object'){
        retrievedData = isoToDateValue(landing.content[0].nextSessionAt);
    }
    
    let selected: DateValue | undefined = $derived(retrievedData);
    // derived per ottenere la data in formato Date
    const isoDate = $derived(
        selected ? selected.toDate(getLocalTimeZone()) : null
    );

    $inspect(

        landing.content[0],"landing"
    )

    async function save() {
        //creo il payload da passare alla fetch
        const payload = {
            campaignId: campaign.id,
            objectives: objectives,
            wiki: wiki,
            nextSessionAt: isoDate
        };

        console.log(payload,"pl");

        const response = await fetch('/api/campaign/landing-save',{
            method:'POST',
            headers:{'Content-type': 'application/json'},
            body:JSON.stringify(payload)
        })
        
        if(!response.ok){
            const error = await response.json().catch(()=>({}));
            console.error('Save Failure',error);
            toast.error(`Errore nel salvataggio: ${error?.message ?? response.statusText}`,{
                action:{
                    label:'OK',
                    onClick:()=>console.info('page modify failed')
                }
            }) 
        }

        await invalidateAll();
        toast.success('Pagina modificata con successo',{
            action:{
                label:'OK',
                onClick:()=>console.info('page modified')
            }
        })
    }
    
</script>

<div class="bg-lion-900 flex flex-col gap-5 items-center justify-start p-5">
    <section class="bg-white flex flex-col gap-5 items-center justify-start p-2">
        {#if isMaster}   
            <span class="flex flex-row items-center justify-center">
                <Label>Modifica</Label>
                <Switch bind:checked = {allowModify}></Switch>
                <Button onclick={save}>Salva</Button>
            </span>
        {/if}

        <div class="flex flex-col">
            <h1 class="text-5xl font-bold "> {campaign.name} </h1>
            <h2>{campaign.description}</h2>
            <img src={campaign.pic} alt="BackgroundPic" />
        </div>
        <div class="flex flex-row justify-start px-5 gap-10">
            <!-- Obiettivi -->
            <span class="flex flex-col border border-black p-5">
                {#if landing.content[0].type === 'object'}
                    <EditableLists 
                        title="Obiettivi Correnti"
                        modify={allowModify} 
                        listContent={objectives}
                        />
                {/if}
                
            </span>
            
            <!-- Giocatori -->
            <span class="flex flex-col gap-5 border border-black p-5">
                <p>Giocatori Attuali</p>
                
                <span class="flex flex-col">
                    {#each campaign.players as player}
                        <p>{player.name}</p>                    
                    {/each}
                </span>

                {#if !isPlayer}
                    <Button class="w-20">
                        Unisciti
                    </Button>
                    
                {/if}
            </span>

            <!-- Calendario -->
            <span class="flex flex-col border border-black p-5 w-auto">
                
                <p>Prossima Sessione</p>
                <DatePicker bind:value = {selected} editable={allowModify}/>
            </span>

        </div>

        <div class="flex flex-col  items-start justify-start">
            <span>                
                {#if landing.content[0].type === 'object'}
                    <EditableLink 
                        modify={allowModify}
                        listContent={wiki}
                        title={"Wiki"}
                    /> 

  
                {/if}
            </span>
        </div>
        
   </section>
</div>