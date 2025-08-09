<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js"; 
    import type { FabulaUltimaCharacter } from "$lib/zod";
    const { character }: { character: FabulaUltimaCharacter & { id: string } } = $props();
    
    $inspect(character);
</script>

<div>
    <Card.Root> 
        <Card.Header> 
            {character.name}
        </Card.Header>
        <Card.Content> 
            {character.id}
            <a href="/characters/{character.id}"> {character.name}</a>
        </Card.Content>
        <Card.Footer>

        </Card.Footer>
    </Card.Root>
    <a href="/characters/{character.id}" class="card-link"> premimi</a>
</div>
