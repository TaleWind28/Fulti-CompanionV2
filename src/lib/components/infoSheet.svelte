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
    import { toast } from "svelte-sonner";
    import Bond from "./bond.svelte";
    import ImageUploader2 from "./imageUploader2.svelte";


    let {
        name,
        pic,
        traits,
        bonds,
        info,
        callbacks
    } = $props();

    let createBondDialog = $state(false);

    let uploadPicDialog = $state(false);

    let wit = $state("");
   
    let affection = $state(false);
    let admiration = $state(false);
    let loyalty = $state(false);

    let hatred = $state(false);
    let mistrust = $state(false);
    let inferiority = $state(false);

    function handleCreateBond(){

        //controllo che il nome del personaggio sia presente
        if(wit === ""){
            toast.error('devi inserire il Personaggio con cui vuoi formare un legame',{action:{label:"OK",onClick:()=>console.info("Undo")}});
            return;
        }
        
        //controllo che almeno un legame sia selezionato
        if( !affection && !hatred && !admiration && !inferiority && !loyalty && !mistrust){
            toast.error('Devi scegliere almeno un legame',{action:{label:"OK",onClick:()=>console.info("Undo")}});
            return;
        }

        //creo il legame
        let  b = {
            with:wit,
            affection,
            admiration,
            loyalty,
            hatred,
            mistrust,
            inferiority
        }

        //aggiungo il legame
        callbacks.bonds.add(b);

        //resetto i campi dell'oggetto
        affection = false;
        admiration = false;
        loyalty = false;
        hatred = false;
        mistrust = false;
        inferiority = false;
        wit = "";

        //chiudo il dialog
        createBondDialog = false;

    }
    let characterImage = pic ;
    let newImageUrl = $state("");
    $inspect(uploadPicDialog,"dialog");

</script>

<div class="flex flex-col gap-5">

    <!-- Informazioni Generali -->
    <Card.Root class="border-0 bg-cafe_noir-800"> 
        <Card.Header class=""> 
            <p>Informazioni Generali</p>
        </Card.Header>
        <Card.Content class="bg-white py-5 flex flex-col gap-5">
            <div class="flex flex-row justify-start gap-30">
                <!-- Immagine Personaggio e pulsante per aggiornarla -->
                <span class="flex flex-col gap-5">
                    <img src={characterImage} alt="charPic" class="w-40 h-40 border border-black">
                    <Button onclick={()=>uploadPicDialog = true}> Aggiorna Immagine </Button>
                </span>

                <Dialog.Root open={uploadPicDialog} onOpenChange={(v)=> {uploadPicDialog = v}}> 
                     <Dialog.Content class="bg-cafe_noir-700 border-0"> 
                        <Dialog.Header> 
                            <Dialog.Title class="text-black"> 
                               Premi sull'immagine per caricarne una locale oppure usa una URL
                            </Dialog.Title>                
                        </Dialog.Header>
                        <div class="bg-cafe_noir-900 border items-center justify-center flex">
                            <ImageUploader2
                                bind:imageUrl={newImageUrl}
                                padre="myUploader"
                                allowUrlInput={true}
                                placeholder="Inserisci URL immagine..."
                                dimensions="w-64 h-64"
                                showButtons={true}
                                showDeletion={true}
                            />
                        </div> 
                            
                             
                        <Dialog.Footer class="flex items-center justify-center "> 
                            <Button onclick={()=>{callbacks.updateField("pic",newImageUrl);uploadPicDialog=false;}}> Aggiorna Immagine </Button>
                        </Dialog.Footer>         
                    </Dialog.Content>
                    
                </Dialog.Root>

                <!-- Primo Riquadro: Nome, Livello, Descrizione-->
                <span class="flex flex-col gap-5">
                    <!-- Nome e Livello -->
                    <div class="flex flex-row justify-between gap-5">
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

                    <!-- Descrizione -->
                    <div class="flex flex-col gap-2">
                        <Label>Descrizione</Label>
                        <Textarea value={info.description} oninput={(e)=> callbacks.info.update("description",(e.target as HTMLTextAreaElement).value)}></Textarea>
                    </div>
                </span>
                
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
        <Card.Content class="flex flex-col gap-7"> 
            {#each bonds as bond,i }
                <Bond bond={bond} updateBond={callbacks.bonds.update} removeBond={callbacks.bonds.remove} id={i}> 

                </Bond>
            {/each}
                
        </Card.Content>
    </Card.Root>

    <!-- Creazione Legame -->
    <Dialog.Root open={createBondDialog} onOpenChange={(v)=> {createBondDialog = v}}> 
        <Dialog.Content class="bg-cafe_noir-700 border-0"> 
            <Dialog.Header> 
                <Dialog.Title class="text-black"> 
                    Inserirsci il nome del Personaggio ed il tipo di Legame che vuoi avere con lui
                </Dialog.Title>
                <Dialog.Description class="flex gap-5 items-center justify-evenly"> 
                    <span class="flex flex-col gap-5">
                        <Label class="text-black">
                            Personaggio
                        </Label>
                        <Input bind:value={wit}/>
                    </span>
                    <span class="grid grid-cols-3 gap-5">
                        <span class="flex flex-col items-center gap-2">
                            <Label class="text-black">Affetto</Label>
                            <Checkbox bind:checked={affection} disabled={hatred}/>
                        </span>

                        <span class="flex flex-col items-center gap-2">
                            <Label class="text-black">Ammirazione</Label>
                            <Checkbox bind:checked={admiration} disabled={inferiority}/>
                        </span>

                        <span class="flex flex-col items-center gap-2">
                            <Label class="text-black">Lealtà</Label>
                            <Checkbox bind:checked={loyalty} disabled={mistrust}/>
                        </span>

                        <span class="flex flex-col items-center gap-2">
                            <Label class="text-black">Odio</Label>
                            <Checkbox bind:checked={hatred} disabled={affection}/>
                        </span>

                        <span class="flex flex-col items-center gap-2">
                            <Label class="text-black">Inferiorità</Label>
                            <Checkbox bind:checked={inferiority} disabled={admiration}/>
                        </span>

                        <span class="flex flex-col items-center gap-2">
                            <Label class="text-black">Sfiducia</Label>
                            <Checkbox bind:checked={mistrust} disabled={loyalty}/>
                        </span>
                    </span>
                </Dialog.Description>

                <Dialog.Footer class="flex items-center justify-centerS"> 
                    <Button onclick={handleCreateBond}> Crea Legame </Button>
                </Dialog.Footer>
            </Dialog.Header>
            
        </Dialog.Content> 
    </Dialog.Root>
</div>