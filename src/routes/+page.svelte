<script>
  import { goto } from "$app/navigation";
  import Grid from "$lib/components/grid.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
    import { icon } from "@fortawesome/fontawesome-svg-core";
  import {faDiceD20,faCloud, faKhanda, faScroll, faBookSkull, faBookBookmark, faHammer} from '@fortawesome/free-solid-svg-icons';   



const features = [
    {
      icon: faScroll,
      iconColor:"text-amber-800",
      title: "Schede Personaggio",
      description: "Creazione semplificata, con aggiunta di equipaggiamento e note."
    },
    {
      icon:faBookSkull,
      iconColor:"",
      title: "Bestiario Integrato",
      description: "Consulta rapidamente mostri e PNG, anche durante le sessioni."
    },
    {
      icon:faBookBookmark,
      iconColor:"text-amber-950",
      title: "Gestione Campagne & Wiki",
      description: "Organizza le tue campagne, invita giocatori e costruite insieme ad una Wiki condivisa per lore e appunti."
    },
    {
      icon:faHammer,
      iconColor:"text-gray",
      title:"Creazione di Oggetti",
      description:"Crea Armi, Armature ed Oggetti da poter usare con il tuo personaggio"
    }
    ];
</script>

<div class="flex flex-col items-center justify-center bg-cafe_noir-900 p-10">
  
  <section class="text-center max-w-2xl">
      <h1 class="flex justify-center">
          <img src="/images/Logo5.1.png" alt="Logo" class="w-auto h-auto">
      </h1>
      <p class=" font-semibold">Un compagno digitale per le tue avventure in Fabula Ultima</p>
      
      <p class=" font-semibold">Gestisci campagne, personaggi, combattimenti e molto altro anche offline</p>
  </section>
  <br><br><br>
 
   <section class="text-center px-4 md:px-8 lg:px-16 py-8 mx-auto min-w-3xl max-w-4xl">
      <Grid grid= {features}>
        
      </Grid>
  </section>

  <br><br><br>

  <Button onclick={()=>goto("/login?id=registrati")}>
    Registrati ora
  </Button>
  <br><br><br>

</div>