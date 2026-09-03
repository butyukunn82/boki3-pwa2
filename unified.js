(function(){
  const KEY='boki3_unified_settings';
  const LEGACY='boki3_unified_settings_v1';
  const defaults={theme:'standard',font:'standard',size:'standard',motion:'standard',daily:10};
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(LEGACY)||'{}')||{}}catch(e){}
  const s={...defaults,...saved};
  window.BOKI_SETTINGS=s;
  window.BOKI_SETTINGS_KEY=KEY;
  if(!localStorage.getItem(KEY) && localStorage.getItem(LEGACY)){
    try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}
  }
  const r=document.documentElement;
  const sizes={small:'14px',standard:'16px',large:'18px',xlarge:'20px'};
  r.style.fontSize=sizes[s.size]||'16px';
  if(s.theme==='dark'){r.style.setProperty('--u-bg','#101722');r.style.setProperty('--u-card','#17202c');r.style.setProperty('--u-text','#edf3f8');r.style.setProperty('--u-muted','#aeb9c6');r.style.setProperty('--u-line','#324153')}
  if(s.theme==='gentle')r.style.setProperty('--u-bg','#fffaf0');
  if(s.theme==='contrast'){r.style.setProperty('--u-text','#000');r.style.setProperty('--u-line','#4b5563')}
  if(s.motion==='off'){const st=document.createElement('style');st.textContent='*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';document.head.appendChild(st)}
  function finish(){
    if(document.body){
      if(s.font==='rounded')document.body.style.fontFamily='"Hiragino Maru Gothic ProN","Yu Gothic UI",sans-serif';
      if(s.font==='serif')document.body.style.fontFamily='"Yu Mincho","Hiragino Mincho ProN",serif';
    }
    const p=location.pathname.split('/').pop()||'index.html';
    if(!['index.html','management.html','settings.html','glossary.html','learn.html','understand.html'].includes(p)){
      try{localStorage.setItem('boki3_last_page',p+location.search)}catch(e){}
    }
    r.classList.add('ui-ready');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',finish,{once:true});else finish();
})();


/* v2.3 compatibility patches for legacy large exercise pages. */
(function(){
  function replaceExact(root, map){
    const w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n=>{const t=n.nodeValue.trim(); if(map[t]) n.nodeValue=n.nodeValue.replace(t,map[t]);});
  }
  function nav4(sel){
    const a=[...document.querySelectorAll(sel)];
    if(a.length>=4){a[0].innerHTML='<b>⌂</b>ホーム';a[1].innerHTML='<b>▣</b>学ぶ';a[2].innerHTML='<b>↻</b>復習';a[3].href='management.html';a[3].innerHTML='<b>▥</b>記録';}
  }
  function patchQ2(){
    const s=document.querySelector('.top small'); if(s)s.textContent='帳簿の役割を見分けて解く';
    const stats=document.querySelector('.stats-grid'); if(stats)stats.style.display='none';
    document.querySelectorAll('.app-section-title').forEach(x=>{if(x.textContent.trim()==='学習メニュー')x.textContent='練習する'; if(x.textContent.trim()==='分野別の定着度')x.style.display='none';});
    const weak=document.getElementById('weakList'); if(weak)weak.style.display='none';
    const cards=[...document.querySelectorAll('.topic-button')];
    cards.forEach(b=>{const h=b.querySelector('b'),sm=b.querySelector('small');if(!h)return; if(h.textContent.trim()==='瞬間ドリル'){h.textContent='反射練習';if(sm)sm.textContent='帳簿・勘定を見た瞬間に判断';} if(h.textContent.trim()==='帳簿の構造を理解'){h.textContent='構造を確認';if(sm)sm.textContent='取引 → 仕訳 → 補助簿・元帳の順で判断';} if(h.textContent.trim()==='CBT演習'){h.textContent='連続演習';if(sm)sm.textContent='15問を続けて解き、判断を安定させる';}});
    nav4('.footer-nav .navbtn');
    replaceExact(document.body,{'瞬間ドリル':'反射練習','構造理解':'構造確認','CBT演習':'連続演習'});
  }
  function patchQ3(){
    const s=document.querySelector('.top small'); if(s)s.textContent='決算整理を順番に解く';
    document.querySelectorAll('.topic-button b').forEach(h=>{if(h.textContent.trim()==='CBT大問'){h.textContent='総合演習';const sm=h.parentElement.querySelector('small');if(sm)sm.textContent='複数の決算整理をまとめて解く';}});
    const cf=document.querySelector('.closing-flow'); if(cf)cf.innerHTML='<h3>考える順番</h3><div class="v23-stage"><div><b>1. 何の処理？</b><small>論点を見極める</small></div><div><b>2. 仕訳</b><small>増減と借方・貸方</small></div><div><b>3. 金額</b><small>必要な計算だけする</small></div></div><div class="v23-stage"><div><b>4. 表へ反映</b><small>P/L・B/Sまでつなげる</small></div></div>';
    const support=document.querySelector('.app-support-grid'); if(support){const title=support.previousElementSibling;if(title&&title.classList.contains('app-section-title'))title.textContent='しくみを確認したいとき';support.innerHTML='<a class="app-support-card manage" href="understand.html" style="text-align:left;text-decoration:none"><span style="font-size:1.4rem">💡</span><span><b>しくみを理解</b><span>図と数字の流れで確認する</span></span></a>';}
    const ws=document.querySelector('#worksheet .learn-hero h2');if(ws)ws.textContent='数字を動かして精算表を理解';
    const lab=document.querySelector('#lab .learn-hero h2');if(lab)lab.textContent='取引から決算まで';
    nav4('.footer-nav .navbtn');
    replaceExact(document.body,{'CBT大問演習':'総合大問演習','CBT大問':'総合演習'});
  }
  function run(){const p=location.pathname.split('/').pop(); if(['q2.html','q3.html'].includes(p)&&!document.querySelector('link[href=\"ux-v23.css\"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='ux-v23.css';document.head.appendChild(l);} if(p==='q2.html')patchQ2(); if(p==='q3.html')patchQ3();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  if(['q2.html','q3.html'].includes(location.pathname.split('/').pop())){
    const obs=new MutationObserver(()=>{const p=location.pathname.split('/').pop();replaceExact(document.body,p==='q2.html'?{'瞬間ドリル':'反射練習','構造理解':'構造確認','CBT演習':'連続演習'}:{'CBT大問演習':'総合大問演習','CBT大問':'総合演習'});});
    obs.observe(document.documentElement,{subtree:true,childList:true});
  }
})();
