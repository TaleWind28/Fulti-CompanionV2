<script lang="ts">
    import Input from "../ui/input/input.svelte";
    import Textarea from "../ui/textarea/textarea.svelte";
    import Label from '$lib/components/ui/label/label.svelte';
    import Button from "../ui/button/button.svelte";
    
    let {
        obj,
        index,
        handleChange,
        superField,
        onDelete
    } = $props();

</script>


<span>
    <Label> Nome </Label>
    <Input
        value={obj.name}
        oninput={(e:Event)=>handleChange(superField,'name',(e.target as HTMLInputElement).value,index)}
    />
</span>

<span>
    <Label> Effetto </Label>
    <Textarea
        value={obj.effect}
        oninput={(e:Event)=>handleChange(superField,'effect',(e.target as HTMLInputElement).value,index)}
    />
</span>

<Button onclick={()=>onDelete(superField,index)}>
    Rimuovi
</Button>