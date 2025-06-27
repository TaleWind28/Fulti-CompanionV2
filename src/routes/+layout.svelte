<script lang="ts">
  import {NavigationMenuItem} from '$lib/components/ui/navigation-menu';
  import NavigationMenuLink from '$lib/components/ui/navigation-menu/navigation-menu-link.svelte';
  import NavigationMenuList from '$lib/components/ui/navigation-menu/navigation-menu-list.svelte';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import NavigationMenu from '$lib/components/ui/navigation-menu/navigation-menu.svelte';
	import '../app.css';
	let { children } = $props();
	let poweredSrc = "src/images/Powered by Fabula Ultima Logo.png" ;
	let logo = "src/images/Logo5.1.png";
	let headerLinks =[{link:"/",name:"Campagne"},{link:"/",name:"Schede Personaggio"},{link:"/",name:"Generatore di Oggetti"},{link:"/",name:"Bestiario"}];
</script>


<div class="flex flex-col h-full bg-caribbean_current-500">
	<header class="flex items-center justify-between px-8 py-4">
		<!-- Logo a sinistra -->
		<div class="flex-none">
			<a href="/"> 
				<img src={logo} alt="logo" class="w-auto h-12">
			</a>
		</div>

		<!-- Menu di navigazione al centro -->
		<NavigationMenu class="flex-1 flex justify-center">
			<NavigationMenuList class="flex items-center gap-8">
				{#each headerLinks as page}
					<NavigationMenuItem>
						<NavigationMenuLink>
							{#snippet child()}
								<a href={page.link} class="{navigationMenuTriggerStyle()} !bg-caribbean_current-500 hover:!bg-caribbean_current-400 text-white text-3xl !w-full !h-full !text-center" >{page.name}</a>
							{/snippet}
						</NavigationMenuLink>
					</NavigationMenuItem>	
				{/each}
			</NavigationMenuList>
		</NavigationMenu>

		<!-- Pulsante TaleWind a destra -->
		<div class="flex-none">
			<a href="/talewind" class="bg-caribbean_current-600 hover:bg-caribbean_current-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2">
				TaleWind
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
				</svg>
			</a>
		</div>
	</header>

	<!-- componenti da renderizzare -->
	<div class="bg-cafe_noir-900 p-10">
		{@render children()}
	</div>

	<!-- footer -->
	<footer class="w-full h-70 flex items-center justify-end">
		<img src={poweredSrc} alt="Powered by Fabula Ultima" class="h-40">
	</footer>
</div>