<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import Input from "./ui/input/input.svelte";

    let {
        name,
        pic,
        traits,
        bonds,
        info,
        onUpdate
    } = $props();

     function updateName(newName: string) {
        onUpdate('name', newName);
    }

    function updateTraits(newTraits: any) {
        onUpdate('traits', newTraits);
    }

    function updateBonds(newBonds: any) {
        onUpdate('bonds', newBonds);
    }

    function updateInfo(newInfo: any) {
        onUpdate('info', newInfo);
    }

</script>

<div>
    <Card.Root> 
        <Card.Header> 
            <p>Informazioni Generali</p>
        </Card.Header>
        <Card.Content> 
            <div class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium mb-2">Nome</label>
                    <Input 
                        id="name"
                        value={name}
                        oninput={(e) => updateName((e.target as HTMLInputElement).value)}
                    />
                </div>
                
                <div>
                    <label for="traits" class="block text-sm font-medium mb-2">Tratti</label>
                    <Input 
                        id = "traits"
                        value={traits || ''}
                        oninput={(e) => updateTraits((e.target as HTMLInputElement).value)}
                        placeholder="Inserisci i tratti del personaggio"
                    />
                </div>
                
                <div>
                    <label for = "bonds" class="block text-sm font-medium mb-2">Legami</label>
                    <Input 
                        id="bonds"
                        value={bonds || ''}
                        oninput={(e) => updateBonds((e.target as HTMLInputElement).value)}
                        placeholder="Inserisci i legami del personaggio"
                    />
                </div>
                
                <div>
                    <label for="info" class="block text-sm font-medium mb-2">Informazioni</label>
                    <textarea 
                        id="info"
                        class="w-full p-2 border rounded-md"
                        value={info || ''}
                        oninput={(e) => updateInfo((e.target as HTMLTextAreaElement).value)}
                        placeholder="Inserisci informazioni aggiuntive"
                        rows="4"
                    ></textarea>
                </div>
            </div>
        </Card.Content>
    </Card.Root>
</div>