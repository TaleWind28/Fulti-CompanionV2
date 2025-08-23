<script lang="ts">
    import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
    import Note from "../note.svelte";
    import * as Card from "../ui/card/index";
    import * as Dialog from "../ui/dialog/index";
    import Fa from "svelte-fa";
    import Input from "../ui/input/input.svelte";
    import Textarea from "../ui/textarea/textarea.svelte"
    import Button from "../ui/button/button.svelte";
    import { toast } from "svelte-sonner";
    import Label from "../ui/label/label.svelte";
    import type { Notes } from "$lib/zod";
    
    let { notes }:{notes:Notes[], callback:any} = $props();
    
    let openCreateNote = $state(false);
    let noteDescription = $state("");
    let noteTitle = $state("");

    function handleCreation(){
        if(noteTitle===""){
            toast.error("La nota deve avere un titolo",{
                action:{
                    label:"OK",
                    onClick:()=>console.info("undo")
                }
            })
            return;
        }

        if(noteDescription===""){
            toast.error("La nota deve avere una descrizione",{
                action:{
                    label:"OK",
                    onClick:()=>console.info("undo")
                }
            })
            return;
        }

        notes.push({title:noteTitle,description:noteDescription,id:notes.length});
        noteTitle = "";
        noteDescription = "";
        openCreateNote = false;
    }
</script>

<div>
    <Card.Root class="bg-cafe_noir-700 border-0">
        <Card.Header class="text-white text-xl flex flex-row justify-between"> 
            <p>NOTE</p>
            <button onclick={()=>openCreateNote = true}>
                <Fa icon={faPlusCircle}/>
            </button>
            
        </Card.Header>
        <Card.Content class="flex flex-col gap-5 bg-white"> 
            {#each notes as note }
                <Note note={note}/>
                <hr>
            {/each}
        </Card.Content>    
        
    </Card.Root>
</div>

<Dialog.Root open={openCreateNote} onOpenChange={(v)=> openCreateNote=v}> 
   
    <Dialog.Content class="bg-white flex flex-col gap-2 border-0"> 
        <Dialog.Header class=""> 
            <p class="text-black">Crea una nota</p>
        </Dialog.Header>
            <span class="flex flex-col gap-2">
                <Label>Titolo</Label>
                <Input bind:value={noteTitle}/>
            </span>
            
            <span class="flex flex-col gap-2">
                <Label>Descrizione</Label>
                <Textarea bind:value={noteDescription}/>
            </span>
        <Dialog.Footer> 
            <Button onclick={handleCreation}> 
                Crea
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>