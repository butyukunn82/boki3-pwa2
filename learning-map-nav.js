(function(){
'use strict';
function current(){return (location.pathname.split('/').pop()||'index.html').toLowerCase()}
function navHtml(){const p=current(),items=[['index.html','⌂','ホーム'],['learn.html','🗺','学習マップ'],['questions.html','☑','問題帳'],['management.html','▦','学習管理'],['settings.html','•••','その他']];return items.map(([href,icon,label])=>`<a href="${href}" class="navbtn ${p===href?'active':''}"><b>${icon}</b>${label}</a>`).join('')}
function loadAddon(id,src){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.async=false;s.src=src+'?v=10';document.body.appendChild(s)}
function pageAddons(){const p=current();loadAddon('public-info-v1','public-info-v1.js');if(p==='mock.html'){loadAddon('mock-multiset-v3','mock-multiset-v3.js');loadAddon('mock-q2-audit-v1','mock-q2-audit-v1.js');loadAddon('mock-q2-originality-v2','mock-q2-originality-v2.js');loadAddon('mock-q3-comprehensive-v1','mock-q3-comprehensive-v1.js');loadAddon('mock-q3-originality-v2','mock-q3-originality-v2.js');loadAddon('mock-q1-pool-v4','mock-q1-pool-v4.js');loadAddon('mock-history-detail-v1','mock-history-detail-v1.js');loadAddon('mock-analysis-v1','mock-analysis-v1.js')}if(p==='daily.html'){loadAddon('daily-mock-rotation-policy-v2','daily-mock-rotation-policy-v2.js');loadAddon('daily-mock-priority-v1','daily-mock-priority-v1.js');loadAddon('daily-mock-review-log-v1','daily-mock-review-log-v1.js')}if(p==='management.html'){loadAddon('management-cycle-v1','management-cycle-v1.js');loadAddon('management-cycle-policy-v2','management-cycle-policy-v2.js');loadAddon('management-history-v3-fix-v1','management-history-v3-fix-v1.js')}if(p==='q2-cbt.html'){loadAddon('q2-asset-fix-v1','q2-asset-fix-v1.js');loadAddon('q2-audit-upgrade-v2','q2-audit-upgrade-v2.js');loadAddon('q2-originality-v2','q2-originality-v2.js');loadAddon('cbt-deeplink-v1','cbt-deeplink-v1.js')}if(p==='q3-cbt.html'){loadAddon('q3-comprehensive-v1','q3-comprehensive-v1.js');loadAddon('q3-originality-v2','q3-originality-v2.js');loadAddon('cbt-deeplink-v1','cbt-deeplink-v1.js')}}
function fix(){
 const html=navHtml();
 document.querySelectorAll('.u-nav .u-nav-inner').forEach(n=>{n.innerHTML=html;n.style.gridTemplateColumns='repeat(5,1fr)'});
 document.querySelectorAll('.footer-nav .footer-inner').forEach(n=>{n.innerHTML=html;n.style.gridTemplateColumns='repeat(5,1fr)'});
 if(!document.getElementById('boki-five-nav-style')){const s=document.createElement('style');s.id='boki-five-nav-style';s.textContent='.u-nav-inner,.footer-inner{grid-template-columns:repeat(5,1fr)!important}.u-nav a,.footer-inner a{min-width:0;text-decoration:none;text-align:center}.footer-inner a{border:0;background:transparent;padding:9px 3px;font-size:.7rem;color:#66788c;cursor:pointer}.footer-inner a b{display:block;font-size:1.08rem}.footer-inner a.active{color:#173b67;font-weight:900}.u-nav a{font-size:.68rem}.u-nav a b{font-size:1.05rem}@media(max-width:370px){.u-nav a,.footer-inner a{font-size:.61rem;padding-left:1px;padding-right:1px}.u-nav a b,.footer-inner a b{font-size:.96rem}}';document.head.appendChild(s)}
 ensureCbtLaunch();pageAddons();
}
function ensureCbtLaunch(){
 const p=current();if(p!=='q2.html'&&p!=='q3.html')return;
 if(document.getElementById('fullCbtLaunch'))return;
 const isQ2=p==='q2.html',href=isQ2?'q2-cbt.html':'q3-cbt.html';
 const box=document.createElement('a');box.id='fullCbtLaunch';box.href=href;box.innerHTML=`<span class="cbt-launch-icon">${isQ2?'▤':'▥'}</span><span><b>${isQ2?'第2問':'第3問'}　本番形式で解く</b><small>${isQ2?'摘要を選び、帳簿・勘定へ金額を直接入力':'決算整理からP/L・B/Sへ金額を直接入力'}</small></span><span class="cbt-launch-go">›</span>`;
 box.style.cssText='display:grid;grid-template-columns:48px 1fr 24px;align-items:center;gap:10px;margin:12px 12px 4px;padding:13px 14px;border-radius:17px;text-decoration:none;color:#fff;background:'+(isQ2?'linear-gradient(135deg,#24558b,#2f7bc0)':'linear-gradient(135deg,#1d6a3b,#46a868)')+';box-shadow:0 8px 20px rgba(30,60,90,.16)';
 box.querySelector('.cbt-launch-icon').style.cssText='width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.18);display:grid;place-items:center;font-size:1.35rem;font-weight:900';
 box.querySelector('b').style.cssText='display:block;font-size:1rem';box.querySelector('small').style.cssText='display:block;margin-top:2px;font-size:.73rem;opacity:.94;line-height:1.4';box.querySelector('.cbt-launch-go').style.cssText='font-size:1.9rem;font-weight:900';
 const host=document.querySelector('.screen.active')||document.querySelector('main')||document.querySelector('.app');
 if(host)host.insertBefore(box,host.firstChild);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
window.addEventListener('pageshow',fix);
})();
