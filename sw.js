'use strict';
const CACHE='dk-kasse-v7';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('dk-kasse-v')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  // Restrict interception to this PWA's directory, never other GitHub Pages projects.
  if(!new URL(request.url).pathname.startsWith(new URL(self.registration.scope).pathname))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try {
      // Network first avoids stale app versions; cached files remain available offline.
      const response=await fetch(request);
      if(response.ok&&response.type==='basic')await cache.put(request,response.clone());
      return response;
    } catch (_) {
      const saved=await cache.match(request,{ignoreSearch:true});
      if(saved)return saved;
      throw new Error('Offline and resource not cached');
    }
  })());
});
