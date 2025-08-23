<script lang="ts">
    import { faTrash } from "@fortawesome/free-solid-svg-icons";
    import Input from "./ui/input/input.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    import Fa from "svelte-fa";
    import { getContext } from "svelte";

    let { note } = $props()

    let title = $state(note.title)
    let description = $state(note.description);
    let id = $state(note.id);

    type DeleteNote = (noteId:number)=>boolean;
    type UpdateNote = (noteId:number,field:"description" | "title",value:string)=>boolean;

    const deleteNote = getContext<DeleteNote>('deleteNote');
    const updateNote = getContext<UpdateNote>('updateNote');

</script>

<div class="flex flex-col gap-2">
    <span class="flex flex-row items-center justify-between py-2">
        <Input bind:value={title} class="w-30" oninput={()=>updateNote(id,"title",title)}/>
        <button onclick={()=>deleteNote(id)}>
            <Fa icon={faTrash}/>
        </button>
    </span>
    <Textarea bind:value={description} oninput={()=>updateNote(id,"description",description)}/>
</div>

