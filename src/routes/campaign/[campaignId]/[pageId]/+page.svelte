<script lang="ts">
    import type { PageData } from "./$types";
    let {data} : {data: PageData}  = $props();
    $inspect(data,"data");
</script>

{data.pageId}