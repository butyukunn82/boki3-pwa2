(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const installedKey='boki3_pwa_installed_v1';
const HOST_ID='pwaInstallHost';
const LEGACY_ID='pwaInstallCard';
const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent||'');
let installPrompt=null;
let installBusy=false;
let installResetTimer=0;
let appInstalledBound=false;

window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  installPrompt=e;
  setTimeout(refreshInstallButton,0);
});

function installBox(){return document.getElementById(HOST_ID)||document.getElementById(LEGACY_ID)}

function sanitizeInstallBox(){
  let box=installBox();
  if(!box)return null;
  if(box.dataset.safeInstall==='1')return box;
  const clean=box.cloneNode(true);
  clean.id=HOST_ID;
  clean.dataset.safeInstall='1';
  box.replaceWith(clean);
  return clean;
}

function addStyle(){
 if(document.getElementById('boki-ui-polish-style'))return;
 const st=document.createElement('style');st.id='boki-ui-polish-style';st.textContent=`
 .u-top .boki-top-actions{display:flex;align-items:center;gap:7px;margin-left:auto;flex:none}
 #${HOST_ID}.pwa-install-top{margin:0;padding:0;border:0;background:transparent;box-shadow:none;border-radius:0;grid-template-columns:none;min-height:0}
 #${HOST_ID}.pwa-install-top>.ico,#${HOST_ID}.pwa-install-top>span{display:none!important}
 #${HOST_ID}.pwa-install-top button{min-height:36px;height:36px;border:1px solid #b9d8f0;border-radius:11px;background:#eaf6ff;color:#0d5da4;padding:0 10px;font-size:.72rem;font-weight:950;white-space:nowrap;box-shadow:none}
 #${HOST_ID}.pwa-install-top button:active{transform:scale(.97)}
 #${HOST_ID}.pwa-install-top button:disabled{opacity:.72;transform:none}
 .u-nav .management-nav b{color:#176bc1}
 .pwa-confirm-backdrop{position:fixed;inset:0;z-index:99999;background:rgba(18,29,42,.48);display:grid;place-items:center;padding:22px}
 .pwa-confirm-backdrop[hidden]{display:none!important}
 .pwa-confirm-dialog{width:min(390px,100%);background:#fff;border-radius:22px;padding:20px 18px 16px;box-shadow:0 24px 70px rgba(13,36,62,.28);border:1px solid #dbe5ef;color:#26384a}
 .pwa-confirm-icon{width:64px;height:64px;margin:0 auto 12px;border-radius:19px;background:linear-gradient(135deg,#e8f6ff,#d8ecff);display:grid;place-items:center;font-size:2rem}
 .pwa-confirm-dialog h2{margin:0;text-align:center;font-size:1.12rem;line-height:1.5;color:#1e3550}
 .pwa-confirm-dialog p{margin:9px 0 0;text-align:center;color:#687b8d;font-size:.82rem;line-height:1.65}
 .pwa-confirm-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:17px}
 .pwa-confirm-actions button{min-height:50px;border-radius:14px;font-size:.95rem;font-weight:950;cursor:pointer}
 .pwa-confirm-no{border:1px solid #ced9e4;background:#f5f7fa;color:#40566d}
 .pwa-confirm-yes{border:0;background:linear-gradient(135deg,#2182d4,#1764b4);color:#fff;box-shadow:0 6px 14px rgba(23,100,180,.20)}
 .pwa-confirm-help{margin-top:13px;padding:10px 11px;border-radius:12px;background:#fff7e7;border:1px solid #ecd7a5;color:#76591b;font-size:.76rem;line-height:1.55;text-align:left}
 @media(max-width:390px){#${HOST_ID}.pwa-install-top button{padding:0 8px;font-size:.68rem}.u-top .boki-top-actions{gap:5px}.pwa-confirm-backdrop{padding:16px}.pwa-confirm-dialog{padding:18px 15px 14px}}
 `;document.head.appendChild(st);
}

