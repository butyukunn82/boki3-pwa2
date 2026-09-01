const CACHE='boki3-unified-v2.4.0-mastery-spaced';
const ASSETS=['./','./index.html','./daily.html','./learn.html','./labs.html','./q1.html','./q2.html','./q3.html','./understand.html','./glossary.html','./management.html','./settings.html','./common.css','./mobile-app.css','./app-ui-v13.css','./app-v20.css','./unified.js','./mastery.js','./account-master.js','./phrase-bank.js','./phrase-bridge.js','./manifest.json','./icon-192.png','./icon-512.png','./mascot.png','./assets/mascot.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function withMastery(res){
 if(!res)return res;
 const type=res.headers.get('content-type')||'';
 if(!type.includes('text/html'))return res;
 let text=await res.text();
 if(!text.includes('mastery.js'))text=text.replace(/<\/body>/i,'<script src="./mastery.js"></script></body>');
 const headers=new Headers(res.headers);headers.delete('content-length');headers.set('content-type','text/html; charset=utf-8');
 return new Response(text,{status:res.status,statusText:res.statusText,headers});
}
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(url.origin!==self.location.origin)return;
 const isHtml=e.request.mode==='navigate'||url.pathname.endsWith('.html')||url.pathname.endsWith('/');
 if(isHtml){
  e.respondWith((async()=>{
   try{
    const net=await fetch(e.request);
    if(net&&net.ok){const cache=await caches.open(CACHE);cache.put(e.request,net.clone()).catch(()=>{});return withMastery(net)}
   }catch(err){}
   const cached=await caches.match(e.request,{ignoreSearch:true})||await caches.match('./index.html');
   return withMastery(cached);
  })());
  return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{})}return res}).catch(()=>caches.match('./index.html'))));
});
