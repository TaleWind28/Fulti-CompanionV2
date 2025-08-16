<script lang="ts">
    import Checkbox from "./ui/checkbox/checkbox.svelte";
    import Input from "./ui/input/input.svelte";
    import Label from "./ui/label/label.svelte";

    let {bond,updateBond,id} = $props();
</script>

<div>
    <span>
        <Label>
            {bond.with}
        </Label>
        <Input value={bond.with} oninput={(e)=> updateBond(id,"with",(e.target as HTMLInputElement).value)}/>
    </span>
    <span>
        <Checkbox checked={bond.affection} onCheckedChange={(checked)=> updateBond(id,"affection",checked)}></Checkbox>
        <Checkbox checked={bond.admiration} onCheckedChange={(checked)=> updateBond(id,"admiration",checked)}></Checkbox>
        <Checkbox checked={bond.loyalty} onCheckedChange={(checked)=> updateBond(id,"loyalty",checked)}></Checkbox>
        <Checkbox checked={bond.hatred} onCheckedChange={(checked)=> updateBond(id,"hatred",checked)}></Checkbox>
        <Checkbox checked={bond.mistrust} onCheckedChange={(checked)=> updateBond(id,"mistrust",checked)}></Checkbox>
        <Checkbox checked={bond.inferiority} onCheckedChange={(checked)=> updateBond(id,"inferiority",checked)}></Checkbox>
    </span>
</div>