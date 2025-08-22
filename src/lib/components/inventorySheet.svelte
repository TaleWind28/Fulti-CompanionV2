<script lang="ts">
    import Button from "./ui/button/button.svelte";
    import * as Card from "./ui/card/index";
    let {weapons, shields, armor, accessories} = $props();
    let openWeaponCreator = $state(false);
    let openArmorCreator = $state(false);
    let openShieldCreator = $state(false);
    let openAccessoryCreator = $state(false);
</script>

<div>
    <!-- ActionBar per creare Armi ed Equipaggiamento -->
    <Card.Root> 
        <Card.Header> 
            Azioni Rapide
        </Card.Header>
        <Card.Content> 
            <Button onclick={()=>openWeaponCreator = true}> 
                Aggiungi un'Arma
            </Button>
            <Button onclick={()=>openArmorCreator = true}> 
                Aggiungi un'armatura
            </Button>
            <Button onclick={()=>openShieldCreator = true}> 
                Aggiungi uno scudo
            </Button>
            <Button onclick={()=>openAccessoryCreator = true}> 
                Aggiungi un'accessorio
            </Button>
        </Card.Content>
    </Card.Root> 
</div>