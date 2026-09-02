(function(){
'use strict';
function current(){return (location.pathname.split('/').pop()||'index.html').toLowerCase()}
function navHtml(){const p=current(),items=[['index.html','⌂','ホーム'],['learn.html','🗺','学習マップ'],['questions.html','☑','問題帳'],['management.html','▦','学習管理'],['settings.html','•••','その他']];return items.map(([href,icon,label])=>`<a href="${href}" class="${p===href?'active':''}"><b>${icon}</b>${label}</a>`).join('')}
function fix(){
 const html=navHtml();
 document.querySelectorAll('.u-nav .u-nav-inner').forEach(n=>{n.innerHTML=html;n.style.gridTemplateColumns='repeat(5,1fr)'});
 document.querySelectorAll('.footer-nav .footer-inner').forEach(n=>{n.innerHTML=html;n.style.gridTemplateColumns='repeat(5,1fr)'});
 if(!document.getElementById('boki-five-nav-style')){const s=document.createElement('style');s.id='boki-five-nav-style';s.textContent='.u-nav-inner,.footer-inner{grid-template-columns:repeat(5,1fr)!important}.u-nav a,.navbtn,.footer-inner a{min-width:0}.u-nav a{font-size:.68rem}.u-nav a b{font-size:1.05rem}@media(max-width:370px){.u-nav a{font-size:.61rem;padding-left:1px;padding-right:1px}.u-nav a b{font-size:.96rem}}';document.head.appendChild(s)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
window.addEventListener('pageshow',fix);
})();