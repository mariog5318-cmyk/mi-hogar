const CACHE='mi-hogar-v4';
const APP='./index.html';

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json'])).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
 e.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);
 if(e.request.mode==='navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/mi-hogar/')){
  e.respondWith(
   fetch(e.request,{cache:'no-store'})
    .then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(c=>c.put(APP,copy));
      return response;
    })
    .catch(()=>caches.match(APP))
  );
 } else {
  e.respondWith(
   caches.match(e.request).then(r=>r||fetch(e.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return response;
   }).catch(()=>caches.match(APP)))
  );
 }
});