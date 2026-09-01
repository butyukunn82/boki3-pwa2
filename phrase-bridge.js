(function(){
'use strict';
if(!window.BOKI_PHRASES?.length)return;
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const sh=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const eh=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));

function bootQ1(){
 if(typeof session==='undefined'||typeof record!=='function'||typeof renderNav!=='function')return;
 const style=document.createElement('style');style.textContent=`
 .phrase-btn{background:linear-gradient(120deg,#1fc1b8,#118b99)!important}.phrase-signal{background:linear-gradient(135deg,#fff9dc,#fff);border:2px solid #efd46c;border-radius:18px;padding:15px 13px;margin:11px 0}.phrase-signal small{display:block;color:#7a681c;font-weight:900;margin-bottom:5px}.phrase-signal strong{font-size:1.18rem;line-height:1.55;color:#312914}.phrase-context{font-size:.88rem;color:var(--u-muted);line-height:1.65;padding:8px 2px}.phrase-choicegrid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.phrase-choicegrid .choice{min-height:66px;text-align:center}.phrase-translate{display:grid;gap:8px;margin-top:10px}.phrase-step{display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:start;border:1px solid var(--u-line);border-radius:13px;padding:10px;background:var(--u-card)}.phrase-step i{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#e9f8f7;color:#137c7a;font-style:normal;font-weight:950}.phrase-account{font-size:1.22rem;color:#176a79}.phrase-contrast{background:#fff3f0;border:1px solid #efc0b5;border-radius:13px;padding:10px;color:#784231}.phrase-journal{background:#eef7ff;border:1px solid #c6def1;border-radius:13px;padding:10px;color:#245b86;font-weight:850}.phrase-tip{background:#f2f9ea;border:1px solid #c9e1a9;border-radius:13px;padding:10px;color:#3e6a28}.phrase-group{display:inline-block;border-radius:999px;padding:4px 8px;background:#e9f8f7;color:#147b79;font-size:.72rem;font-weight:900}@media(max-width:520px){.phrase-choicegrid{grid-template-columns:1fr 1fr}.phrase-signal strong{font-size:1.06rem}}
 `;document.head.appendChild(style);
 const stack=document.querySelector('#home .topic-stack');
 if(stack&&!document.getElementById('phraseTrainerBtn')){
   const b=document.createElement('button');b.id='phraseTrainerBtn';b.className='topic-button phrase-btn';b.onclick=()=>startPhraseTrainer();b.innerHTML='<span class="ico">文</span><span><b>ことば → 勘定科目</b><small>「約束手形を振り出した」などを科目へ翻訳</small></span>';
   const children=[...stack.children];if(children[1])children[1].after(b);else stack.appendChild(b);
 }
 const sub=document.querySelector('.u-top .u-small');if(sub)sub.textContent='5要素 → ことば変換 → 借方・貸方 → 仕訳';
 const hero=document.querySelector('#home .app-learning-head p');if(hero)hero.textContent='5要素で住所を知り、問題文のことばを勘定科目へ翻訳してから仕訳へ進みます。';
 const rec=document.querySelector('#home .daily-card p');if(rec)rec.textContent='まず5要素。その次に「この言い回しならこの科目」を反射化すると仕訳が一気に読みやすくなります。';

 window.startPhraseTrainer=function(group='all'){
   let pool=window.BOKI_PHRASES;
   if(group!=='all')pool=pool.filter(x=>x.group===group);
   const important=sh(pool.filter(x=>x.priority>=3));const rest=sh(pool.filter(x=>x.priority<3));
   const picked=[];for(const g of window.BOKI_PHRASE_GROUPS){const z=sh(pool.filter(x=>x.group===g&&x.priority>=2))[0];if(z&&!picked.some(a=>a.id===z.id))picked.push(z)}
   for(const x of [...important,...rest]){if(!picked.some(a=>a.id===x.id))picked.push(x);if(picked.length>=20)break}
   session={mode:'phrase',list:sh(picked.slice(0,20)),index:0,correct:0,answered:false,responses:{}};nav('quiz');renderPhrase();
 };
 window.renderPhrase=function(){
   clearInterval(session.timer);const z=session.list[session.index];session.answered=false;document.getElementById('progress').textContent=`${session.index+1}/${session.list.length}`;document.getElementById('timer').textContent='00:00';
   const opts=sh([...new Set(z.choices)]).slice(0,4);
   document.getElementById('quizCard').innerHTML=`<span class="phrase-group">${eh(z.group)}</span><div class="phrase-signal"><small>この言い回しを見たら？</small><strong>${eh(z.signal)}</strong></div><div class="phrase-context">${eh(z.sentence)}</div><div class="u-small" style="font-weight:900;margin:7px 0">中心となる勘定科目を選んでください</div><div class="phrase-choicegrid" id="phraseChoices">${opts.map(o=>`<button class="choice" data-value="${eh(o)}" onclick="answerPhrase(this,${JSON.stringify(o)})">${eh(o)}</button>`).join('')}</div><div class="u-actions"><button class="u-btn u-secondary" onclick="answerPhrase(null,'',true)">？ 分からない</button></div><div id="feedback" class="feedback"></div>${renderNav()}`;startTimer();
 };
 window.answerPhrase=function(btn,val,dont=false){
   if(session.answered)return;session.answered=true;const z=session.list[session.index],sec=stopTimer(),ok=!dont&&val===z.answer;if(ok)session.correct++;
   record('PH:'+z.id,'言い回し',ok,sec,dont);
   const gk='言い回し:'+z.group;data.bySkill[gk]=data.bySkill[gk]||{seen:0,correct:0,time:0};data.bySkill[gk].seen++;data.bySkill[gk].correct+=ok?1:0;data.bySkill[gk].time+=sec;save();
   document.querySelectorAll('#phraseChoices .choice').forEach(b=>{b.disabled=true;if(b.dataset.value===z.answer)b.classList.add('correct')});if(btn&&!ok)btn.classList.add('wrong');
   const fb=document.getElementById('feedback');fb.classList.add('show');fb.innerHTML=`<div class="result-banner ${ok?'good':'bad'}">${ok?'○ 正解　'+eh(z.answer):dont?'△ 正解は '+eh(z.answer):'× 正解は '+eh(z.answer)}</div><div class="phrase-translate"><div class="phrase-step"><i>1</i><div><b>合図</b><br>${eh(z.signal)}</div></div><div class="phrase-step"><i>2</i><div><b>頭の中で翻訳</b><br>${eh(z.meaning)}</div></div><div class="phrase-step"><i>3</i><div><b>勘定科目</b><br><strong class="phrase-account">${eh(z.answer)}</strong></div></div><div class="phrase-contrast"><b>⚠ 似た言葉との見分け</b><br>${eh(z.contrast)}</div><div class="phrase-journal"><b>仕訳につなぐと</b><br>${eh(z.journal)}</div>${z.tip?`<div class="phrase-tip"><b>覚え方</b><br>${eh(z.tip)}</div>`:''}</div>`;document.getElementById('nextBtn').disabled=false;
 };
 const oldRender=renderByMode;renderByMode=function(){if(session.mode==='phrase')renderPhrase();else oldRender()};
 const urlMode=new URLSearchParams(location.search).get('mode');if(urlMode==='phrase')startPhraseTrainer();
}

