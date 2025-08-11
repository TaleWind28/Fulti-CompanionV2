<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js"; 
    import type { FabulaUltimaCharacter } from "$lib/zod";
    import { toast } from "svelte-sonner";
    import { invalidateAll } from "$app/navigation";
    import Fa from "svelte-fa";
    import { faFileExport, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
    import { downloadFile } from "$lib/utils";
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
        toast.error(`Errore: ${errorData.message || 'Impossibile eliminare il personaggio.'}`);
        return;
      }

      //ricarica la pagina
      await invalidateAll();
      toast.success('Personaggio eliminato con successo!');

    } catch (err) {
      console.error('Errore nella richiesta di cancellazione:', err);
      toast.error('Si è verificato un errore di rete. Riprova.');
    }
  }
  async function handleExport(){
    const downloadableCharacter = JSON.stringify(character, null, 2);
    downloadFile(downloadableCharacter,`${character.name.replace(/\s+/g, '') || 'accessorio'}.json`,'application/json')
    return;
  }

  
</script>

<div>
    <Card.Root> 
        <Card.Header> 
            {character.name}
        </Card.Header>
        <Card.Content> 
            {character.id}
        </Card.Content>
        <Card.Footer class="flex justify-between">
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
