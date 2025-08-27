<script lang="ts">
    let fetched:any[] = $state([{id:12,name:"minosse"}]); 
</script>

<div class="bg-cafe_noir-900 h-full flex items-center justify-center">
    <section class="text-center max-w-2xl">
        <h1 class="flex justify-center">
            <img src="/images/Logo5.1.png" alt="Logo" class="w-auto h-auto">
        </h1>
        <p class=" font-semibold">Più mondi sconfinati si aprono davanti a te, quale sceglierai?</p>
    </section>

    {#each fetched as campaign}
        <a href="/campaign/{campaign.id}">{campaign.name}</a>
    {/each}

</div>

