<script lang="ts">
    import CharacterCard from "../characterCard.svelte";
    import * as Card from "$lib/components/ui/card/index";
    import { toast } from "svelte-sonner";

  import { ca } from "zod/v4/locales";
  import StatModifier from "../utility/statModifier.svelte";
    let { character, callbacks } = $props();

    let hp = $state(0);
    let mp = $state(0);
    let ip = $state(0);
</script>

<div class="flex flex-col gap-5">
    <!-- Scheda Personaggio -->
    <CharacterCard character={character}/> 
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

            <!-- {@render actionSection("HP","text-black","bg-red-400 hover:bg-red-500 text-white","bg-red-700 hover:bg-red-800 text-white",callbacks.stats.updateActual,"HP")}
            {@render actionSection("MP","text-black","bg-blue-400 hover:bg-blue-500 text-white","bg-blue-700 hover:bg-blue-800 text-white",callbacks.stats.updateActual,"MP")}
            {@render actionSection("IP","text-black","bg-green-400 hover:bg-green-500 text-white","bg-green-700 hover:bg-green-800 text-white",callbacks.stats.updateActual,"IP")} -->
        </Card.Content>
    </Card.Root>
</div>


