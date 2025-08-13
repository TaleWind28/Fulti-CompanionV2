<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js"; 
    import type { Affinity, FabulaUltimaCharacter } from "$lib/zod";
    import { toast } from "svelte-sonner";
    import { invalidateAll } from "$app/navigation";
    import Fa from "svelte-fa";
    import { faFileExport, faKhanda, faMagicWandSparkles, faPencil, faRunning, faShield, faTrash, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import { downloadFile } from "$lib/utils";
    import { elemGlams, type Attributes, type Traits } from "$lib";
    import ProgressiveBar from "./progressiveBar.svelte";
    let { character, showButtons=true }: { character: FabulaUltimaCharacter & { id: string }, showButtons:boolean } = $props();
    


    // Questa funzione verrà chiamata al click del pulsante
  async function handleDelete(characterId: string) {
    // 1. Chiedi conferma all'utente (buona pratica UX)
    if (!confirm('Sei sicuro di voler eliminare questo personaggio? L\'azione è irreversibile.')) {
      return;
    }

    // 2. Esegui la chiamata all'endpoint API
    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE',
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
  async function handleExport(){
    const downloadableCharacter = JSON.stringify(character, null, 2);
    downloadFile(downloadableCharacter,`${character.name.replace(/\s+/g, '') || 'accessorio'}.json`,'application/json')
    return;
  }

  let currentPic = $derived(
    character.pic || '/images/defaultCharacterAvatar.jpg'
  );

  $inspect(showButtons,"pulsanti");
</script>

<div class="w-130">
  <Card.Root class="bg-lion-600 border-0 "> 
    
    <Card.Header class="flex items-center justify-between">
      <p>{character.name}</p>
      <p>
      LV  
      {character.stats.LV}
      </p>
    </Card.Header>

    <Card.Content class="flex items-start flex-row gap-5 py-5 bg-white">

      <!-- CharacterPic e ProgressBar -->
      <div class="flex flex-col gap-2">
        <img src={currentPic} alt="character-pic" class="w-40 h-40 border border-black">

        <ProgressiveBar color="bg-red-500" bgColor = "cafe_noir" label = "PV" actual={character.stats.HP.actual} max={character.stats.HP.max}></ProgressiveBar>
        <ProgressiveBar color="bg-blue-500" bgColor = "cafe_noir" label = "PM"  actual={character.stats.MP.actual} max={character.stats.MP.max}></ProgressiveBar>
        <ProgressiveBar color="bg-green-500" bgColor = "cafe_noir" label = "PI" actual={character.stats.IP.actual} max={character.stats.IP.max}></ProgressiveBar>
      </div>
      
      
      <!-- descrizione a dx -->
      <div class="flex flex-col gap-5 w-100">
        <!-- Tratti -->
        <span class="flex flex-row border">
          <p class="bg-lion-200 text-white  px-1 py-1 rounded flex-shrink-0 [writing-mode:vertical-lr] rotate-180 text-center">
          TRATTI
          </p>
          {@render traits(character.traits)}
        </span>

        <!-- Caratteristiche -->
        <span>
          {@render characterStats(character.attributes)}
        </span>

        <!-- Difesa Difesa Magica ed Iniziativa -->
        <span class=" flex items-center justify-between px-4">
          {@render derivedStats("DEF",character.stats.DEF,faShield,faKhanda)}
          {@render derivedStats("M.DEF",character.stats.MDEF,faShield,faMagicWandSparkles)}
        </span>

        <!-- Affinità Elementali -->
        <span>
          {@render affinitiesTable(character.affinities,elemGlams)}
        </span>

      </div>
    </Card.Content>
    <Card.Footer class="flex justify-end items-center gap-5">
      
      {#if showButtons}
        <a href="/characters/{character.id}" class="card-link">
          <Fa icon={faPencil}></Fa>
        </a>

        <button onclick={()=>handleDelete(character.id)}>
          <Fa icon={faTrash} class="cursor-pointer px-2 w-auto"/>
        </button>

        <button onclick={handleExport}>
          <Fa icon={faFileExport} class="cursor-pointer px-2 w-auto"></Fa>
        </button>
      {/if}
    </Card.Footer>
  </Card.Root>

</div>


{#snippet traits(traits:Traits)}
  <div class="flex flex-col w-60">

    <h1 class="flex flex-row">
      <p class="font-bold">Identità: </p>{traits.identity }
    </h1>
    
    <h1 class="flex flex-row">
      <p class="font-bold">Origine:</p>{traits.origin}  
    </h1>
    <h1 class="flex flex-row">
      <p class="font-bold">Tema: </p>{traits.theme}
    </h1>

    
  </div>
{/snippet}

{#snippet characterStats(stats:Attributes)}    
  <div class="grid grid-cols-2 justify-between">
      <div class="flex px-2 text-xl font-semi-bold">
          <p>DES</p>:
          d{stats.DEX}
      </div>
      <div class="flex px-2 text-xl font-semi-bold">
          <p>INT</p>:
          d{stats.INS}
      </div>
      <div class="flex px-2 text-xl font-semi-bold">
        <p>VIG</p>:
        d{stats.MIG}
    </div>
    <div class="flex px-2 text-xl font-semi-bold">
        <p>VOL</p>:
        d{stats.WLP}
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