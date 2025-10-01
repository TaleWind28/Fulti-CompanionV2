 <script lang="ts">
  import { faAward, faCoins, faFeather } from "@fortawesome/free-solid-svg-icons";
  import Input from "./ui/input/input.svelte";
  import Label from "./ui/label/label.svelte";
  import Fa from "svelte-fa";

 let {
    info,
    callbacks
 } = $props()

 </script>
 
 <div class="flex flex-row justify-evenly items-center gap-10">
    <!-- Punti Fabula -->
    <span class="flex flex-row items-center gap-2">
        <Label>
            Punti Fabula
        </Label>
        <Input class="w-20" value={info.fabulaPoints} oninput={(e)=> callbacks.info.update("fabulaPoints",(e.target as HTMLInputElement).value)} type="number"/>
            <Fa icon={faFeather} class="text-lion-800"/>
    </span>

    <!-- Punti Esperienza -->
    <span class="flex flex-row items-center gap-2">
        <Label>
            Punti Esperienza
        </Label>
        <Input class="w-20" value={info.exp} oninput={(e)=> callbacks.info.update("exp",(e.target as HTMLInputElement).value)} type="number"/>
        {#if info.exp - 10 >= 0}
            <button class="cursor-pointer" onclick={(e)=>{ callbacks.info.update("level",info.level+1);callbacks.info.update("exp",info.exp-10)}}>
                <Fa icon={faAward} class=" text-blue-500"/>
            </button>
            
        {:else}
            <Fa icon={faAward} class=" text-green-900"/>
        {/if}
    </span>
    
    <!-- Zenit -->
    <span class="flex flex-row items-center gap-2">
        <Label>
            Zenit
        </Label>
        <Input class="w-20" value={info.zenit} oninput={(e)=> callbacks.info.update("zenit",(e.target as HTMLInputElement).value)} type="number"/>
        <Fa icon={faCoins} class="text-yellow-500"/>
    </span>
</div>