<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import type { StatsSheetProps } from '$lib';
    import CharacterCard from '$lib/components/characterCard.svelte';
    import CharacterClasses from '$lib/components/characterClasses.svelte';
    import InfoSheet from '$lib/components/infoSheet.svelte';
    import StatSheet from '$lib/components/statSheet.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import {  infoScheme} from '$lib/zod.js';
    import { setContext } from 'svelte';
    import { toast } from 'svelte-sonner';

	let { data } = $props();

	let character = $state.raw(data.character);

	const characterCallbacks = {
        // Callback per campi semplici
        updateField: (field: string, value: any) => {
            character = {
                ...character,
                [field]: value
            };
        },

        // Callback per traits
        traits: {
            update: (traitField: string, value: any) => {
                character = {
                    ...character,
                    traits: {
                        ...character.traits,
                        [traitField]: value
                    }
                };
            },
            
            reset: () => {
                character = {
                    ...character,
                    traits: { identity: '', origin: '', theme: '' }
                };
            }
        },

        // Callback per info
        info: {
            update: (infoField: string, value: any) => {
                character = {
                    ...character,
                    info: {
                        ...character.info,
                        [infoField]: value
                    }
                };
            },
            
            clear: () => {
                character = {
                    ...character,
                    info: infoScheme.parse({})
                };
            }
        },

        // Callback per bonds (array)
        bonds: {
            update: (bondIndex: number, field: string, value: any) => {
                const newBonds = [...character.bonds];
                newBonds[bondIndex] = {
                    ...newBonds[bondIndex],
                    [field]: value
                };
                
                character = {
                    ...character,
                    bonds: newBonds
                };
            },
            
            add: (newBond:any) => {
                

                character = {
                    ...character,
                    bonds: [
                        ...character.bonds,
                        newBond
                    ]
                };
            },
            
            remove: (index: number) => {
                character = {
                    ...character,
                    bonds: character.bonds.filter((_, i) => i !== index)
                };
            }
        },

        // Callback per stats
        stats: {
            updateHP: (value: number) => {
                character = {
                    ...character,
                    stats: {
                        ...character.stats,
                        HP: { ...character.stats.HP, actual: value }
                    }
                };
            },
            
            updateMaxHP: (value: number) => {
                character = {
                    ...character,
                    stats: {
                        ...character.stats,
                        HP: { ...character.stats.HP, max: value }
                    }
                };
            },
            
            heal: (amount: number) => {
                const newHP = Math.min(
                    character.stats.HP.actual + amount,
                    character.stats.HP.max
                );
                
                character = {
                    ...character,
                    stats: {
                        ...character.stats,
                        HP: { ...character.stats.HP, actual: newHP }
                    }
                };
            }
        },

        // Callback per Status
        status:{
            update:(statusField:string,value:boolean)=>{
                console.log(statusField," :field\t",value," :value\t")
                //assegno lo status
                character = {
                    ...character,
                    status: {
                        ...character.status,
                        [statusField]: value
                    }
                };
            }
        },

        //Callback per Affinità Elementali
        affinity:{
            update:(affinity:"fisico"|"aria"|"fulmine"|"fuoco"|"ghiaccio"|"luce"|"oscurita"|"terra"|"veleno",value:any)=>{
                
                let affinityType = value === 0 ? "immune" : value === 1 ? "weak" : value === 3 ? "resistant" : value === 4 ? "absorb" : "";
                console.log(affinity," :field\t",value," :value\t",affinityType,"\t affinityType")
                //resetto l'oggetto per mantere la mutua esclusione
                character = {
                    ...character,
                    affinities:{
                        ...character.affinities,
                        [affinity]:{
                            weak:false,
                            immune:false,
                            resistant:false,
                            absorb:false
                        }
                    }
                }    
                //controllo che l'affinità al tipo sia diversa da quella neutra
                if(affinityType === "")return;
                //metto a true solo il campo interessato
                character = {
                    ...character,
                    affinities:{
                        ...character.affinities,
                        [affinity]:{
                            ...character.affinities[affinity],
                            [affinityType]:true
                        }
                    }
                }
            }
        },

        attributes:{
            update:(attribute:"DEX"|"MIG"|"INS"|"WLP",value:number)=>{
                console.log(attribute,"attribute", value,"value");
                character = {
                    ...character,
                    attributes:{
                        ...character.attributes,
                        [attribute]:value
                    }
                }
            }
        },

        classes:{
            update:async (className:string)=>{
                //recupero le classi dal db
                const response = await  fetch(`/api/characters?classNames=${JSON.stringify([className])}`);
                const result = await response.json();
                if(result.success){
                    const newClass = result.characterClasses[0];
                    if(character.classes.some(classe => classe.name === newClass.name)){
                        toast.error('Classe già presente',{
                            action:{
						        label:"OK",
						        onClick: () =>{console.info("undo")}
                            }
                        })
                        return;
                    }
                    
                    character = {
                        ...character,
                        classes:[...character.classes,newClass]
                    }
                    toast.success('Classe aggiunta con successo!',{
                            action:{
						        label:"OK",
						        onClick: () =>{console.info("undo")}
                            }
                        })
                }

            }
        },

        // Utility callback con salvataggio su firestore
        save: async () => {
            try {
                const response = await fetch(`/api/characters/${character.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(character)
                });
                
                if (response.ok) {
                    console.log('Personaggio salvato!');
                    toast.success('Personaggio salvato con successo!',{
                        action:{
                            label:"OK",
                            onClick:()=>console.info("Undo")
                        }
                    })
                    await invalidateAll();
                } else {
                    console.error('Errore nel salvataggio');
                }
            } catch (error) {
                console.error('Errore di rete:', error);
            }
        }
    };


    type SkillUp = (skillName:string,up:boolean,className:string)=> boolean;
    type Heroic =(className:string,heroicName:string,heroicDescription:string)=> boolean;
    type ClassUp = (className:string,up:boolean)=> boolean;

    function levelSkill(skillName: string,up:boolean,className:string): boolean {

        // Trova la classe e la skill
        const desiredClass = character.classes.find(c => c.name === className); 
        if(!desiredClass)return false;       
        const skill = desiredClass.skills.find(s => s.name === skillName);
        if(!skill)return false;
        let skillLevels = 0;
        for(const skillz of desiredClass.skills){
            skillLevels+=skillz.level.actual;
        }
        
        //controllo che il livello della classe possa aumentare se l'operazione è di aumento
        if(skillLevels >= desiredClass.level && up){
            toast.error('La classe ha raggiunto il livello massimo',{
            action:{
                label:"OK",
                onClick: () =>{console.info("undo")}
            }})
            return false;
        }
        //controllo che il livello dell'abilità possa aumentare se l'operazione è di aumento
        if(skill.level.actual === skill.level.max && up){
                toast.error('L\'abilità ha raggiunto il livello massimo',{
                action:{
                label:"OK",
                    onClick: () =>{console.info("undo")}
                }
            })
            return false;
        }

            //controllo che il livello dell'abilità possa diminuire se l'operazione è di diminuzione
        if(skill.level.actual === 0 && !up){
            toast.error('Il livello abilità non può essere inferiore a 0',{
                action:{
                label:"OK",
                    onClick: () =>{console.info("undo")}
                }
            })
            return false;
        }

            //controllo l'operazione da fare sul livello
        if (up) {
            skill.level.actual += 1;
            return true;
        }else{
            skill.level.actual -= 1;
            return true;
        }
    }

   
    function levelClass(className:string,up:boolean):boolean{
        const desiredClass = character.classes.find(c => c.name === className);
        if(!desiredClass){
            toast.error('La classe non è stata trovata',{
                action:{
                    label:"OK",
                    onClick:()=>console.log("undo")
                }
            })
            return false;
        }
        if(desiredClass?.level>=10 && up){
            toast.error('La classe ha raggiunto il livello massimo',{
                action:{
                    label:"OK",
                    onClick:()=>console.log("undo")
                }
            })
            return false;
        }

        if(desiredClass?.level<=1 && !up){
            toast.error('Il livello della classe non può essere inferiore ad 1',{
                action:{
                    label:"OK",
                    onClick:()=>console.log("undo")
                }
            })
            return false;
        }
        //cerco la classe nell'oggetto character ed aggiorno il suo livello
        if(up){
            desiredClass.level+=1;
        }else{
            desiredClass.level-=1;
        }
    
        let index = character.classes.findIndex(c=>c.name===desiredClass.name);
        character.classes[index] = desiredClass;

        return true;
    };

    function editHeroic(className:string,heroicName:string,heroicDescription:string):boolean{
        if(heroicName ==="")return false;
        if(heroicDescription ==="")return false;
        const heroic = character.classes.find(c => c.name === className)?.heroic;

        if(heroic){
            heroic.name = heroicName;
            heroic.description = heroicDescription;
        }
        

        return false;
    }
    setContext<ClassUp>('classUp',levelClass);
    setContext<Heroic>('editHeroic',editHeroic);
    setContext<SkillUp>('skillUp',levelSkill);

    type CharacterClassesProps ={
        classes: typeof character.classes,
        classNames:string[],
        callbacks:any

    }

	type CharacterCardProps = {
        character: typeof character;
    };

    type InfoSheetProps = {
        name: string;
        pic: string | undefined;
        traits: any;
        bonds: any;
        info: any;
        callbacks:any;
    };

	type TabContentProps = CharacterCardProps | InfoSheetProps | StatsSheetProps | CharacterClassesProps;

	 type TabContent = {
        value: string;
        text: string;
        component: any;
        props: TabContentProps;
    };

	let tabSelector = $derived.by(():{
		contents:TabContent[]
	}=>
	(
		{
			contents:[
                //scheda personaggio
				{
					value:"sheet",
					text:"Scheda Personaggio",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				},
                //infosheet
					{
					value:"information",
					text:"Informazioni",
					component:InfoSheet,
					props:{
						name:character.name,
						pic:character.pic,
						traits:character.traits,
						bonds:character.bonds,
						info:character.info,
						callbacks:characterCallbacks
					},

					
				},
                //statsheet
					{
					value:"stats",
					text:"Statistiche",
					component:StatSheet,
					props:{
						attributes:character.attributes,
                        affinity:character.affinities,
                        statuses:character.status,
                        callbacks:characterCallbacks
					},
					
				},
                //classSheet	
                {
					value:"classes",
					text:"Classi",
					component:CharacterClasses,
					props:{
						classes:character.classes,
                        classNames:data.classNames,
                        callbacks:characterCallbacks
						},
					
				},
                //spellSheet
				{
					value:"spells",
					text:"Incantesimi",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				},
                //equipmentSheet
				{
					value:"equipment",
					text:"Equipaggiamento",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				},
                //notes
				{
					value:"notes",
					text:"Note",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				}
			],
			

		}
	)

);
    let hasBeenChanged = $state(false);
	let tabValue = $state("sheet");
	/* IMPORTANTE PER CASTARE NON CANCELLARE */
	$inspect(tabValue,"tab",character,"personaggio",(tabSelector.contents[0].props as CharacterCardProps).character);
	//consenter aggiornamento di character dopo la chiamata alla load a causa dell'invalidateAll
	$effect(()=>{
        if(character !== data.character){
            hasBeenChanged = true;
            console.log("cambiato");    
        }
        });
</script>


<div class="bg-cafe_noir-900 flex items-center justify-center p-10">
	<Tabs.Root bind:value={tabValue} onValueChange={async ()=>{console.log("riga 135 posso mettere funzione")}}>
		<Tabs.List class="bg-cafe_noir-700 gap-2">
			{#each tabSelector.contents as trigger, i}
				<Tabs.Trigger value={trigger.value} class="bg-cafe_noir-700  data-[state=active]:bg-cafe_noir text-white "> 
					{trigger.text}
				</Tabs.Trigger>
				{#if i !== tabSelector.contents.length-1}
					<Separator orientation="vertical" class="bg-cafe_noir-600 "/>
				{/if}
			{/each}
		</Tabs.List>

        {#each tabSelector.contents as content }
            <Tabs.Content value={content.value} class="py-10" > 
                <div>
                    <content.component {...content.props}> </content.component>
                </div>
                </Tabs.Content>
        {/each}

	</Tabs.Root>
    {#if hasBeenChanged}
    <button 
        onclick={characterCallbacks.save}
        class="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Salva modifiche"
    >
        <i class="fas fa-save text-xl"></i>
    </button>
{/if}
</div>
