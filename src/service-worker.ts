/// <reference types="@sveltejs/kit"/>
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope

import {build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];


//installare il SW
self.addEventListener('install',event=>{

    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }

    event.waitUntil(addFilesToCache());
})


//attivare il SW
self.addEventListener('activate', event=>{
    async function deleteOldCaches() {
        for (const key of await caches.keys()){
            if(key !== CACHE){
                await caches.delete(key);
            }
        }
    }

    event.waitUntil(deleteOldCaches());
})

//ascoltare le Fetch
self.addEventListener('fetch', (event)=>{
    const url = new URL(event.request.url);
     async function handleApiCall(){
            try {
                // tenta comunque la fetch normale
                return await fetch(event.request);
                
            } catch {
                // offline → rispondi tu direttamente
                return new Response(
                    JSON.stringify({
                        success:true,
                        data:{
                            offline:true,
                        },
                        message:"SW Response",
                        
                    }),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        }
    
    //se è una fetch ad API locali allora la faccio passare
    if(url.pathname === '/api/accessoryGenerator' && event.request.method === 'POST'){
       
        event.respondWith(handleApiCall());
    }
    //accettiamo solo le GET
    if(event.request.method !== "GET") return;

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        //fornisci i file dalla cache
        if(ASSETS.includes(url.pathname)){
            const cachedResponse = await cache.match(url.pathname);
            if(cachedResponse)return cachedResponse;
        }
        //controllo se c'è rete
        try{
            const response = await fetch(event.request);
            const isNotExtension = url.protocol === 'http:';
            const isSuccess = response.status === 200;
            
            if(isNotExtension && isSuccess){
                console.log("avevo rete");
                cache.put(event.request, response.clone());
            }
            return response;
        }catch{
            console.log("niente rete");
            //fallback to cache
            const cachedResponse = await cache.match(url.pathname);
            if(cachedResponse){
                return cachedResponse;
            }
        }

        return new Response('Not Found',{status:404});
    }

    event.respondWith(respond());
})


self.addEventListener('message', (event)=>{
    if(event.data && event.data.type === 'SKIP_WAITING'){
        self.skipWaiting()
    }
})

console.log("pino");
