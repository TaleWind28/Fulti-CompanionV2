<script lang="ts">
    import CharacterCard from "../characterCard.svelte";
    import * as Card from "$lib/components/ui/card/index";
    import StatModifier from "../utility/statModifier.svelte";
  import EconomicInfo from "../economicInfo.svelte";
    let { character, callbacks } = $props();

    let hp = $state(0);
    let mp = $state(0);
    let ip = $state(0);
</script>

<div class="flex flex-col gap-5">
    <!-- Scheda Personaggio -->
    <CharacterCard character={character}/> 
    
    <Card.Root class="bg-lion-600 border-0"> 
        <Card.Content class="bg-white flex flex-row gap-5 items-center justify-between py-5">
            <EconomicInfo info={character.info} callbacks={callbacks} /> 
        </Card.Content>
    </Card.Root>

    <!-- Controllo Statistiche -->
    <Card.Root class="bg-lion-600 border-0"> 
        <Card.Header> 
            Modifiche Manuali
        </Card.Header>
        <Card.Content class="bg-white flex flex-row gap-5 items-center justify-between  py-5">
            <StatModifier
                label={"HP"}
                labelColor={"text-black"}
                btnLightColor={"bg-red-400 hover:bg-red-500 text-white"}
                btnDarkColor={"bg-red-700 hover:bg-red-800 text-white"}
                clickFun={callbacks.stats.updateActual}
                field={"HP"}
                inputValue={hp}
            />
            <StatModifier
                label={"MP"}
                labelColor={"text-black"}
                btnLightColor={"bg-blue-400 hover:bg-blue-500 text-white"}
                btnDarkColor={"bg-blue-700 hover:bg-blue-800 text-white"}
                clickFun={callbacks.stats.updateActual}
                field={"MP"}
                inputValue={mp}
            />
            <StatModifier
                label={"IP"}
                labelColor={"text-black"}
                btnLightColor={"bg-green-400 hover:bg-green-500 text-white"}
                btnDarkColor={"bg-green-700 hover:bg-green-800 text-white"}
                clickFun={callbacks.stats.updateActual}
                field={"IP"}
                inputValue={ip}
            />
        </Card.Content>
    </Card.Root>
</div>


