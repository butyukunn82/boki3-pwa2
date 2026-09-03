(function(){
'use strict';
if(!document.getElementById('result')||!document.getElementById('q1'))return;
const CAT={
 trade:{label:'商品売買',href:'q1.html'},
 settle:{label:'決済・前払前受',href:'q1.html'},
 asset:{label:'固定資産',href:'q1.html'},
 payroll:{label:'給与・税金',href:'q1.html'},
 closing:{label:'決算整理',href:'q1.html'},
 equity:{label:'純資産・特殊処理',href:'q1.html'}
};
const Q2LINK={closing:'q2-cbt.html?mode=closing',asset:'q2-cbt.html?mode=asset',accrual:'q2-cbt.html?mode=accrual',dividend:'q2-cbt.html?mode=dividend',interest:'q2-cbt.html?mode=interest'};
const Q3LINK={statements:'q3-cbt.html?mode=statements',worksheet:'q3-cbt.html?mode=worksheet',adjusted:'q3-cbt.html?mode=adjusted',comprehensive:'q3-cbt.html?mode=comprehensive'};
const pct=(c,t)=>t?Math.round(c/t*100):100;
function controlScore(root){const ok=root.querySelectorAll('.ok').length,ng=root.querySelectorAll('.ng').length;return{correct:ok,total:ok+ng,rate:pct(ok,ok+ng),wrong:ng}}
function q1Ok(card,i){
 try{const q=state?.q1?.[i];if(!q)return false;if(typeof actualSide==='function'&&typeof samePairs==='function')return samePairs(actualSide(card,'d'),q.debits)&&samePairs(actualSide(card,'c'),q.credits)}catch(e){}
 return card.style.borderColor==='rgb(105, 189, 142)'||card.style.borderColor==='#69bd8e';
}
function q1Cats(){
 const cards=[...document.querySelectorAll('#q1 .qcard')],map={};
 cards.forEach((card,i)=>{
   const cat=(typeof state!=='undefined'&&state.q1&&state.q1[i]&&state.q1[i].cat)||'other';
   if(!map[cat])map[cat]={cat,label:(CAT[cat]||{label:'第1問'}).label,correct:0,total:0,wrong:0};
   const bad=!q1Ok(card,i);
   map[cat].total++;
   if(bad)map[cat].wrong++;else map[cat].correct++;
 });
 Object.values(map).forEach(x=>x.rate=pct(x.correct,x.total));
 return Object.values(map);
}
function candidateData(){
 const out=[];
 q1Cats().forEach(x=>{if(x.wrong>0)out.push({kind:'q1',title:`第1問｜${x.label}`,rate:x.rate,wrong:x.wrong,why:`${x.total}問中${x.wrong}問で失点`,href:(CAT[x.cat]||CAT.trade).href,action:`${x.label}を復習する`})});
 const s2=controlScore(document.getElementById('q2'));
 const m2=(typeof state!=='undefined'&&state.q2&&state.q2.mode)||'';
 const l2=(typeof state!=='undefined'&&state.q2&&(state.q2.label||state.q2.mode))||'第2問';
 if(s2.wrong>0)out.push({kind:'q2',title:`第2問｜${l2}`,rate:s2.rate,wrong:s2.wrong,why:`入力欄の正答率 ${s2.rate}%`,href:Q2LINK[m2]||'q2-cbt.html',action:`${l2}を解き直す`});
 const s3=controlScore(document.getElementById('q3'));
 const m3=(typeof state!=='undefined'&&state.q3&&state.q3.mode)||'';
 const l3=(typeof state!=='undefined'&&state.q3&&(state.q3.label||state.q3.mode))||'第3問';
 if(s3.wrong>0)out.push({kind:'q3',title:`第3問｜${l3}`,rate:s3.rate,wrong:s3.wrong,why:`入力欄の正答率 ${s3.rate}%`,href:Q3LINK[m3]||'q3-cbt.html',action:`${l3}を解き直す`});
 return out.sort((a,b)=>a.rate-b.rate||b.wrong-a.wrong).slice(0,3);
}
function allOverview(){
 const q1=q1Cats(),s2=controlScore(document.getElementById('q2')),s3=controlScore(document.getElementById('q3'));
 const q1c=q1.reduce((n,x)=>n+x.correct,0),q1t=q1.reduce((n,x)=>n+x.total,0);
 return {q1:pct(q1c,q1t),q2:s2.rate,q3:s3.rate};
}
function render(){
 const result=document.getElementById('result');
 if(!result||result.dataset.analysisDone==='1')return;
 if(result.hidden||(!result.classList.contains('show')&&getComputedStyle(result).display==='none'))return;
 const cand=candidateData(),ov=allOverview();
 const box=document.createElement('section');box.id='mockAnalysis';box.className='card';
 const rows=cand.length?cand.map((x,i)=>`<div class="ma-row"><div class="ma-rank">${i+1}</div><div><b>${x.title}</b><small>${x.why}</small><div class="ma-bar"><i style="width:${x.rate}%"></i></div></div><a href="${x.href}">${x.action} ›</a></div>`).join(''):`<div class="ma-good">今回の大問別・カテゴリ別では大きな失点はありません。次は別セットで再現性を確認しましょう。</div>`;
 box.innerHTML=`<div class="ma-head"><div><h2>次にやること</h2><p>模試の失点から、優先して復習する順番を自動で並べています。</p></div></div><div class="ma-over"><div><span>第1問</span><b>${ov.q1}%</b></div><div><span>第2問</span><b>${ov.q2}%</b></div><div><span>第3問</span><b>${ov.q3}%</b></div></div><div class="ma-list">${rows}</div><div class="ma-note">同点の場合は失点数が多いものを優先します。公式の採点分析ではなく、このアプリ内の学習用分析です。</div>`;
 const st=document.createElement('style');st.id='mock-analysis-style';st.textContent=`#mockAnalysis{text-align:left;margin-top:14px}.ma-head h2{margin:0;color:var(--navy);font-size:1.12rem}.ma-head p{margin:3px 0 0;color:var(--muted);font-size:.78rem}.ma-over{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0}.ma-over div{border:1px solid var(--line);border-radius:11px;padding:9px;text-align:center}.ma-over span{display:block;font-size:.7rem;color:var(--muted)}.ma-over b{font-size:1.2rem;color:var(--navy)}.ma-list{display:grid;gap:8px}.ma-row{display:grid;grid-template-columns:34px 1fr auto;gap:9px;align-items:center;border:1px solid var(--line);border-radius:13px;padding:10px}.ma-rank{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#173b67;color:#fff;font-weight:950}.ma-row b{display:block;font-size:.88rem}.ma-row small{display:block;color:var(--muted);font-size:.7rem;margin-top:2px}.ma-row a{white-space:nowrap;text-decoration:none;background:#176bc1;color:#fff;border-radius:9px;padding:8px 10px;font-size:.72rem;font-weight:900}.ma-bar{height:6px;background:#edf1f5;border-radius:99px;overflow:hidden;margin-top:6px}.ma-bar i{display:block;height:100%;background:#2f6fad}.ma-note{margin-top:9px;font-size:.68rem;color:var(--muted)}.ma-good{padding:12px;border-radius:11px;background:#eef9f2;color:#216c43;font-weight:800;font-size:.82rem}@media(max-width:620px){.ma-row{grid-template-columns:32px 1fr}.ma-row a{grid-column:1/-1;text-align:center}.ma-over{gap:5px}}`;
 if(!document.getElementById(st.id))document.head.appendChild(st);
 result.appendChild(box);result.dataset.analysisDone='1';
 try{localStorage.setItem('boki3_mock_last_analysis_v1',JSON.stringify({at:Date.now(),overview:ov,priorities:cand.map(x=>({kind:x.kind,title:x.title,rate:x.rate,href:x.href}))}))}catch(e){}
}
const target=document.getElementById('result');
new MutationObserver(()=>setTimeout(render,0)).observe(target,{attributes:true,childList:true,subtree:true});
window.addEventListener('pageshow',()=>setTimeout(render,60));
})();
