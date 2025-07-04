<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index"        
    import Input from "./ui/input/input.svelte";
    import Checkbox from "./ui/checkbox/checkbox.svelte";
    import Label from "./ui/label/label.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    
    //fetchare db
    const fruits = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grapes", label: "Grapes" },
        { value: "pineapple", label: "Pineapple" }
    ];

    let value = $state("");
    //logica della select
    const triggerContent = $derived(
        fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
    );
</script>

<Card.Root class="w-200">
    <Card.Header>
        <Card.Title>WeaponGenerator</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col gap-5">
        <!-- Prima riga: Arma base, Nome e Marziale -->
        <div class="flex flex-row gap-5">
            <Select.Root type="single" name="favoriteFruit" bind:value>
                <Select.Trigger class="w-[180px]">
                    {triggerContent}
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Fruits</Select.Label>
                        {#each fruits as fruit (fruit.value)}
                            <Select.Item
                            value={fruit.value}
                            label={fruit.label}
                            disabled={fruit.value === "grapes"}
                            >
                                {fruit.label}
                            </Select.Item>
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <!-- checkbox marziale -->
            <div class="flex items-center flex-col ">
                <Label for="martial">Marziale</Label>
                <Checkbox id="martial"/>
    
            </div>
            
            <!-- nome arma -->
            <Input type="text" placeholder="Nome Arma"/>
        </div>
        <!-- Seconda Riga: Tipo di danno, Numero di Mani ed Attributi di precisione  -->
        <div>

        </div>

        <!-- Terza Riga: Qualità Standard, Modificatori Precisione e Danno -->
        <div>

        </div>
        
        <!-- Quarta riga: Qualità Custom e prezzo della Qualità -->
        <div>
            <Textarea>

            </Textarea>
        </div>
    </Card.Content>
</Card.Root>

