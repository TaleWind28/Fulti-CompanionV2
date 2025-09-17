<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import DatePicker from '$lib/components/datePicker.svelte';
    import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import Switch from '$lib/components/ui/switch/switch.svelte';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import EditableLink from '$lib/components/utility/editableLink.svelte';
    import EditableLists from '$lib/components/utility/editableLists.svelte';
    import { blobUrlToBase64, isoToDateValue } from '$lib/utils.js';
    import { FabulaUltimaCharacterScheme, type Campaign } from '$lib/zod.js';
    import { getLocalTimeZone, type DateValue } from '@internationalized/date';
    import { toast } from 'svelte-sonner';
    import Input from '$lib/components/ui/input/input.svelte';
    import type { Page } from '$lib/zodPages.js';
    import { faArrowUpRightFromSquare, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import ImageUploader2 from '$lib/components/imageUploader2.svelte';
    import * as Tooltip from '$lib/components/ui/tooltip/index.js';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import * as Select from '$lib/components/ui/select/index.js';

    let {data} = $props();

    
    let campaign : Campaign  = $derived(data.campaign);
    
    type LinkItem = {name:string,link:string}

    let showLeaveCampaignDialog = $state(false);
    //recuupero le informazioni riguardo la landing Page
    let imageUrl = $derived(
        campaign.pages[0].coverImage || ""
    )

    let landing = $derived(campaign.pages[0]);
    
    let objectives = $derived<string[]>(
        landing.content[0]?.type === 'object' ? landing.content[0].objectives ?? [] : []
    );
    let wiki = $derived<LinkItem[]>(
        landing.content[0]?.type === 'object' ? (landing.content[0].wiki ?? []) : []
    );

    //recupero la data della prossima sessione se disponibile 
    let retrievedData: DateValue | undefined = $derived(
        landing.content[0].type === 'object' ? isoToDateValue(landing.content[0].nextSessionAt) : undefined
    );
    //derivo il giorno selezionato dalla data recuperata
    let selected: DateValue | undefined = $derived(retrievedData);
    
    //infine derivo per ottenere il formato Date
    const isoDate = $derived(
        selected ? selected.toDate(getLocalTimeZone()) : null       
    );

    //controllo se l'utente è il master o se è un player
    let isMaster = $derived(
        campaign.master === data.userId ? true : false
    );
    //il master non viene considerato un player, inoltre un player deve essere registrato alla campagnia
    let isPlayer= $derived(
        !isMaster && campaign.players.some((player)=> player.nickname === data.displayName)
    );

    let selectedCharacter = $state("");

    const triggerCharacter = $derived(
        data.characters.find(char => char.name === selectedCharacter)?.name ?? "Scegli un personaggio"
    );

    $inspect(triggerCharacter,"char");  

    //variabile per consentire la modifica della pagina
    let allowModify = $state(false);
        
    let newPageName = $state("");

    let playerToKill = $state("");


    //dialog variables
    let showConfirmationDialog = $state(false);
    let showWikiPageCreationDialog = $state(false);    
    let showKillDialog = $state(false);
    let showCampaignDeletionDialog = $state(false);
    let hasBeenSet = $state(false);

    //FUNZIONI
    //SALVATAGGIO MODIFICHE
    async function save() {
        //controllo se l'utente è il master perchè solo lui può modificare tutti i campi della landingPage
        if(isMaster){
            let nextSessionAt = isoDate?.toString() ;
            campaign.pages[0].content[0].type === 'object' ? campaign.pages[0].content[0] = {wiki, nextSessionAt, objectives, type:'object'} : null; 
          
            if(imageUrl.toLowerCase().includes("blob"))imageUrl = await blobUrlToBase64(imageUrl) as string
            campaign.pages[0].coverImage = imageUrl;
        

        }
        else{
            //gli unici campi modificabili da tutti sono la wiki e i giocatori
            campaign.pages[0].content[0].type === 'object' ? campaign.pages[0].content[0].wiki = wiki : null ;
        }

        //salvo la landingPage
        const response = await fetch('/api/campaign/landing-save',{
            method:'POST',
            headers:{'Content-type': 'application/json'},
            body:JSON.stringify({payload:campaign,wasChanged:hasBeenSet})
        })
        //controllo se la chiamata è andata a buon fine
        if(!response.ok){
            const error = await response.json().catch(()=>({}));
            console.error('Save Failure',error);
            toast.error(`Errore nel salvataggio: ${error?.message ?? response.statusText}`,{
                action:{
                    label:'OK',
                    onClick:()=>console.info('page modify failed')
                }
            })
            return;
        }
        //forzo un refresh della pagina per aggiornare il prop Data
        await invalidateAll();
        hasBeenSet = false;
        //notifica all'utente del successo dell'operazione
        toast.success('Pagina modificata con successo',{
            action:{
                label:'OK',
                onClick:()=>console.info('page modified')
            }
        })
    }
    //AGGIUNTA GIOCATORE ALLA CAMPAGNA
    async function addPlayer() {
        //non può succedere che uno sia loggato ma non abbia username però almeno typescript è contento
        if(!data.displayName)return;
        let id;
        if(selectedCharacter === ""){
            const newCharacter = FabulaUltimaCharacterScheme.parse(
            {
            name:"-",
            traits:{},
            stats:{},
            affinities:{},
            status:{},
            info:{},
            inventory:{},
            classes:[],
            }
            )
            //bisogna fetchare
            const response = await fetch('/api/characters',{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        character: newCharacter
                    })
                    
                })

            if (!response.ok){
                toast.error( 'Impossibile creare il personaggio.',{
                    action:{
                        label:"OK",
                        onClick: () =>{console.info("undo")}
                    }
                });
                return;
            }
            const characterData = await response.json();

            id = characterData.id;    
        }else{
            id = data.characters.find(char => char.name === selectedCharacter)?.id;
            console.log(`id: ${id}`);
        }
        

        

        campaign.players.push({nickname:data.displayName,uid:data.userId,characterId:id}),
        
        campaign = {
            ...campaign,
            players: [...campaign.players]
        }
        await save();
        showConfirmationDialog = false;
        await invalidateAll();
        toast.success(`Ti sei unito a ${campaign.name}`,{
            action:{
                label:'OK',
                onClick:()=>console.info("Campaign Joined")
            }
        })
    }
    //RIMOZIONE GIOCATORE DALLA CAMPAGNA
    async function removePlayer(){
        let index = campaign.players.findIndex((player)=> player.nickname === data.userId);
        campaign.players.splice(index,1);
        await save()
        await invalidateAll()
        toast.success(`Hai lasciato ${campaign.name}`,{
            action:{
                label:'OK',
                onClick:()=>console.info("Campaign Left")
            }
        })
        showLeaveCampaignDialog = false;
    }
    //AGGIUNTA DI UNA PAGINA ALLA WIKI
    async function addWikiPage(){
        //se il nome della pagina è già presente allora esco subito 
        if(campaign.pages.some((page)=>page.title === newPageName)){
            toast.error('Esiste già una pagina con quel nome',{
                action:{
                    label:'OK',
                    onClick:()=>console.info('page duplicated')
                }
            })
            showWikiPageCreationDialog = false;
            newPageName = "";    
            return;
        }

        //fetch a pageCreator per creare una pagina
        //pageCreator NON aggiorna firestore si occupa solo di creare un nuovo oggetto pagina.
        const response = await fetch('/api/campaign/pageCreator',{
            method:"PUT",
            headers:{'Content-type' :' application/json'},
            body:JSON.stringify({name:newPageName,masterId:campaign.master})
        })

        if(!response.ok) return;
        
        const result = await response.json();
        
        const createdPage:Page = result.page;


        campaign.pages.push(createdPage);
        
        if(campaign.pages[0].content[0].type==='object'){
            campaign.pages[0].content[0].wiki.push({name:createdPage.title,link:`/campaign/${campaign.id}/${createdPage.id}`});
        }

        await save();

        showWikiPageCreationDialog = false;
        newPageName = "";    
        await invalidateAll();
    }
    //RIMOZIONE DI UNA PAGINA DALLA WIKI
    async function removeWikiPage(index:number){

        if(landing.content[0].type === 'object'){
            let deleted = wiki.splice(index,1);
            wiki = [...wiki];
            let removeIndex = campaign.pages.findIndex((page)=>page.title === deleted[0].name);
            campaign.pages.splice(removeIndex,1);
            toast.info('Modifica attuata, per salvare premere il pulsante Salva')
        }
        
        
    }
    //AGGIORNAMENTO DEL NOME DI UNA PAGINA
    function updatePageName(oldName:string,newName:string){
        let index = campaign.pages.findIndex((page)=> page.title === oldName);
        if(index === -1) return false;
        campaign.pages[index].title = newName;
        console.info("updated");
        return true;
    }
    //RIMOZIONE DI UN GIOCATORE DA PARTE DEL MASTER
    async function masterKill(name:string){
        let index = campaign.players.findIndex((player)=> player.nickname === name);
        campaign.players.splice(index,1);
        await save()
        await invalidateAll()
        toast.success(`Hai fatto fuori ${name}`,{
            action:{
                label:'OK',
                onClick:()=>console.info("Kicked From Campaign")
            }
        })
    }
    //AGGIORNAMENTO OBIETTIVI
    function updateItem(index: number, newValue: string) {
        objectives[index] = newValue;
        objectives = [...objectives]; // Triggera la reattività
        console.info("updated,list")
    }
    //CANCELLAZIONE CAMPAGNA
    async function deleteCampaign(){
        

        const response = await fetch(`/api/campaign`,{
            method:"DELETE",
            headers:{ 
                'content-type':'application/json'
            },
            body:JSON.stringify(data)

        })
        console.log("risposta",response);
        if(response.ok){
            showCampaignDeletionDialog = false;
            const data = await response.json();
            toast.success(`${data.message}, sarai reindirizzato alla pagina delle campagne`,{
                action:{
                    label:"OK",
                    onClick:()=>console.info('la campagna è morta...')
                }
            })
            goto('/campaign');
        }

        
        return;


    }

    $effect(()=>{
        if(JSON.stringify($state.snapshot(selected)) !== JSON.stringify(retrievedData)){
            hasBeenSet = true;
        }
    })
