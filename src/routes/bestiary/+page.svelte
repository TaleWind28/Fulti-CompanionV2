<script lang="ts">
    import type { PageData } from "../$types";

    let communityLink = "/bestiary/communityBestiary/";

    let { data } : { data: PageData } = $props();

</script>

<div>
    fetchare i png dal db
</div>

<button> 
    <a href={communityLink}> cerca PNG online</a>
</button>