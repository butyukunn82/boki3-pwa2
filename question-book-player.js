(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='questions.html')return;
const RETURN_KEY='boki3_qbook_return_state_v1';
let sequence=[],pos=0,currentQuestion=null,answered=false;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const opposite=s=>s==='借方'?'貸方':'借方';
const moduleLabel={q1:'第1問 仕訳',q2:'第2問 帳簿・勘定',q3:'第3問 決算・精算表'};
const JOURNAL_KEYS={
'商品を掛けで売る':'sale-credit','商品を掛けで仕入れる':'buy-credit','商品を現金で売る':'sale-cash','商品を現金で仕入れる':'buy-cash','売掛金が普通預金へ振り込まれる':'ar-bank','買掛金を普通預金から支払う':'ap-bank','備品を現金で購入する':'equipment-cash','備品を後払いで購入する':'equipment-payable','銀行から借り入れる':'borrow-bank','借入金を返済する':'repay-loan','商品代金として約束手形を受け取る':'note-sale','商品代金として約束手形を振り出す':'note-buy','売掛金を約束手形で回収する':'note-ar','買掛金を約束手形で支払う':'note-ap','受取手形の満期決済':'note-maturity-in','支払手形の満期決済':'note-maturity-out','自社の小切手を振り出す':'own-check','他店振出小切手を受け取る':'other-check','電子記録債権へ振り替える':'e-receivable','電子記録債務へ振り替える':'e-payable','商品注文時に手付金を支払う':'advance-paid','商品注文時に手付金を受け取る':'advance-received','出張前に概算旅費を渡す':'employee-advance','内容不明の入金を処理する':'unknown-deposit','仮受金の内容が判明する':'unknown-resolved','固定資産税を支払う':'tax','電話料金を支払う':'communication','水道光熱費が未払い':'utility-unpaid','出資を受ける':'capital','現金実査が帳簿より少ない':'cash-short','現金実査が帳簿より多い':'cash-over','現金不足の原因が判明する':'cash-short-resolve','現金超過の原因が判明する':'cash-over-resolve','税抜方式で商品を仕入れる':'tax-purchase','税抜方式で商品を売る':'tax-sale','振込手数料を当社負担で支払う':'bank-fee','仕入時の引取運賃を処理する':'purchase-freight','広告宣伝費を支払う':'advertising','店舗家賃を支払う':'rent','事務用品を費用処理する':'supplies','借入金と利息を同時に支払う':'loan-interest','給料から税・社会保険料を控除する':'payroll','会社負担の社会保険料を計上する':'legal-welfare','未払利息を見越す':'accrued-interest','翌期分保険料を前払へ振り替える':'prepaid-insurance','備品の減価償却を間接法で計上する':'depreciation','貸倒引当金を差額補充法で設定する':'allowance'};
const Q2={
'取引から必要な補助簿を選ぶ':q('商品を掛けで販売した。得意先別の売掛金残高を管理する帳簿はどれ？','売掛金元帳',['売掛金元帳','買掛金元帳','仕入帳','固定資産台帳'],'補助簿','売掛金元帳は得意先別の売掛金残高を管理します。'),
'現金出納帳を読み書きする':q('現金の受入れと支払いを日付順に記録する帳簿はどれ？','現金出納帳',['現金出納帳','当座預金出納帳','売上帳','仕入帳'],'現金出納帳','現金そのものの増減を管理する帳簿です。'),
'当座預金出納帳を読み書きする':q('当座預金の預入れ・引出しを記録する補助簿はどれ？','当座預金出納帳',['当座預金出納帳','現金出納帳','小口現金出納帳','買掛金元帳'],'当座預金出納帳','当座預金の増減を管理します。'),
'小口現金の補給と支払を整理する':q('小口現金係が交通費や消耗品費などの支払いを記録する帳簿は？','小口現金出納帳',['小口現金出納帳','現金出納帳','仕入帳','固定資産台帳'],'小口現金','小口現金の補給と日々の少額支出を整理します。'),
'売上帳への記入を判断する':q('商品の売上取引を記録する補助記入帳はどれ？','売上帳',['売上帳','仕入帳','売掛金元帳','受取手形記入帳'],'売上帳','商品売上の明細を記録します。'),
'仕入帳への記入を判断する':q('商品の仕入取引を記録する補助記入帳はどれ？','仕入帳',['仕入帳','売上帳','買掛金元帳','支払手形記入帳'],'仕入帳','商品仕入の明細を記録します。'),
'得意先別の売掛金を管理する':q('A社・B社など得意先ごとの売掛金残高を把握する帳簿は？','売掛金元帳',['売掛金元帳','買掛金元帳','売上帳','現金出納帳'],'売掛金元帳','売掛金元帳は得意先別に管理します。'),
'仕入先別の買掛金を管理する':q('仕入先ごとの買掛金残高を把握する帳簿は？','買掛金元帳',['買掛金元帳','売掛金元帳','仕入帳','当座預金出納帳'],'買掛金元帳','買掛金元帳は仕入先別に管理します。'),
'商品の受入・払出・残高を管理する':q('商品ごとの数量・単価・金額の受入、払出、残高を記録する帳簿は？','商品有高帳',['商品有高帳','固定資産台帳','売上帳','仕入帳'],'商品有高帳','在庫の数量と金額を継続的に把握します。'),
'先入先出法で払出単価を求める':q('先に仕入れた商品から先に払い出されたと仮定する方法は？','先入先出法',['先入先出法','移動平均法','個別法','定額法'],'先入先出','古い仕入単価から払出原価に使います。'),
'移動平均法で平均単価を求める':q('商品を仕入れるたびに、在庫と仕入分を合計して平均単価を計算し直す方法は？','移動平均法',['移動平均法','先入先出法','定率法','個別法'],'移動平均','仕入れの都度、新しい平均単価を求めます。'),
'固定資産台帳を読み書きする':q('備品などについて取得日・取得原価・減価償却累計額などを個別管理する帳簿は？','固定資産台帳',['固定資産台帳','商品有高帳','仕入帳','総勘定元帳'],'固定資産台帳','固定資産ごとの取得・減価償却等を管理します。'),
'受取手形の振出人・満期日を管理する':q('受け取った約束手形の振出人や満期日を管理する帳簿は？','受取手形記入帳',['受取手形記入帳','支払手形記入帳','売掛金元帳','現金出納帳'],'受取手形','受取手形の詳細を管理します。'),
'支払手形の受取人・満期日を管理する':q('自社が振り出した約束手形の受取人や満期日を管理する帳簿は？','支払手形記入帳',['支払手形記入帳','受取手形記入帳','買掛金元帳','当座預金出納帳'],'支払手形','支払手形の詳細を管理します。'),
'仕訳から総勘定元帳へ転記する':q('仕訳帳の内容を勘定科目ごとに集めて記録する主要簿は？','総勘定元帳',['総勘定元帳','仕訳帳','売上帳','試算表'],'総勘定元帳','仕訳帳から各勘定へ転記します。'),
'元帳から試算表を作る・読む':q('各勘定の残高を一覧にし、貸借の一致などを確認する表は？','試算表',['試算表','精算表','損益計算書','仕訳日計表'],'試算表','元帳の各勘定を集計して確認します。'),
'入金・出金・振替伝票を判断する':q('現金100,000円を受け取った取引を伝票会計で処理するとき、基本的に使う伝票は？','入金伝票',['入金伝票','出金伝票','振替伝票','仕入伝票'],'伝票','現金の入金を伴う取引なので入金伝票です。'),
'帳簿を締め切り翌期へつなぐ':q('決算で資産・負債・純資産の残高を翌期へ引き継ぐ処理として適切なのは？','次期繰越として締め切る',['次期繰越として締め切る','すべて損益勘定へ振り替える','すべてゼロにして廃棄する','売上勘定へまとめる'],'締切','資産・負債・純資産は残高を翌期へ繰り越します。'),
'伝票を集計して仕訳日計表へつなぐ':q('複数の伝票を1日単位で集計し、総勘定元帳への転記を効率化する表は？','仕訳日計表',['仕訳日計表','試算表','精算表','商品有高帳'],'仕訳日計表','伝票を日ごとに集計する表です。')
};
const Q3={
'決算整理の目的と流れを判断する':q('決算整理を行う主な目的として最も適切なのは？','当期の正しい利益と期末の財政状態を示す',['当期の正しい利益と期末の財政状態を示す','現金を必ず増やす','売上を翌期へ繰り越す','仕訳帳を廃棄する'],'決算整理','期間帰属を正しくして決算書を完成させます。'),
'現金過不足を決算で整理する':q('決算日に現金過不足の借方残高の原因が最後まで不明だった。原則として振り替える科目は？','雑損',['雑損','雑益','売上','資本金'],'現金過不足','不足の原因不明額は雑損に振り替えます。'),
'期首・仕入・期末から売上原価を求める':q('売上原価の基本式として正しいものは？','期首商品＋当期仕入－期末商品',['期首商品＋当期仕入－期末商品','期首商品－当期仕入＋期末商品','当期仕入＋期末商品','売上－期末商品'],'売上原価','売れる可能性があった商品の原価から期末在庫を除きます。'),
'貸倒引当金を設定・補充する':q('貸倒引当金の期末必要額が30,000円、整理前残高が10,000円。差額補充法の繰入額は？','20,000円',['20,000円','30,000円','10,000円','40,000円'],'貸倒引当金','必要額30,000－既存残高10,000＝20,000円です。'),
'固定資産の減価償却費を計算する':q('取得原価600,000円、残存価額0円、耐用年数5年、定額法。1年分の減価償却費は？','120,000円',['120,000円','100,000円','300,000円','600,000円'],'減価償却','600,000÷5年＝120,000円です。'),
'固定資産売却損益を判断する':q('固定資産の売却損益を判定するとき、売却代金と比較するものは？','売却時の帳簿価額',['売却時の帳簿価額','取得原価だけ','当期の売上高','減価償却累計額だけ'],'固定資産 売却','取得原価ではなく、売却時点の帳簿価額と比較します。'),
'翌期分の費用を前払へ繰り延べる':q('すでに支払った費用のうち翌期分を決算整理するとき計上するものは？','前払費用',['前払費用','未払費用','未収収益','前受収益'],'前払費用 前払','翌期にサービスを受ける権利なので資産です。'),
'当期発生・未払いの費用を見越す':q('当期に発生しているが、まだ支払っていない費用を決算整理で計上するものは？','未払費用',['未払費用','前払費用','未収収益','前受収益'],'未払費用 未払','当期費用を計上し、同時に負債を認識します。'),
'当期発生・未収の収益を見越す':q('当期に発生しているが、まだ受け取っていない収益を計上するものは？','未収収益',['未収収益','前受収益','前払費用','未払費用'],'未収収益 未収','当期収益と受取権利を認識します。'),
'翌期分の収益を前受へ繰り延べる':q('すでに受け取った収益のうち翌期分を決算整理するとき計上するものは？','前受収益',['前受収益','未収収益','未払費用','前払費用'],'前受収益 前受','まだ稼いでいない部分なので負債です。'),
'前払・未払・未収・前受を総合判断する':q('「当期に稼いだが、まだ受け取っていない」という状況に当てはまる経過勘定は？','未収収益',['未収収益','前受収益','前払費用','未払費用'],'経過勘定','発生済みの収益を見越して計上します。'),
'消耗品の未使用分を決算整理する':q('購入時に全額を消耗品費として処理した。期末に未使用分がある場合、その未使用分はどうする？','資産の消耗品へ振り替える',['資産の消耗品へ振り替える','追加で消耗品費にする','売上へ振り替える','何もしない'],'消耗品','未使用分は翌期に使える資産として残します。'),
'法人税等と未払法人税等を処理する':q('決算で当期の法人税等100,000円を計上し、まだ納付していない。貸方科目は？','未払法人税等',['未払法人税等','法人税等','仮受消費税','買掛金'],'法人税','未納分は負債の未払法人税等になります。'),
'仮払・仮受消費税を決算で整理する':q('税抜方式で仮受消費税が仮払消費税より多い場合、差額は原則として何になる？','未払消費税',['未払消費税','未収消費税','売上','仕入'],'消費税','預かった消費税の方が多ければ納付すべき差額です。'),
'誤った仕訳を取り消して正しく直す':q('訂正仕訳の基本的な考え方として適切なのは？','誤った仕訳の影響を取り消し、正しい仕訳に直す',['誤った仕訳の影響を取り消し、正しい仕訳に直す','誤った仕訳をそのまま残す','現金だけ修正する','決算時まで何もしない'],'訂正','誤りを相殺し、最終的に正しい残高になるよう修正します。'),
'決算整理を精算表へ反映する':q('精算表で決算整理仕訳を反映した後、収益・費用は主にどこへ移す？','損益計算書欄',['損益計算書欄','貸借対照表欄','仕訳帳欄','補助元帳欄'],'精算表','収益・費用はP/L、資産・負債・純資産はB/Sへ進みます。'),
'収益費用と資産負債純資産の行き先を判断する':q('決算書への振り分けとして正しい組合せは？','収益・費用→P/L、資産・負債・純資産→B/S',['収益・費用→P/L、資産・負債・純資産→B/S','すべてP/L','すべてB/S','収益だけB/S'],'P/L B/S','5要素の最終的な行き先を区別します。'),
'損益計算書を完成させる':q('損益計算書が示す中心的な内容は？','一定期間の経営成績',['一定期間の経営成績','期末時点の財政状態','商品ごとの在庫数量','現金だけの増減'],'損益計算書','収益と費用から一定期間の利益を示します。'),
'貸借対照表を完成させる':q('貸借対照表が示す中心的な内容は？','期末時点の財政状態',['期末時点の財政状態','一定期間の売上だけ','一定期間の経営成績だけ','仕訳の順序'],'貸借対照表','資産・負債・純資産を期末時点で示します。'),
'収益費用を締め、資産負債を翌期へ繰り越す':q('決算の帳簿締切で、収益・費用勘定は最終的にどこへ集約する？','損益勘定',['損益勘定','資本金勘定','現金勘定','売掛金勘定'],'締切 繰越','収益・費用を損益勘定へ振り替えて締め切ります。'),
'取引から決算書までの処理順を理解する':q('簿記の基本的な処理順として適切なのは？','取引→仕訳→元帳→試算表→決算整理→決算書',['取引→仕訳→元帳→試算表→決算整理→決算書','取引→決算書→仕訳→元帳','元帳→取引→決算書→仕訳','決算書→試算表→取引→仕訳'],'全体像','日々の記録から集計・決算整理を経て決算書へ進みます。')
};
function q(prompt,answer,choices,topic,explanation){return{prompt,answer,choices,topic,explanation}}
function descriptor(el){
 const mod=el.closest('.module');let module='q1';if(mod?.classList.contains('q2'))module='q2';else if(mod?.classList.contains('q3'))module='q3';
 const groupEl=el.closest('.group'),sum=groupEl?.querySelector(':scope > summary span');let group='';if(sum)group=(sum.childNodes[0]?.textContent||sum.textContent||'').trim();
 return{module,group,name:$('.item-name',el)?.textContent?.trim()||'',sub:$('.item-sub',el)?.textContent?.trim()||''}
}
function currentDomSequence(){return $$('#catalog .item').map(descriptor)}
function accountByName(name){return (window.BOKI_ACCOUNTS||[]).find(a=>a.name===name)}
function phraseByItem(item){return (window.BOKI_PHRASES||[]).find(p=>(p.signal||p.sentence||p.id)===item.name)}
function buildQuestion(item){
 if(item.module==='q1'&&item.group==='5要素'){
  const name=(item.name.match(/「(.+?)」/)||[])[1],a=accountByName(name);if(!a)return fallback(item);
  return{prompt:`「${name}」は、簿記の5要素のどれに分類される？`,answer:a.element,choices:shuffle(['資産','負債','純資産','収益','費用']).slice(0,5),explanation:`「${name}」は ${a.element} です。${a.statement?`決算書では${a.statement}に属します。`:''}`,record:{module:'q1',id:`ACC:${name}`,topic:'5要素',skill:'5要素'}}
 }
 if(item.module==='q1'&&item.group==='借方・貸方'){
  const name=(item.name.match(/「(.+?)」/)||[])[1],a=accountByName(name);if(!a)return fallback(item);const inc=Math.random()<.5,normal=a.normalSide||'借方',answer=inc?normal:opposite(normal);
  return{prompt:`「${name}」が${inc?'増加':'減少'}した。この変化を記入する側は？`,answer,choices:shuffle(['借方','貸方']),explanation:`「${name}」の通常残高は${normal}。${inc?'増加は通常残高と同じ側':'減少は通常残高と反対側'}なので ${answer} です。`,record:{module:'q1',id:`DC:${name}:${inc?'up':'down'}`,topic:'借方・貸方',skill:'借方・貸方'}}
 }
 if(item.module==='q1'&&item.group==='言い回し'){
  const p=phraseByItem(item);if(!p)return fallback(item);return{prompt:p.sentence||p.signal,answer:p.answer,choices:shuffle([...(p.choices||[])]),explanation:[p.meaning,p.contrast,p.journal,p.tip].filter(Boolean).join(' '),record:{module:'q1',id:`PH:${p.id}`,topic:p.group||'言い回し',skill:p.group||'言い回し'}}
 }
 if(item.module==='q1'&&item.group==='仕訳パターン'){
  const k=JOURNAL_KEYS[item.name]||encodeURIComponent(item.name),correct=item.sub||'正しい仕訳を選ぶ';const pool=$$('#catalog .module.q1 .group .item').map(descriptor).filter(x=>x.group==='仕訳パターン'&&x.sub&&x.sub!==correct).map(x=>x.sub);const distract=shuffle([...new Set(pool)]).slice(0,3);
  return{prompt:`「${item.name}」場合の処理として、最も適切なものは？`,answer:correct,choices:shuffle([correct,...distract]),explanation:`この項目では「${correct}」と判断します。`,record:{module:'q1',id:`J4X:${k}:BOOK`,topic:'4択仕訳',skill:'仕訳パターン'}}
 }
 const base=item.module==='q2'?Q2[item.name]:Q3[item.name];if(base){return{...base,choices:shuffle(base.choices),record:{module:item.module,id:`BOOK:${encodeURIComponent(item.name)}`,topic:base.topic,skill:item.group}}}
 return fallback(item)
}
function fallback(item){const correct=item.sub||item.name;return{prompt:`「${item.name}」について最も適切な説明は？`,answer:correct,choices:[correct,'この項目には当てはまらない','必ず現金だけで処理する','決算では考慮しない'],explanation:`この項目のポイントは「${correct}」です。`,record:{module:item.module,id:`BOOK:${encodeURIComponent(item.name)}`,topic:item.name,skill:item.group}}}
function aggregateFor(item){
 const db=window.BOKI_MASTERY?.store?.().questions||{},xs=Object.values(db).filter(r=>{
  if(r.module!==item.module)return false;const id=String(r.id||''),topic=`${r.topic||''} ${r.skill||''}`;
  if(item.module==='q1'&&item.group==='5要素'){const n=(item.name.match(/「(.+?)」/)||[])[1];return id===`ACC:${n}`}
  if(item.module==='q1'&&item.group==='借方・貸方'){const n=(item.name.match(/「(.+?)」/)||[])[1];return id.startsWith(`DC:${n}:`)}
  if(item.module==='q1'&&item.group==='言い回し'){const p=phraseByItem(item);return p&&id===`PH:${p.id}`}
  if(item.module==='q1'&&item.group==='仕訳パターン'){const k=JOURNAL_KEYS[item.name]||'';return id.startsWith(`J4X:${k}:`)||id.startsWith(`JDX:${k}:`)}
  const base=item.module==='q2'?Q2[item.name]:Q3[item.name];return base?topic.includes(base.topic):id===`BOOK:${encodeURIComponent(item.name)}`
 });
 let seen=0,correct=0,wrong=0,streak=0;xs.forEach(r=>{seen+=Number(r.seen||0);correct+=Number(r.correct||0);wrong+=Number(r.wrong||0)});const acc=seen?Math.round(correct/seen*100):0;
 const latest=[...xs].sort((a,b)=>Number(b.last||0)-Number(a.last||0));for(const r of latest){if(r.lastResult==='correct')streak++;else break}
 const s=window.BOKI_MASTERY?.settings?.()||{masteryTarget:5,masteryAccuracy:80,masteryStreak:3};let label='未回答',pct=0;if(seen){if(correct>=Number(s.masteryTarget||5)&&streak>=Number(s.masteryStreak||3)&&acc>=Number(s.masteryAccuracy||80)){label='習熟';pct=100}else if(streak>=2&&acc>=75){label='あと一歩';pct=80}else if(correct>=2&&acc>=60){label='定着中';pct=55}else{label=wrong>=3||acc<50?'苦手':'学習中';pct=25}}
 return{seen,correct,wrong,acc,streak,label,pct}
}
function ensureUI(){if($('#qbookPlayer'))return;const d=document.createElement('div');d.id='qbookPlayer';d.className='qbp';d.innerHTML=`<div class="qbp-card"><header><button id="qbpClose" type="button">‹ 問題帳</button><div><b id="qbpPosition"></b><small id="qbpCrumb"></small></div></header><div class="qbp-progress"><i id="qbpBar"></i></div><main><div class="qbp-item"><small>学習項目</small><h2 id="qbpItem"></h2></div><div class="qbp-question" id="qbpQuestion"></div><div class="qbp-choices" id="qbpChoices"></div><button class="qbp-dont" id="qbpDont" type="button">わからない</button><div class="qbp-feedback" id="qbpFeedback"></div><div class="qbp-actions" id="qbpActions"></div></main></div>`;document.body.appendChild(d);$('#qbpClose').onclick=closePlayer;$('#qbpDont').onclick=()=>submit('__DONT__');injectCss()}
function injectCss(){if($('#qbpCss'))return;const s=document.createElement('style');s.id='qbpCss';s.textContent=`
#catalog .item{cursor:pointer}.qbp{position:fixed;inset:0;z-index:1200;background:#eef3f8;display:none;overflow:auto}.qbp.show{display:block}.qbp-card{min-height:100%;max-width:680px;margin:0 auto;background:#f7f9fc;padding-bottom:28px}.qbp-card header{position:sticky;top:0;z-index:4;background:#176bc1;color:#fff;padding:10px 12px;display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}.qbp-card header button{border:0;background:rgba(255,255,255,.16);color:#fff;border-radius:999px;min-height:40px;padding:0 11px;font-weight:900}.qbp-card header b{display:block;font-size:.9rem}.qbp-card header small{display:block;opacity:.9;margin-top:2px}.qbp-progress{height:6px;background:#dce7f0;position:sticky;top:60px;z-index:3}.qbp-progress i{display:block;height:100%;background:#45b66b;width:0;transition:.2s}.qbp-card main{padding:14px}.qbp-item{background:#fff;border:1px solid #d9e3ed;border-radius:16px;padding:11px 13px;margin-bottom:10px}.qbp-item small{color:#6d8094;font-weight:800}.qbp-item h2{font-size:1rem;margin:4px 0 0;line-height:1.45}.qbp-question{background:linear-gradient(145deg,#176bc1,#185b9d);color:#fff;border-radius:18px;padding:18px 15px;font-size:1.04rem;font-weight:900;line-height:1.65;box-shadow:0 8px 22px rgba(25,84,145,.16)}.qbp-choices{display:grid;gap:8px;margin-top:11px}.qbp-choice{border:1px solid #cbd9e6;background:#fff;color:#253c54;border-radius:14px;min-height:56px;padding:10px 12px;text-align:left;font-size:.9rem;font-weight:850}.qbp-choice.correct{background:#eaf8ef;border-color:#69b984;color:#1f6d3d}.qbp-choice.wrong{background:#fff0f0;border-color:#df8585;color:#943636}.qbp-choice:disabled{opacity:1}.qbp-dont{width:100%;margin-top:9px;min-height:46px;border:1px dashed #b7c6d5;border-radius:13px;background:#f5f7fa;color:#627488;font-weight:900}.qbp-feedback{display:none;margin-top:12px;border-radius:16px;padding:13px;background:#fff;border:1px solid #d9e4ee}.qbp-feedback.show{display:block}.qbp-result{font-size:1.05rem;font-weight:950;margin-bottom:6px}.qbp-result.ok{color:#21804a}.qbp-result.ng{color:#a33a3a}.qbp-explain{font-size:.8rem;line-height:1.65;color:#4e6277}.qbp-stat{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px}.qbp-stat span{background:#f3f6f9;border-radius:9px;padding:6px 3px;text-align:center;font-size:.65rem}.qbp-stat b{display:block;font-size:.82rem}.qbp-nextname{margin-top:9px;font-size:.72rem;color:#5f7184}.qbp-actions{display:none;grid-template-columns:1fr 1.45fr;gap:8px;margin-top:11px}.qbp-actions.show{display:grid}.qbp-actions button{min-height:52px;border-radius:13px;font-weight:950}.qbp-repeat{background:#fff;border:1px solid #cbd8e5;color:#39556f}.qbp-next{border:0;background:#176bc1;color:#fff}@media(max-width:420px){.qbp-card main{padding:11px}.qbp-actions{grid-template-columns:1fr}.qbp-stat{grid-template-columns:repeat(2,1fr)}}`;document.head.appendChild(s)}
function start(el){ensureUI();sequence=currentDomSequence();const clicked=descriptor(el);pos=Math.max(0,sequence.findIndex(x=>x.module===clicked.module&&x.group===clicked.group&&x.name===clicked.name));saveReturnState();$('#qbookPlayer').classList.add('show');document.body.style.overflow='hidden';renderQuestion()}
function renderQuestion(){answered=false;const item=sequence[pos];if(!item){finish();return}currentQuestion=buildQuestion(item);const totalAll=Number($('#totalN')?.textContent)||sequence.length;$('#qbpPosition').textContent=sequence.length===totalAll?`問題帳 ${pos+1} / ${sequence.length}`:`今回 ${pos+1} / ${sequence.length} ・ 全${totalAll}項目`;$('#qbpCrumb').textContent=`${moduleLabel[item.module]} ＞ ${item.group}`;$('#qbpItem').textContent=item.name;$('#qbpBar').style.width=`${((pos+1)/sequence.length)*100}%`;$('#qbpQuestion').textContent=currentQuestion.prompt;const c=$('#qbpChoices');c.innerHTML='';currentQuestion.choices.forEach(ch=>{const b=document.createElement('button');b.type='button';b.className='qbp-choice';b.textContent=ch;b.onclick=()=>submit(ch);c.appendChild(b)});$('#qbpDont').disabled=false;$('#qbpFeedback').classList.remove('show');$('#qbpFeedback').innerHTML='';$('#qbpActions').classList.remove('show');window.scrollTo(0,0)}
function submit(value){if(answered)return;answered=true;const qn=currentQuestion,item=sequence[pos],dont=value==='__DONT__',ok=!dont&&value===qn.answer;$$('#qbpChoices .qbp-choice').forEach(b=>{b.disabled=true;if(b.textContent===qn.answer)b.classList.add('correct');else if(!dont&&b.textContent===value)b.classList.add('wrong')});$('#qbpDont').disabled=true;try{window.BOKI_MASTERY?.record?.(qn.record.module,qn.record.id,ok,0,dont,{topic:qn.record.topic,skill:qn.record.skill})}catch(e){}const st=aggregateFor(item),fb=$('#qbpFeedback');const next=sequence[pos+1];fb.innerHTML=`<div class="qbp-result ${ok?'ok':'ng'}">${ok?'○ 正解':dont?'？ わからない':'× 不正解'}</div><div class="qbp-explain"><b>正解：${esc(qn.answer)}</b><br>${esc(qn.explanation||'')}</div><div class="qbp-stat"><span>回答<b>${st.seen}回</b></span><span>正解<b>${st.correct}回</b></span><span>正答率<b>${st.seen?st.acc+'%':'—'}</b></span><span>習熟度<b>${esc(st.label)}</b></span></div>${next?`<div class="qbp-nextname">次の項目：<b>${esc(next.name)}</b></div>`:'<div class="qbp-nextname"><b>この学習リストの最後まで到達しました。</b></div>'}`;fb.classList.add('show');const a=$('#qbpActions');a.innerHTML=`<button class="qbp-repeat" type="button">この項目をもう1問</button><button class="qbp-next" type="button">${next?'次の項目へ →':'問題帳へ戻る'}</button>`;a.classList.add('show');$('.qbp-repeat',a).onclick=renderQuestion;$('.qbp-next',a).onclick=()=>{if(next){pos++;renderQuestion()}else finish()}}
function saveReturnState(){try{sessionStorage.setItem(RETURN_KEY,JSON.stringify({filter:$('.filter.on')?.dataset?.filter||'all',search:$('#search')?.value||''}))}catch(e){}}
function restoreReturnState(){let z=null;try{z=JSON.parse(sessionStorage.getItem(RETURN_KEY)||'null');sessionStorage.removeItem(RETURN_KEY)}catch(e){}if(!z)return;setTimeout(()=>{if(z.search){const s=$('#search');if(s){s.value=z.search;s.dispatchEvent(new Event('input',{bubbles:true}))}}if(z.filter&&z.filter!=='all'){const b=$(`.filter[data-filter="${z.filter}"]`);b?.click()}},450)}
function closePlayer(){saveReturnState();location.reload()}
function finish(){saveReturnState();location.reload()}
function hook(){ensureUI();const cat=$('#catalog');if(!cat)return setTimeout(hook,120);cat.addEventListener('click',e=>{const item=e.target.closest('.item');if(!item)return;e.preventDefault();e.stopPropagation();start(item)},true);const mo=new MutationObserver(()=>{$$('#catalog .status').forEach(a=>a.title='タップしてこの項目の問題を解く')});mo.observe(cat,{childList:true,subtree:true});restoreReturnState()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(hook,300),{once:true});else setTimeout(hook,300);
})();
