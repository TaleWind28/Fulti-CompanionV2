<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import CharacterCard from '$lib/components/characterCard.svelte';
    import InfoSheet from '$lib/components/infoSheet.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';

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

	 type CharacterCardProps = {
        character: typeof character;
    };

    type InfoSheetProps = {
        name: string;
        pic: string | undefined;
        traits: any;
        bonds: any;
        info: any;
        onUpdate: (field: string, value: any) => void;
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
						onUpdate:updateCharacter	
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
	$effect(()=>{character = data.character});
</script>


<div class="bg-cafe_noir-900 flex items-center justify-center p-10">
	<Tabs.Root bind:value={tabValue} onValueChange={async ()=>{await invalidateAll();console.log("awaited")}}>
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
		{character.name}
		{#each tabSelector.contents as content }
			
			<Tabs.Content value={content.value} class="py-10" > 
				<div class="w-full">
					<content.component {...content.props}> </content.component>
				</div>
				</Tabs.Content>
		{/each}

	</Tabs.Root>
</div>
