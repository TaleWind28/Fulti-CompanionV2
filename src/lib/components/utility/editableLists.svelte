<script lang="ts">
    import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
    import Input from "../ui/input/input.svelte";
    import Fa from "svelte-fa";

    let {
        modify,
        listContent,
        title
    } = $props();

    function updateItem(index: number, newValue: string) {
        listContent[index] = newValue;
        listContent = [...listContent]; // Triggera la reattività
        console.info("updated,list")
    }

    function add(){
        listContent.push("Aggiungi elemento");
        listContent = [...listContent];
    }

    function remove(i:number){
        listContent.splice(i,1)
        listContent = [...listContent];
    }
</script>

<p>{title}</p>
<ul>
    {#each listContent as item, i}
        {#if modify}
            <span class="flex flex-row justify-between">
                <Input
                    class="w-full" 
                    value={listContent[i]} 
                    oninput={(e)=>updateItem(i,(e.target as HTMLInputElement).value)}
                />
                <button onclick={()=>remove(i)}>
                    <Fa icon={faMinus}/>
                </button>
            </span>
            
        {:else}
            <li>{item}</li>
        {/if}
    {/each}
    {#if modify}
            <button onclick={add}>
                <Fa icon={faPlus}/>
            </button>
    {/if}
</ul>

