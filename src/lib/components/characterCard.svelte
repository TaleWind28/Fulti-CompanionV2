<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js"; 
    import type { FabulaUltimaCharacter } from "$lib/zod";
    const { character }: { character: FabulaUltimaCharacter & { id: string } } = $props();
    
    $inspect(character);
</script>


<Card.Root> 
    <Card.Header> 
        {character.name}
    </Card.Header>
    <Card.Content> 

    </Card.Content>
    <Card.Footer>

    </Card.Footer>
</Card.Root>



