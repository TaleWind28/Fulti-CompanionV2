<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import Switch from '$lib/components/ui/switch/switch.svelte';
    import type { Campaign } from '$lib/zod.js';
    import { string } from 'zod';


    let {data} = $props();

    let isPlayer= $state(false);
    let campaign : Campaign  = $derived(data.campaign);
    
    let landing = $derived(campaign.pages[0]);

    let isMaster = $state(true);
    let allowModify = $state(false);
    
    $inspect(data,"data")
</script>

<div class="bg-lion-900 h-full flex flex-col gap-5 items-center justify-start p-5">
    <section class="bg-white h-full flex flex-col gap-5 items-center justify-start p-2">
        {#if isMaster}   
            <span class="flex flex-row items-center justify-center">
                <Label>Modifica</Label>
                <Switch bind:checked = {allowModify}></Switch>
            </span>
        {/if}

        {#if !allowModify}

            <div class="flex flex-col">
                <h1 class="text-5xl font-bold "> {campaign.name} </h1>
                <h2>{campaign.description}</h2>
                <img src={campaign.pic} alt="BackgroundPic" class="w-full"/>
            </div>
            <div class="flex flex-row justify-start px-5 gap-10">
                <!-- Obiettivi -->
                <span class="flex flex-col border border-black p-5">
                    <p>Obiettivi Correnti</p>
                    
                    {#if landing.content[0].type === 'object'}
                        <ul>
                            {#each landing.content[0].objectives as objective }
                                <li>{objective}</li>
                            {/each}
                        </ul>
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
                <span class="flex flex-col border border-black p-5 w-32">
                    
                    <p>Prossima Sessione</p>
                    //mettere calendario
                </span>

            </div>

            <div class="flex flex-col  items-start justify-start">
                <p>Wiki</p>
                <span>
                    <ul>                    
                        {#if landing.content[0].type === 'object'}
                            {#each landing.content[0].wiki as value }
                                <li>
                                    <a href={value.link}>
                                        {value.name}
                                    </a>
                                </li>
                            {/each}
                        {/if}
                    </ul>
                </span>
            </div>
        {:else}
            porcodio
        {/if}
   </section>
</div>