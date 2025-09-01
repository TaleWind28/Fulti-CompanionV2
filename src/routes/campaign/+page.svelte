<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import type { Campaign} from "$lib/zod";

    

    let fetched:Campaign[] = $state([
        {
            id:0,
            name:"Smash Around the universe",
            description:"Questà è l'unica seria",
            pic:"/images/map-2.png",
            players:[],
            master:"TaleWind",
            pages:[],
        },
        {
            id:1,
            name:"UnrivalUnranked",
            description:"Il master è un min maxer",
            pic:"/images/map-2.png",
            players:[],
            master:"TaleWind",
            pages:[],
        },
        {
            id:2,
            name:"The Conjuring",
            description:"bhooo",
            pic:"/images/map-2.png",
            players:[],
            master:"TaleWind",
            pages:[],
        }
        ]); 

    let searchCampaign = $state("");
    let filteredCampaigns:Campaign[] = $derived(
        fetched.filter( (campaign) => campaign.name.toLowerCase().includes(searchCampaign.toLowerCase())) || []    
    )

    async function handleNewCampaign() {
        fetched.push(
            {
                name:"minosse",
                description:"Minno",
                pic:"/images/map-2.png",
                players:[],
                master:"TaleWind",
                pages:[],
                id:3,
            })
    }
    $inspect(filteredCampaigns,"search");
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
                            src={campaign.pic} 
                            alt={`immagine ${campaign.name}`}
                            class="w-80"    
                        />
                    </a>
                </span>
                
            {/each}
        </section>
    </div>
</div>


