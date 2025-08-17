<!-- Slider singolo con ticks e labels -->
<div class="space-y-6">
  <div>
    <label class="block text-sm font-medium mb-2">
      Volume: {singleValue}%
    </label>
    
    <Slider.Root 
      type="single"
      bind:value={singleValue} 
      min={0} 
      max={100} 
      step={10}
      onValueChange={handleValueChange}
      class="relative flex w-full touch-none select-none items-center"
      trackPadding={3}
    >
      {#snippet children({ tickItems, thumbItems })}
        <!-- Traccia dello slider -->
        <div class="relative h-2 w-full grow rounded-full bg-gray-200">
          <Slider.Range class="absolute h-full rounded-full bg-blue-500" />
        </div>

        <!-- Thumb -->
        {#each thumbItems as { index } (index)}
          <Slider.Thumb 
            {index}
            class="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          />
        {/each}

        <!-- Ticks e Labels -->
        {#each tickItems as { index, value } (index)}
          <Slider.Tick 
            {index}
            class="absolute h-2 w-0.5 bg-gray-400 z-0"
          />
          <Slider.TickLabel 
            {index}
            position="bottom"
            class="text-xs text-gray-600 mt-2 font-medium"
          >
            {value}%
          </Slider.TickLabel>
        {/each}
      {/snippet}
    </Slider.Root>
  </div>
</div>