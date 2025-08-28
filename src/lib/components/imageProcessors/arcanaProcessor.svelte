<script lang="ts">
    import { exportHtmlToImage } from "$lib/utils";
    import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
    import ImageUploader2 from "../imageUploader2.svelte";
    import Fa from "svelte-fa";

    let {requestedData, arcanaImageUrl, rework} = $props();


    function handleExport(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        throw new Error("Function not implemented.");
    }
</script>

    <!-- ImageProcessor -->
    <div>
        <!-- Immagine Scaricabile-->
        <div id="arcanum" class="bg-white border-black h-auto">

            <div class="flex">
                <div class="flex-shrink-0">
                    <ImageUploader2 padre="arcanumGenerator" dimensions={"w-20 h-20 border-r border-b"} fill={true} bind:imageUrl = {arcanaImageUrl}/>
                </div>
                <div class="flex-1">
                    <div class="bg-cafe_noir-700">
                        {requestedData.arcanaName}
                    </div>
                    <div class="items-center justify-start px-2 bg-cafe_noir-800 flex w-150 break-words">
                        {requestedData.description}
                    </div>
                    <hr>
                    <div class="px-2">
                        {requestedData.domain}
                    </div>
                </div>
            </div>


            <!-- Fusione -->
            <div>
                <span class="flex flex-row">
                    <p class="bg-cafe_noir-700 text-white w-auto px-2">
                        Fusione
                    </p>
                    <p class="bg-cafe_noir-800 w-full px-2">
                        {requestedData.fusionName}
                    </p>
                </span>
                    <div class="px-2 break-words w-150">
                        {requestedData.fusionEffect}
                    </div>
            </div>

            <!-- Impulso -->
            {#if rework}
                <div>
                    <span class="flex flex-row">
                        <p class="bg-cafe_noir-700 text-white w-auto px-2">
                            Impulso
                        </p>
                        <p class="bg-cafe_noir-800 w-full px-2">
                            {requestedData.impulseName}
                        </p>
                    </span>
                    <div class="px-2 break-words w-150">
                        {requestedData.impulseEffect}
                    </div>
                </div>
            {/if}

            <!-- Congedo -->
            <div>
                <span class="flex flex-row">
                    <p class="bg-cafe_noir-700 text-white w-auto px-2">
                        Congedo
                    </p>
                    <p class="bg-cafe_noir-800 w-full">
                        {requestedData.dismissalName}
                    </p>
                </span>
                <div class="px-2 break-words w-150">
                    {requestedData.dismissalEffect}
                </div>            
            </div>
            
        </div>

        <!-- Pulsanti Azione -->
        <span class="flex flex-row">
            <span>
                <button onclick={()=>exportHtmlToImage('arcanum')}>
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