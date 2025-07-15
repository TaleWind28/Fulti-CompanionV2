<script>
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js"     
    import ImageUploader2 from "./imageUploader2.svelte";
    import { exportHtmlToImage } from "$lib/utils";
    import Fa from "svelte-fa";
    import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";

    let equipName = $state("");
    //imageProcessor
    let tableHeader = ["DIFESA", "DIF.MAGICA","COSTO"];
    let cost = $state(0);
    let dataRow = $derived(["7","5",cost+"z"]);
    let equipImageUrl = $state("");
    let quality = $state("");
    let isMartial = $state(false);
    
    function handleExport(){
        return;
    }
</script>

<div class="flex gap-5">
    <!-- Generatore -->
    <div>
        <Card.Root  class="w-150 bg-cafe_noir-700 border-0">
            <Card.Header>
                pipo
            </Card.Header>
            <Card.Content>

            </Card.Content>
            <Card.Footer>
                
            </Card.Footer>
        </Card.Root>
    </div>
    <!--ImageProcessor -->
    <div>
        <div id="equipaggiamento" class="bg-white border h-auto">
            <!-- intestazione tabella -->
        <div class="bg-cafe_noir-700 grid grid-cols-6">
            <p class="col-span-1 px-2">
                {equipName}
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

        <!-- Corpo Tabella -->
        <div class="flex">
            <div class="flex-shrink-0">
                <ImageUploader2 padre="weaponGenerator" dimensions={"w-25 h-25 border-r"} fill={true} bind:imageUrl = {equipImageUrl}/>
            </div>
            <div class="flex-1">
                <div class="justify-around bg-cafe_noir-800 flex ">
                    {#each ["Def","*","MDef","*","costo"] as formula}
                        <p> {formula} </p>
                    {/each}
                </div>
                <hr>
                <!-- <div class="flex flex-row items-center justify-between px-2 ">
                    {#each calculatedResults.thirdRowElement as element }
                        <p class="text-center"> {element} </p>
                    {/each}
                </div>
                <hr> -->
                <div class="px-2 break-words w-150">
                    {quality}
                </div>
            </div>
        </div>
        </div>
        

        <span class="flex flex-row">
            <span>
                <button onclick={()=>exportHtmlToImage('equipaggiamento')}>
                    <Fa icon={faDownload} class="cursor-pointer px-2 w-auto"/>
                </button>
            </span>
            
            <span>
                <button onclick={handleExport}>
                    <Fa icon={faFileExport} class="cursor-pointer px-2 w-auto"></Fa>
                </button>
            </span>
            
        </span>
    </div>    
</div>

