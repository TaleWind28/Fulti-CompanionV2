<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';


    let {data} = $props();

    let isPlayer= $state(false);
    $inspect(data,"data")
</script>

<div class="bg-lion-900 h-full flex flex-col gap-5 items-center justify-start p-5">
    <div class="flex flex-col">
        <h1> {data.campaignId} </h1>
        <img src="" alt="BackgroundPic" class="w-full"/>
    </div>
    <div class="flex flex-row justify-start px-5 gap-10">
        
        <span class="flex flex-col border border-black p-5">
            <p>Descrizione</p>
            <p>scrivimi</p>
        </span>
        
        <span class="flex flex-col border border-black p-5">
            <p>Obiettivi Correnti</p>

        </span>
        

        <span class="flex flex-col gap-5 border border-black p-5">
            <p>Giocatori Attuali</p>
            
            <span class="flex flex-col">
                <p>Vorston,</p>
                <p>Viridi,</p>
                <p>....</p>
            </span>

            {#if !isPlayer}
                <Button class="w-20">
                    Unisciti
                </Button>
                
            {/if}
        </span>
        <span class="flex flex-col border border-black p-5">
            
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
   

</div>