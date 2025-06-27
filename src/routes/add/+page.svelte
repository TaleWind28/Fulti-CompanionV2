<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";

	
 	import * as Card from "$lib/components/ui/card/index";
  	import Input from "$lib/components/ui/input/input.svelte";
	import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  	import TabsTrigger from "$lib/components/ui/tabs/tabs-trigger.svelte";
  	import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";
  	import TabsContent from "$lib/components/ui/tabs/tabs-content.svelte";

	let a = $state(0);
	let b = $state(0);
	let total = $state(0);
	let email = $state("");
	let password = $state("");
	async function add() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: {
				'content-type': 'application/json'
			}
		});

		total = await response.json();
	}

	$inspect(email);
</script>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<Button onclick={add} class="bg-black text-white">Calculate</Button>

<div class="flex items-center justify-center">
<Tabs value="accedi" class="w-[400px]">
  
  <TabsList class="bg-caribbean_current-300">
    <TabsTrigger value="accedi" class="bg-carribean_current-400 ">Accedi</TabsTrigger>
    <TabsTrigger value="registrati">Registrati</TabsTrigger>
  </TabsList>

  <TabsContent value="accedi">
		<Card.Root class="w-full max-w-sm bg-caribbean_current-400">
			<Card.Header>
				<Card.Title class="text-white">Accedi al tuo account</Card.Title>
				<Card.Description class="text-white">Card Description</Card.Description>
			</Card.Header>
			<Card.Content class="text-white">
				{#each [{text:"Email",var:email,placeholder:"pino@outlook.it"},{text:"Password",var:password,placeholder:""}] as element }
					<p>{element.text}</p>
					<Input bind:value={element.var} placeholder={element.placeholder} class="text-black"/>
				{/each}
			</Card.Content>
				<Card.Footer>
				<Button onclick={console.log("accedo")} class="w-full">
					Accedi
				</Button>	
			</Card.Footer>
		</Card.Root>
  </TabsContent>

  <TabsContent value="registrati">
  		<Card.Root class="w-full max-w-sm bg-caribbean_current-400">
			<Card.Header>
				<Card.Title class="text-white">Accedi al tuo account</Card.Title>
				<Card.Description class="text-white">Card Description</Card.Description>
			</Card.Header>
			<Card.Content class="text-white">
				{#each [{text:"Email",var:email,placeholder:"pino@outlook.it"},{text:"Password",var:password,placeholder:""}] as element }
					<p>{element.text}</p>
					<Input bind:value={element.var} placeholder={element.placeholder} class="text-black"/>
				{/each}
			</Card.Content>
				<Card.Footer>
				<Button onclick={console.log("accedo")} class="w-full">
					Registrati
				</Button>	
			</Card.Footer>
		</Card.Root>
	</TabsContent>
</Tabs>	

</div>



