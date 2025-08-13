<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import Input from "./ui/input/input.svelte";

    let {
        name,
        pic,
        traits,
        bonds,
        info
    } = $props();



</script>

<div>
    <Card.Root> 
        <Card.Header> 
            <p>Informazioni Generali</p>
        </Card.Header>
        <Card.Content> 
            <Input value={name}/>
        </Card.Content>
    </Card.Root>
</div>