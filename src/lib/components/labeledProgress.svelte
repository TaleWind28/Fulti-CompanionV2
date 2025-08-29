    
<!-- src/lib/components/ui/progress/LabeledProgress.svelte -->
<script lang="ts">
	// Importa il componente base
	import Progress from "./ui/progress/progress.svelte";

	let {
		value = 0,
		max = 100,
		progressColor = 'bg-red-500',
		class: className = ''
	} = $props<{
		value?: number;
		max?: number;
		progressColor?: string;
		trackColor?: string;
		class?: string;
	}>();

 
	const progressClasses = $derived(
		`${progressColor} ${className}`
	);
</script>

<!-- Il template HTML rimane identico -->
<div class="relative w-full">
	<Progress {value} {max} class={progressClasses} />

	<span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
		{value}/{max}
	</span>
</div>

  