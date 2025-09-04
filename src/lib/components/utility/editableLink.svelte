<script lang="ts">
    import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
    import Input from "../ui/input/input.svelte";
    import Fa from "svelte-fa";

    let {
        modify,
        listContent,
        title,
        allowedToModify = false,
        add,
        remove,
        auxiliaryUpdate
    } = $props();

    //mantenere funzione ma fare una fetch per generare una nuova pagina sul db
    function updateItem(index: number, newValue: string) {
        if(auxiliaryUpdate){
            let retVal = auxiliaryUpdate(listContent[index].name,newValue)
            if(!retVal) return;
        }
        listContent[index].name = newValue;
        
        listContent = [...listContent]; // Triggera la reattività
    }
</script>

<p>{title}</p>
<ul>
    {#each listContent as item, i}
        {#if modify}
            <span class="flex flex-row justify-between">
                <span class="flex flex-col">
                    <Input
                        class="w-full" 
                        value={listContent[i].name} 
                        oninput={(e)=>updateItem(i,(e.target as HTMLInputElement).value)}
                    />
                </span>
                <button onclick={()=>remove(i)}>
                    <Fa icon={faMinus}/>
                </button>
            </span>
            
        {:else}
            <li>
                <a href={item.link}>
                    {item.name}
                </a>
            </li>
        {/if}
    {/each}
    {#if modify || allowedToModify}
            <button onclick={add}>
                <Fa icon={faPlus}/>
            </button>
    {/if}
</ul>