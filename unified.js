(function(){
'use strict';
const defaults={theme:'standard',font:'standard',size:'standard',motion:'standard',daily:10};
let settings={...defaults};
try{settings={...settings,...JSON.parse(localStorage.getItem('boki3_unified_settings')||'{}')}}catch(e){}
window.BOKI_SETTINGS=settings;
const root=document.documentElement;
if(settings.theme==='dark'){
  root.style.setProperty('--u-bg','#101722');root.style.setProperty('--u-card','#17202c');root.style.setProperty('--u-text','#edf3f8');root.style.setProperty('--u-muted','#aeb9c6');root.style.setProperty('--u-line','#324153');
}
if(settings.theme==='gentle')root.style.setProperty('--u-bg','#fffaf0');
if(settings.theme==='contrast'){root.style.setProperty('--u-text','#000');root.style.setProperty('--u-line','#4b5563')}
const sizes={small:'14px',standard:'16px',large:'18px',xlarge:'20px'};root.style.fontSize=sizes[settings.size]||'16px';
if(settings.font==='rounded')document.body.style.fontFamily='"Hiragino Maru Gothic ProN","Yu Gothic UI",sans-serif';
if(settings.font==='serif')document.body.style.fontFamily='"Yu Mincho","Hiragino Mincho ProN",serif';
if(settings.motion==='off'){const st=document.createElement('style');st.textContent='*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';document.head.appendChild(st)}

const page=location.pathname.split('/').pop()||'index.html';
if(!['index.html','management.html','settings.html','glossary.html','learn.html'].includes(page))localStorage.setItem('boki3_last_page',page+location.search);
const CHECK_STORE='boki3_understanding_checks_v1';
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const esc=v=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
function readChecks(){try{return JSON.parse(localStorage.getItem(CHECK_STORE)||'{}')||{}}catch(e){return {}}}
function writeChecks(v){localStorage.setItem(CHECK_STORE,JSON.stringify(v))}

const checkDefs={
 worksheet:{title:'精算表連動・What-if',short:'精算表連動',questions:[
  {q:'保険料120,000円のうち翌期分30,000円を前払保険料へ振り替えた。正しい影響はどれ？',choices:['保険料費用が30,000円減り、前払保険料（資産）が30,000円増える','保険料費用が30,000円増え、前払保険料が30,000円減る','現金が30,000円増える','売上が30,000円増える'],answer:'保険料費用が30,000円減り、前払保険料（資産）が30,000円増える',exp:'翌期分は当期費用から外し、前払保険料という資産へ振り替えます。'},
  {q:'未払給料30,000円を決算整理で計上すると、P/LとB/Sはどう動く？',choices:['P/Lの給料が増え、B/Sの未払給料（負債）が増える','P/Lの給料が減り、B/Sの現金が増える','P/Lの売上が増え、B/Sの売掛金が増える','B/Sだけが動きP/Lは動かない'],answer:'P/Lの給料が増え、B/Sの未払給料（負債）が増える',exp:'当期発生分は給料費用へ追加し、同時に将来支払う義務として負債を計上します。'},
  {q:'減価償却費60,000円を計上したとき、利益への影響は？',choices:['利益が60,000円減る','利益が60,000円増える','利益は変わらない','現金が60,000円必ず減る'],answer:'利益が60,000円減る',exp:'減価償却費は費用なので利益を減らします。ただし決算整理仕訳そのものでは現金は動きません。'}]},
 ledger:{title:'仕訳→元帳→試算表',short:'元帳・試算表',questions:[
  {q:'仕訳帳と総勘定元帳の違いとして正しいものは？',choices:['仕訳帳は日付順、総勘定元帳は勘定科目別','仕訳帳は科目別、総勘定元帳は日付順','どちらも必ず得意先別に記録する','試算表を作った後に仕訳帳を作る'],answer:'仕訳帳は日付順、総勘定元帳は勘定科目別',exp:'取引を日付順に仕訳し、その内容を各勘定科目の元帳へ転記します。'},
  {q:'試算表の数字は主にどこから集める？',choices:['総勘定元帳の各勘定の合計・残高','請求書だけ','貸借対照表だけ','補助元帳だけ'],answer:'総勘定元帳の各勘定の合計・残高',exp:'試算表は総勘定元帳に集まった各勘定の合計や残高を一覧にする表です。'},
  {q:'補助元帳の役割として最も適切なのは？',choices:['総勘定元帳の残高を得意先・仕入先などの内訳に分けて管理する','仕訳の借方と貸方を逆にする','収益と費用を翌期へ繰り越す','決算書を税務署へ送信する'],answer:'総勘定元帳の残高を得意先・仕入先などの内訳に分けて管理する',exp:'総勘定元帳が会社全体、補助元帳はその内訳です。'}]},
 carry:{title:'締切・繰越',short:'締切・繰越',questions:[
  {q:'3月31日の現金100,000円は、翌4月1日にどうなる？',choices:['前期繰越として翌期へ引き継ぐ','損益勘定へ振り替えて0にする','売上へ振り替える','必ず現金を全額引き出す'],answer:'前期繰越として翌期へ引き継ぐ',exp:'現金は資産で、会社に残る状態なので翌期へ引き継ぎます。'},
  {q:'当期の売上500,000円は翌期首にどうなる？',choices:['売上勘定は0から始める','前期繰越500,000円として売上勘定に残す','現金勘定へ移す','買掛金へ移す'],answer:'売上勘定は0から始める',exp:'収益・費用はその1年間の成績なので損益へ振り替え、翌期は0から始めます。'},
  {q:'翌期へ残るグループはどれ？',choices:['資産・負債・純資産','収益・費用だけ','費用・資産だけ','収益・純資産だけ'],answer:'資産・負債・純資産',exp:'B/Sの3要素は期末時点の状態なので翌期へつながります。'}]},
 lab:{title:'総合簿記ラボ',short:'総合簿記ラボ',questions:[
  {q:'簿記の基本的な流れとして最も適切なのは？',choices:['取引→仕訳→総勘定元帳→試算表→決算整理→精算表・決算書','試算表→取引→仕訳→決算書→元帳','決算書→仕訳→取引→試算表','仕訳→決算書→取引→元帳'],answer:'取引→仕訳→総勘定元帳→試算表→決算整理→精算表・決算書',exp:'現実の取引を仕訳に翻訳し、科目別に集め、試算表・決算整理を経て決算書へつなげます。'},
  {q:'貸倒引当金繰入3,000円を計上したとき、正しい組合せは？',choices:['P/Lに貸倒引当金繰入3,000円、B/Sでは貸倒引当金が売掛金から控除される','P/Lに売掛金3,000円、B/Sに売上3,000円','P/Lには何も出ず、B/Sに現金3,000円が増える','貸倒引当金は負債として買掛金に加算する'],answer:'P/Lに貸倒引当金繰入3,000円、B/Sでは貸倒引当金が売掛金から控除される',exp:'繰入は費用なのでP/L、貸倒引当金は資産を控除する評価勘定としてB/Sに関係します。'},
  {q:'試算表で貸借が一致していることから必ず言えることは？',choices:['少なくとも借方合計と貸方合計は一致している','すべての仕訳が絶対に正しい','決算整理がすべて完了している','利益が必ず出ている'],answer:'少なくとも借方合計と貸方合計は一致している',exp:'貸借一致は重要なチェックですが、同額を誤った科目へ記録した誤りなどは残ることがあります。'}]}
};

const runtime={};
function injectStyles(){
 if(document.getElementById('boki-learning-bridge-style'))return;
 const st=document.createElement('style');st.id='boki-learning-bridge-style';st.textContent=`
 .mini-check-shell{margin:18px 0 8px}.mini-check-card{background:#fff;border:1px solid #d9e2ec;border-radius:18px;padding:15px;box-shadow:0 8px 28px rgba(26,48,79,.08)}
 .mini-check-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px}.mini-check-kicker{display:inline-block;font-size:.72rem;font-weight:900;color:#2d6dad;background:#edf6ff;border:1px solid #cfe2f5;border-radius:999px;padding:4px 8px;margin-bottom:5px}.mini-check-title{font-size:1.05rem;font-weight:900}.mini-check-desc{font-size:.78rem;color:#6f7f91}.mini-check-best{flex:none;background:#f4f7fb;border:1px solid #d9e2ec;border-radius:12px;padding:7px 9px;text-align:center;font-size:.7rem;color:#6f7f91}.mini-check-best b{display:block;font-size:1rem;color:#173b67}
 .mini-check-start,.mini-check-next{width:100%;border:0;border-radius:13px;min-height:48px;background:linear-gradient(135deg,#2568ad,#173b67);color:#fff;font-weight:900;font-size:.92rem;cursor:pointer}.mini-check-dots{display:flex;gap:6px;margin:8px 0 13px}.mini-check-dot{height:7px;flex:1;border-radius:999px;background:#e7edf3}.mini-check-dot.done{background:#69b97d}.mini-check-dot.current{background:#2f6fad}.mini-check-q{font-weight:900;font-size:.96rem;line-height:1.6;margin:5px 0 12px}.mini-check-options{display:grid;gap:8px}.mini-check-choice{width:100%;min-height:50px;text-align:left;border:2px solid #d7e0ea;background:#fff;border-radius:12px;padding:11px 12px;font-size:.86rem;font-weight:700;cursor:pointer}.mini-check-choice.correct{border-color:#2d8a58;background:#edf9f2;color:#216b45}.mini-check-choice.wrong{border-color:#c95555;background:#fff1f1;color:#a53535}.mini-check-choice:disabled{opacity:1}.mini-check-feedback{margin-top:10px;border-radius:12px;padding:10px 11px;font-size:.82rem;line-height:1.55}.mini-check-feedback.good{background:#edf9f2;border:1px solid #acd8be;color:#225f40}.mini-check-feedback.bad{background:#fff6e8;border:1px solid #ead09d;color:#78581b}.mini-check-actions{display:flex;gap:8px;margin-top:11px}.mini-check-sub{flex:1;min-height:45px;border:1px solid #ccd8e5;background:#fff;color:#36516e;border-radius:11px;font-weight:900;cursor:pointer}.mini-check-result{text-align:center;padding:7px 0}.mini-check-score{font-size:2rem;font-weight:900;color:#173b67}.mini-check-result p{font-size:.82rem;color:#64758a}.mini-check-retry{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
 .understanding-progress{margin:12px 0 16px;background:linear-gradient(135deg,#f7fbff,#fff);border:1px solid #d5e3f0;border-radius:16px;padding:12px}.understanding-progress-head{display:flex;justify-content:space-between;gap:8px;align-items:center}.understanding-progress-head b{font-size:.9rem}.understanding-progress-head strong{color:#2568ad}.understanding-chip-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.understanding-chip{border-radius:999px;padding:5px 8px;font-size:.7rem;font-weight:800;background:#f1f4f8;color:#607186}.understanding-chip.ok{background:#eaf7ef;color:#267047}.understanding-chip.weak{background:#fff2e8;color:#9a5b18}
 .adaptive-review-note{margin:10px 0 14px;border:1px solid #e5ca91;background:linear-gradient(135deg,#fff9e8,#fff);border-radius:14px;padding:10px 12px;font-size:.8rem;color:#70551e}.adaptive-review-note b{display:block;color:#8a6417;margin-bottom:2px}.adaptive-badge{display:inline-block;background:#fff0cc;border:1px solid #e7c875;color:#815c10;border-radius:999px;padding:3px 7px;font-size:.68rem;font-weight:900;margin-left:5px}
 @media(max-width:560px){.mini-check-head{align-items:stretch}.mini-check-retry{grid-template-columns:1fr}}
 `;document.head.appendChild(st);
}

function bestScore(key){const z=readChecks()[key]||{};return Number.isFinite(Number(z.best))?Number(z.best):Number.isFinite(Number(z.score))?Number(z.score):0}
function attempted(key){const z=readChecks()[key]||{};return !!(z.attempts||z.lastDate||z.updatedAt||z.best!=null||z.score!=null)}
function weakModules(onlyDue=false){
 const d=readChecks(),t=today();
 return Object.keys(checkDefs).map(key=>{const z=d[key]||{},best=Number(z.best??z.score??0),was=!!(z.attempts||z.lastDate||z.updatedAt||z.best!=null||z.score!=null);return {key,best,was,lastDate:z.lastDate||'',def:checkDefs[key]}})
 .filter(x=>x.was&&x.best<3&&(!onlyDue||!x.lastDate||x.lastDate<t))
 .sort((a,b)=>a.best-b.best||String(a.lastDate).localeCompare(String(b.lastDate)));
}

function mountProgress(){
 if(page!=='q3.html')return;const learn=document.getElementById('learn');if(!learn||learn.querySelector('.understanding-progress'))return;
 const grid=learn.querySelector('.understand-grid');if(!grid)return;const d=readChecks(),keys=Object.keys(checkDefs),done=keys.filter(k=>Number(d[k]?.best??d[k]?.score??0)>=3).length;
 const box=document.createElement('div');box.className='understanding-progress';box.innerHTML=`<div class="understanding-progress-head"><b>理解チェック進捗</b><strong>${done} / ${keys.length} 定着</strong></div><div class="understanding-chip-row">${keys.map(k=>{const sc=Number(d[k]?.best??d[k]?.score??0),cls=sc>=3?'ok':attempted(k)?'weak':'';return `<span class="understanding-chip ${cls}">${esc(checkDefs[k].short)} ${sc}/3</span>`}).join('')}</div>`;grid.parentNode.insertBefore(box,grid);
}
function mountAdaptiveNote(){
 if(page!=='q3.html')return;const home=document.getElementById('home');if(!home||home.querySelector('.adaptive-review-note'))return;const weak=weakModules(true);if(!weak.length)return;
 const count=Math.min(3,weak.reduce((n,x)=>n+(x.best<=1?2:1),0));const el=document.createElement('div');el.className='adaptive-review-note';el.innerHTML=`<b>弱点を自動復習します <span class="adaptive-badge">今日 ${count}問</span></b>${weak.slice(0,3).map(x=>esc(x.def.short)+' '+x.best+'/3').join('・')} を「今日の10問」に混ぜます。残りは通常問題なので、新しい論点も進められます。`;
 const stats=home.querySelector('.stats-grid');(stats?.parentNode||home).insertBefore(el,stats?stats.nextSibling:home.firstChild);
}

function shellFor(key){return `<div class="mini-check-card"><div class="mini-check-head"><div><span class="mini-check-kicker">✓ 3問で定着確認</span><div class="mini-check-title">${esc(checkDefs[key].title)}</div><div class="mini-check-desc">教材を触った直後に、判断できるかを確認します。</div></div><div class="mini-check-best">ベスト<b>${bestScore(key)}/3</b></div></div><button class="mini-check-start" data-start-check="${key}">3問を始める</button></div>`}
function mountChecks(){if(page!=='q3.html')return;['worksheet','ledger','carry','lab'].forEach(key=>{const sec=document.getElementById(key);if(!sec||sec.querySelector(`[data-check-shell="${key}"]`))return;const shell=document.createElement('div');shell.className='mini-check-shell';shell.dataset.checkShell=key;shell.innerHTML=shellFor(key);sec.appendChild(shell)})}
function renderCheck(key){const shell=document.querySelector(`[data-check-shell="${key}"]`);if(!shell)return;let rt=runtime[key];if(!rt){rt=runtime[key]={order:shuffle(checkDefs[key].questions.map((_,i)=>i)),pos:0,correct:0,wrong:[],answered:false}}const qi=rt.order[rt.pos],q=checkDefs[key].questions[qi],choices=shuffle(q.choices);shell.innerHTML=`<div class="mini-check-card"><div class="mini-check-head"><div><span class="mini-check-kicker">理解チェック</span><div class="mini-check-title">${esc(checkDefs[key].short)}</div></div><div class="mini-check-best">${rt.pos+1} / 3</div></div><div class="mini-check-dots">${[0,1,2].map(i=>`<i class="mini-check-dot ${i<rt.pos?'done':i===rt.pos?'current':''}"></i>`).join('')}</div><div class="mini-check-q">${esc(q.q)}</div><div class="mini-check-options">${choices.map(c=>`<button class="mini-check-choice" data-check-choice="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="mini-check-feedback" hidden></div><div class="mini-check-actions"><button class="mini-check-sub" data-cancel-check="${key}">やめる</button><button class="mini-check-next" data-next-check="${key}" style="display:none">${rt.pos===2?'結果を見る':'次へ'}</button></div></div>`}
function answerCheck(btn){const shell=btn.closest('.mini-check-shell'),key=shell?.dataset.checkShell,rt=runtime[key];if(!key||!rt||rt.answered)return;rt.answered=true;const q=checkDefs[key].questions[rt.order[rt.pos]],val=btn.dataset.checkChoice,ok=val===q.answer;if(ok)rt.correct++;else rt.wrong.push(rt.order[rt.pos]);shell.querySelectorAll('.mini-check-choice').forEach(b=>{b.disabled=true;if(b.dataset.checkChoice===q.answer)b.classList.add('correct');if(b===btn&&!ok)b.classList.add('wrong')});const fb=shell.querySelector('.mini-check-feedback');fb.hidden=false;fb.className='mini-check-feedback '+(ok?'good':'bad');fb.innerHTML=`<b>${ok?'○ 正解':'× 不正解'}</b><br>${esc(q.exp)}`;shell.querySelector('[data-next-check]').style.display='block'}
function finishCheck(key){const rt=runtime[key],d=readChecks(),prev=Number(d[key]?.best??d[key]?.score??0),score=rt.correct;d[key]={...(d[key]||{}),best:Math.max(prev,score),lastScore:score,attempts:Number(d[key]?.attempts||0)+1,lastDate:today(),updatedAt:Date.now()};writeChecks(d);const shell=document.querySelector(`[data-check-shell="${key}"]`);shell.innerHTML=`<div class="mini-check-card"><div class="mini-check-result"><div class="mini-check-score">${score}/3</div><h3>${score===3?'定着できています！':score===2?'あと一歩です':'ここを復習しましょう'}</h3><p>${score<3?'この弱点は翌日の「今日の10問」へ自動で入ります。':'3/3なので弱点自動復習から外れます。'}</p></div><div class="mini-check-retry"><button class="mini-check-sub" data-restart-check="${key}">もう一度3問</button>${rt.wrong.length?`<button class="mini-check-next" data-retry-wrong="${key}">間違いだけ</button>`:'<button class="mini-check-next" data-close-check="'+key+'">教材へ戻る</button>'}</div></div>`;delete runtime[key];document.querySelector('.understanding-progress')?.remove();mountProgress();document.querySelector('.adaptive-review-note')?.remove();mountAdaptiveNote()}
function startCheck(key,order){runtime[key]={order:order||shuffle(checkDefs[key].questions.map((_,i)=>i)),pos:0,correct:0,wrong:[],answered:false};renderCheck(key);document.querySelector(`[data-check-shell="${key}"]`)?.scrollIntoView({behavior:'smooth',block:'center'})}

function adaptiveItems(){
 const due=weakModules(true),items=[];
 for(const x of due){const want=x.best<=1?2:1;const qs=shuffle(x.def.questions).slice(0,want);qs.forEach((q,i)=>items.push({id:`ADAPT-${x.key}-${i}-${today()}`,category:'弱点自動復習',skill:'判定',type:'choice',choices:q.choices,answer:q.answer,title:`理解チェック復習：${x.def.short}`,body:q.q,hint:['教材で見た数字の流れを思い出す。','5要素とP/L・B/Sの行き先を確認する。','最も関係が合う選択肢を選ぶ。'],flow:['何が増減するかを確認する。','その科目が資産・負債・純資産・収益・費用のどれかを判定する。','最終的な行き先や翌期への扱いまでつなげる。'],point:q.exp,caution:'暗記ではなく「なぜその場所へ行くか」を確認してから答えます。',visual:''}))}
 return shuffle(items).slice(0,3);
}
function installAdaptiveDaily(){
 if(page!=='q3.html'||typeof window.buildDaily!=='function'||window.buildDaily.__adaptive)return;
 const original=window.buildDaily;const wrapped=function(){const base=original();const adapt=adaptiveItems();if(!adapt.length)return base;const ids=new Set(adapt.map(x=>x.id));const rest=base.filter(x=>!ids.has(x.id));return [...adapt,...rest].slice(0,10)};wrapped.__adaptive=true;window.buildDaily=wrapped;
}

function routeQ3(){if(page!=='q3.html')return;const screen=new URLSearchParams(location.search).get('screen');if(!screen)return;const allowed=new Set(['map','journey','worksheet','ledger','carry','year','lab','learn','home']);if(!allowed.has(screen)||!document.getElementById(screen))return;if(typeof window.nav==='function'){window.nav(screen);window.scrollTo({top:0,behavior:'auto'})}}
function init(){injectStyles();mountChecks();mountProgress();mountAdaptiveNote();installAdaptiveDaily();routeQ3()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else setTimeout(init,0);

document.addEventListener('click',e=>{
 const start=e.target.closest('[data-start-check]');if(start)return startCheck(start.dataset.startCheck);
 const choice=e.target.closest('[data-check-choice]');if(choice)return answerCheck(choice);
 const next=e.target.closest('[data-next-check]');if(next){const key=next.dataset.nextCheck,rt=runtime[key];if(!rt?.answered)return;if(rt.pos>=2)return finishCheck(key);rt.pos++;rt.answered=false;return renderCheck(key)}
 const cancel=e.target.closest('[data-cancel-check]');if(cancel){const key=cancel.dataset.cancelCheck;delete runtime[key];const shell=document.querySelector(`[data-check-shell="${key}"]`);if(shell)shell.innerHTML=shellFor(key);return}
 const restart=e.target.closest('[data-restart-check]');if(restart)return startCheck(restart.dataset.restartCheck);
 const wrong=e.target.closest('[data-retry-wrong]');if(wrong){const key=wrong.dataset.retryWrong,d=readChecks();const prev=runtime[key]?.wrong||[];const order=prev.length?prev:checkDefs[key].questions.map((_,i)=>i);return startCheck(key,order.slice(0,3))}
 const close=e.target.closest('[data-close-check]');if(close){const key=close.dataset.closeCheck,shell=document.querySelector(`[data-check-shell="${key}"]`);if(shell)shell.innerHTML=shellFor(key)}
});
})();
