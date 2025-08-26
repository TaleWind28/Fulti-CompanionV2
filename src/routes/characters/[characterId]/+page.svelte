<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import type { Accessory, Armor, Shield, StatsSheetProps, Weapon } from '$lib';
    import CharacterCard from '$lib/components/characterCard.svelte';
    import CharacterClasses from '$lib/components/sheets/characterClasses.svelte';
    import InfoSheet from '$lib/components/sheets/infoSheet.svelte';
    import InventorySheet from '$lib/components/sheets/inventorySheet.svelte';
    import NotesSheet from '$lib/components/sheets/notesSheet.svelte';
    import SpellBook from '$lib/components/sheets/spellBook.svelte';
    import StatSheet from '$lib/components/sheets/statSheet.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import {  infoScheme, type Spell, type Spellbook} from '$lib/zod.js';
    import { faSave } from '@fortawesome/free-solid-svg-icons';
    import { setContext } from 'svelte';
    import Fa from 'svelte-fa';
    import { toast } from 'svelte-sonner';

	let { data } = $props();

	let character = $state(data.character);

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

        notes:{
            update:(field:"title"|"description",value:string,id:number)=>{
                
                character.notes[id][field] = value;
                
                character = {
                    ...character,
                    notes:[...character.notes]
                }
            }            
        },
        spell:{
            update:(value:Spell)=>{
                console.log(value.list,"lista");
                //se non esiste la lista di incantesimi nel libro la creo
                if(!character.spellbook[value.list]){
                    character.spellbook[value.list]=[]
                }
                //aggiungi l'incantesimo alla lista
                character.spellbook[value.list].push(value);
            }
        },

        // Utility callback con salvataggio su firestore
        save: async () => {
            try {
                // Non so perchè ma firestore vede il livello come un a stringa
                const sanitizedCharacter = {
                    ...character,
                    traits:{
                        ...character.traits
                    },
                    info:{
                        ...character.info,
                        level:Number(character.info.level)
                    },
                    classes: character.classes.map(cls => ({
                        ...cls,
                        level: Number(cls.level), // Assicurati che sia un numero
                        skills: cls.skills.map(skill => ({
                            ...skill,
                            level: {
                                actual: Number(skill.level.actual),
                                max: Number(skill.level.max)
                            }
                        }))
                    }))
                };

                const response = await fetch(`/api/characters/${character.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sanitizedCharacter)
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
                    hasBeenChanged = false;
                } else {
                    console.error('Errore nel salvataggio');
                }
            } catch (error) {
                console.error('Errore di rete:', error);
            }
        }
    };

    //tipi per le funzioni da passare tramite context
    type SkillUp = (skillName:string,up:boolean,className:string)=> boolean;
    type Heroic =(className:string,heroicName:string,heroicDescription:string)=> boolean;
    type ClassUp = (className:string,up:boolean)=> boolean;
    type DeleteClass = (className:string)=>boolean;

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
            toast.error('Hai usato tutti i punti abilità a disposizione, aumenta il livello della classe per ottenerne altri',{
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

        let classLevels = 0;
        
        for(const classe of character.classes){
            classLevels+=classe.level;
        }

        if(classLevels>=character.info.level && up){
            toast.error("Devi prima salire di livello!",{
                action:{
                    label:"OK",
                    onClick:()=>console.info("undo")
                }
            })
            return false;
        }

        if(!desiredClass){
            toast.error('La classe non è stata trovata',{
                action:{
                    label:"OK",
                    onClick:()=>console.info("undo")
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
        
        character = {
            ...character,
            classes: character.classes.map(c => c.name === desiredClass.name ? desiredClass : c)
        };

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

    function deleteClass(className: string): boolean {
        const i = character.classes.findIndex(c => c.name === className);
        if (i !== -1) {
            character.classes.splice(i, 1);
            toast.success("Classe rimossa con successo",{
                action:{
                    label:"OK",
                    onClick:()=>console.info("Undo")
                }
            })
            return true;
        }
        return false;
    }
    setContext<ClassUp>('classUp',levelClass);
    setContext<Heroic>('editHeroic',editHeroic);
    setContext<SkillUp>('skillUp',levelSkill);
    setContext<DeleteClass>('delete',deleteClass)

    type DeleteNote = (noteId:number)=>boolean;
    type UpdateNote = (noteId:number,field:"description" | "title",value:string)=>boolean;

    function deleteNote(noteId:number){
        let deleteIndex = character.notes.findIndex((n)=>n.id === noteId);
        character.notes.splice(deleteIndex,1);
        return true;
    }

    function updateNote(noteId:number,field:"description" | "title" ,value:string){
        character.notes[noteId][field] = value;
        character = {
            ...character,
            notes:[...character.notes]
        }
        return true;
    }
    
    setContext<DeleteNote>('deleteNote',deleteNote);
    setContext<UpdateNote>('updateNote',updateNote);
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

    type InventorySheetProps = {
        weapons:Weapon[],
        shields:Shield[],
        armor:Armor[],
        accessories:Accessory[]
    }

    type NotesProps = {
        notes:Array<{title:string,description:string,id:number}>
    }

    type SpeelBookProps = {
        spellBook:SpellBook,
        callbacks:any
    }

	type TabContentProps = CharacterCardProps | InfoSheetProps | StatsSheetProps | CharacterClassesProps | InventorySheetProps | NotesProps | SpeelBookProps;

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
					text:"Libro degli Incantesimi",
					component:SpellBook,
					props:{
						spellBook:character.spellbook,
                        callbacks:characterCallbacks
					},
					
				},
                //inventorySheet
				{
					value:"inventory",
					text:"Inventario",
					component:InventorySheet,
					props:{
                        weapons:character.inventory.weapons,
                        shields:character.inventory.shields,
                        armor:character.inventory.armor,
                        accessories:character.inventory.accessories
                    },
					
				},
                //notes
				{
					value:"notes",
					text:"Note",
					component:NotesSheet,
					props:{
                            notes:character.notes
						},
					
				}
			],
			

		}
	)

);
    let hasBeenChanged = $state(false);
	let tabValue = $state("sheet");

	//consentire all'utente di salvare le modifiche  di character dopo la chiamata alla load a causa dell'invalidateAll
	$effect(()=>{
        if(JSON.stringify($state.snapshot(character)) !== JSON.stringify(data.character)){
            hasBeenChanged = true;
            console.info("cambiato");    
        }
        });

    $inspect("======================================\n",character,"\n===========================");
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
        <!-- <i class="fas fa-save text-xl"></i> -->
        <Fa icon={faSave}/>
    </button>
{/if}
</div>
