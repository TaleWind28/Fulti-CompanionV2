<script lang="ts">
    import type { Benefits } from "$lib/zod";
    let {
        benefits,
        caller
    } : {
        benefits: Benefits,
        caller:string
    } =  $props();

    type keyType =  keyof typeof benefits;
    const keys: keyType[]= Object.keys(benefits) as keyType[];
    $inspect(benefits, caller);
    const benefitsMessage = [
        `Aumenti permanentemente i tuoi Punti Vita di ${benefits.hp.quantity}`,
        `Aumenti permanentemente i tuoi Punti Mente di ${benefits.mp.quantity}`, 
        `Aumenti permanentemente i tuoi Punti Inventario di ${benefits.ip.quantity}`,
        ]

    const martialMessage = [
        "Puoi Equipaggiare Le Armi da Mischia Marziali",    
        "Puoi Equipaggiare Le Armi a Distanza Marziali",
        `Puoi Equipaggiare Le Armature Marziali`,
        `Puoi Equipaggiare gli Scudi Marziali`
    ]
</script>


<div>
    <ul>
        {#each keys as key, index}
            {#if key !== 'martial' && key !== 'rituals' && key !== 'other'}
                {#if benefits[key].active}
                    <li>
                        <p>{benefitsMessage[index]}</p>
                    </li>
                {/if}
            {/if}
            {#if key === 'martial'}
                {#if benefits[key].weapons.melee}
                   <li>
                        <p>{martialMessage[1]}</p>
                    </li>
                {:else if benefits[key].weapons.ranged}
                    <li>
                        <p>{martialMessage[2]}</p>
                    </li>
                {:else if benefits[key].equipment.armor}
                    <li>
                        <p>{martialMessage[3]}</p>
                    </li>
                {:else if benefits[key].equipment.shields}
                    <li>
                        <p>{martialMessage[4]}</p>
                    </li> 
                {/if}
            {/if}
            {#if key === 'rituals'}
                {#if benefits[key].ritualism}
                    <li>
                        <p>Puoi eseguire Rituali i cui effetti rientrino nella disciplina di Ritualismo</p>
                    </li>
                {/if}
            {/if}
            {#if key === 'other'}
                {#if benefits[key].active}
                    <li>
                        <p>{benefits.other.content}</p>
                    </li>
                 {/if}
            {/if}
        {/each}
    </ul>
</div>