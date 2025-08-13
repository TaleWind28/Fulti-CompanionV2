<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import CharacterCard from '$lib/components/characterCard.svelte';
    import InfoSheet from '$lib/components/infoSheet.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { data } = $props();

	let character = $state(data.character);

	let tabSelector = $derived.by(()=>
	(
		{
			triggers:[
				{value:"sheet",text:character.name},
				{value:"information",text:"Informazioni"},
				{value:"stats",text:"Statistiche"},
				{value:"classes",text:"Classi"},
				{value:"spells",text:"Incantesimi"},
				{value:"equipment",text:"Equipaggamenti"},
				{value:"notes",text:"Note"},
			],
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
	$inspect(tabValue,"tab",character,"personaggio",tabSelector.contents[0].props.character,data.character.traits);
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
