(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const journalPatterns=[
 ['sale-credit','商品を掛けで売る','売掛金 ／ 売上'],['buy-credit','商品を掛けで仕入れる','仕入 ／ 買掛金'],['sale-cash','商品を現金で売る','現金 ／ 売上'],['buy-cash','商品を現金で仕入れる','仕入 ／ 現金'],['ar-bank','売掛金が普通預金へ振り込まれる','普通預金 ／ 売掛金'],['ap-bank','買掛金を普通預金から支払う','買掛金 ／ 普通預金'],['equipment-cash','備品を現金で購入する','備品 ／ 現金'],['equipment-payable','備品を後払いで購入する','備品 ／ 未払金'],['borrow-bank','銀行から借り入れる','普通預金 ／ 借入金'],['repay-loan','借入金を返済する','借入金 ／ 普通預金'],['note-sale','商品代金として約束手形を受け取る','受取手形 ／ 売上'],['note-buy','商品代金として約束手形を振り出す','仕入 ／ 支払手形'],['note-ar','売掛金を約束手形で回収する','受取手形 ／ 売掛金'],['note-ap','買掛金を約束手形で支払う','買掛金 ／ 支払手形'],['note-maturity-in','受取手形の満期決済','当座預金 ／ 受取手形'],['note-maturity-out','支払手形の満期決済','支払手形 ／ 当座預金'],['own-check','自社の小切手を振り出す','当座預金が減る'],['other-check','他店振出小切手を受け取る','現金として処理'],['e-receivable','電子記録債権へ振り替える','電子記録債権 ／ 売掛金'],['e-payable','電子記録債務へ振り替える','買掛金 ／ 電子記録債務'],['advance-paid','商品注文時に手付金を支払う','前払金 ／ 現金'],['advance-received','商品注文時に手付金を受け取る','現金 ／ 前受金'],['employee-advance','出張前に概算旅費を渡す','仮払金 ／ 現金'],['unknown-deposit','内容不明の入金を処理する','普通預金 ／ 仮受金'],['unknown-resolved','仮受金の内容が判明する','仮受金を正しい科目へ振替'],['tax','固定資産税を支払う','租税公課 ／ 現金'],['communication','電話料金を支払う','通信費 ／ 普通預金'],['utility-unpaid','水道光熱費が未払い','水道光熱費 ／ 未払金'],['capital','出資を受ける','現金 ／ 資本金'],['cash-short','現金実査が帳簿より少ない','現金過不足を使う'],['cash-over','現金実査が帳簿より多い','現金過不足を使う'],['cash-short-resolve','現金不足の原因が判明する','現金過不足を正しい費用へ'],['cash-over-resolve','現金超過の原因が判明する','現金過不足を正しい収益へ'],['tax-purchase','税抜方式で商品を仕入れる','仮払消費税を分ける'],['tax-sale','税抜方式で商品を売る','仮受消費税を分ける'],['bank-fee','振込手数料を当社負担で支払う','支払手数料を分ける'],['purchase-freight','仕入時の引取運賃を処理する','仕入原価に含める'],['advertising','広告宣伝費を支払う','広告宣伝費 ／ 預金'],['rent','店舗家賃を支払う','支払家賃 ／ 現金'],['supplies','事務用品を費用処理する','消耗品費 ／ 現金'],['loan-interest','借入金と利息を同時に支払う','元本と支払利息を分ける'],['payroll','給料から税・社会保険料を控除する','預り金を分ける複合仕訳'],['legal-welfare','会社負担の社会保険料を計上する','法定福利費を使う'],['accrued-interest','未払利息を見越す','支払利息 ／ 未払利息'],['prepaid-insurance','翌期分保険料を前払へ振り替える','前払保険料 ／ 保険料'],['depreciation','備品の減価償却を間接法で計上する','減価償却費 ／ 累計額'],['allowance','貸倒引当金を差額補充法で設定する','貸倒引当金繰入 ／ 貸倒引当金']
];
const q2Topics=[
 ['補助簿判定','取引から必要な補助簿を選ぶ',['補助簿判定','補助簿']],['現金出納帳','現金出納帳を読み書きする',['現金出納帳']],['当座預金出納帳','当座預金出納帳を読み書きする',['当座預金出納帳']],['小口現金出納帳','小口現金の補給と支払を整理する',['小口現金']],['売上帳','売上帳への記入を判断する',['売上帳']],['仕入帳','仕入帳への記入を判断する',['仕入帳']],['売掛金元帳','得意先別の売掛金を管理する',['売掛金元帳']],['買掛金元帳','仕入先別の買掛金を管理する',['買掛金元帳']],['商品有高帳','商品の受入・払出・残高を管理する',['商品有高帳']],['先入先出法','先入先出法で払出単価を求める',['先入先出']],['移動平均法','移動平均法で平均単価を求める',['移動平均']],['固定資産台帳','固定資産台帳を読み書きする',['固定資産台帳']],['受取手形記入帳','受取手形の振出人・満期日を管理する',['受取手形']],['支払手形記入帳','支払手形の受取人・満期日を管理する',['支払手形']],['総勘定元帳','仕訳から総勘定元帳へ転記する',['総勘定元帳','転記']],['試算表','元帳から試算表を作る・読む',['試算表']],['伝票会計','入金・出金・振替伝票を判断する',['伝票']],['帳簿の締切','帳簿を締め切り翌期へつなぐ',['締切','繰越']],['仕訳日計表','伝票を集計して仕訳日計表へつなぐ',['仕訳日計表']]
];
const q3Topics=[
 ['決算整理','決算整理の目的と流れを判断する',['決算整理']],['現金過不足','現金過不足を決算で整理する',['現金過不足']],['売上原価','期首・仕入・期末から売上原価を求める',['売上原価']],['貸倒引当金','貸倒引当金を設定・補充する',['貸倒引当金']],['減価償却','固定資産の減価償却費を計算する',['減価償却']],['固定資産売却','固定資産売却損益を判断する',['固定資産','売却']],['前払費用','翌期分の費用を前払へ繰り延べる',['前払費用','前払']],['未払費用','当期発生・未払いの費用を見越す',['未払費用','未払']],['未収収益','当期発生・未収の収益を見越す',['未収収益','未収']],['前受収益','翌期分の収益を前受へ繰り延べる',['前受収益','前受']],['経過勘定','前払・未払・未収・前受を総合判断する',['経過勘定']],['消耗品','消耗品の未使用分を決算整理する',['消耗品']],['法人税等','法人税等と未払法人税等を処理する',['法人税']],['消費税','仮払・仮受消費税を決算で整理する',['消費税']],['訂正仕訳','誤った仕訳を取り消して正しく直す',['訂正']],['精算表','決算整理を精算表へ反映する',['精算表']],['P/L・B/S','収益費用と資産負債純資産の行き先を判断する',['P/L','B/S']],['損益計算書','損益計算書を完成させる',['損益計算書']],['貸借対照表','貸借対照表を完成させる',['貸借対照表']],['締切・繰越','収益費用を締め、資産負債を翌期へ繰り越す',['締切','繰越']],['全体像','取引から決算書までの処理順を理解する',['全体像']]
];
function makeCatalog(){
 const items=[];
 (window.BOKI_ACCOUNTS||[]).forEach(a=>{
  items.push({module:'q1',group:'5要素',name:`「${a.name}」を5要素で判定`,sub:`${a.element}・${a.statement}`,exact:[`ACC:${a.name}`],link:'q1.html'});
  items.push({module:'q1',group:'借方・貸方',name:`「${a.name}」の増減と借方・貸方`,sub:`通常残高 ${a.normalSide}`,prefix:[`DC:${a.name}:`],link:'q1.html'});
 });
 (window.BOKI_PHRASES||[]).forEach(p=>items.push({module:'q1',group:'言い回し',name:p.signal||p.sentence||p.id,sub:`→ ${p.answer}`,exact:[`PH:${p.id}`],link:'q1.html'}));
 journalPatterns.forEach(([k,name,sub])=>items.push({module:'q1',group:'仕訳パターン',name,sub,prefix:[`J4X:${k}:`,`JDX:${k}:`],link:'q1.html'}));
 q2Topics.forEach(([id,name,aliases])=>items.push({module:'q2',group:'帳簿・勘定',name,sub:'第2問の主要論点',topics:aliases,id:`q2-${id}`,link:'q2.html'}));
 q3Topics.forEach(([id,name,aliases])=>items.push({module:'q3',group:'決算・精算表',name,sub:'第3問の主要論点',topics:aliases,id:`q3-${id}`,link:'q3.html'}));
 return items;
}
function dbRecords(){try{return Object.values(window.BOKI_MASTERY?.store?.().questions||{})}catch(e){return[]}}
function matches(item,q){
 if(q.module!==item.module)return false;
 const id=String(q.id||'');
 if(item.exact?.includes(id))return true;
 if(item.prefix?.some(p=>id.startsWith(p)))return true;
 if(item.topics?.some(t=>String(q.topic||'').includes(t)||String(q.skill||'').includes(t)))return true;
 return false;
}
function aggregate(item,records){
 const xs=records.filter(q=>matches(item,q));
 let seen=0,correct=0,wrong=0,dont=0,totalTime=0,due=false,exactMastered=false;
 xs.forEach(q=>{seen+=Number(q.seen||0);correct+=Number(q.correct||0);wrong+=Number(q.wrong||0);dont+=Number(q.dont||0);totalTime+=Number(q.totalTime||0);try{if(window.BOKI_MASTERY?.due?.(q))due=true;if(xs.length===1&&window.BOKI_MASTERY?.isMastered?.(q))exactMastered=true}catch(e){}});
 const acc=seen?Math.round(correct/seen*100):0;
 let status='new',label='未回答';
 if(seen){
  if(exactMastered||(seen>=5&&correct>=5&&acc>=80)){status='mastered';label='習熟'}
  else if((seen>=2&&acc<60)||wrong>=3){status='weak';label='苦手'}
  else if(seen>=3&&acc>=75){status='settling';label='定着中'}
  else{status='learning';label='学習中'}
 }
 return{seen,correct,wrong,dont,totalTime,acc,status,label,due,records:xs.length};
}
function addDetectedTopics(items,records){
 for(const module of ['q2','q3']){
  const known=items.filter(x=>x.module===module);
  const topics=[...new Set(records.filter(q=>q.module===module&&q.topic).map(q=>String(q.topic)))];
  topics.forEach(topic=>{if(known.some(x=>x.topics?.some(t=>topic.includes(t)||t.includes(topic))))return;items.push({module,group:'履歴から検出',name:topic,sub:'回答履歴から検出した問題項目',topics:[topic],id:`det-${module}-${topic}`,link:`${module}.html`})})
 }
}
const moduleLabel={q1:'第1問　仕訳',q2:'第2問　帳簿・勘定',q3:'第3問　決算・精算表'};
function render(){
 const records=dbRecords(),items=makeCatalog();addDetectedTopics(items,records);items.forEach(x=>x.stat=aggregate(x,records));
 let filter='all',query='';
 const total=items.length,answered=items.filter(x=>x.stat.seen>0).length,mastered=items.filter(x=>x.stat.status==='mastered').length;
 const counts=k=>items.filter(x=>x.stat.status===k).length;
 const cov=total?Math.round(answered/total*100):0,mas=total?Math.round(mastered/total*100):0;
 const put=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 put('totalN',total);put('answeredN',answered);put('remainingN',Math.max(0,total-answered));put('coverageText',`${answered}/${total}　${cov}%`);put('masteryText',`${mastered}/${total}　${mas}%`);put('newN',counts('new'));put('weakN',counts('weak'));put('learningN',counts('learning'));put('settlingN',counts('settling'));put('masteredN',mastered);
 document.getElementById('coverageBar').style.width=cov+'%';document.getElementById('masteryBar').style.width=mas+'%';
 const icon=document.getElementById('mileIcon'),title=document.getElementById('mileTitle'),text=document.getElementById('mileText');
 if(cov>=100){icon.textContent='🏆';title.textContent='全問題項目を一周達成！';text.textContent=mas>=80?'習熟率80%以上。CBT演習で仕上げる段階です。':`次のゴールは習熟率80%。現在${mas}%です。`}
 else if(cov>=75){icon.textContent='🏃';title.textContent='75%突破。あと4分の1';text.textContent=`一周まであと${total-answered}項目。未回答を優先しましょう。`}
 else if(cov>=50){icon.textContent='⭐';title.textContent='半分を超えました';text.textContent=`${answered}項目まで到達。一周まであと${total-answered}項目です。`}
 else if(cov>=25){icon.textContent='🌿';title.textContent='基礎を一周中';text.textContent=`${answered}項目を経験済み。まず50%到達を目指します。`}
 else{icon.textContent='🌱';title.textContent='まずは全体を広く触る';text.textContent=`一周まであと${total-answered}項目。未回答から進めると現在地が伸びます。`}
 function draw(){
  const shown=items.filter(x=>{
   if(filter==='due'&&!x.stat.due)return false;
   if(filter!=='all'&&filter!=='due'&&x.stat.status!==filter)return false;
   const q=query.trim().toLowerCase();return !q||`${x.name} ${x.sub} ${x.group}`.toLowerCase().includes(q)
  });
  const root=document.getElementById('catalog');if(!shown.length){root.innerHTML='<div class="empty">この条件に当てはまる問題項目はありません。</div>';return}
  root.innerHTML=['q1','q2','q3'].map(module=>{
   const arr=shown.filter(x=>x.module===module);if(!arr.length)return'';const all=items.filter(x=>x.module===module),ans=all.filter(x=>x.stat.seen).length,pct=all.length?Math.round(ans/all.length*100):0;
   const groups=[...new Set(arr.map(x=>x.group))];
   return `<details class="module ${module}" open><summary><div class="module-head"><div><b>${moduleLabel[module]}</b><small>${ans}/${all.length}項目を回答済</small></div><div class="module-pct"><b>${pct}%</b><small>網羅</small></div></div></summary>${groups.map(g=>{const gs=arr.filter(x=>x.group===g),ga=items.filter(x=>x.module===module&&x.group===g),done=ga.filter(x=>x.stat.seen).length;return `<details class="group"><summary><span>${esc(g)} <small>${done}/${ga.length}</small></span><span>⌄</span></summary><div class="group-list">${gs.map(item=>{const s=item.stat;return `<div class="item"><div><div class="item-name">${esc(item.name)}</div><div class="item-sub">${esc(item.sub||'')}</div><div class="metric"><span>回答 ${s.seen}回</span><span>正解 ${s.correct}回</span><span>正答率 ${s.seen?s.acc+'%':'—'}</span>${s.due?'<span>復習時期</span>':''}</div></div><a href="${item.link}" class="status ${s.status} ${s.due?'due':''}" style="text-decoration:none">${s.label}</a></div>`}).join('')}</div></details>`}).join('')}</details>`
  }).join('')
 }
 document.getElementById('filters').addEventListener('click',e=>{const b=e.target.closest('.filter');if(!b)return;filter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('on',x===b));draw()});
 document.getElementById('search').addEventListener('input',e=>{query=e.target.value;draw()});draw();
}
function init(){setTimeout(render,160)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();