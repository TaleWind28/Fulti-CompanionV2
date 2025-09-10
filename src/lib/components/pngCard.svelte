<script lang="ts">
    import * as Card from '$lib/components/ui/card/index';
    import Fa from "svelte-fa";
    import { faFileExport, faKhanda, faMagicWandSparkles, faPencil, faShield, faTrash, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

    let {png, showButtons} = $props();
    async function handleDelete(pngId:string) {
    }

    async function handleExport() {
        
    }

</script>

<Card.Root class="bg-purple-800"> 
    <!-- Intestazione della Card -->
    <Card.Header class="flex items-center justify-between">
      <p class="font-bold">{png.name}</p>
      <p class=""> LV {png.level}</p>
    </Card.Header>

    <Card.Content class="flex items-start flex-row gap-5 py-5 bg-white"> 

    </Card.Content>
    <Card.Footer class="flex justify-end items-center gap-5">
      
      {#if showButtons}
        <a href="/characters/{png.id}" class="card-link">
          <Fa icon={faPencil}/>
        </a>

        <button onclick={()=>handleDelete(png.id)}>
          <Fa icon={faTrash} class="cursor-pointer px-2 w-auto"/>
        </button>

        <button onclick={handleExport}>
          <Fa icon={faFileExport} class="cursor-pointer px-2 w-auto"/>
        </button>
      {/if}
    </Card.Footer>
</Card.Root>
