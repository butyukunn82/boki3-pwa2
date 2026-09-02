const CACHE='boki3-unified-v2.5.13-problem-book-ready';
const ASSETS=['./','./index.html','./daily.html','./learn.html','./questions.html','./labs.html','./q1.html','./q2.html','./q3.html','./understand.html','./glossary.html','./management.html','./settings.html','./common.css','./mobile-app.css','./app-ui-v13.css','./app-v20.css','./unified.js','./settings-runtime.js','./settings-page.js','./dark-mode-fix.js','./contrast-mode-fix.js','./mastery.js','./mastery-native.js','./accrual-layout-fix.js','./asset-lab-v2.js','./dropdown-choice-fix.js','./question-variety-v2.js','./question-book.js','./account-window-bridge.js','./ui-polish.js','./learning-map-nav.js','./account-master.js','./phrase-bank.js','./phrase-bridge.js','./manifest.json','./app-icon-v2.svg','./icon-192-v2.png','./app-icon.svg','./icon-192.png','./icon-512.png','./mascot.png','./assets/mascot.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function withEnhancements(res){
 if(!res)return res;
 const type=res.headers.get('content-type')||'';
 if(!type.includes('text/html'))return res;
 let text=await res.text();
 text=text.replace(/id=["']pwaInstallCard["']/g,'id="pwaInstallHost"');
 text=text.replace(/icon-192\.png/g,'icon-192-v2.png');
 text=text.replace(/app-icon\.svg/g,'app-icon-v2.svg');
 if(!/rel=["']icon["']/i.test(text))text=text.replace(/<\/head>/i,'<link rel="icon" href="./icon-192-v2.png" sizes="192x192"></head>');
 const scripts=[];
 if(!text.includes('settings-runtime.js'))scripts.push('<script src="./settings-runtime.js"></script>');
 if(!text.includes('dark-mode-fix.js'))scripts.push('<script src="./dark-mode-fix.js"></script>');
 if(!text.includes('contrast-mode-fix.js'))scripts.push('<script src="./contrast-mode-fix.js"></script>');
 if(!text.includes('mastery.js'))scripts.push('<script src="./mastery.js"></script>');
 if(!text.includes('mastery-native.js'))scripts.push('<script src="./mastery-native.js"></script>');
 if(!text.includes('accrual-layout-fix.js'))scripts.push('<script src="./accrual-layout-fix.js"></script>');
 if(!text.includes('asset-lab-v2.js'))scripts.push('<script src="./asset-lab-v2.js"></script>');
 if(!text.includes('dropdown-choice-fix.js'))scripts.push('<script src="./dropdown-choice-fix.js"></script>');
 if(!text.includes('question-variety-v2.js'))scripts.push('<script src="./question-variety-v2.js"></script>');
 if(!text.includes('account-window-bridge.js'))scripts.push('<script src="./account-window-bridge.js"></script>');
 if(!text.includes('ui-polish.js'))scripts.push('<script src="./ui-polish.js"></script>');
 if(!text.includes('learning-map-nav.js'))scripts.push('<script src="./learning-map-nav.js"></script>');
 if(!text.includes('settings-page.js'))scripts.push('<script src="./settings-page.js"></script>');
 if(scripts.length)text=text.replace(/<\/body>/i,scripts.join('')+'</body>');
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
    if(net&&net.ok){const cache=await caches.open(CACHE);cache.put(e.request,net.clone()).catch(()=>{});return withEnhancements(net)}
   }catch(err){}
   const cached=await caches.match(e.request,{ignoreSearch:true})||await caches.match('./index.html');
   return withEnhancements(cached);
  })());
  return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{})}return res}).catch(()=>caches.match('./index.html'))));
});