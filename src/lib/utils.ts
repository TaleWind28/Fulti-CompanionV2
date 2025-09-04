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
import type { FabulaUltimaCharacter } from "./zod";
import { fromDate, getLocalTimeZone, type DateValue } from "@internationalized/date";

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

export function uploadFile(accept='*'): Promise<{name:string, content:string}>{
	return new Promise((resolve,reject)=>{
		const input = document.createElement('input');
		input.type='file';
		input.accept = accept;
		input.style.display = 'none';
		input.onchange = ()=>{
			const file  = input.files?.[0];
			if(!file){
				reject(new Error('Nessun File Selezionato'));
				return;
			}
			const reader = new FileReader();
			reader.onload = ()=>{
				resolve({name:file.name,content:reader.result as string});
			}
			reader.onerror = ()=>{
				reject(new Error('Errore durante la lettura del file'));
			}

			reader.readAsText(file);
		};
		document.body.appendChild(input);
		input.click();
		document.body.removeChild(input);
	});
}

export function retrieveSpellClasses(character:FabulaUltimaCharacter){
  let spellClasses:string[] = [];
  character.classes.forEach((cl)=>{
  if(!spellClasses.includes(cl.spellClass)){
      spellClasses.push(cl.spellClass.toLowerCase());
    }
  })
  return spellClasses;
}

export function isoToDateValue(iso: string | null | undefined): DateValue | undefined {
  if (!iso) return undefined;
  
  const d = new Date(iso);
 
  if (Number.isNaN(d.getTime())) {
    console.error('Invalid date');
    return undefined;
  }
  
  try {
    const timeZone = getLocalTimeZone();
    const result = fromDate(d, timeZone);    
    return result;
  } catch (error) {
    console.error('Error in fromDate:', error);
    return undefined;
  }
}