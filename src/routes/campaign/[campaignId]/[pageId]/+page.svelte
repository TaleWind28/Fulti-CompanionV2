<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import RenderPageContent from "$lib/components/utility/renderPageContent.svelte";
    import { user } from "$lib/stores/user";
    import type { PageData } from "./$types";
    let {data} : {data: PageData}  = $props();
    
    let {page , pageId} = $derived(data);
    function addTextBlock(){
        if(!page)return;
        page = {
            ...page,
            content:[
                ...page.content,
                {type:'text',text:'Scrivi'}
            ]
        }
    }

    function textChange(index:number, newText: string){
        page.content[index] = {text:newText,type:'text'};
        page.content = [...page.content];
    
    }

    function removeText(index:number){
        page.content.splice(index,1);

    }
    $inspect(page,"page");
</script>
<div class="bg-cafe_noir-900">
    
<!-- Container principale dove far modificare la pagina-->
<div class="min-h-150 flex flex-col items-center">
    <h1>{data.pageId}</h1>
    <div class="flex flex-col items-start justify-center bg-white gap-5 p-5">
        {#if page}
            {#each page.content as content,i }
                <div class="flex flex-col gap-5">
                    <RenderPageContent 
                        remove = {removeText}
                        index={i}
                        handleImageChange={()=>console.info('image')}
                        handleTextChange={textChange}
                        content={content}
                        />
                    <Separator orientation='horizontal'></Separator>
                </div>
            {/each}    
        {/if}
    </div>
    
    
    <!-- Solo creatore della pagina e Master possono modificarla -->
    {#if page?.ownerId === $user?.uid || page?.masterID ===$user?.uid}
        <span>
            <Button onclick={addTextBlock}> 
                Aggiungi Paragrafo
            </Button>
            <Button onclick={()=>page?.content.push({type:'image',url:'',alt:'image not found'})}>
                Aggiungi Immagine
            </Button>
        </span>
        
    {/if}
</div>

</div>
