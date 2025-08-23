<script>
    import { faTrash } from "@fortawesome/free-solid-svg-icons";
    import Input from "./ui/input/input.svelte";
    import Textarea from "./ui/textarea/textarea.svelte";
    import Fa from "svelte-fa";

    let { note, modifyTitle, modifyDesription, onDelete } = $props()

    let {title,description, id} = note;

    function handleTitleChange(){
        modifyTitle(title,id);
    }

    function handleDescriptionChange(){
        modifyDesription(description,id);
    }

    function handleDelete(){
        onDelete(id);
    }

</script>

<div class="flex flex-col gap-2">
    <span class="flex flex-row items-center justify-between">
        <Input value={title} class="w-30" oninput={handleTitleChange}/>
        <button onclick={handleDelete}>
            <Fa icon={faTrash}/>
        </button>
    </span>
    <Textarea value={description} oninput={handleDescriptionChange}/>
</div>

