(function(){
'use strict';
if(window.BOKI_SETTINGS_API?.version>=2)return;
const KEY='boki3_unified_settings';
const DEFAULTS={theme:'standard',font:'standard',size:'standard',motion:'standard',daily:10,masteryTarget:5,masteryAccuracy:80,masteryStreak:3,wrongThreshold:2};
const ALLOWED={theme:['standard','gentle','contrast','dark'],font:['standard','rounded','serif'],size:['small','standard','large','xlarge'],motion:['standard','off']};
function safeParse(s){try{return JSON.parse(s||'{}')||{}}catch(e){return {}}}
function normalize(raw={}){
 const s={...DEFAULTS,...raw};
 Object.keys(ALLOWED).forEach(k=>{if(!ALLOWED[k].includes(String(s[k])))s[k]=DEFAULTS[k]});
 ['daily','masteryTarget','masteryAccuracy','masteryStreak','wrongThreshold'].forEach(k=>s[k]=Number(s[k]??DEFAULTS[k]));
 if(![5,10,20].includes(s.daily))s.daily=10;
 if(![3,5,10].includes(s.masteryTarget))s.masteryTarget=5;
 if(![70,80,90].includes(s.masteryAccuracy))s.masteryAccuracy=80;
 if(![2,3,4].includes(s.masteryStreak))s.masteryStreak=3;
 if(![1,2,3,5].includes(s.wrongThreshold))s.wrongThreshold=2;
 return s;
}
function load(){return normalize(safeParse(localStorage.getItem(KEY)))}
function ensureStyle(){
 let st=document.getElementById('boki-settings-runtime-style');if(st)return st;
 st=document.createElement('style');st.id='boki-settings-runtime-style';st.textContent=`
 html[data-boki-size="small"]{font-size:14px!important}html[data-boki-size="standard"]{font-size:16px!important}html[data-boki-size="large"]{font-size:18px!important}html[data-boki-size="xlarge"]{font-size:20px!important}
 body[data-boki-font="standard"]{font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic UI",Meiryo,sans-serif!important}
 body[data-boki-font="rounded"]{font-family:"Hiragino Maru Gothic ProN","Yu Gothic UI","Meiryo",sans-serif!important}
 body[data-boki-font="serif"]{font-family:"Yu Mincho","Hiragino Mincho ProN","HGS明朝E",serif!important}
 html[data-boki-theme="gentle"]{--u-bg:#fff9ef;--u-card:#fffdf8;--u-text:#26343f;--u-muted:#6f756f;--u-line:#eadfce;--u-navy:#365f7b;--u-blue:#5a96c6;--u-good:#34875a;--u-goodbg:#edf8ef;--u-bad:#bc5555;--u-badbg:#fff0ed}
 html[data-boki-theme="contrast"]{--u-bg:#fff;--u-card:#fff;--u-text:#000;--u-muted:#303030;--u-line:#404040;--u-navy:#003f79;--u-blue:#005bbb;--u-good:#006b2e;--u-goodbg:#effff3;--u-bad:#b00020;--u-badbg:#fff0f2}
 html[data-boki-theme="dark"]{--u-bg:#0e1620;--u-card:#18222e;--u-text:#f2f6fa;--u-muted:#b6c0ca;--u-line:#3a4857;--u-navy:#8fc8ff;--u-blue:#61aff4;--u-good:#72d593;--u-goodbg:#153423;--u-bad:#ff8c8c;--u-badbg:#3a1b1e}
 html[data-boki-theme="gentle"] body,html[data-boki-theme="gentle"] .u-app{background:#fff9ef!important}
 html[data-boki-theme="gentle"] .u-top,html[data-boki-theme="gentle"] .u-nav,html[data-boki-theme="gentle"] .u-card,html[data-boki-theme="gentle"] .u-form-card,html[data-boki-theme="gentle"] .u-stat,html[data-boki-theme="gentle"] select{background:#fffdf8!important}
 html[data-boki-theme="contrast"] body,html[data-boki-theme="contrast"] .u-app{background:#fff!important;color:#000!important}
 html[data-boki-theme="contrast"] .u-top,html[data-boki-theme="contrast"] .u-nav,html[data-boki-theme="contrast"] .u-card,html[data-boki-theme="contrast"] .u-form-card,html[data-boki-theme="contrast"] .u-stat,html[data-boki-theme="contrast"] select{background:#fff!important;color:#000!important;border-color:#404040!important}
 html[data-boki-theme="contrast"] .u-small,html[data-boki-theme="contrast"] small,html[data-boki-theme="contrast"] .u-muted{color:#252525!important}
 html[data-boki-theme="dark"] body,html[data-boki-theme="dark"] .u-app,html[data-boki-theme="dark"] .app-v20 .u-app{background:#0e1620!important;color:#f2f6fa!important}
 html[data-boki-theme="dark"] .u-top,html[data-boki-theme="dark"] .u-nav{background:rgba(18,28,39,.98)!important;border-color:#344250!important}
 html[data-boki-theme="dark"] .u-card,html[data-boki-theme="dark"] .u-form-card,html[data-boki-theme="dark"] .u-stat,html[data-boki-theme="dark"] .u-hero,html[data-boki-theme="dark"] .map-current,html[data-boki-theme="dark"] .stage,html[data-boki-theme="dark"] .ready-row,html[data-boki-theme="dark"] .journey a,html[data-boki-theme="dark"] select,html[data-boki-theme="dark"] input{background:#18222e!important;color:#f2f6fa!important;border-color:#3a4857!important}
 html[data-boki-theme="dark"] .u-small,html[data-boki-theme="dark"] small,html[data-boki-theme="dark"] .u-card-copy span,html[data-boki-theme="dark"] .u-section-head span{color:#b6c0ca!important}
 html[data-boki-theme="dark"] .u-section-head h2,html[data-boki-theme="dark"] .app-section-title,html[data-boki-theme="dark"] .u-hero h1,html[data-boki-theme="dark"] .map-section-title h2,html[data-boki-theme="dark"] .map-hero h1{color:#f2f6fa!important}
 html[data-boki-theme="dark"] .u-hero,html[data-boki-theme="dark"] .map-hero{background:linear-gradient(135deg,#182738,#111b26)!important}
 html[data-boki-theme="dark"] .u-note{background:#182a3a!important;border-color:#3b5266!important;color:#e6edf4!important}
 html[data-boki-theme="dark"] .choice,html[data-boki-theme="dark"] .mini-check-choice,html[data-boki-theme="dark"] .term-card{background:#18222e!important;color:#f2f6fa!important;border-color:#435264!important}
 html[data-boki-theme="dark"] .quiznav{background:#0e1620!important}
 html[data-boki-motion="off"] *,html[data-boki-motion="off"] *::before,html[data-boki-motion="off"] *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
 html[data-boki-size="large"] .u-btn,html[data-boki-size="xlarge"] .u-btn,html[data-boki-size="large"] button,html[data-boki-size="xlarge"] button{min-height:56px}
 `;document.head.appendChild(st);return st;
}
function updateDailyGoal(s){
 const goal=document.getElementById('dailyGoal');if(goal)goal.textContent=String(s.daily);
 const countEl=document.getElementById('todayCount'),ring=document.getElementById('todayRing');
 const paint=()=>{if(!ring||!countEl)return;const n=Number(String(countEl.textContent).replace(/[^0-9.]/g,''))||0;ring.style.setProperty('--p',String(Math.max(0,Math.min(100,Math.round(n/Math.max(1,s.daily)*100)))))};
 paint();
 if(countEl&&!countEl.dataset.goalObserver){countEl.dataset.goalObserver='1';new MutationObserver(paint).observe(countEl,{childList:true,characterData:true,subtree:true})}
}
function apply(raw,{persist=false,notify=true}={}){
 const s=normalize(raw);ensureStyle();
 const root=document.documentElement;root.dataset.bokiTheme=s.theme;root.dataset.bokiSize=s.size;root.dataset.bokiMotion=s.motion;
 if(document.body)document.body.dataset.bokiFont=s.font;
 if(persist)localStorage.setItem(KEY,JSON.stringify(s));
 window.BOKI_SETTINGS=s;
 updateDailyGoal(s);
 if(notify)window.dispatchEvent(new CustomEvent('boki:settings-applied',{detail:{...s,persisted:persist}}));
 return s;
}
function save(raw){return apply(raw,{persist:true})}
function reset(){localStorage.removeItem(KEY);return apply(DEFAULTS,{persist:false})}
const api={version:2,key:KEY,defaults:{...DEFAULTS},load,normalize,apply,save,reset};window.BOKI_SETTINGS_API=api;
function boot(){apply(load(),{persist:false,notify:false})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('storage',e=>{if(e.key===KEY)apply(load(),{persist:false})});
})();
