<script lang="ts">

    import Input from "../ui/input/input.svelte";
    import Button from "../ui/button/button.svelte";
    import Label from "../ui/label/label.svelte";

    let {
        label,
        labelColor,
        btnDarkColor,
        btnLightColor,
        clickFun, 
        inputValue = $bindable(), 
        field
    } = $props();
</script>

<div class="flex flex-col">
        <Label class={labelColor}> {label} </Label>
        <div class="flex flex-row items-center gap-2">
            <Input 
                type="number" 
                bind:value={inputValue} 
                class="w-20"
            />
            <span class="flex flex-col gap-2 items-center justify-center">
                <Button class={btnDarkColor} onclick={()=>clickFun(inputValue,field)}>Recupera</Button>
                <Button class={btnLightColor} onclick={()=>clickFun(-inputValue,field)}>Subisci</Button>
            </span>
        </div>
    </div>