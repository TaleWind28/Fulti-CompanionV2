import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

import { toPng } from 'html-to-image';

export async function exportHtmlToImage(elementId: string) {
	const node = document.getElementById(elementId);

	if (!node) {
		console.error('Elemento non trovato:', elementId);
		return;
	}

	try {
		const dataUrl = await toPng(node);
		const link = document.createElement('a');
		link.download = `${elementId}.png`;
		link.href = dataUrl;
		link.click();
	} catch (error) {
		console.error('Errore nella conversione:', error);
	}
}

export function downloadFile(data:any, filename:string, mimeType = 'application/octet-stream') {
  // console.log(data,"data to download");
  // 1. Crea un Blob se i dati sono una stringa
  const blob = (data instanceof Blob) ? data : new Blob([data], { type: mimeType });

  // 2. Crea un Object URL per il Blob
  const url = URL.createObjectURL(blob);

  // 3. Crea un elemento <a> temporaneo
  const a = document.createElement('a');

  // 4. Imposta gli attributi del link
  a.href = url;
  a.download = filename;

  // 5. Aggiungi il link al documento (necessario per Firefox in alcuni casi),
  //    simula il click e rimuovilo.
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 6. Revoca l'Object URL per liberare risorse
  URL.revokeObjectURL(url);
}


export function blobUrlToBase64(blobUrl:any) {
  return new Promise((resolve, reject) => {
    // 1. Usa fetch per recuperare i dati dall'URL Blob
    fetch(blobUrl)
      .then(response => {
        
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        // 2. Ottieni l'oggetto Blob dalla risposta
        return response.blob();
      })
      .then(blob => {
        
        const reader = new FileReader();
        reader.onload = () => {
          // La lettura è completata, risolviamo la promise con il risultato
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          // C'è stato un errore durante la lettura
          reject(new Error("Errore durante la lettura del Blob: " + error));
        };
        // 3. Usa FileReader per convertire il Blob in Base64 (Data URL)
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        // C'è stato un errore nel fetch
        reject(new Error("Errore nel fetch dell'URL Blob: " + error));
      });
  });
}

export async function processSelectedJsonFile(file: File | null): Promise<any> {
  return new Promise((resolve, reject) => {
    if(file == null)return new Error("il file non è valido!");
    // Controlla il tipo di file (opzionale ma buona pratica)
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error("Il file selezionato non sembra essere un file JSON. Assicurati che l'estensione sia .json o il tipo MIME sia application/json."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        if (!fileContent) {
          reject(new Error("Il contenuto del file è vuoto o illeggibile."));
          return;
        }
        // console.log(fileContent);
        const jsonData = JSON.parse(fileContent);
        
        // console.log(jsonData,"jsonData processSelectedFile")
        resolve(jsonData);
      } catch (e) {
        reject(new Error(`Errore durante il parsing del JSON:`+ e ));
      }
    };

    reader.onerror = (error) => {

      reject(new Error(`Errore durante la lettura del file: ${error}`));
    };
    console.log(file)
    reader.readAsText(file); // Legge il file come testo
  });
}