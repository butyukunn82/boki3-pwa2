(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const installedKey='boki3_pwa_installed_v1';
const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true;

function addStyle(){
 if(document.getElementById('boki-ui-polish-style'))return;
 const st=document.createElement('style');st.id='boki-ui-polish-style';st.textContent=`
 .u-top .boki-top-actions{display:flex;align-items:center;gap:7px;margin-left:auto;flex:none}
 #pwaInstallCard.pwa-install-top{margin:0;padding:0;border:0;background:transparent;box-shadow:none;border-radius:0;grid-template-columns:none;min-height:0}
 #pwaInstallCard.pwa-install-top>.ico,#pwaInstallCard.pwa-install-top>span{display:none!important}
 #pwaInstallCard.pwa-install-top button{min-height:36px;height:36px;border:1px solid #b9d8f0;border-radius:11px;background:#eaf6ff;color:#0d5da4;padding:0 10px;font-size:.72rem;font-weight:950;white-space:nowrap;box-shadow:none}
 #pwaInstallCard.pwa-install-top button:active{transform:scale(.97)}
 .u-nav .management-nav b{color:#176bc1}
 @media(max-width:390px){#pwaInstallCard.pwa-install-top button{padding:0 8px;font-size:.68rem}.u-top .boki-top-actions{gap:5px}}
 `;document.head.appendChild(st);
}

function fixBottomNav(){
 document.querySelectorAll('.u-nav a').forEach(a=>{
  const href=a.getAttribute('href')||'';
  if(href.includes('management.html')||a.textContent.trim()==='復習'){
   a.classList.add('management-nav');
   a.href='management.html?top=1';
   a.innerHTML='<b>▦</b>学習管理';
   a.addEventListener('click',e=>{
    sessionStorage.setItem('boki3_open_management_top','1');
    if(page==='management.html'){
     e.preventDefault();history.replaceState(null,'','management.html');window.scrollTo({top:0,left:0,behavior:'auto'});
    }
   });
  }
 });
}

function forceManagementTop(){
 if(page!=='management.html')return;
 const p=new URLSearchParams(location.search);
 const shouldTop=p.get('top')==='1'||location.hash==='#review'||sessionStorage.getItem('boki3_open_management_top')==='1';
 if(!shouldTop)return;
 sessionStorage.removeItem('boki3_open_management_top');
 history.replaceState(null,'','management.html');
 const go=()=>window.scrollTo({top:0,left:0,behavior:'auto'});
 go();requestAnimationFrame(go);setTimeout(go,80);setTimeout(go,260);
}

function setupTopInstall(){
 if(page!=='index.html')return;
 const box=document.getElementById('pwaInstallCard');
 const header=document.querySelector('.u-top');
 if(!box||!header)return;
 let actions=header.querySelector('.boki-top-actions');
 if(!actions){
  actions=document.createElement('div');actions.className='boki-top-actions';
  const setting=header.querySelector('a[href="settings.html"]');
  if(setting){header.insertBefore(actions,setting);actions.appendChild(setting)}else header.appendChild(actions);
 }
 box.classList.add('pwa-install-top');
 const btn=box.querySelector('button');if(btn)btn.textContent='📱 インストール';
 actions.insertBefore(box,actions.firstChild);
 const markInstalled=()=>{localStorage.setItem(installedKey,'1');box.hidden=true};
 if(isStandalone())markInstalled();
 if(localStorage.getItem(installedKey)==='1')box.hidden=true;
 window.addEventListener('appinstalled',markInstalled);
 window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change',e=>{if(e.matches)markInstalled()});
 const watch=new MutationObserver(()=>{if(isStandalone()||localStorage.getItem(installedKey)==='1')box.hidden=true});
 watch.observe(box,{attributes:true,attributeFilter:['hidden']});
}

function setAppIconLinks(){
 let icon=document.querySelector('link[rel="icon"]');if(!icon){icon=document.createElement('link');icon.rel='icon';document.head.appendChild(icon)}icon.href='app-icon.svg';icon.type='image/svg+xml';
}

function boot(){addStyle();fixBottomNav();forceManagementTop();setAppIconLinks();setTimeout(setupTopInstall,60)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pageshow',()=>{fixBottomNav();forceManagementTop();setTimeout(setupTopInstall,30)});
})();
