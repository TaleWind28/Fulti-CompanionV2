<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import type { Attributes, StatsSheetProps } from '$lib';
    import CharacterCard from '$lib/components/characterCard.svelte';
    import InfoSheet from '$lib/components/infoSheet.svelte';
    import StatSheet from '$lib/components/statSheet.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import { bondScheme, infoScheme, type Affinity, type Status } from '$lib/zod.js';

	let { data } = $props();

	let character = $state(data.character);

	 // Callback per aggiornare il personaggio
    function updateCharacter(field: string, value: any) {
        character = {
            ...character,
            [field]: value
        };
        
        // Opzionale: salva automaticamente nel database
        // saveCharacterToDatabase();
    }

	    // Callback specifica per aggiornare campi nested in traits
    function updateTraits(traitField: string, value: any) {
        character = {
            ...character,
            traits: {
                ...character.traits,
                [traitField]: value
            }
        };
    }

    // Callback specifica per aggiornare campi nested in info
    function updateInfo(infoField: string, value: any) {
        character = {
            ...character,
            info: {
                ...character.info,
                [infoField]: value
            }
        };
    }

    // Callback specifica per bonds
    function updateBonds(bondIndex: number, field: string, value: any) {
        const newBonds = [...character.bonds];
        newBonds[bondIndex] = {
            ...newBonds[bondIndex],
            [field]: value
        };
        
        character = {
            ...character,
            bonds: newBonds
        };
    }



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
                //ha più senso fare una funzione che viene invocata ogni volta e calcola quanto aumentare/diminuire
                //il for each serve solo per gli status furente ed avvelenato
                // interestedAttributes.forEach((attribute)=>{    
                //     //controllo se posso modificare il valore interessato dallo status
                //     if( character.attributes[attribute]<= 12 || character.attributes[attribute] >= 6){   
                //         //controllo l'operazione da fare
                //         if(statusField === "slow" || statusField === "dazed" || statusField === "enraged" || statusField === "weak" || statusField === "shaken" || statusField === "poisoned"){
                //             //status negativi => sottrarre
                            
                //             character = {
                //                 ...character,
                //                 attributes:{
                //                     ...character.attributes,
                //                     [attribute]:character.attributes[attribute]-2
                //                 }
                //             }

                //         }
                //         else if(statusField.includes("Up")){
                //             //statust positivi => aggiungere
                //             character = {
                //                 ...character,
                //                 attributes:{
                //                     ...character.attributes,
                //                     [attribute]:character.attributes[attribute]+2
                //                 }
                //             }
                //         }
                //     }
                    
                // })
            }
        },

        //Callback per Affinità Elementali
        affinity:{
            update:(affinity:"fisico"|"aria"|"fulmine"|"fuoco"|"ghiaccio"|"luce"|"oscurità"|"terra"|"veleno",value:any)=>{
                
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
                } else {
                    console.error('Errore nel salvataggio');
                }
            } catch (error) {
                console.error('Errore di rete:', error);
            }
        }
    };

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

	type TabContentProps = CharacterCardProps | InfoSheetProps | StatsSheetProps;

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
					component:CharacterCard,
					props:{
						character:character,
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

	let tabValue = $state("sheet");
	/* IMPORTANTE PER CASTARE NON CANCELLARE    */
	$inspect(tabValue,"tab",character,"personaggio",(tabSelector.contents[0].props as CharacterCardProps).character);
	//consenter aggiornamento di character dopo la chiamata alla load a causa dell'invalidateAll
	$effect(()=>{character = data.character});
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
				<div class="w-full">
					<content.component {...content.props}> </content.component>
				</div>
				</Tabs.Content>
		{/each}

	</Tabs.Root>
</div>
