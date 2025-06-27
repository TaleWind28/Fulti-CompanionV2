<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";

	
 	import Input from "$lib/components/ui/input/input.svelte";
	import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  	import TabsTrigger from "$lib/components/ui/tabs/tabs-trigger.svelte";
  	import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";
  	import TabsContent from "$lib/components/ui/tabs/tabs-content.svelte";
 	import Card from "$lib/components/ui/card/card.svelte";
  import CardHeader from "$lib/components/ui/card/card-header.svelte";
  import { CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card/index";

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
	let tabSelector = $derived(
			{
			triggers:[
				{value:"accedi",text:"Accedi"},
				{value:"registrati",text:"Registrati"}
				],
			contents:[
				{
					title:"Accedi al tuo Account",
					description:"",
					content:[{
						text:"Email",
						var:email,
						placeholder:"pino@outlook.it"

					},
					{
						text:"Password",
						var:password,
						placeholder:""

					}
					],
					footerText:"Accedi",
					clickFun:()=>{console.log("accesso")}
				},
				{
					title:"Crea un Account",
					description:"",
					content:[{
						text:"Email",
						var:email,
						placeholder:"pino@outlook.it"

					},
					{
						text:"Password",
						var:password,
						placeholder:""

					}
					],
					footerText:"Registrati",
					clickFun:()=>{console.log("registrazione")}
				}
				]
			}
	);
</script>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<Button onclick={add} class="bg-black text-white">Calculate</Button>

<div class="flex items-center justify-center">
	<Tabs value={tabSelector.triggers[0].value} class="w-[400px]">
		<TabsList class="bg-caribbean_current-400">
			{#each tabSelector.triggers as trigger}
				<TabsTrigger value={trigger.value} class="bg-carribean_current-400  data-[state=active]:bg-caribbean_current-600 text-white" >{trigger.text}</TabsTrigger>	
			{/each}
		</TabsList>
		
		{#each tabSelector.contents as card,i }
			<TabsContent value ={tabSelector.triggers[i].value}>
				<Card class="w-full max-w-sm bg-caribbean_current-400">
					<CardHeader>
						<CardTitle class="text-white">{card.title}</CardTitle>
						<CardDescription class="text-white">{card.description}</CardDescription>
					</CardHeader>
					<CardContent class="text-white">
						{#each card.content as element }
							<p>{element.text}</p>
							<Input bind:value={element.var} placeholder={element.placeholder} class="text-black"/>
						{/each}
					</CardContent>
					<CardFooter class="w-full">
						<Button onclick={card.clickFun}>{card.footerText}</Button>
					</CardFooter>
				</Card>
			</TabsContent>		
		{/each}
		
	</Tabs>
</div>


<!-- 
<div class="flex items-center justify-center">
<Tabs value="accedi" class="w-[400px]">
  
  <TabsList class="bg-caribbean_current-400">
    <TabsTrigger value="accedi" class="bg-carribean_current-400  data-[state=active]:bg-caribbean_current-600 text-white">Accedi</TabsTrigger>
    <TabsTrigger value="registrati" class = "data-[state=active]:bg-caribbean_current-600 text-white">Registrati</TabsTrigger>
  </TabsList>

  <TabsContent value="accedi">
		<Card class="w-full max-w-sm bg-caribbean_current-400">
			<CardHeader>
				<CardTitle class="text-white">Accedi al tuo account</CardTitle>
				<CardDescription class="text-white">	</CardDescription>
			</CardHeader>
			<CardContent class="text-white">
				{#each [{text:"Email",var:email,placeholder:"pino@outlook.it"},{text:"Password",var:password,placeholder:""}] as element }
					<p>{element.text}</p>
					<Input bind:value={element.var} placeholder={element.placeholder} class="text-black"/>
				{/each}
			</CardContent>
				<CardFooter>
				<Button onclick={console.log("accedo")} class="w-full">
					Accedi
				</Button>	
			</CardFooter>
		</Card>
  </TabsContent>

  <TabsContent value="registrati">
  		<Card class="w-full max-w-sm bg-caribbean_current-400">
			<CardHeader>
				<CardTitle class="text-white">Accedi al tuo account</CardTitle>
				<CardDescription class="text-white">Card Description</CardDescription>
			</CardHeader>
			<CardContent class="text-white">
				{#each [{text:"Email",var:email,placeholder:"pino@outlook.it"},{text:"Password",var:password,placeholder:""}] as element }
					<p>{element.text}</p>
					<Input bind:value={element.var} placeholder={element.placeholder} class="text-black"/>
				{/each}
			</CardContent>
				<CardFooter>
				<Button onclick={console.log("accedo")} class="w-full">
					Registrati
				</Button>	
			</CardFooter>
		</Card>
	</TabsContent>
</Tabs>	

</div>

 -->