function fixBottomNav(){
 document.querySelectorAll('.u-nav a').forEach(a=>{
  const href=a.getAttribute('href')||'';
  if(href.includes('management.html')||a.textContent.trim()==='復習'){
   a.classList.add('management-nav');
   a.href='management.html?top=1';
   a.innerHTML='<b>▦</b>学習管理';
   if(a.dataset.managementTopBound==='1')return;
   a.dataset.managementTopBound='1';
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

function ensureInstallDialog(){
 let wrap=document.getElementById('pwaSafeConfirm');
 if(wrap)return wrap;
 wrap=document.createElement('div');wrap.id='pwaSafeConfirm';wrap.className='pwa-confirm-backdrop';wrap.hidden=true;
 wrap.innerHTML=`<div class="pwa-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="pwaConfirmTitle">
   <div class="pwa-confirm-icon">📱</div>
   <h2 id="pwaConfirmTitle">スマホのホーム画面に<br>アイコンを作成しますか？</h2>
   <p>「はい」を押すと、ブラウザの正式なインストール確認画面を表示します。</p>
   <div id="pwaConfirmHelp" class="pwa-confirm-help" hidden></div>
   <div class="pwa-confirm-actions"><button type="button" class="pwa-confirm-no">いいえ</button><button type="button" class="pwa-confirm-yes">はい</button></div>
 </div>`;
 document.body.appendChild(wrap);
 wrap.querySelector('.pwa-confirm-no').addEventListener('click',closeInstallDialog);
 wrap.addEventListener('click',e=>{if(e.target===wrap)closeInstallDialog()});
 wrap.querySelector('.pwa-confirm-yes').addEventListener('click',runNativeInstall);
 return wrap;
}

function openInstallDialog(){
 if(isStandalone()){markInstalled();return}
 const wrap=ensureInstallDialog();const help=wrap.querySelector('#pwaConfirmHelp');
 help.hidden=true;help.textContent='';
 if(!installPrompt){
  help.hidden=false;
  help.textContent=isIOS()? 'iPhone / iPadでは、Safariの共有ボタンから「ホーム画面に追加」を選んでください。' : 'ブラウザ側のインストール準備がまだできていません。数秒後にもう一度お試しいただくか、Chromeの「︙」→「アプリをインストール」を選んでください。';
 }
 wrap.hidden=false;document.body.style.overflow='hidden';
}

function closeInstallDialog(){const wrap=document.getElementById('pwaSafeConfirm');if(wrap)wrap.hidden=true;document.body.style.overflow=''}

function setInstallBusy(on){
 installBusy=on;const box=installBox();const btn=box?.querySelector('button');
 if(btn){btn.disabled=on;btn.textContent=on?'確認中…':'📱 インストール'}
 clearTimeout(installResetTimer);
 if(on)installResetTimer=setTimeout(()=>setInstallBusy(false),12000);
}

function markInstalled(){
 localStorage.setItem(installedKey,'1');
 const box=installBox();if(box)box.hidden=true;
 closeInstallDialog();setInstallBusy(false);installPrompt=null;
}

function runNativeInstall(){
 if(installBusy)return;
 if(isStandalone()){markInstalled();return}
 if(!installPrompt){
  closeInstallDialog();
  const wrap=ensureInstallDialog();const help=wrap.querySelector('#pwaConfirmHelp');
  help.hidden=false;help.textContent=isIOS()? 'Safariの共有ボタンから「ホーム画面に追加」を選んでください。' : 'Chromeの「︙」→「アプリをインストール」または「ホーム画面に追加」を選んでください。';
  wrap.hidden=false;document.body.style.overflow='hidden';return;
 }
 const ev=installPrompt;installPrompt=null;
 closeInstallDialog();setInstallBusy(true);
 try{
   ev.prompt();
   ev.userChoice.then(()=>setInstallBusy(false)).catch(()=>setInstallBusy(false));
 }catch(e){
   setInstallBusy(false);
   setTimeout(()=>{const wrap=ensureInstallDialog();const help=wrap.querySelector('#pwaConfirmHelp');help.hidden=false;help.textContent='インストール画面を開けませんでした。Chromeの「︙」→「アプリをインストール」をお試しください。';wrap.hidden=false;document.body.style.overflow='hidden'},0);
 }
}

function refreshInstallButton(){
 if(page!=='index.html')return;
 const box=installBox();if(!box)return;
 if(isStandalone()||localStorage.getItem(installedKey)==='1'){box.hidden=true;return}
 box.hidden=false;const btn=box.querySelector('button');if(btn&&!installBusy){btn.disabled=false;btn.textContent='📱 インストール'}
}

function setupTopInstall(){
 if(page!=='index.html')return;
 let box=sanitizeInstallBox();const header=document.querySelector('.u-top');if(!box||!header)return;
 let actions=header.querySelector('.boki-top-actions');
 if(!actions){actions=document.createElement('div');actions.className='boki-top-actions';const setting=header.querySelector('a[href="settings.html"]');if(setting){header.insertBefore(actions,setting);actions.appendChild(setting)}else header.appendChild(actions)}
 box.classList.add('pwa-install-top');actions.insertBefore(box,actions.firstChild);
 const btn=box.querySelector('button');if(btn&&btn.dataset.safeBound!=='1'){btn.dataset.safeBound='1';btn.addEventListener('click',e=>{e.preventDefault();if(!installBusy)openInstallDialog()})}
 refreshInstallButton();
 if(!appInstalledBound){appInstalledBound=true;window.addEventListener('appinstalled',markInstalled);window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change',e=>{if(e.matches)markInstalled()})}
}

function setAppIconLinks(){let icon=document.querySelector('link[rel="icon"]');if(!icon){icon=document.createElement('link');icon.rel='icon';document.head.appendChild(icon)}icon.href='app-icon.svg';icon.type='image/svg+xml'}

function boot(){addStyle();fixBottomNav();forceManagementTop();setAppIconLinks();ensureInstallDialog();setTimeout(setupTopInstall,30)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pageshow',()=>{fixBottomNav();forceManagementTop();setTimeout(()=>{setupTopInstall();refreshInstallButton()},30)});
})();
