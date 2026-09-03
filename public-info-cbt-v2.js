(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
function run(){
  if(page==='about.html'||document.getElementById('publicInfoNotice')||document.querySelector('main'))return;
  const host=document.querySelector('body > .wrap')||document.querySelector('body > .app')||document.querySelector('body > .u-app');
  if(!host)return;
  const d=document.createElement('div');
  d.id='publicInfoNotice';
  d.className='public-info-note';
  d.innerHTML='個人制作の非公式学習アプリです。日本商工会議所・各地商工会議所の公式教材ではありません。 <a href="about.html">このアプリについて</a>';
  host.appendChild(d);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('pageshow',run);
})();
