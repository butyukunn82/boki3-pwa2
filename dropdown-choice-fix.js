(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'').toLowerCase();
if(page!=='q1.html')return;

const CONFUSIONS={
 '売掛金':['受取手形','現金','普通預金'],
 '受取手形':['売掛金','現金','支払手形'],
 '買掛金':['支払手形','未払金','現金'],
 '支払手形':['買掛金','未払金','受取手形'],
 '現金':['普通預金','売掛金','買掛金'],
 '普通預金':['現金','当座預金','売掛金'],
 '当座預金':['普通預金','現金','支払手形'],
 '仕入':['備品','売上','繰越商品'],
 '売上':['仕入','売掛金','受取手形'],
 '備品':['仕入','消耗品費','現金'],
 '借入金':['買掛金','未払金','資本金'],
 '支払利息':['未払利息','受取利息','借入金'],
 '受取利息':['未収利息','支払利息','普通預金'],
 '仮払消費税':['仮受消費税','租税公課','仕入'],
 '仮受消費税':['仮払消費税','租税公課','売上'],
 '給料':['法定福利費','社会保険料預り金','所得税預り金'],
 '所得税預り金':['社会保険料預り金','未払金','給料'],
 '社会保険料預り金':['所得税預り金','法定福利費','給料'],
 '法定福利費':['給料','社会保険料預り金','未払金'],
 '未払利息':['支払利息','未払金','前払利息'],
 '前払保険料':['保険料','未払保険料','前払金'],
 '保険料':['前払保険料','未払保険料','支払利息'],
 '減価償却費':['備品減価償却累計額','備品','修繕費'],
 '備品減価償却累計額':['減価償却費','備品','貸倒引当金'],
 '貸倒引当金繰入':['貸倒引当金','貸倒損失','減価償却費'],
 '貸倒引当金':['貸倒引当金繰入','売掛金','備品減価償却累計額'],
 '未払金':['買掛金','未払費用','現金'],
 '前払金':['前払費用','売掛金','現金'],
 '資本金':['借入金','繰越利益剰余金','売上']
};
const FALLBACK=['現金','普通預金','売掛金','買掛金','受取手形','支払手形','仕入','売上','備品','未払金','前払金','借入金','支払利息','給料','法定福利費','貸倒引当金','減価償却費'];
function uniq(a){return [...new Set(a.filter(v=>v!==undefined&&v!==null&&v!==''))]}
function availableNames(){try{return new Set((BOKI_ACCOUNTS||[]).map(x=>x.name))}catch(e){return new Set(FALLBACK)}}
function nameChoices(z){
 const required=uniq([...z.d,...z.c].map(x=>x[0]));
 if(required.length>=4)return shuffle(required).slice(0,4);
 const available=availableNames();
 const pool=[];
 required.forEach(n=>(CONFUSIONS[n]||[]).forEach(x=>{if(available.has(x)&&!required.includes(x))pool.push(x)}));
 FALLBACK.forEach(x=>{if(available.has(x)&&!required.includes(x))pool.push(x)});
 try{(BOKI_ACCOUNTS||[]).forEach(x=>{if(!required.includes(x.name))pool.push(x.name)})}catch(e){}
 const result=[...required];
 for(const x of uniq(pool)){if(result.length>=4)break;result.push(x)}
 return shuffle(result).slice(0,4);
}
function roundNice(n){
 if(!Number.isFinite(n)||n<=0)return 0;
 const unit=n>=10000?1000:n>=1000?100:10;
 return Math.max(unit,Math.round(n/unit)*unit);
}
function amountChoices(z){
 const required=uniq([...z.d,...z.c].map(x=>Number(x[1]))).filter(n=>n>0);
 if(required.length>=4)return shuffle(required).slice(0,4);
 const dt=z.d.reduce((s,x)=>s+Number(x[1]||0),0),ct=z.c.reduce((s,x)=>s+Number(x[1]||0),0);
 const max=Math.max(...required,dt,ct,1000),min=Math.min(...required, max);
 const candidates=[dt,ct,Math.abs(dt-min),roundNice(max*.9),roundNice(max*1.1),roundNice(max/2),roundNice(max*2),roundNice(min+max)];
 const result=[...required];
 for(const n of uniq(candidates).filter(n=>Number(n)>0)){if(result.length>=4)break;if(!result.includes(Number(n)))result.push(Number(n))}
 let bump=1;
 while(result.length<4){const n=roundNice(max*(1+bump*.25));if(!result.includes(n))result.push(n);bump++}
 return shuffle(result).slice(0,4);
}
function optHtml(arr){return ['—',...arr].map(x=>`<option>${typeof x==='number'?fmt(x):x}</option>`).join('')}

if(typeof renderDrop==='function'){
 renderDrop=function(){
  clearInterval(session.timer);
  const z=session.list[session.index];
  session.answered=false;
  document.getElementById('progress').textContent=`${session.index+1}/${session.list.length}`;
  const names=nameChoices(z),amounts=amountChoices(z);
  const nameOpts=optHtml(names),amountOpts=optHtml(amounts);
  const rows=side=>Array.from({length:3},(_,i)=>`<div class="jrow"><select class="acct ${side}" data-row="${i}" aria-label="${side==='debit'?'借方':'貸方'}の勘定科目 ${i+1}">${nameOpts}</select><select class="amt ${side}" data-row="${i}" aria-label="${side==='debit'?'借方':'貸方'}の金額 ${i+1}">${amountOpts}</select></div>`).join('');
  document.getElementById('quizCard').innerHTML=`<span class="u-badge">プルダウン仕訳</span><div class="qbody">${z.body}</div><div class="u-note" style="margin:8px 0"><b>選択肢は最大4つ。</b> 正解と、間違えやすい勘定科目・金額だけに絞っています。</div><div class="journal"><div class="jcol"><h3>← 借方</h3>${rows('debit')}</div><div class="jcol"><h3>貸方 →</h3>${rows('credit')}</div></div><div class="u-small">不要な行は「—」のまま。複合仕訳は行の順番が違っても正解になります。</div><div class="u-actions"><button class="u-btn u-primary" onclick="gradeDrop()">回答する</button><button class="u-btn u-secondary" onclick="gradeDrop(true)">分からない</button></div><div id="feedback" class="feedback"></div>${renderNav()}`;
  startTimer();
 };
}
})();
