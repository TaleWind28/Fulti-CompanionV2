<script lang='ts'>

    
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import damageTypes from '$lib/data/damageTypes.json';
    import Label from '$lib/components/ui/label/label.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import Fa from 'svelte-fa';
    import { faBullseye, faCircleMinus, faKhanda } from '@fortawesome/free-solid-svg-icons';
    

const attributes = ['DES','INT','VIG','VOL']

let {
    index,
    attack,
    removeAttack,
    handleNameChange,
    handleRangeChange,
    handleAttrChange,
    handleTypeChange,
    handleBonusChange,
    handleEffectChange
}= $props();

const triggerAttr1 = $derived(attributes.find(attr=>attr === attack.accuracy.first))
const triggerAttr2 = $derived(attributes.find(attr=>attr === attack.accuracy.second))
const dTrigger = $derived(damageTypes.find(type=> type.value === attack.type)?.label)

</script>


<!-- Container con le info dell'attacco -->
<div class="grid grid-cols-2 ">
    <!-- Lato sx: Nome, Attributi, Tipo di danno e Range -->
    <span class="flex flex-col gap-2">
        <!-- Prima riga: Nome Attacco e Range -->
        <span class="flex flex-row items-center gap-5">
            <!-- Rimozioni Attacco -->
            <button onclick={()=>removeAttack(index)}>
                <Fa icon={faCircleMinus}/>
            </button>
            <!-- Nome Attacco -->
            <span class="flex flex-col items-center gap-2">
                <Label>
                    Nome Attacco
                </Label>
                <Input
                    value={attack.name}
                    placeholder="nome attacco"
                    oninput={(e)=>handleNameChange(index,(e.target as HTMLInputElement).value)}
                />
            </span>
            <!-- Range -->
            <span class="flex flex-col gap-2 items-center">
                <Label>Raggio</Label>
                <!-- Toggle per scegliere se distanza o mischia -->
                <ToggleGroup.Root type="single" value={attack.ranged} onValueChange={(v)=>handleRangeChange(index,v)}> 
                    <!-- Group Melee -->
                    <ToggleGroup.Item value="melee">
                        <!-- Tooltip per far capire all'utente che sta selezionando la mischia -->
                        <Tooltip.Provider>
                            <Tooltip.Root> 
                                <Tooltip.Trigger> 
                                    <Fa icon={faKhanda}></Fa>
                                </Tooltip.Trigger>
                                <Tooltip.Content> 
                                    <p>Mischia</p>
                                </Tooltip.Content>
                            </Tooltip.Root> 
                        </Tooltip.Provider>
                    </ToggleGroup.Item>

                    <!-- Group Ranged -->
                    <ToggleGroup.Item value="ranged">
                        <!-- Tooltip per far capire all'utente che sta selezionando la distanza -->
                        <Tooltip.Provider> 
                            <Tooltip.Root> 
                                <Tooltip.Trigger> 
                                    <Fa icon={faBullseye}></Fa>
                                </Tooltip.Trigger>
                                <Tooltip.Content> 
                                    <p>Distanza</p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider> 
                        
                    </ToggleGroup.Item>
                </ToggleGroup.Root>
            </span>
        </span>
            

        <!-- Seconda Riga: Attributi e Tipo di Danno-->
        <span class="flex flex-row gap-2">

            <!-- Primo Attributo -->
            <span class="flex flex-col gap-2 items-center">
                <Label>Primo Attr</Label>
                <Select.Root  type="single" name="attr1" onValueChange={(v)=>handleAttrChange(v,'first',index)} value={attack.accuracy.first}>
                    <Select.Trigger class="w-auto min-w-15">
                        {triggerAttr1}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Caratteritiche</Select.Label>
                            {#each attributes as attr}
                                <Select.Item
                                    value={attr}
                                    label={attr}
                                >
                                    {attr}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </span>
            
            <!-- Secondo Attributo -->
            <span class="flex flex-col gap-2 items-center">
                <Label>Secondo Attr</Label>
                <Select.Root type="single" name="attr2" onValueChange={(v)=>handleAttrChange(v,'second',index)} value={attack.accuracy.second}>
                    <Select.Trigger class="w-auto min-w-15">
                        {triggerAttr2}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Caratteritiche</Select.Label>
                            {#each attributes as attr}
                                <Select.Item
                                    value={attr}
                                    label={attr}
                                >
                                    {attr}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </span>
            
            <!-- Damage Type -->
            <span class="flex flex-col gap-2 items-center">
                <Label>Tipo</Label>
                <Select.Root type='single' value={attack.type} onValueChange={(v)=>handleTypeChange(v,index)}>
                    <Select.Trigger class=" w-auto min-w-26"> 
                        {dTrigger}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group> 
                            <Select.Label> 
                                Tipo di Danno
                            </Select.Label>
                            {#each damageTypes as type (type.label)}
                                <Select.Item
                                    value={type.value}
                                    label={type.label}
                                > 
                                {type.label} 
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
        </span>
            

        </span>
            <!-- Bonus -->
        <span class="flex flex-row gap-10">
            
            <!-- Accuracy -->
            <span class="flex flex-col w-15 gap-2 items-center">
                <Label> Precisione </Label>
                <Input
                    type='number'
                    value={attack.bonus.accuracy}
                    min={0}
                    oninput={(e)=>handleBonusChange('accuracy',Number((e.target as HTMLInputElement).value),index)}
                />
            </span>

            <!-- Damage -->
            <span class="flex flex-col w-15 gap-2 items-center">
                <Label> Danno </Label>
                <Input
                    type='number'
                    value={attack.bonus.damage}
                    oninput={(e)=>handleBonusChange('accuracy',Number((e.target as HTMLInputElement).value),index)}
                />
            </span>

            
        </span>

    </span>
                        
    <!-- Lato dx: Effetto Secondario dell'attacco -->
    <span class="flex flex-col gap-2 items-center">
        <Label> Effetto Secondario </Label>
        <Textarea 
            value={attack.effect}
            placeholder="Nessun Effetto Aggiuntivo"
            oninput={(e)=>handleEffectChange(index,(e.target as HTMLTextAreaElement).value)}
        />
    </span> 
</div>