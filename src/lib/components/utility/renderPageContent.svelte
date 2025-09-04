<script lang="ts">
    import type { Block } from "$lib/zodPages";
    import { fa } from "zod/v4/locales";
    import ImageUploader2 from "../imageUploader2.svelte";
    import Textarea from "../ui/textarea/textarea.svelte";
    import { faMinus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    let {
        content, 
        handleTextChange, 
        handleImageChange,
        remove,
        
        index
    } 
    : {
        content:Block,
        remove:any 
        handleTextChange:any, 
        handleImageChange:any, 
        index:number,
    
    } = $props();

    
</script>

<div class="flex flex-row gap-2 ">
    {#if content.type === 'text'}
        <Textarea value={content.text} oninput={(e)=>handleTextChange(index,(e.target as HTMLTextAreaElement).value)} class="w-200">

        </Textarea>
        <button onclick={()=>remove(index)}>
            <Fa icon={faMinusCircle}/>
        </button>
    {:else if content.type === 'image'}
        <ImageUploader2 
            imageUrl={content.url} 
            allowUrlInput={true}
            showButtons = {true}
            showDeletion = {true}
            />
        <button onclick={()=>remove(index)}>
            <Fa icon={faMinusCircle}/>
        </button>
    {/if}
</div>