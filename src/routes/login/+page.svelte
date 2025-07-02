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
	import { page } from "$app/state";
  import { goto } from "$app/navigation";

	let email = $state("");
	let password = $state("");
	let username = $state("");


	async function login(){
		const response = await fetch('/api/login',{
			method:'POST',
			body: JSON.stringify({email, password}),
			headers:{
				'content-type': 'applicatiion/json'
			}
		})
		let risposta = await response.json();
		console.log(risposta);
		if (response.status=== 200)goto('/');
		else{
			console.log(response.status+" : "+ response.statusText);
		}
		console.log(risposta);
	}

	async function register() {
		const response = await fetch('api/login',{
			method:'PUT',
			body:JSON.stringify({username,email,password}),
			headers:{
				'content-type':'application/json'
			}
		})

		let risposta = await response.json();
		if (response.status === 200)goto('/');
		else console.log(response.statusText);
	}

	$inspect("Email: " + email+"\nPassword: "+password);
	let logo = "src/images/Logo5.1.png";

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
						get var(){return email},
						set var(value){email = value},
						placeholder:"pino@outlook.it"

					},
					{
						
						text:"Password",
						get var(){return password},
						set var(value){password = value},
						placeholder:""

					}
					],
					footerText:"Accedi",
					clickFun:login
				},
				{
					title:"Crea un Account",
					description:"",
					content:[
					{
						text:"Username",
						get var(){return username},
						set var(value){username = value},
						placeholder:"TaleWind28"

					},
					{
						text:"Email",
						get var(){return email},
						set var(value){email = value},
						placeholder:"pino@outlook.it"

					},
					{
						
						text:"Password",
						get var(){return password},
						set var(value){password = value},
						placeholder:""

					}
					],
					footerText:"Registrati",
					clickFun:register
				}
				]
			}
	);
	let initialValue = $derived.by(()=>{
		let val = page.url.searchParams.get("id");
		if(val === null) return "accedi"
		else return val;
		}
	)
	$inspect(initialValue);
</script>
<div class="bg-cafe_noir-900 flex h-screen">

		<Tabs value={initialValue} class="flex justify-center items-center gap-4 flex-col p-50">
			<div class="flex items-center justify-center">
				<!-- creo una lista di tab per cambiare la visibilità delle stesse -->
				<TabsList class="bg-caribbean_current-400">
					{#each tabSelector.triggers as trigger}
						<TabsTrigger value={trigger.value} class="bg-carribbean_current-400  data-[state=active]:bg-caribbean_current-600 text-white" >{trigger.text}</TabsTrigger>	
					{/each}
				</TabsList>
			</div>
			<!-- creo un contenuto per ogni trigger -->
			{#each tabSelector.contents as card,i }
				<TabsContent value ={tabSelector.triggers[i].value}>
					<Card class="w-700 max-w-sm bg-caribbean_current-400">
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
							<Button type="submit" onclick={card.clickFun}>{card.footerText}</Button>
						</CardFooter>
					</Card>
				</TabsContent>		
			{/each}
		</Tabs>
		<div class=" bg-teal-800 flex items-center justify-center text-white text-2xl  w-full">
        	<a href="/"><img src={logo} alt="logo" class="h-70 w-full"></a>
    	</div>
	
	</div>