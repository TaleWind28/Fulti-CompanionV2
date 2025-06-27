<script lang="ts">
  import {NavigationMenuItem} from '$lib/components/ui/navigation-menu';
  import NavigationMenuLink from '$lib/components/ui/navigation-menu/navigation-menu-link.svelte';
  import NavigationMenuList from '$lib/components/ui/navigation-menu/navigation-menu-list.svelte';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import NavigationMenu from '$lib/components/ui/navigation-menu/navigation-menu.svelte';
  import { Button } from 'bits-ui';
	import '../app.css';
	let { children } = $props();
	let poweredSrc = "src/images/Powered by Fabula Ultima Logo.png" ;
	let logo = "src/images/Logo5.1.png";
	let headerLinks =[{link:"/",name:"Campagne"},{link:"/",name:"Schede Personaggio"},{link:"/",name:"Generatore di Oggetti"},{link:"/",name:"Bestiario"}];
</script>

<div class="flex flex-col h-full bg-caribbean_current-500">
	<header class="flex items-center justify-center">
		<NavigationMenu class="w-full p-5">
			<NavigationMenuList class="flex  justify-between items-center gap-5 bg-caribbean_current-500 w-full">
				<NavigationMenuItem class="flex-none">
					<NavigationMenuLink class="flex items-start">
						<a href="/"> <img src={logo} alt="logo" class="flex items-start  w-auto h-12"></a>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<div class="flex space-x-4 justify-center">
					{#each headerLinks as page }
						<NavigationMenuItem class="!flex-1 !justify-end">
							<NavigationMenuLink class="w-full">
								{#snippet child()}
									<a href={page.link} class="{navigationMenuTriggerStyle()} !bg-caribbean_current-500 hover:!bg-caribbean_current-400 text-white text-3xl !w-full !h-full !text-center" >{page.name}</a>
								{/snippet}
							</NavigationMenuLink>
						</NavigationMenuItem>	
					{/each}
				</div>

				<NavigationMenuItem class="">
					<NavigationMenuLink>
						<a href="/login">Accedi/Registrati</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
			
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