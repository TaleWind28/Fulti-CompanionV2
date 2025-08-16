<script lang="ts">
    import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
    import Checkbox from "./ui/checkbox/checkbox.svelte";
    import Input from "./ui/input/input.svelte";
    import Label from "./ui/label/label.svelte";
    import Fa from "svelte-fa";

    let {bond,updateBond,id,removeBond} = $props();
</script>

<div class="flex flex-row items-center justify-center gap-10">
    <span class="flex flex-row gap-2 items-center">
        <button onclick={()=>removeBond(id)}><Fa icon={faMinusCircle} class="text-2xl text-lion-300 cursor-pointer"/></button>
        <Input value={bond.with} class="w-30" oninput={(e)=> updateBond(id,"with",(e.target as HTMLInputElement).value)}/>
    </span>
    
    <span class="grid grid-cols-3 gap-2">
        <span class="flex flex-col items-center gap-2">
            <Label class="text-black">Affetto</Label>
            <Checkbox checked={bond.affection} disabled={bond.hatred} onCheckedChange={(checked)=> updateBond(id,"affection",checked)}></Checkbox>
        </span>

        <span class="flex flex-col items-center gap-2">
            <Label class="text-black">Ammirazione</Label>
            <Checkbox checked={bond.admiration} disabled={bond.inferiority} onCheckedChange={(checked)=> updateBond(id,"admiration",checked)}></Checkbox>
        </span>

        <span class="flex flex-col items-center gap-2">
            <Label class="text-black">Lealtà</Label>
            <Checkbox checked={bond.loyalty} disabled={bond.mistrust} onCheckedChange={(checked)=> updateBond(id,"loyalty",checked)}></Checkbox>
        </span>

        <span class="flex flex-col items-center gap-2">
            <Label class="text-black">Odio</Label>
            <Checkbox checked={bond.hatred} disabled={bond.affection} onCheckedChange={(checked)=> updateBond(id,"hatred",checked)}></Checkbox>
        </span>

        <span class="flex flex-col items-center gap-2">
            <Label class="text-black">Inferiorità</Label>
            <Checkbox checked={bond.inferiority} disabled={bond.admiration} onCheckedChange={(checked)=> updateBond(id,"inferiority",checked)}></Checkbox>
        </span>

        <span class="flex flex-col items-center gap-2">
            <Label class="text-black">Sfiducia</Label>
            <Checkbox checked={bond.mistrust} disabled={bond.loyalty} onCheckedChange={(checked)=> updateBond(id,"mistrust",checked)}></Checkbox>
        </span>
    </span>
</div>