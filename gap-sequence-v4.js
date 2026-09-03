(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='official-gaps.html')return;
function patch(n=0){if(typeof start!=='function'||typeof T==='undefined'){if(n<30)return setTimeout(()=>patch(n+1),60);return}if(start.__gapSeq)return;const orig=start;const w=function(id,b=false){const p=new URLSearchParams(location.search),raw=p.get('seq');if(b&&raw){const ids=raw.split(',').map(decodeURIComponent),picked=ids.map(x=>T.find(t=>t.id===x)).filter(Boolean);if(picked.length){seq=picked;ti=0;qi=0;score=0;book=true;document.getElementById('home').hidden=true;document.getElementById('done').hidden=true;document.getElementById('quiz').hidden=false;render();return}}return orig.apply(this,arguments)};w.__gapSeq=true;window.start=w}
patch();
})();