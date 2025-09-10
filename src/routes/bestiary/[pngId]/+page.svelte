<script lang="ts">

    import * as Card from '$lib/components/ui/card/index';
    import * as Dialog from '$lib/components/ui/dialog/index';
    import ImageUploader2 from "$lib/components/imageUploader2.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from '$lib/components/ui/label/label.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    
    let { data } = $props();
    const png = data.png;

    let uploadPicDialog = $state(false);
    let newImageUrl = $state("");

    function updateField(field:string,value:any){
        return;
    }
</script>



<div class="flex flex-col mx-50 my-10 gap-5">
    <!-- Nome, Descrizione Attributi, Livello, Specie -->
    <Card.Root> 
        <Card.Header> 
            
        </Card.Header>
        <Card.Content> 
            <!-- Immagine PNG -->
            <span>
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
            <div class="flex flex-row justify-between gap-5">
                <Label for="name" class="block text-sm font-medium mb-2"> 
                    Nome
                </Label>
                <Input 
                    id="name"
                    value={png.name}
                />
            
            </div>
        </Card.Content>    
    </Card.Root>

    <!-- Affinità -->
     <Card.Root> 
        <Card.Header> 

        </Card.Header>
        <Card.Content> 

        </Card.Content>    
    </Card.Root>

    <!-- Attacchi -->
     <Card.Root> 
        <Card.Header> 

        </Card.Header>
        <Card.Content> 

        </Card.Content>    
    </Card.Root>
    <!-- Incantesmi -->
     <Card.Root> 
        <Card.Header> 

        </Card.Header>
        <Card.Content> 

        </Card.Content>    
    </Card.Root>
    <!-- Altre Azioni -->
     <Card.Root> 
        <Card.Header> 

        </Card.Header>
        <Card.Content> 

        </Card.Content>    
    </Card.Root>
    <!-- Regole Speciali -->
     <Card.Root> 
        <Card.Header> 

        </Card.Header>
        <Card.Content> 

        </Card.Content>    
    </Card.Root>
</div>


