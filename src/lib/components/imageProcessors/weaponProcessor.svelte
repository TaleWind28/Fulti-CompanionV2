<script>
  import { exportHtmlToImage } from "$lib/utils";
  import { faDownload, faFileExport, faTrash } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import ImageUploader2 from "../imageUploader2.svelte";

    let {weaponName,isMartial,weaponImageUrl,calculatedResults,quality,handleExport=null, onDelete=null} = $props();
    function handleDelete(){
        onDelete(weaponName);
        return;
    }
    let downloadId = "arma:"+weaponName;
</script>


<div>
    <div  id={downloadId} class="bg-white border-black h-auto ">
        <!-- Intestazione tabella -->
        <div class="bg-cafe_noir-700 grid grid-cols-6">
            <p class="col-span-1 px-2">
                {weaponName}
                {#if isMartial}
                    <span class="text-red-600 " style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">♦</span>
                {/if}
            </p>
            <span class="grid grid-cols-3  col-span-5 gap-30 px-10">
                {#each ["PRECISIONE","DANNO","COSTO"] as header}
                    <p> {header} </p>
                {/each}
            </span>
        </div>
        <div class="flex">
            <div class="flex-shrink-0">
                <ImageUploader2 padre={downloadId} dimensions={"w-25 h-25 border-r"} fill={true} bind:imageUrl = {weaponImageUrl}/>
            </div>
            <div class="flex-1">
                <div class="justify-around bg-cafe_noir-800 flex ">
                    {#each calculatedResults.formulaRow as formula}
                        <p> {formula} </p>
                    {/each}
                </div>
                <hr>
                <div class="flex flex-row items-center justify-between px-2 ">
                    {#each calculatedResults.thirdRowElement as element }
                        <p class="text-center"> {element} </p>
                    {/each}
                </div>
                <hr>
                <div class="px-2 break-words w-150">
                    {quality}
                </div>
            </div>
        </div>
    
        
    </div>
    <span class="flex flex-row">
        <span>
            <button onclick={()=>exportHtmlToImage(downloadId)}>
                <Fa icon={faDownload} class="cursor-pointer px-2 w-auto"/>
            </button>
        </span>
        {#if handleExport}
            <span>
                <button onclick={handleExport}>
                    <Fa icon={faFileExport} class="cursor-pointer px-2 w-auto"></Fa>
                </button>
            </span>
        {/if}
        {#if onDelete}
            <span>
                <button onclick={handleDelete}>
                    <Fa icon={faTrash} class="cursor-pointer px-2 w-auto"></Fa>
                </button>
            </span>
        {/if}
        
    </span>
</div>
