
<script lang="ts">
  import { exportHtmlToImage } from "$lib/utils";
  import { faDownload, faFileExport, faTrash } from "@fortawesome/free-solid-svg-icons";
  import ImageUploader2 from "../imageUploader2.svelte";
  import Fa from "svelte-fa";
  import Checkbox from "../ui/checkbox/checkbox.svelte";
  import Label from "../ui/label/label.svelte";
  import { getContext } from "svelte";

    let {requestedData, isMartial,handleExport = null,equipImageUrl, onDelete = null, equip = $bindable(null)} = $props();

    type WearArmor = (equipName:string) => boolean;
    type EquipArmor = (equipName:string,value:boolean) => boolean;

    //context per controllare se posso equipaggiare un'armatura o uno scudo
    const ArmorWear = getContext<EquipArmor>('WearArmor');
    const ArmorUp = getContext<WearArmor>('CheckArmor');
    function handleDelete(){
        onDelete(requestedData.equipName);
        return;
    }

    let downloadId = "equipaggiamento: "+requestedData.equipName;
</script>

<div id={downloadId} class="bg-white border border-gray-500 h-auto">
    <!-- intestazione tabella -->
    <div class="bg-cafe_noir-700 grid grid-cols-6">
    <p class="col-span-1 px-2 w-25">
        {requestedData.equipName}
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
        <ImageUploader2 padre={downloadId} dimensions={"w-25 h-25 border-r"} fill={true} bind:imageUrl = {equipImageUrl}/>
    </div>
    <div class="flex-1">
        <div class="justify-around bg-cafe_noir-800 flex ">
            {#each requestedData.tableRow as formula}
                <p> {formula} </p>
            {/each}
        </div>
        <hr>
        <div class="px-2 break-words w-150">
            {requestedData.quality}
        </div>
    </div>
</div>
</div>


    <span class="flex flex-row items center justify-between">
        <span class="flex flex-row gap-2">
            <span>
                <button onclick={()=>exportHtmlToImage(downloadId)}>
                    <Fa icon={faDownload} class="cursor-pointer px-2 w-auto"/>
                </button>
            </span>
            
            {#if handleExport}
                <button onclick={handleExport}>
                    <Fa icon={faFileExport} class="cursor-pointer px-2 w-auto"></Fa>
                </button>
            {/if}
            {#if onDelete}
                <span>
                    <button onclick={handleDelete}>
                        <Fa icon={faTrash} class="cursor-pointer px-2 w-auto"></Fa>
                    </button>
                </span>
            {/if}
        </span>
        {#if equip !== null}
            <span class="flex flex-row items-center gap-2">
                <Label for={`equipaggiamento: ${requestedData.equipName} + checkbox`}>Equipaggiato: </Label>
                <Checkbox 
                id={`equipaggiamento: ${requestedData.equipName} + checkbox`} 
                bind:checked={equip} 
                onCheckedChange={
                    
                    (e)=>ArmorWear(requestedData.equipName,e.valueOf())}
                disabled={ArmorUp(requestedData.equipName)}/>
            </span>
             
        {/if}
    </span>