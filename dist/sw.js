const VERSION='20260920';
const CACHE=`reson-v2-studio-${VERSION}`;
const ASSETS=['./','./index.html','./styles.css','./studio.css','./app.js','./core.js','./lexicon.js','./lyrics.js','./themes.js','./studio.js','./studio-view.js','./icon.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('reson-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data==='skip-waiting')self.skipWaiting();});
// Cache d'abord (rapide, hors ligne fiable), mise à jour du cache en tâche de fond à chaque visite.
self.addEventListener('fetch',e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(req);
    const network=fetch(req).then(response=>{
      if(response.ok&&response.type==='basic')cache.put(req,response.clone());
      return response;
    }).catch(()=>null);
    if(cached){network.catch(()=>{});return cached;}
    const fresh=await network;
    if(fresh)return fresh;
    return (await cache.match('./index.html'))||Response.error();
  })());
});
