<script lang="ts">
    import { invalidate, invalidateAll } from '$app/navigation';
    import CharacterCard from '$lib/components/characterCard.svelte';
    import { Content } from '$lib/components/ui/card/index.js';
    import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { data } = $props();

	let character = $state(data.character);

	let tabSelector = $derived(
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
					title:"",
					description:"",
					component:CharacterCard,
					props:{
						character:character,
						showButtons:false
						},
					triggerName:"sheet"
					
				}
			],
			

		}
	)
	let tabValue = $state("sheet");
	$inspect(tabValue,"tab",character,"personaggio",tabSelector.contents[0].props.character.traits,"Contenuto del componente");
</script>


<div class="bg-cafe_noir-900 flex items-center justify-center p-10">
	<Tabs.Root bind:value={tabValue} onValueChange={async ()=>{await invalidateAll();console.log("awaited",tabSelector.contents[0].props.character.traits)}}>
		<Tabs.List class="bg-cafe_noir-700 gap-5"> 
			{#each tabSelector.triggers as trigger}
				<Tabs.Trigger value={trigger.value} class="bg-cafe_noir-700  data-[state=active]:bg-cafe_noir text-white"> 
					{trigger.text}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		{#each tabSelector.contents as content }
			<Tabs.Content value={content.triggerName} class="py-10" > 
				<div class="w-full">
					<content.component {...content.props}> </content.component>
				</div>
				</Tabs.Content>
		{/each}

	</Tabs.Root>
</div>
