const CACHE="ee-left-500-v77";const CORE=["/", "/information", "/work", "/contact", "/work/estudioniksen", "/work/andwander", "/work/viviennewestwood", "/work/huxley-parlour", "/work/mejuri", "/work/snowpeak", "/work/weekday", "/work/arket", "/layout-variant.css", "/support.css", "/support.js", "/coracao.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{if(r.ok){const saved=r.clone();caches.open(CACHE).then(c=>c.put(e.request,saved))}return r}).catch(()=>caches.match(e.request).then(r=>r||Response.error())))});
