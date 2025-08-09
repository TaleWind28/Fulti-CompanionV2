<!-- src/routes/dashboard/+page.svelte -->
<script>
    /** @type {import('./$types').PageData} */
    export let data; // SvelteKit inietta automaticamente qui i dati restituiti dalla funzione `load`
</script>

<h1>Dashboard</h1>
<p>Benvenuto, {data.userEmail}!</p>

<h2>Le tue note:</h2>

{#if data.error}
    <p style="color: red;">{data.error}</p>
{/if}

{#if data.notes && data.notes.length > 0}
    <ul>
        {#each data.notes as note}
            <li>
            </li>
        {/each}
    </ul>
{:else}
    <p>Non hai ancora creato nessuna nota.</p>
{/if}