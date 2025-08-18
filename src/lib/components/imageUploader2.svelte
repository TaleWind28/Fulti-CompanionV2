<script lang="ts">
  let defaultImage = "/images/UploadImage.png";

  let {
    dimensions = "w-auto h-auto", 
    fill = false, 
    imageUrl = $bindable(), 
    padre = $bindable(),
    showDeletion = false,
    allowUrlInput = false, // Nuovo prop per abilitare input URL
    showButtons = false, // Nuovo prop per mostrare/nascondere i pulsanti
    placeholder = "Inserisci URL immagine o carica file..."
  } = $props();
  
  let uploadError = $state();
  let urlInput = $state(""); // Input per URL remoti
  let showUrlInput = $state(false); // Toggle per mostrare input URL
  let imageLoading = $state(false); // Stato loading per URL remoti
  let imageLoadError = $state(false); // Errore caricamento immagine remota

  let imageSrc = $derived.by(() => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === "") {
      return defaultImage;
    }
    return imageUrl;
  });

  let modality = () => {
    if(fill === true) return "object-fill";
    else return "object-cover";
  }
  
  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0] || null;
    uploadError = null;
    imageLoadError = false;

    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        // Rilascia l'eventuale URL precedente per evitare memory leak
        if (imageUrl && imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imageUrl);
        }
        imageUrl = URL.createObjectURL(selectedFile);
      } else {
        uploadError = 'Per favore, seleziona un file immagine valido.';
      }
    }
    if (target) target.value = '';
  }

  function handleUrlSubmit() {
    if (!urlInput.trim()) {
      uploadError = 'Inserisci un URL valido';
      return;
    }

    // Validazione base URL
    try {
      new URL(urlInput.trim());
    } catch {
      uploadError = 'URL non valido';
      return;
    }

    uploadError = null;
    imageLoadError = false;
    imageLoading = true;

    // Rilascia l'eventuale blob URL precedente
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }

    imageUrl = urlInput.trim();
    showUrlInput = false;
    urlInput = "";
  }

  function handleImageLoad() {
    imageLoading = false;
    imageLoadError = false;
  }

  function handleImageError() {
    imageLoading = false;
    imageLoadError = true;
    uploadError = 'Impossibile caricare l\'immagine dall\'URL specificato';
  }

  function toggleUrlInput() {
    showUrlInput = !showUrlInput;
    uploadError = null;
  }

  function clearImage() {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    imageUrl = "";
    urlInput = "";
    uploadError = null;
    imageLoadError = false;
    showUrlInput = false;
  }

  // Cleanup quando il componente viene distrutto
  $effect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  });
</script>

<div class="image-uploader-container">
  <!-- Immagine principale -->
  <div class="relative inline-block">
    <label for={padre+"file-selector"} class="cursor-pointer">
      <img
        src={imageSrc}
        alt="Impossibile caricare l'immagine"
        class="{dimensions} {modality} {imageLoading ? 'opacity-50' : ''}"
        onload={handleImageLoad}
        onerror={handleImageError}
      />
      {#if imageLoading}
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      {/if}
    </label>

    <!-- Bottone per cancellare immagine -->
    {#if imageUrl && imageUrl !== defaultImage && showDeletion}
      <button
        onclick={clearImage}
        class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
        title="Rimuovi immagine"
      >
        ×
      </button>
    {/if}
  </div>

  <!-- Input file nascosto -->
  <input 
    type="file" 
    id={padre+"file-selector"} 
    accept="image/*" 
    onchange={handleFileSelect} 
    style="display: none;" 
    aria-hidden="true"
  />

  <!-- Controlli aggiuntivi -->
  {#if showButtons}
    <div class="mt-3 space-y-2">
      {#if allowUrlInput}
        <div class="flex gap-2">
          <button
            onclick={toggleUrlInput}
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showUrlInput ? 'Annulla URL' : 'Usa URL'}
          </button>
          
          <label for={padre+"file-selector"} class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
            Carica File
          </label>
        </div>

        <!-- Input per URL -->
        {#if showUrlInput}
          <div class="flex gap-2">
            <input
              type="url"
              bind:value={urlInput}
              placeholder={placeholder}
              class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              onkeydown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <button
              onclick={handleUrlSubmit}
              class="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        {/if}
      {:else}
        <!-- Se allowUrlInput è false, mostra solo il bottone carica file -->
        <div class="flex gap-2">
          <label for={padre+"file-selector"} class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
            Carica File
          </label>
        </div>
      {/if}

      <!-- Messaggi di errore -->
      {#if uploadError}
        <div class="text-red-600 text-sm">{uploadError}</div>
      {/if}

      {#if imageLoadError}
        <div class="text-red-600 text-sm">
          Errore nel caricamento dell'immagine remota
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .image-uploader-container {
    display: inline-block;
  }
</style>