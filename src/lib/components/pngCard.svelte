<script lang="ts">
    import * as Card from '$lib/components/ui/card/index';
    import Fa from "svelte-fa";
    import { faFileExport, faKhanda, faMagicWandSparkles, faPencil, faShield, faTrash, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import LabeledProgress from './labeledProgress.svelte';
    import type { Affinity, Attributes, FabulaUltimaPNG } from '$lib/zod';
    import { elemGlams } from '$lib';
    import { downloadFile } from '$lib/utils';
    import { toast } from 'svelte-sonner';
    import { invalidateAll } from '$app/navigation';

    let {png, showButtons} : {png:FabulaUltimaPNG, showButtons:boolean} = $props();
    async function handleDelete(pngId: string) {
    // 1. Chiedi conferma all'utente (buona pratica UX)
    if (!confirm('Sei sicuro di voler eliminare questo personaggio? L\'azione è irreversibile.')) {
      return;
    }

    // 2. Esegui la chiamata all'endpoint API
    try {
      const response = await fetch(`/api/png`, {
        method: 'DELETE',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({pngId})
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Errore: 'Impossibile eliminare il personaggio.'`,{
        action:{
                label:"OK",
                onClick: () =>{console.info("undo")}
            }
        });
        return;
      }

      //ricarica la pagina
      await invalidateAll();
      toast.success('Personaggio eliminato con successo!',{
        action:{
						label:"OK",
						onClick: () =>{console.info("undo")}
					}
      });

    } catch (err) {
      console.error('Errore nella richiesta di cancellazione:', err);
      toast.error('Si è verificato un errore di rete. Riprova.',{action:{
						label:"OK",
						onClick: () =>{console.info("undo")}
					}});
    }
  }

    async function handleExport() {
      const downloadablePNG = JSON.stringify(png, null, 2);
      downloadFile(downloadablePNG,`${png.name.replace(/\s+/g, '') || 'PNG'}.json`,'application/json')
      return;
    }

  let currentPic = $derived(
    png.pic || '/images/defaultPngAvatar.jpg'
  );

</script>

<Card.Root class="bg-purple-600 border-0"> 
  <!-- Intestazione della Card -->
  <Card.Header class="flex items-center justify-between">
    <p class="font-bold text-white">{png.name}</p>
    <p class="text-white"> LV {png.level}</p>
  </Card.Header>

  <Card.Content class="flex items-start flex-row gap-5 py-5 bg-white"> 
    <!-- Pic e barre -->
    <div>
      <img src={currentPic} alt="png-pic" class="w-40 h-40 border"/>
      <!-- MPBAR -->
      <span class="flex flex-row items-center justify-center gap-2">
        <LabeledProgress 
          value={png.stats.HP.actual}
          max={png.stats.HP.max}
          progressColor="h-6 bg-red-200 [&_[data-slot=progress-indicator]]:bg-red-500"
          class="h-3"
        />
        <p>HP</p> 
      </span>
      <!-- MPBAR -->
      <span class="flex flex-row items-center justify-center gap-2">
        <LabeledProgress 
          value={png.stats.MP.actual}
          max={png.stats.MP.max}
          progressColor="h-6 bg-blue-200 [&_[data-slot=progress-indicator]]:bg-blue-500"
          class="h-3"
        />
        <p>MP</p> 
      </span>
    </div>
    <!-- Container Laterale per Caratteristiche descrizione ed affinità -->
    <div class="flex flex-col gap-2">
        <!-- Descrizione -->
        <p class="w-50 break-words border-2 border-gray-600 p-2">
          {png.description}
        </p>
        <!-- Caratteristiche -->
        <span>
          {@render characterStats(png.attributes)}
        </span>
         <!-- Difesa Difesa Magica ed Iniziativa -->
        <span class=" flex items-center justify-between px-4">
          {@render derivedStats("DEF",png.stats.DEF,faShield,faKhanda)}
          {@render derivedStats("M.DEF",png.stats.MDEF,faShield,faMagicWandSparkles)}
        </span>
        <!-- Affinità Elementali -->  
        <span>
          {@render affinitiesTable(png.affinities,elemGlams)}
        </span>
      
    </div>
  </Card.Content>

  <Card.Footer class="flex justify-end items-center gap-5">
    
    {#if showButtons}
      <a href="/bestiary/{png.id}" class="card-link">
        <Fa icon={faPencil} class="cursor-pointer text-white"/>
      </a>

      <button onclick={()=>handleDelete(png.id)}>
        <Fa icon={faTrash} class="cursor-pointer px-2 w-auto text-white"/>
      </button>

      <button onclick={handleExport}>
        <Fa icon={faFileExport} class="cursor-pointer px-2 w-auto text-white"/>
      </button>
    {/if}
  </Card.Footer>
</Card.Root>


{#snippet characterStats(stats:Attributes)}    
  <div class="grid grid-cols-2 justify-between gap-5">
      <div class="flex text-xl font-semi-bold">
          <p>DES</p>:
          d{stats.DEX.actual}
      </div>
      <div class="flex  text-xl font-semi-bold">
          <p>INT</p>:
          d{stats.INS.actual}
      </div>
      <div class="flex  text-xl font-semi-bold">
        <p>VIG</p>:
        d{stats.MIG.actual}
    </div>
    <div class="flex text-xl font-semi-bold">
        <p>VOL</p>:
        d{stats.WLP.actual}
    </div>
  </div>
{/snippet}

{#snippet affinitiesTable(affinities:Affinity, elemGlams:any)}
  {@const affinityEntries = Object.entries(affinities)}
  
  <div class="grid grid-cols-9 border-r border-t border-b border-black">
    {#each affinityEntries as [name, affinity]}
      {@const hasActiveAffinity = affinity.weak || affinity.resistant || affinity.immune || affinity.absorb}
      {@const glam = elemGlams[name]}
      {#if glam}
        <span class="flex items-center justify-center border-l border-black px-1">
          <Fa icon={glam.icon} class={hasActiveAffinity ? glam.color : ''} />
          <span>
            {#if affinity.weak}db{/if}
            {#if affinity.resistant}rs{/if}
            {#if affinity.immune}im{/if}
            {#if affinity.absorb}as{/if}
          </span>
        </span>
      {/if}
    {/each}
  </div>
{/snippet}

{#snippet iconComposer(icon1:IconDefinition|null, icon2:IconDefinition | null)}
    <span class="relative inline-block">
        {#if icon1!=null}
            <Fa icon={icon1} class="text-4xl " />
            {#if icon2 !== null}
                <Fa icon={icon2} class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-white" />
            {/if}
        {/if}
    </span>
{/snippet}


{#snippet derivedStats(statName:string|null, stat:number|null, icon:IconDefinition|null, innerIcon:IconDefinition | null)}
    {#if stat!=null}
        <div>
            {@render iconComposer(icon, innerIcon)}
            <p>{statName}: {stat}</p>
        </div>
    {:else}
        <div>

        </div>
    {/if}

{/snippet} 