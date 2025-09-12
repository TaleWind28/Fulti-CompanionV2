<script>
    import { afterNavigate } from "$app/navigation";
    let successRoute = $state("/");
    // afterNavigate(({ to, from }) => {
    //     // Cancella i dati qui
	// 	console.log('ho navigato da', from?.url.pathname, 'a', to?.url.pathname);

	// 	if(from){
	// 		successRoute = from.url.pathname;
	// 	}
    // });
</script>
<div class="h-screen w-screen">
    <p>Purtoppo Per accedere a questa sezione è necessaria la connessione ad Internet,nel frattempo puoi andara a creare degli oggetti...</p>
</div>