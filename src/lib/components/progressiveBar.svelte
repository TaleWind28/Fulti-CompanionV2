
    <script>
        // Props del componente
        let {
            label = "PV",
            actual = 40,
            max = 70,
            color, 
            bgColor
        } =$props()
        
        // Calcolo della percentuale di riempimento
        let percentage = $derived((max > 0) ? Math.min(100, Math.max(0, (actual / max) * 100)) : 0);
    </script>
    
    <div class="w-full relative h-8 mb-1">
        <!-- Sfondo della barra -->
        <div 
            class="absolute top-0 left-0 h-full w-full"
            style="background-color: {bgColor};"
        ></div>
        
        <!-- Barra di progresso colorata -->
        <div 
            class="absolute top-0 left-0 h-full transition-all duration-300 ease-in-out {color}"
            style="width: {percentage}%; background-color: {color};"
        ></div>
        
        <!-- Testo sovrapposto -->
        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-black font-medium text-sm">
            {actual}/{max} {label}
        </div>
    </div>