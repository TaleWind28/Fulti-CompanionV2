<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import type { Campaign } from '$lib/zod.js';


    let {data} = $props();

    let isPlayer= $state(false);
    let campaign : Campaign  = $derived(data.campaign);
    
    let landing = $derived(campaign.pages[0]);
    
    $inspect(data,"data")
</script>

<div class="bg-lion-900 h-full flex flex-col gap-5 items-center justify-start p-5">
    <section class="bg-white h-full flex flex-col gap-5 items-center justify-start p-2">
        <div class="flex flex-col">
            <h1 class="text-5xl font-bold "> {campaign.name} </h1>
            <h2>{campaign.description}</h2>
            <img src={campaign.pic} alt="BackgroundPic" class="w-full"/>
        </div>
        <div class="flex flex-row justify-start px-5 gap-10">
            
            <span class="flex flex-col border border-black p-5">
                <p>Obiettivi Correnti</p>
                <p>
                    {#if landing.content[0].type === 'text'}
                        {landing.content[0].text}
                    {/if}
                </p>
            </span>
            

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
            <span class="flex flex-col border border-black p-5 w-32">
                
                <p>Prossima Sessione</p>
                //mettere calendario
            </span>

        </div>

        <div class="flex flex-col  items-start justify-start">
            <p>Wiki</p>
            <span>
                mostrare link alla lore/pagine
            </span>
        </div>
   </section>

</div>