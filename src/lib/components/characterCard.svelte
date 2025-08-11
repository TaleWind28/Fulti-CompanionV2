<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js"; 
    import type { FabulaUltimaCharacter } from "$lib/zod";
    const { character }: { character: FabulaUltimaCharacter & { id: string } } = $props();
    
</script>

<div>
    <Card.Root> 
        <Card.Header> 
            {character.name}
        </Card.Header>
        <Card.Content> 
            {character.id}
        </Card.Content>
        <Card.Footer>
            <a href="/characters/{character.id}" class="card-link"> premimi</a>
        </Card.Footer>
    </Card.Root>
   
</div>
