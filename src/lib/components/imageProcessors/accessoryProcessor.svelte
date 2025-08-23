<script>
  import { faDownload, faFileExport, faTrash } from "@fortawesome/free-solid-svg-icons";
  import ImageUploader2 from "../imageUploader2.svelte";
  import Fa from "svelte-fa";
  import { exportHtmlToImage } from "$lib/utils";

    let {requestedData, accessoryImageUrl, handleExport = null, onDelete = null} = $props();
    function handleDelete(){
        onDelete(requestedData.accessoryName);
        return;
    }
    let downloadId = "accessory: "+requestedData.accessoryName;
</script>

<div>
            <div id={downloadId} class="bg-white border border-gray-500 h-auto">
                <!-- Intestazione Tabella -->
                <div class="bg-cafe_noir-700 grid grid-cols-5">
                    <p class="col-span-4 px-2">
                        {requestedData.accessoryName}
                    </p>
                    <span class="flex justify-end px-4 gap-30 ">
                        {#each ["COSTO"] as header}
                            <p> {header} </p>
                        {/each}
                    </span>
            </div>

                <!-- Corpo Tabella -->
            <div class="flex">
                    <div class="flex-shrink-0">
                        <ImageUploader2 padre={downloadId} dimensions={"w-20 h-20 border-r"} fill={true} bind:imageUrl = {accessoryImageUrl}/>
                    </div>
                    <div class="flex-1">
                        <div class="items-center justify-end  px-5  bg-cafe_noir-800 flex">
                            <p> {requestedData.price+"z"} </p>
                        </div>
                        <hr>
                        <div class="px-2">
                            {requestedData.quality}
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