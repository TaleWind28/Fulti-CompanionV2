<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import RenderPageContent from "$lib/components/utility/renderPageContent.svelte";
    import { user } from "$lib/stores/user";
    import { toast } from "svelte-sonner";
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import { blobUrlToBase64 } from "$lib/utils";
    let {data} : {data: PageData}  = $props();
    
    let {page , pageId, campaignId} = $derived(data);
    function addTextBlock(){
        page = {
            ...page,
            content:[
                ...page.content,
                {type:'text',text:'Scrivi'}
            ]
        }
    }

    function addImageBlock(){
        page = {
            ...page,
            content:[
                ...page.content,
                {type:'image',url:'',alt:'image not found'}
            ]
        }
    }

    function textChange(index:number, newText: string){
        page.content[index] = {text:newText,type:'text'};
        page.content = [...page.content];
    }

    async function handleImageChange(index:number,newImg:string){
        if(page.content[index].type !== 'image')return;
        if(newImg.toLowerCase().includes("blob")) newImg =  await blobUrlToBase64(newImg) as string;
        page.content[index].url = newImg;

    }

    function removeText(index:number){
        console.log("rimuovo");
        page.content.splice(index,1);
        //triggera reattività
        page = {
            ...page
        }
        console.log("rimuovo");
    }

    async function save(){
        const response = await fetch(`/api/campaign/${pageId}`,{
            method:'PUT',
            headers:{'Content-type' : 'application/json'},
            body:JSON.stringify({page,campaignId:campaignId})
        })

        if(!response.ok){
            const error = await response.json().catch(()=>({}));
            console.error('Save Failure');
            toast.error(`Errore nel salvataggio: ${error?.message ?? response.statusText}`,{
                action:{
                    label:'OK',
                    onClick:()=>console.info('page modify failed')
                }
            }) 
            return;
            
        }
        await invalidateAll();
        toast.success('Pagina modificata con successo',{
            action:{
                label:'OK',
                onClick:()=>console.info('page modified')
            }
        })
    }

    let wantsToModify = $state(false);

    let canModify = $derived(page.ownerId === $user?.uid || page?.masterId ===$user?.uid);
</script>
<div class="bg-cafe_noir-900">
    
<!-- Container principale dove far modificare la pagina-->
<div class="min-h-150 flex flex-col items-center">
    <h1>{data.pageId}</h1>
    <div class="flex flex-col items-start justify-center bg-white gap-5 p-5">
        <!-- Solo creatore della pagina e Master possono modificarla -->
        {#if canModify}
            <Button onclick={save}>
                Salva
            </Button>
            <span>
                <Label for="want-mod">Modifica</Label>
                <Switch id="want-mod" bind:checked={wantsToModify}/>

            </span>
            
        {/if}
        {#each page.content as content,i }
            <div class="flex flex-col gap-5">
                <RenderPageContent 
                    remove = {removeText}
                    index={i}
                    handleImageChange={handleImageChange}
                    handleTextChange={textChange}
                    content={content}
                    canModify = {canModify && wantsToModify}
                    />
                <Separator orientation='horizontal'></Separator>
            </div>
        {/each}
        {#if page.ownerId === $user?.uid || page?.masterId ===$user?.uid}
            <span class="flex flex-row gap-2">
                <Button onclick={addTextBlock}> 
                    Aggiungi Paragrafo
                </Button>
                <Button onclick={addImageBlock}>
                    Aggiungi Immagine
                </Button>
            </span>   
        {/if}
    </div>
    
    

</div>

</div>
