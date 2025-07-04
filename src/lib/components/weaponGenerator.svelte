<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js"        
    import * as Table from "$lib/components/ui/table/index.js";
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
<div class="flex flex-row gap-5">
    <!-- Generatore -->
    <Card.Root class="w-150 bg-cafe_noir-700 border-0">
        <Card.Header class="">
            <Card.Title>Generatore di Armi  </Card.Title>
        </Card.Header>
        <Card.Content class=" py-5 flex flex-col gap-5 bg-white">
            
            <!-- Prima riga: Arma base, Nome e Marziale -->
            <div class="flex flex-row gap-5 items-center justify-between">
                <!-- Arma Base -->
                <span class="flex flex-col gap-2 ">
                    <Label for="arma_base">Arma</Label>
                    <Select.Root type="single" name="arma_base" bind:value>
                        <Select.Trigger class="w-[180px]">
                            {triggerContent}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group >
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
                </span>
                <!-- checkbox marziale -->
                <div class="flex items-center flex-col gap-2">
                    <Label for="martial">Marziale</Label>
                    <Checkbox id="martial"/>
                </div>
                <!-- nome arma -->
                <span class="flex flex-col gap-2 ">
                    <Label for="nome_arma">Nome</Label>
                    <Input type="text" id="nome_arma" placeholder="Nome Arma"/>
                </span>
            </div>

            <!-- Seconda Riga: Tipo di danno, Numero di Mani ed Attributi di precisione  -->
            <div class="flex flex-row gap-5">
                <!-- Tipo di danno -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Tipo di danno</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value>
                        <Select.Trigger class="w-auto min-w-30">
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
                </span>

                <!-- Numero di Mani -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Numero di mani</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value>
                        <Select.Trigger class="w-auto min-w-30">
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
                </span>

                <!-- Prima Caratteristica -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Attr1</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value>
                        <Select.Trigger class="w-auto min-w-30">
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
                </span>

                <!-- Seconda Caratteristica -->
                <span class="flex flex-col gap-2">
                    <Label for="nome_arma">Attr2</Label>
                    <Select.Root type="single" name="favoriteFruit" bind:value>
                        <Select.Trigger class="w-auto min-w-30">
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
                </span>

            </div>

            <!-- Terza Riga: Qualità Standard, Prezzo,Modificatori Precisione e Danno -->
            <div class="flex flex-row justify-between items-center">
                <!-- Qualità Standard -->
                <span class="flex flex-col gap-2">
                    <Label>Qualità</Label>
                    <Select.Root type="single" name="qualità" bind:value>
                    <Select.Trigger class="w-50 min-w-50">
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
                </span>

                <!-- Prezzo -->
                <span class="flex flex-col gap-5 w-30 items-center">
                    <Label for="price">Costo Qualità</Label>
                    <Input id="price" type="number" min="0" class="w-20"/>  
                </span>


                <!-- Modificatori -->
                <div class="flex flex-col gap-2">
                    <Label class="border-0"> Qualità Personalizzata</Label>
                    <!-- Accuracy -->
                    <span class="flex flex-row gap-2">
                        <Checkbox id="damageMod"></Checkbox>
                        <Label for="damageMod">+4 Danno</Label>
                    </span>
                    <!-- Damage -->  
                    <span class="flex flex-row gap-2">
                        <Checkbox id="accuracyMod"></Checkbox>
                        <Label for="accuracymod">+1 Precisione</Label>
                    </span>
                </div>

            </div>
            
            <!-- Quarta riga: Qualità Custom -->
            <div class="flex flex-row gap-30 justify-start w-full">
                <span class="flex flex-col gap-4 w-full">
                    <Label> Qualità Personalizzata</Label>
                    <Textarea >

                    </Textarea>
                </span>
            </div>

        </Card.Content>
    </Card.Root>

    <!-- ImageProcesor -->

    <Table.Root class="bg-white">
        <!-- <Table.Caption>La tua arma</Table.Caption> -->
    <Table.Header class="bg-cafe_noir-700">
        <Table.Row>
        <Table.Head class="w-[100px]">Arma</Table.Head>
        <Table.Head>Costo</Table.Head>
        <Table.Head>Precisione</Table.Head>
        <Table.Head class="text-right">Danno</Table.Head>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        <Table.Row>
        <Table.Cell class="font-medium">INV001</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>Credit Card</Table.Cell>
        <Table.Cell class="text-right">$250.00</Table.Cell>
        </Table.Row>
    </Table.Body>
    </Table.Root>
</div>