function bootDaily(){
 if(typeof q1Questions!=='function'||typeof mk!=='function'||typeof q1==='undefined'||typeof build!=='function')return;
 const base=q1Questions;
 q1Questions=function(n){
   const weakIds=Object.entries(q1.byQ||{}).filter(([id])=>id.startsWith('PH:')).sort((a,b)=>(b[1].reviewDebt||0)-(a[1].reviewDebt||0)).map(([id])=>id.slice(3));
   const skill=q1.bySkill?.['言い回し'];const rate=skill?.seen?(skill.correct||0)/(skill.seen||1):0;
   const phraseN=Math.min(n,weakIds.length?Math.min(2,n):rate<.85?1:0);if(!phraseN)return base(n);
   const weak=weakIds.map(id=>window.findBokiPhrase(id)).filter(Boolean);const pool=[...weak,...sh(window.BOKI_PHRASES.filter(x=>x.priority>=2))];const ph=[];
   for(const z of pool){if(ph.some(x=>x.id===z.id))continue;ph.push(z);if(ph.length>=phraseN)break}
   const phraseQs=ph.map(z=>mk('q1','言い回し',`「${z.signal}」→ 中心となる勘定科目は？`,z.answer,z.choices,`${z.meaning} ${z.contrast}`));
   return sh([...phraseQs,...base(Math.max(0,n-phraseN))]).slice(0,n);
 };
 try{list=build()}catch(e){}
}

if(page==='q1.html')bootQ1();
if(page==='daily.html')bootDaily();
})();
