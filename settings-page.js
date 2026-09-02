(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'').toLowerCase();if(page!=='settings.html')return;
const api=window.BOKI_SETTINGS_API;if(!api)return;
const IDS=['theme','font','size','motion','daily','masteryTarget','masteryAccuracy','masteryStreak','wrongThreshold'];
let saved=api.load();
function collect(){const o={};IDS.forEach(k=>{const el=document.getElementById(k);if(!el)return;o[k]=['daily','masteryTarget','masteryAccuracy','masteryStreak','wrongThreshold'].includes(k)?Number(el.value):el.value});return api.normalize(o)}
function fill(s){IDS.forEach(k=>{const el=document.getElementById(k);if(el)el.value=String(s[k])})}
function relabel(){
 const theme=document.getElementById('theme');if(theme){const c=theme.querySelector('option[value="contrast"]');if(c)c.textContent='高コントラスト（標準）'}
 const size=document.getElementById('size');if(size){const labels={small:'小（18px）',standard:'標準（20px・旧特大）',large:'大（22px）',xlarge:'特大（24px）'};[...size.options].forEach(o=>{if(labels[o.value])o.textContent=labels[o.value]})}
 const hero=document.querySelector('.u-hero p');if(hero)hero.textContent='高コントラスト・20pxを標準にしています。表示と習熟判定は端末ごとに保存されます。';
}
function ensureStatus(){let box=document.getElementById('settingsLiveStatus');if(box)return box;box=document.createElement('div');box.id='settingsLiveStatus';box.style.cssText='position:sticky;top:64px;z-index:25;margin:0 0 10px;padding:9px 11px;border-radius:12px;background:#eaf6ff;border:1px solid #1b5f91;color:#123e63;font-size:.76rem;font-weight:850;box-shadow:none';const main=document.querySelector('.u-page');const hero=main?.querySelector('.u-hero');if(main){if(hero)hero.insertAdjacentElement('afterend',box);else main.prepend(box)}return box}
function status(text,type='info'){const b=ensureStatus();if(!b)return;b.textContent=text;if(type==='saved'){b.style.background='#edfff2';b.style.borderColor='#006b30';b.style.color='#003d1b'}else if(type==='warn'){b.style.background='#fff7d6';b.style.borderColor='#7a5c00';b.style.color='#3e2f00'}else{b.style.background='#eaf6ff';b.style.borderColor='#1b5f91';b.style.color='#123e63'}}
function markPreview(){const cur=collect();api.apply(cur,{persist:false});status('プレビュー中です。問題画面やホームにも反映するには「設定を保存」を押してください。','warn')}
function bind(){relabel();fill(saved);ensureStatus();status('現在の保存設定を読み込みました。変更するとこの画面ですぐ確認できます。');
 IDS.forEach(k=>{const el=document.getElementById(k);if(el)el.addEventListener('change',markPreview)});
 const saveBtn=document.getElementById('save');if(saveBtn){saveBtn.onclick=()=>{saved=api.save(collect());fill(saved);status('✓ 設定を保存しました。ホーム・問題・学習マップ・学習管理に反映されます。','saved');saveBtn.textContent='✓ 保存しました';setTimeout(()=>saveBtn.textContent='✓ 設定を保存',1200)}}
 if(saveBtn&&!document.getElementById('settingsReset')){const reset=document.createElement('button');reset.type='button';reset.id='settingsReset';reset.className='u-btn u-ghost';reset.textContent='↺ 標準設定に戻す';reset.onclick=()=>{saved={...api.defaults};fill(saved);api.save(saved);status('高コントラスト・20pxの標準設定に戻して保存しました。','saved')};saveBtn.parentElement?.insertBefore(reset,saveBtn.nextSibling)}
 window.addEventListener('beforeunload',()=>{api.apply(saved,{persist:false,notify:false})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();