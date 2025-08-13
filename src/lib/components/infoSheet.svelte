<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import Input from "./ui/input/input.svelte";

    let {
        character = $bindable(),
    } = $props();

    $inspect("character infosheet",character)

</script>

<div>
    <Card.Root> 
        <Card.Header> 
            <p>Informazioni Generali</p>
        </Card.Header>
        <Card.Content> 
            <Input bind:value={character.name}/>
        </Card.Content>
    </Card.Root>
</div>