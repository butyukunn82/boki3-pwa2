(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='practical.html')return;const p=new URLSearchParams(location.search),raw=p.get('seq');if(!raw)return;const ids=raw.split(',').map(x=>x.trim()).filter(Boolean);
function apply(n=0){try{if(typeof C==='undefined'||typeof render!=='function'||typeof seq==='undefined'){if(n<20)return setTimeout(()=>apply(n+1),80);return}const xs=ids.map(id=>C.find(s=>s.id===id)).filter(Boolean);if(!xs.length)return;seq=xs;si=0;step=0;score=0;book=true;answered=false;document.getElementById('home').hidden=true;document.getElementById('done').hidden=true;document.getElementById('quiz').hidden=false;render()}catch(e){if(n<20)setTimeout(()=>apply(n+1),80)}}
setTimeout(()=>apply(),180);
})();