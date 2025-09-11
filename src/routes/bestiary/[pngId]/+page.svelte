<script lang="ts">

    import * as Card from '$lib/components/ui/card/index';
    import * as Dialog from '$lib/components/ui/dialog/index';
    import ImageUploader2 from "$lib/components/imageUploader2.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from '$lib/components/ui/label/label.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import StatSheet from '$lib/components/sheets/statSheet.svelte';
    
    let { data } = $props();
    const png = data.png;

    let uploadPicDialog = $state(false);
    let newImageUrl = $state("");

    function updateField(field:string,value:any){
        return;
    }
</script>



<div class="flex m-5 items-center justify-center">
    <!-- Nome, Descrizione Attributi, Livello, Specie -->
    <Card.Root class="flex flex-col w-150"> 
        <Card.Header> 
            
        </Card.Header>
        <Card.Content class="flex flex-col gap-5"> 
            <!-- Primo Blocco: Pic, Nome Livello e Descrizione -->
            <div class="flex flex-row justify-start gap-20">
                <!-- Immagine PNG -->
                <span class="flex flex-col gap-2">
                    <img src={png?.pic} alt="charPic" class="w-40 h-40 border border-black">
                    <Button onclick={()=>uploadPicDialog = true}> Aggiorna Immagine </Button>
                </span>
                <!-- Dialog Modifica Immagine PNG-->
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
                            <Button onclick={()=>{updateField("pic",newImageUrl);uploadPicDialog=false;}}> Aggiorna Immagine </Button>
                        </Dialog.Footer>         
                    </Dialog.Content>
                    
                </Dialog.Root>
                
                <!-- Nome, Livello e descrizione -->
                <div class="flex flex-col w-70 gap-5">
                    <!-- Nome e Livello -->
                    <section class="flex flex-row items-center gap-5">
                        <!-- Nome -->
                        <span class="flex flex-col">
                            <Label for="name" class="block text-sm font-medium mb-2"> 
                                Nome
                            </Label>
                            <Input 
                                id="name"
                                value={png.name}
                                oninput={(e)=> updateField('name',(e.target as HTMLInputElement).value)}
                            />
                        </span>
                        <!-- Livello -->
                        <span class="flex flex-col">
                            <Label for="name" class="block text-sm font-medium mb-2"> 
                                Livello
                            </Label>
                            <Input 
                                id="name"
                                value={png.level}
                                type="number"
                                oninput={(e)=> updateField('level',(e.target as HTMLInputElement).value)}
                            />
                        </span>
                    </section>
                        
                    <!-- Descrizione -->
                    <span class="flex flex-col">
                        <Label for="description" class="block text-sm font-medium mb-2"> 
                            Descrizione
                        </Label>
                        <Textarea 
                            id="description"
                            value={png.description}
                            oninput={(e)=> updateField('description',(e.target as HTMLTextAreaElement).value)}
                        />
                    </span>
                </div>
            </div>

            <Separator orientation="horizontal"/>
            <!-- Secondo Blocco: Affinità -->
            <div>
                <StatSheet
                    affinity={png.affinities}
                    attributes={png.attributes}
                    statuses={png.statuses}
                    callbacks={()=>console.log()}
                /> 
            </div>

            <!-- Attacchi -->
            <div>
            </div> 
            <!-- Incantesmi -->
            <div>
            </div> 
            <!-- Altre Azioni -->
            <div>
            </div>    
            <!-- Regole Speciali -->
            <div>

            </div>
        </Card.Content>    
    </Card.Root>
</div>


