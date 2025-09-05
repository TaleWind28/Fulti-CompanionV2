<script lang="ts">
    interface Props {
        value?: string;
        placeholder?: string;
    }
    
    let {
        value = $bindable(''),
        placeholder = "URL immagine o carica file..."
    }: Props = $props();
    
    let fileInput: HTMLInputElement;
    let urlInput = $state(value);
    
    // Sincronizza input con valore
    $effect(() => {
        urlInput = value;
    });
    
    function handleUrlChange() {
        value = urlInput;
    }
    
    function handleFileSelect(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            urlInput = result;
            value = result;
        };
        reader.readAsDataURL(file);
    }
    
    function clearImage() {
        urlInput = '';
        value = '';
        if (fileInput) fileInput.value = '';
    }
</script>

<div class="space-y-3">
    <!-- Input URL con pulsante file -->
    <div class="flex gap-2">
        <input
            bind:value={urlInput}
            oninput={handleUrlChange}
            type="text"
            {placeholder}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
            type="button"
            onclick={() => fileInput?.click()}
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
            📁
        </button>
        {#if value}
            <button
                type="button"
                onclick={clearImage}
                class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                ✕
            </button>
        {/if}
    </div>
    
    <!-- Input file nascosto -->
    <input
        bind:this={fileInput}
        type="file"
        accept="image/*"
        onchange={handleFileSelect}
        class="hidden"
    />
    
    <!-- Anteprima -->
    {#if value}
        <div class="border border-gray-200 rounded-lg p-2">
            <img
                src={value}
                alt="Anteprima"
                class="max-w-full h-32 object-cover rounded"
                onerror={() => clearImage()}
            />
        </div>
    {/if}
</div>