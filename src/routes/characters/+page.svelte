<!-- src/routes/dashboard/+page.svelte -->
<script>
    /** @type {import('./$types').PageData} */
    export let data; // SvelteKit inietta automaticamente qui i dati restituiti dalla funzione `load`
</script>

<h1>Dashboard</h1>
<p>Benvenuto, {data.userEmail}!</p>

<h1> {data.uid}</h1>

<h2>Le tue note:</h2>

{#if data.error}
    <p style="color: red;">{data.error}</p>
{/if}	

{#if data.characters && data.characters.length > 0}
    <ul>
        {#each data.characters as char}
            <li>{char.name}</li>
			<li>
				{char.id}
			</li>
        {/each}
    </ul>
{:else}
    <p>Non hai ancora creato nessuna nota.</p>
{/if}