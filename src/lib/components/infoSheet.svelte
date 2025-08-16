<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import Fa from "svelte-fa";
    import Button from "./ui/button/button.svelte";
    import Input from "./ui/input/input.svelte";
    import Label from "./ui/label/label.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    import { faAward, faCoins, faFeather, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
    import Checkbox from "./ui/checkbox/checkbox.svelte";


    let {
        name,
        pic,
        traits,
        bonds,
        info,
        callbacks
    } = $props();

    let createBondDialog = $state(false);

    let wit = $state("");
   
    let affection = $state(false);
    let admiration = $state(false);
    let loyalty = $state(false);
    let hatred = $state(false);
    let mistrust = $state(false);
    let inferiority = $state(false);

    function handleCreateBond(){
       //dovrei aver creato il legame
        let  b = {
            wit,
            admiration,
            loyalty,
            hatred,
            mistrust,
            inferiority
        }
        //aggiungo il legame
        callbacks.bonds.add(b);

    }

</script>

<div class="flex flex-col gap-5">

    <!-- Informazioni Generali -->
    <Card.Root class="border-0 bg-cafe_noir-800"> 
        <Card.Header class=""> 
            <p>Informazioni Generali</p>
        </Card.Header>
        <Card.Content class="bg-white py-5 flex flex-col gap-5">

            <!-- Primo Riquadro: Nome, Livello, Descrizione-->
            <div class="flex flex-row justify-between">
                <!-- Nome -->
                <span>
                    <label for="name" class="block text-sm font-medium mb-2">Nome</label>
                    <Input 
                        id="name"
                        value={name}
                        oninput={(e) => callbacks.updateField('name', (e.target as HTMLInputElement).value)}
                    />
                </span>

                <!-- Livello -->
                <span class="flex flex-col">
                    <label for="level" class="block text-sm font-medium mb-2">Livello</label>
                    <Input id="level" class="w-20" value={info.level} type="number" oninput={(e) => callbacks.info.update("level",(e.target as HTMLInputElement).value)}/>
                </span>
            </div>

            <!-- Secondo Riquadro: Descrizione -->
            <div class="flex flex-col gap-2">
                <Label>Descrizione</Label>
                <Textarea value={info.description} oninput={(e)=> callbacks.info.update("description",(e.target as HTMLTextAreaElement).value)}></Textarea>
            </div>

            <!--Terzo Riquadro: Punti Fabula, Exp e Zenit -->
            <div class="flex flex-row justify-between items-center">
                <!-- Punti Fabula -->
                <span class="flex flex-row items-center gap-2">
                    <Label>
                        Punti Fabula
                    </Label>
                    <Input class="w-20" value={info.fabulaPoints} oninput={(e)=> callbacks.info.update("fabulaPoints",(e.target as HTMLInputElement).value)} type="number"/>
                        <Fa icon={faFeather} class="text-lion-800"/>
                </span>

                <!-- Punti Esperienza -->
                <span class="flex flex-row items-center gap-2">
                    <Label>
                        Punti Esperienza
                    </Label>
                    <Input class="w-20" value={info.exp} oninput={(e)=> callbacks.info.update("exp",(e.target as HTMLInputElement).value)} type="number"/>
                    {#if info.exp - 10 >= 0}
                        <button class="cursor-pointer" onclick={(e)=>{ callbacks.info.update("level",info.level+1);callbacks.info.update("exp",info.exp-10)}}>
                            <Fa icon={faAward} class=" text-blue-500"/>
                        </button>
                        
                    {:else}
                        <Fa icon={faAward} class=" text-green-900"/>
                    {/if}
                </span>
                
                <!-- Zenit -->
                <span class="flex flex-row items-center gap-2">
                    <Label>
                        Zenit
                    </Label>
                    <Input class="w-20" value={info.zenit} oninput={(e)=> callbacks.info.update("zenit",(e.target as HTMLInputElement).value)} type="number"/>
                    <Fa icon={faCoins} class="text-yellow-500"/>
                </span>
            </div>

        </Card.Content>
    
    </Card.Root>

    <!-- Tratti -->
    <Card.Root class="border-0 bg-cafe_noir-800"> 
        <Card.Header> 
            <p>Tratti</p>
        </Card.Header>
        <Card.Content class="bg-white py-5 flex flex-col gap-5">
            <span class="flex flex-col gap-2">
                <Label>
                    Identità
                </Label>
                <Input value={traits.identity} oninput={(e) => callbacks.traits.update('identity', (e.target as HTMLInputElement).value)}/>
            </span>
            <div class="flex flex-row items-center justify-between">
                <span class="flex flex-col gap-2">
                    <Label>
                        Tema
                    </Label>
                    <Input value={traits.theme} oninput={(e) => callbacks.traits.update('theme', (e.target as HTMLInputElement).value)}/>
                </span>
                <span class="flex flex-col gap-2">
                    <Label>
                        Origine
                    </Label>
                    <Input value={traits.origin} oninput={(e) => callbacks.traits.update('origin', (e.target as HTMLInputElement).value)}/>
                </span>
            </div>
        </Card.Content>
    </Card.Root>

    <!-- Legami -->
    <Card.Root class="border-0 bg-cafe_noir-800"> 
        <Card.Header class="flex flex-row justify-between"> 
            <p>Legami</p>
            <button class="cursor-pointer" onclick={()=>createBondDialog = true}> <Fa icon={faPlusCircle} class="text-2xl text-lion-300"/> </button>
        </Card.Header>
        <Card.Content> 
                
        </Card.Content>
    </Card.Root>

    <Dialog.Root open={createBondDialog} onOpenChange={(v)=> {createBondDialog = v}}> 
        <Dialog.Content class="bg-cafe_noir-600 border-0"> 
            <Dialog.Header> 
                <Dialog.Title class="text-black"> 
                    Inserirsci il nome ed il tipo di Legame che hai con quel personaggio
                </Dialog.Title>
                <Dialog.Description> 
                    <span>
                        <Label>
                            Personaggio
                        </Label>
                        <Input value={wit}/>
                    </span>
                    <span class="grid grid-cols-3 gap-5">
                        <Checkbox checked={affection}/>
                        <Checkbox checked={admiration}/>
                        <Checkbox checked={loyalty}/>
                        <Checkbox checked={hatred}/>
                        <Checkbox checked={mistrust}/>
                        <Checkbox checked={inferiority}/>
                    </span>
                </Dialog.Description>
                <Dialog.Footer> 
                    <Button onclick={handleCreateBond}> Crea Legame </Button>
                </Dialog.Footer>
            </Dialog.Header>
            
        </Dialog.Content> 
    </Dialog.Root>
</div>