    
<!-- src/lib/components/ui/progress/LabeledProgress.svelte -->
<script lang="ts">
	// Importa il componente base
	import Progress from "./ui/progress/progress.svelte";

	// 1. DICHIARAZIONE DELLE PROPS CON $props()
	// $props() sostituisce `export let`. Definiamo le props e i loro valori di default.
	// La prop `class` viene catturata e rinominata in `className` per evitare conflitti.
	let {
		value = 0,
		max = 100,
		progressColor = 'bg-red-500',
		trackColor = 'bg-red-200',
		class: className = ''
	} = $props<{
		value?: number;
		max?: number;
		progressColor?: string;
		trackColor?: string;
		class?: string;
	}>();

	// 2. CREAZIONE DI VALORI DERIVATI CON $derived
	// `progressClasses` si ricalcola automaticamente solo quando una delle sue dipendenze
	// (`trackColor`, `progressColor`, `className`) cambia. Sostituisce la reattività implicita.
	const progressClasses = $derived(
		`h-6 ${trackColor} [&_[data-slot=progress-indicator]]:${progressColor} ${className}`
	);
</script>

<!-- Il template HTML rimane identico -->
<div class="relative w-full">
	<Progress {value} {max} class={progressClasses} />

	<span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
		{value}/{max}
	</span>
</div>

  