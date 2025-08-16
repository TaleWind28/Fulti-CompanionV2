<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import CharacterCard from '$lib/components/characterCard.svelte';
    import InfoSheet from '$lib/components/infoSheet.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import { bondScheme, infoScheme } from '$lib/zod.js';

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

	type TabContentProps = CharacterCardProps | InfoSheetProps;

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
				{
					value:"sheet",
					text:"Scheda Personaggio",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				},
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
					{
					value:"stats",
					text:"Statistiche",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				},	{
					value:"classes",
					text:"Classi",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				},
				{
					value:"spells",
					text:"Incantesimi",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				},
				{
					value:"equipment",
					text:"Equipaggiamento",
					component:CharacterCard,
					props:{
						character:character,
						},
					
				},
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
		{character.info.description}
		{character.info.level}
		{character.info.zenit}
		{character.info.fabulaPoints}
		{character.info.exp}
		{#each tabSelector.contents as content }
			<Tabs.Content value={content.value} class="py-10" > 
				<div class="w-full">
					<content.component {...content.props}> </content.component>
				</div>
				</Tabs.Content>
		{/each}

	</Tabs.Root>
</div>
