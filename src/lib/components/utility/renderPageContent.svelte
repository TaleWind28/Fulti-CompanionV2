<script lang="ts">
    import type { Block } from "$lib/zodPages";
    import { fa } from "zod/v4/locales";
    import ImageUploader2 from "../imageUploader2.svelte";
    import Textarea from "../ui/textarea/textarea.svelte";
    import { faMinus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    let {
        content = $bindable(), 
        handleTextChange, 
        handleImageChange,
        remove,
        canModify,
        index
    } 
    : {
        content:Block,
        remove:any 
        handleTextChange:any, 
        handleImageChange:any, 
        index:number,
        canModify:boolean
    
    } = $props();

   
</script>

<div class="flex flex-row gap-2 ">
    {#if content.type === 'text'}
        {#if canModify}
            <Textarea value={content.text} oninput={(e)=>handleTextChange(index,(e.target as HTMLTextAreaElement).value)} class="w-300">

            </Textarea>
            <button onclick={()=>remove(index)}>
                <Fa icon={faMinusCircle}/>
            </button>
        {:else}
            <p class="w-300">
                {content.text}
            </p>
        {/if}
    {/if}
    <!-- {#if content.type === 'image'}
        {#if canModify}
            <ImageUploader2 
                bind:imageUrl={content.url} 
                allowUrlInput={true}
                showButtons = {true}
                showDeletion = {true}
                padre={content.type+index}
                />
            <button onclick={()=>remove(index)}>
                <Fa icon={faMinusCircle}/>
            </button>
        {:else}
            <img 
                src={content.url}
                alt={content.alt}
            />
        {/if}
    {/if} -->
</div>