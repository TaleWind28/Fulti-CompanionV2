<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js"; 
    import type { FabulaUltimaCharacter } from "$lib/zod";
    import { toast } from "svelte-sonner";
    import { invalidateAll } from "$app/navigation";
    import Fa from "svelte-fa";
    import { faFileExport, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
    import { downloadFile } from "$lib/utils";
    import { type Attributes, type Traits } from "$lib";
    import ProgressiveBar from "./progressiveBar.svelte";
    const { character }: { character: FabulaUltimaCharacter & { id: string } } = $props();
    

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
</script>

<div>
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
      <div class="flex flex-col">
        <img src={currentPic} alt="character-pic" class="w-40 h-40 border">
        <ProgressiveBar color="bg-red-500" bgColor = "cafe_noir" label = "PV" actual={character.stats.HP.actual} max={character.stats.HP.max}></ProgressiveBar>
        <ProgressiveBar color="bg-blue-500" bgColor = "cafe_noir" label = "PM"  actual={character.stats.MP.actual} max={character.stats.MP.max}></ProgressiveBar>
        <ProgressiveBar color="bg-green-500" bgColor = "cafe_noir" label = "PI" actual={character.stats.IP.actual} max={character.stats.IP.max}></ProgressiveBar>
      </div>
      
      
      <!-- descrizione a dx -->
      <div class="flex flex-col gap-5">
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
        
      </div>
    </Card.Content>
    <Card.Footer class="flex justify-end items-center gap-5">
    <a href="/characters/{character.id}" class="card-link">
      <Fa icon={faPencil}></Fa>
    </a>

    <button onclick={()=>handleDelete(character.id)}>
      <Fa icon={faTrash} class="cursor-pointer px-2 w-auto"/>
    </button>

    <button onclick={handleExport}>
      <Fa icon={faFileExport} class="cursor-pointer px-2 w-auto"></Fa>
    </button>

    </Card.Footer>
  </Card.Root>

</div>


{#snippet traits(traits:Traits)}
  <div class="flex flex-col w-full">
    <p class="font-bold">Identità: </p>{traits.identity }
    <p class="font-bold">Tema: </p>{traits.theme}
    <p class="font-bold">Origine:</p>{traits.origin}  
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