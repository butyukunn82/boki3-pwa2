(function(){
'use strict';
function fix(){
  document.querySelectorAll('.u-nav a').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('?')[0].split('#')[0];
    if(href==='learn.html' || href.endsWith('/learn.html')){
      a.href='learn.html';
      a.innerHTML='<b>🗺</b>学習マップ';
    }
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
window.addEventListener('pageshow',fix);
})();