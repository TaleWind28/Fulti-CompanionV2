<script lang="ts">
	import { page } from '$app/state';
	import {NavigationMenuItem} from '$lib/components/ui/navigation-menu';
	import NavigationMenuLink from '$lib/components/ui/navigation-menu/navigation-menu-link.svelte';
	import NavigationMenuList from '$lib/components/ui/navigation-menu/navigation-menu-list.svelte';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import NavigationMenu from '$lib/components/ui/navigation-menu/navigation-menu.svelte';
	import '../app.css';
  	import { onMount } from 'svelte';
  	import { user } from '$lib/stores/user';
	import {  onAuthStateChanged } from 'firebase/auth';
	import { auth, logout } from '$lib/firebase';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import * as MenuBar from '$lib/components/ui/menubar/index';

  	
		
	let { children } = $props();
	let poweredSrc = "/images/Powered by Fabula Ultima Logo.png";
	let logo = "/images/Logo5.1.png";
	let headerLinks =[{link:"/",name:"Campagne"},{link:"/characters/",name:"Schede Personaggio"},{link:"/itemGenerator/",name:"Generatore di Oggetti"},{link:"/",name:"Bestiario"}];
	

	onMount(()=>{
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			user.set(firebaseUser);
		});
		console.log($user);
		return unsubscribe;
	})


</script>


<div class="flex flex-col h-screen">
	<!-- top-left, top-center, top-right, bottom-left, bottom-center, bottom-right -->
	<Toaster position="top-center" expand = {true}  richColors />
	<!-- Header del sito -->
	{#if page.url.pathname !== '/login'}

		<header class="flex items-center justify-between px-8 py-4 bg-caribbean_current-500">

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

			<!-- Nome Utente a destra -->
			<div class="flex-none px-5">
				{#if !$user}
				<a href="/login" class="bg-caribbean_current-600 hover:bg-caribbean_current-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2">
					Registrati/Accedi
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
					</svg>
				</a>
				{:else}
					<MenuBar.Root class="bg-caribbean_current-600 hover:bg-caribbean_current-700 text- rounded-md font-medium flex items-center border-0">
						<MenuBar.Menu>
							<MenuBar.Trigger class="focus:!bg-caribbean_current-700 focus:!text-white data-[state=open]:!bg-caribbean_current-700 data-[state=open]:!text-white hover:!bg-caribbean_current-700 hover:!text-white text-white">
								{$user.displayName}
							</MenuBar.Trigger>
							<MenuBar.Content class="!bg-lion_900  !min-w-[200px] !w-auto !p-2">
								<MenuBar.Item>
									Vai al tuo profilo
								</MenuBar.Item>
								<MenuBar.Item>
									<button onclick={logout}>
										Logout
									</button>
								</MenuBar.Item>
							</MenuBar.Content>

						</MenuBar.Menu>
					</MenuBar.Root>
					
				{/if}
			</div>
		</header>
	{/if}

	<!-- componenti da renderizzare -->
		{@render children()}
	
	<!-- footer -->
	{#if page.url.pathname !== '/login'}
		<footer class="w-full h-70 flex items-center justify-end bg-caribbean_current-500">
			<img src={poweredSrc} alt="Powered by Fabula Ultima" class="h-40">
		</footer>
	{/if}

</div>