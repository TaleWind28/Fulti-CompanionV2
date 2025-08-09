<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";
    import { Popover } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="dialog-header"
	class={cn("flex flex-col gap-2 text-center sm:text-left", className)}
	{...restProps}
>
	{@render children?.()}
</div>

<Popover.Root>
  <Popover.Content>Place content for the popover here.</Popover.Content>
</Popover.Root>