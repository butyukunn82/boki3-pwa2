(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'').toLowerCase();if(page!=='settings.html')return;
const api=window.BOKI_SETTINGS_API;if(!api)return;
const IDS=['theme','font','size','motion','daily','masteryTarget','masteryAccuracy','masteryStreak','wrongThreshold'];
let saved=api.load();
function collect(){const o={};IDS.forEach(k=>{const el=document.getElementById(k);if(!el)return;o[k]=['daily','masteryTarget','masteryAccuracy','masteryStreak','wrongThreshold'].includes(k)?Number(el.value):el.value});return api.normalize(o)}
function fill(s){IDS.forEach(k=>{const el=document.getElementById(k);if(el)el.value=String(s[k])})}
function ensureStatus(){let box=document.getElementById('settingsLiveStatus');if(box)return box;box=document.createElement('div');box.id='settingsLiveStatus';box.style.cssText='position:sticky;top:64px;z-index:25;margin:0 0 10px;padding:9px 11px;border-radius:12px;background:#eaf6ff;border:1px solid #c8e0f5;color:#245b88;font-size:.76rem;font-weight:850;box-shadow:0 4px 12px rgba(25,70,110,.06)';const main=document.querySelector('.u-page');const hero=main?.querySelector('.u-hero');if(main){if(hero)hero.insertAdjacentElement('afterend',box);else main.prepend(box)}return box}
function status(text,type='info'){const b=ensureStatus();if(!b)return;b.textContent=text;if(type==='saved'){b.style.background='#edf9f1';b.style.borderColor='#b8dfc6';b.style.color='#236a3f'}else if(type==='warn'){b.style.background='#fff7e7';b.style.borderColor='#ead29c';b.style.color='#775719'}else{b.style.background='#eaf6ff';b.style.borderColor='#c8e0f5';b.style.color='#245b88'}}
function markPreview(){const cur=collect();api.apply(cur,{persist:false});status('プレビュー中です。問題画面やホームにも反映するには「設定を保存」を押してください。','warn')}
function bind(){fill(saved);ensureStatus();status('現在の保存設定を読み込みました。変更するとこの画面ですぐ確認できます。');
 IDS.forEach(k=>{const el=document.getElementById(k);if(el)el.addEventListener('change',markPreview)});
 const saveBtn=document.getElementById('save');if(saveBtn){saveBtn.onclick=()=>{saved=api.save(collect());fill(saved);status('✓ 設定を保存しました。ホーム・問題・学習マップ・学習管理に反映されます。','saved');saveBtn.textContent='✓ 保存しました';setTimeout(()=>saveBtn.textContent='✓ 設定を保存',1200)}}
 if(saveBtn&&!document.getElementById('settingsReset')){const reset=document.createElement('button');reset.type='button';reset.id='settingsReset';reset.className='u-btn u-ghost';reset.textContent='↺ 標準設定に戻す';reset.onclick=()=>{saved={...api.defaults};fill(saved);api.save(saved);status('標準設定に戻して保存しました。','saved')};saveBtn.parentElement?.insertBefore(reset,saveBtn.nextSibling)}
 window.addEventListener('beforeunload',()=>{api.apply(saved,{persist:false,notify:false})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
