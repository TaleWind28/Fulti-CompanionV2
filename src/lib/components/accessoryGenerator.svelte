<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js"     
    import ImageUploader2 from "./imageUploader2.svelte";
    import { exportHtmlToImage } from "$lib/utils";
    import Fa from "svelte-fa";
    import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
    import { Button } from "./ui/button";
    import { Label } from "./ui/label";
    import type { Quality } from "$lib";
    import Input from "./ui/input/input.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";

    let accessoryName = $state("");
    let isMartial = $state(false);
    function handleExport(){
        return;
    }
    
    function handleImport(){

    }

    function clearFields(){
        
    }
</script>

<div class=" flex gap-5">
    <!-- Generatore -->
    <div>
        <Card.Root class="w-150 bg-cafe_noir-700 border-0"> 
            <Card.Header> 
                Generatore di Accessori
            </Card.Header>
            <Card.Content class=" py-5 flex flex-col gap-5 bg-white">
                
            </Card.Content>

            <Card.Footer class="flex justify-center gap-10">
                <Button class="bg-cafe_noir-400 w-30" onclick={handleImport}>
                Carica Json
                </Button>
                <Button class="bg-cafe_noir-400 w-30" onclick={clearFields}>
                    Pulisci i Campi
                </Button>
            </Card.Footer>
        </Card.Root>
    </div>

    <!-- ImageProcessor -->
    <div>
        <div id="accessorio" class="bg-white border h-auto">
            <!-- Intestazione Tabella -->
             <div class="bg-cafe_noir-700 grid grid-cols-6">
            <p class="col-span-1 px-2">
                {accessoryName}
                {#if isMartial}
                    <span class="text-red-600 " style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">♦</span>
                {/if}
            </p>
            <span class="grid grid-cols-3  col-span-5 gap-30 px-10">
                {#each ["DIFESA","DIFESA M.","COSTO"] as header}
                    <p> {header} </p>
                {/each}
            </span>
        </div>
        </div>
    </div>
</div>

