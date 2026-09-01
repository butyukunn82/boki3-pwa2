(function(){
  const defaults={theme:'standard',font:'standard',size:'standard',motion:'standard',daily:10};
  let s={...defaults};try{s={...s,...JSON.parse(localStorage.getItem('boki3_unified_settings')||'{}')}}catch(e){}
  window.BOKI_SETTINGS=s;
  const r=document.documentElement;
  if(s.theme==='dark'){r.style.setProperty('--u-bg','#101722');r.style.setProperty('--u-card','#17202c');r.style.setProperty('--u-text','#edf3f8');r.style.setProperty('--u-muted','#aeb9c6');r.style.setProperty('--u-line','#324153')}
  if(s.theme==='gentle'){r.style.setProperty('--u-bg','#fffaf0')}
  if(s.theme==='contrast'){r.style.setProperty('--u-text','#000');r.style.setProperty('--u-line','#4b5563')}
  const sizes={small:'14px',standard:'16px',large:'18px',xlarge:'20px'};document.documentElement.style.fontSize=sizes[s.size]||'16px';
  if(s.font==='rounded')document.body.style.fontFamily='"Hiragino Maru Gothic ProN","Yu Gothic UI",sans-serif';
  if(s.font==='serif')document.body.style.fontFamily='"Yu Mincho","Hiragino Mincho ProN",serif';
  if(s.motion==='off'){const st=document.createElement('style');st.textContent='*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';document.head.appendChild(st)}
  const p=location.pathname.split('/').pop()||'index.html';if(!['index.html','management.html','settings.html','glossary.html','learn.html'].includes(p))localStorage.setItem('boki3_last_page',p+location.search);
})();
