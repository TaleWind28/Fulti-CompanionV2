<script lang="ts">
	let { data } = $props();
    $inspect(data,"loaded");
</script>

<h1>blog</h1>

<ul>
	{#each data.summaries as { slug, title }}
		<li><a href="/characters/{slug}">{title}</a></li>
	{/each}
</ul>