<script>
  import { goto } from "$app/navigation";
  import Grid from "$lib/components/grid.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import {faDiceD20,faCloud, faKhanda, faScroll, faBookSkull, faBookBookmark} from '@fortawesome/free-solid-svg-icons';   



const features = [
    {
      icon: faScroll,
      iconColor:"text-amber-800",
      title: "Schede Personaggio",
      description: "Creazione guidata, con aggiunta di equipaggiamento e note. Sempre disponibili, anche offline."
    },
    {
      icon:faBookSkull,
      iconColor:"",
      title: "Bestiario Integrato",
      description: "Consulta rapidamente mostri e PNG, filtra per livello o tipo. Accessibile offline e durante le sessioni."
    },
    {
      icon:faBookBookmark,
      iconColor:"text-amber-950",
      title: "Gestione Campagne & Wiki",
      description: "Organizza le tue campagne, invita giocatori e costruite insieme ad una Wiki condivisa per lore e appunti."
    },
    {
      icon:faDiceD20,
      iconColor:"text-purple-900",
      title: "Dice Roller Avanzato",
      description: "Tira dadi personalizzati con un click. Log storico dei tiri per non perdere nulla."
    },
    {
      icon:faKhanda,
      iconColor:" text-red-900",
      title: "Combat Helper",
      description: "Un simulatore di combattimento per tenere tenere sempre alta l'attenzione dei giocatori."
    },
    {
      icon:faCloud,
      iconColor:"text-grey-900",
      title: "Offline Availability",
      description: "Lavora offline senza problemi, i tuoi dati si sincronizzeranno automaticamente appena torni online."
    }];
</script>

<div class="flex flex-col items-center justify-center bg-cafe_noir-900 p-10">
  
  <section class="text-center max-w-2xl">
      <h1 class="flex justify-center">
          <img src="src/images/Logo5.1.png" alt="Logo" class="w-auto h-auto">
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