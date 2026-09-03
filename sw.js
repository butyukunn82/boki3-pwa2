const CACHE='boki3-v2-3-ux';
const ASSETS=['./','./index.html','./learn.html','./q1.html','./q2.html','./q3.html','./understand.html','./glossary.html','./management.html','./settings.html','./common.css','./mobile-app.css','./app-ui-v13.css','./app-v20.css','./ux-v23.css','./unified.js','./stats.js','./account-master.js','./manifest.json','./icon-192.png','./icon-512.png','./assets/mascot.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const req=e.request;
  const isPage=req.mode==='navigate'||new URL(req.url).pathname.endsWith('.html');
  if(isPage){
    e.respondWith(fetch(req).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));return res})));
});
