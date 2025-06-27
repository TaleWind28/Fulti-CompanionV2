<script lang="ts">
  import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from '$lib/components/ui/navigation-menu';
  import NavigationMenuLink from '$lib/components/ui/navigation-menu/navigation-menu-link.svelte';
  import NavigationMenuList from '$lib/components/ui/navigation-menu/navigation-menu-list.svelte';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import NavigationMenu from '$lib/components/ui/navigation-menu/navigation-menu.svelte';
	import '../app.css';
	let { children } = $props();
	let poweredSrc = "src/images/Powered by Fabula Ultima Logo.png" ;
	
	let headerLinks =[ {link:"/",name:"Home"},{link:"/",name:"Campagne"},{link:"/",name:"Schede Personaggio"},{link:"/",name:"Generatore di Oggetti"},{link:"/",name:"Bestiario"}];
</script>

<div class="flex flex-col h-full bg-caribbean_current-500">
	<header>
		<NavigationMenu>
			<NavigationMenuList class="flex items-center justify-between">
				{#each headerLinks as page }
					<NavigationMenuItem>
						<NavigationMenuLink>
							{#snippet child()}
								<a href={page.link} class={navigationMenuTriggerStyle()} >{page.name}</a>
							{/snippet}
						</NavigationMenuLink>
					</NavigationMenuItem>	
				{/each}
				
			</NavigationMenuList>
		</NavigationMenu>
	</header>

	<div class="bg-cafe_noir-900 p-10">
		{@render children()}
	</div>


	<footer class="w-full h-70 flex items-center justify-end">
		<img src={poweredSrc} alt="Powered by Fabula Ultima" class="h-40">
	</footer>
</div>