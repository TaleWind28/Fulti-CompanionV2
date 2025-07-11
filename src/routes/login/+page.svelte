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
  	import { user } from "$lib/stores/user";
  import { login, registerUser } from "$lib/firebase";
    import { enhance } from "$app/forms";

	let email = $state("");
	let password = $state("");
	let username = $state("");

	
	
	async function firebaseLogin(){
		login(email,password)
		.then(()=>goto('/'))
		.catch((error)=>{alert(error)});
	}

	async function firebaseRegister() {
		registerUser(email,password,username)
		.then(()=>goto('/'))
		.catch((error)=>{alert(error)});
	}

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
					action:'?/login',
					content:[{
						
						text:"Email",
						name:'email',
						get var(){return email},
						set var(value){email = value},
						placeholder:"pino@outlook.it"

					},
					{
						
						text:"Password",
						name:'password',
						get var(){return password},
						set var(value){password = value},
						placeholder:""

					}
					],
					footerText:"Accedi",
					clickFun:firebaseLogin
				},
				{
					title:"Crea un Account",
					description:"",
					action:'?/register',
					content:[
					{
						text:"Username",
						name:'username',
						get var(){return username},
						set var(value){username = value},
						placeholder:"TaleWind28"

					},
					{
						text:"Email",
						name:'email',
						get var(){return email},
						set var(value){email = value},
						placeholder:"pino@outlook.it"

					},
					{
						
						text:"Password",
						name:'password',
						get var(){return password},
						set var(value){password = value},
						placeholder:""

					}
					],
					footerText:"Registrati",
					clickFun:firebaseRegister
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
				<form method = 'POST' use:enhance>
					<TabsContent value ={tabSelector.triggers[i].value}>
						<Card class="w-700 max-w-sm bg-caribbean_current-400">
							<CardHeader>
								<CardTitle class="text-white">{card.title}</CardTitle>
								<CardDescription class="text-white">{card.description}</CardDescription>
							</CardHeader>
							<CardContent class="text-white">
								{#each card.content as element }
									<p>{element.text}</p>
									<Input name={element.name} bind:value={element.var} placeholder={element.placeholder} class="text-black"/>
								{/each}
							</CardContent>
							<CardFooter class="w-full">
								<Button type="submit" formaction={card.action}>{card.footerText}</Button>
							</CardFooter>
						</Card>
					</TabsContent>		
				</form>
			{/each}

		</Tabs>
		<div class=" bg-teal-800 flex items-center justify-center text-white text-2xl  w-full">
        	<a href="/"><img src={logo} alt="logo" class="h-70 w-full"></a>
    	</div>
	
	</div>