</script>

<div class="bg-lion-900 flex flex-col gap-5 items-center justify-start p-5">
    <section class="bg-white flex flex-col gap-5 items-start justify-center p-2">
        <!-- Sezione Master only per modifiche -->
        {#if isMaster}   
            <span class="flex flex-row items-center justify-center">
                <Label>Modifica</Label>
                <Switch bind:checked = {allowModify}></Switch>
                <Button onclick={save}>Salva</Button>
            </span>
        {/if}
        <!-- Immagine della landing page -->
        <div class="flex flex-col items-center justify-start">
            <h1 class="text-5xl font-bold "> {campaign.name} </h1>
            <h2>{campaign.description}</h2>
            {#if isMaster && allowModify}
                <ImageUploader2
                    bind:imageUrl={imageUrl}
                    allowUrlInput={true}
                    showButtons={true}
                    showDeletion={true}
                />
            {:else}
                <img src={campaign.pages[0].coverImage} alt="BackgroundPic" />
            {/if} 
        </div>

        <!-- Container Principale per obiettivi, giocatori e data sessione -->
        <div class="flex flex-row justify-start px-5 gap-10">
            
            <!-- Obiettivi -->
            <span class="flex flex-col border border-black p-5">
                {#if landing.content[0].type === 'object'}
                    <EditableLists 
                        updateItem = {updateItem}
                        title="Obiettivi Correnti"
                        modify={allowModify} 
                        listContent={objectives}
                        />
                {/if}
                
            </span>
            
            <!-- Giocatori -->
            <span class="flex flex-col gap-5 border border-black p-5">
                <p>Giocatori Attuali</p>
                <span class="flex flex-row gap-5 items-center justify-center">
                    {#each campaign.players as player}
                        <p>{player.nickname}</p>
                        {#if isMaster}
                            <button onclick={()=>{playerToKill = player.nickname; showKillDialog = true}}> <Fa icon={faMinusCircle}/> </button>                    
                        {/if}
                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <!-- il trim è necessario perchè player.uid a quanto apre ha uno spazio in fondo-->
                                <Tooltip.Trigger class={buttonVariants({ variant: "outline" } )} onclick={()=>goto(`/characters/${player.characterId}?uid=${player.uid.trim()}&master=${campaign.master.trim()}`)}>
                                    <Fa icon={faArrowUpRightFromSquare}/>    
                                </Tooltip.Trigger>
                                    
                                <Tooltip.Content>
                                <p>Mostra scheda Personaggio</p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                            

                    {/each}
                </span>
                {#if !isPlayer && !isMaster}
                    <Button class="w-20" onclick={()=>showConfirmationDialog = true}>
                        Unisciti
                    </Button>
                {:else if !isMaster}
                    <Button class="w-20" onclick={()=>showLeaveCampaignDialog = true}>
                        Lascia
                    </Button>
                {/if}
            </span>

            <!-- Calendario -->
            <span class="flex flex-col border border-black p-5 w-auto">
                <p>Prossima Sessione</p>
                <DatePicker bind:value = {selected} editable={allowModify}/>
            </span>

        </div>

        <!-- Wiki -->
        <div class="flex flex-col  items-start justify-start">
            <span>                
                {#if landing.content[0].type === 'object'}
                    <EditableLink 
                        auxiliaryUpdate = {updatePageName}
                        remove={removeWikiPage}
                        add={()=>showWikiPageCreationDialog = true}
                        allowedToModify = {isPlayer}
                        modify={allowModify}
                        listContent={wiki}
                        title={"Wiki"}
                    />
                {/if}
            </span>
        </div>

        <Separator orientation="horizontal"></Separator>
        {#if isMaster}
            <Button onclick={()=>showCampaignDeletionDialog = true}> Elimina Campagna </Button>
        {/if}

        <Dialog.Root open={showCampaignDeletionDialog} onOpenChange={(v)=> showCampaignDeletionDialog = v}> 
            <Dialog.Content> 
                <Dialog.Header> 
                    Confermare L'eliminazione della campagna?
                </Dialog.Header>
                    <p class="bg-red-600 text-white ">
                        Questa scelta è irreversibile e tutti i dati relativi alla campagna verranno persi
                    </p>
                <Dialog.Footer> 
                <Button onclick={deleteCampaign}> Distruggi il mondo da te creato  </Button>
            </Dialog.Footer>
        </Dialog.Content>
        </Dialog.Root>

        <Dialog.Root open={showConfirmationDialog} onOpenChange={(v)=> showConfirmationDialog = v}> 
            <Dialog.Content> 
                <Dialog.Header> 
                    Confermare l'adesione alla campagna?
                </Dialog.Header>
                    <p>Usare un personaggio esistente?</p>
                    
                    <Select.Root type="single" bind:value={selectedCharacter}>
                        <Select.Trigger class="w-50"> 
                            {triggerCharacter}
                        </Select.Trigger> 
                        <Select.Content> 
                            <Select.Group>
                                {#each data.characters as char }
                                    <Select.Item
                                        value={char.name}
                                        label={char.name}
                                    >
                                        {char.name}
                                    </Select.Item>

                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>


                <Dialog.Footer> 
                    <Button onclick={addPlayer}> Iscriviti</Button>
                </Dialog.Footer>
        </Dialog.Content>
        </Dialog.Root>

        <Dialog.Root open={showWikiPageCreationDialog} onOpenChange={(v)=> showWikiPageCreationDialog = v}> 
            <Dialog.Content> 
                <Dialog.Header> 
                    Inserisci un nome per la pagina
                </Dialog.Header>
                    <Input bind:value = {newPageName}/>
                <Dialog.Footer> 
                <Button onclick={addWikiPage}> Aggiungi</Button>
            </Dialog.Footer>
            </Dialog.Content>    
        </Dialog.Root>

        <Dialog.Root open={showKillDialog} onOpenChange={(v)=> showKillDialog = v}> 
            <Dialog.Content> 
                <Dialog.Header> 
                    Vuoi davvero rimuovere {playerToKill} dalla campagna?
                </Dialog.Header>
                <Button class="bg-green-600 hover:bg-green-700" onclick={()=>masterKill(playerToKill)}> SI</Button>
                <Button class="bg-red-600 hover:bg-red-700" onclick={()=>showKillDialog=false}> NO </Button>
                <Dialog.Footer> 
                
            </Dialog.Footer>
            </Dialog.Content>    
        </Dialog.Root>
        
        <Dialog.Root open={showLeaveCampaignDialog} onOpenChange={(v)=> showLeaveCampaignDialog = v}> 
            <Dialog.Content> 
                <Dialog.Header> 
                    Vuoi davvero abbandonare la campagna {campaign.name}?
                </Dialog.Header>
                <Button class="bg-green-600 hover:bg-green-700" onclick={removePlayer}> SI</Button>
                <Button class="bg-red-600 hover:bg-red-700" onclick={()=>showKillDialog=false}> NO </Button>
            </Dialog.Content>    
        </Dialog.Root>
        
   </section>
</div>

