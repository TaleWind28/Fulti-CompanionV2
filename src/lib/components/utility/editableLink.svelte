<script lang="ts">
    import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
    import Input from "../ui/input/input.svelte";
    import Fa from "svelte-fa";

    let {
        modify,
        listContent,
        title
    } = $props();

    //mantenere funzione ma fare una fetch per generare una nuova pagina sul db
    function updateItem(index: number, newValue: string, field:"name" | "link") {
        listContent[index][field] = newValue;
        listContent = [...listContent]; // Triggera la reattività
    }

    function add(){
        listContent.push({name:"Aggiungi elemento",link:"link"});
        listContent = [...listContent];
    }

    function remove(i:number){
        listContent.splice(i,1)
        listContent = [...listContent];
    }

    $inspect(listContent);
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
                        oninput={(e)=>updateItem(i,(e.target as HTMLInputElement).value,"name")}
                    />
                    <Input
                        class="w-full" 
                        value={listContent[i].link} 
                        oninput={(e)=>updateItem(i,(e.target as HTMLInputElement).value,"link")}
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
    {#if modify}
            <button onclick={add}>
                <Fa icon={faPlus}/>
            </button>
    {/if}
</ul>