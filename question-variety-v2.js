(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const RECENT_KEY='boki3_recent_question_signatures_v2';
function normText(s){return String(s||'').replace(/[0-9０-９,，.．]+/g,'#').replace(/[A-ZＡ-Ｚ]社/g,'X社').replace(/\s+/g,'').slice(0,160)}
function sig(x){return normText(x?.body||x?.transaction||x?.q||x?.title||x?.id||'')}
function loadRecent(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch{return[]}}
function remember(x){const s=typeof x==='string'?x:sig(x);if(!s)return;const a=loadRecent().filter(v=>v!==s);a.unshift(s);localStorage.setItem(RECENT_KEY,JSON.stringify(a.slice(0,18)))}
function uniqueBySig(arr){const seen=new Set(),out=[];for(const x of arr||[]){const s=sig(x)||String(x?.id||Math.random());if(seen.has(s))continue;seen.add(s);out.push(x)}return out}
function diversify(arr){const recent=new Set(loadRecent().slice(0,6)),src=[...(arr||[])],unique=uniqueBySig(src),rest=src.filter(x=>!unique.includes(x));const pool=[...unique,...rest];pool.sort((a,b)=>(recent.has(sig(a))?1:0)-(recent.has(sig(b))?1:0));const out=[];while(pool.length){let pick=pool.findIndex(x=>{if(!out.length)return true;const p=out[out.length-1];const sameSig=sig(p)===sig(x);const sameTopic=(p.topic||p.category||p.skill||'')===(x.topic||x.category||x.skill||'');return !sameSig&&!sameTopic});if(pick<0)pick=pool.findIndex(x=>!out.length||sig(out[out.length-1])!==sig(x));if(pick<0)pick=0;out.push(pool.splice(pick,1)[0])}return out}

// 第1問：仕訳パターンを大幅拡張し、同型を連続させない
if(page==='q1.html' && typeof q4==='function'){
 const money=(min=20000,max=180000)=>Math.round((min+Math.random()*(max-min))/1000)*1000;
 const small=(min=2000,max=20000)=>Math.round((min+Math.random()*(max-min))/1000)*1000;
 const T=[
  a=>({k:'sale-credit',body:`商品 ${fmt(a)}円を掛けで販売した。`,d:[['売掛金',a]],c:[['売上',a]]}),
  a=>({k:'buy-credit',body:`商品 ${fmt(a)}円を掛けで仕入れた。`,d:[['仕入',a]],c:[['買掛金',a]]}),
  a=>({k:'sale-cash',body:`商品 ${fmt(a)}円を現金で販売した。`,d:[['現金',a]],c:[['売上',a]]}),
  a=>({k:'buy-cash',body:`商品 ${fmt(a)}円を現金で仕入れた。`,d:[['仕入',a]],c:[['現金',a]]}),
  a=>({k:'ar-bank',body:`売掛金 ${fmt(a)}円が普通預金口座へ振り込まれた。`,d:[['普通預金',a]],c:[['売掛金',a]]}),
  a=>({k:'ap-bank',body:`買掛金 ${fmt(a)}円を普通預金口座から支払った。`,d:[['買掛金',a]],c:[['普通預金',a]]}),
  a=>({k:'equipment-cash',body:`備品 ${fmt(a)}円を購入し、現金で支払った。`,d:[['備品',a]],c:[['現金',a]]}),
  a=>({k:'equipment-payable',body:`備品 ${fmt(a)}円を購入し、代金は翌月支払うこととした。`,d:[['備品',a]],c:[['未払金',a]]}),
  a=>({k:'borrow-bank',body:`銀行から ${fmt(a)}円を借り入れ、普通預金に入金された。`,d:[['普通預金',a]],c:[['借入金',a]]}),
  a=>({k:'repay-loan',body:`借入金 ${fmt(a)}円を普通預金から返済した。`,d:[['借入金',a]],c:[['普通預金',a]]}),
  a=>({k:'note-sale',body:`商品 ${fmt(a)}円を販売し、代金として約束手形を受け取った。`,d:[['受取手形',a]],c:[['売上',a]]}),
  a=>({k:'note-buy',body:`商品 ${fmt(a)}円を仕入れ、代金として約束手形を振り出した。`,d:[['仕入',a]],c:[['支払手形',a]]}),
  a=>({k:'note-ar',body:`売掛金 ${fmt(a)}円の回収として約束手形を受け取った。`,d:[['受取手形',a]],c:[['売掛金',a]]}),
  a=>({k:'note-ap',body:`買掛金 ${fmt(a)}円の支払いのため約束手形を振り出した。`,d:[['買掛金',a]],c:[['支払手形',a]]}),
  a=>({k:'note-maturity-in',body:`受取手形 ${fmt(a)}円が満期となり、当座預金に入金された。`,d:[['当座預金',a]],c:[['受取手形',a]]}),
  a=>({k:'note-maturity-out',body:`支払手形 ${fmt(a)}円が満期となり、当座預金から引き落とされた。`,d:[['支払手形',a]],c:[['当座預金',a]]}),
  a=>({k:'own-check',body:`買掛金 ${fmt(a)}円を支払うため、小切手を振り出した。`,d:[['買掛金',a]],c:[['当座預金',a]]}),
  a=>({k:'other-check',body:`売掛金 ${fmt(a)}円の回収として、他店振出の小切手を受け取った。`,d:[['現金',a]],c:[['売掛金',a]]}),
  a=>({k:'e-receivable',body:`売掛金 ${fmt(a)}円について電子記録債権の発生記録が行われた。`,d:[['電子記録債権',a]],c:[['売掛金',a]]}),
  a=>({k:'e-payable',body:`買掛金 ${fmt(a)}円について電子記録債務の発生記録が行われた。`,d:[['買掛金',a]],c:[['電子記録債務',a]]}),
  a=>({k:'advance-paid',body:`商品の注文に際し、手付金として ${fmt(a)}円を現金で支払った。`,d:[['前払金',a]],c:[['現金',a]]}),
  a=>({k:'advance-received',body:`商品の注文を受け、手付金として ${fmt(a)}円を現金で受け取った。`,d:[['現金',a]],c:[['前受金',a]]}),
  a=>({k:'employee-advance',body:`従業員の出張に先立ち、旅費の概算額 ${fmt(a)}円を現金で渡した。`,d:[['仮払金',a]],c:[['現金',a]]}),
  a=>({k:'unknown-deposit',body:`普通預金に ${fmt(a)}円の入金があったが、内容は不明である。`,d:[['普通預金',a]],c:[['仮受金',a]]}),
  a=>({k:'unknown-resolved',body:`先日内容不明で仮受金としていた ${fmt(a)}円は、売掛金の回収と判明した。`,d:[['仮受金',a]],c:[['売掛金',a]]}),
  a=>({k:'tax',body:`固定資産税 ${fmt(a)}円を現金で支払った。`,d:[['租税公課',a]],c:[['現金',a]]}),
  a=>({k:'communication',body:`電話料金 ${fmt(a)}円を普通預金から支払った。`,d:[['通信費',a]],c:[['普通預金',a]]}),
  a=>({k:'utility-unpaid',body:`当月の水道光熱費 ${fmt(a)}円が未払いである。`,d:[['水道光熱費',a]],c:[['未払金',a]]}),
  a=>({k:'capital',body:`会社設立にあたり、株主から現金 ${fmt(a)}円の出資を受けた。`,d:[['現金',a]],c:[['資本金',a]]}),
  a=>({k:'cash-short',body:`現金の実際有高が帳簿残高より ${fmt(a)}円少ないことが判明した。原因は不明である。`,d:[['現金過不足',a]],c:[['現金',a]]}),
  a=>({k:'cash-over',body:`現金の実際有高が帳簿残高より ${fmt(a)}円多いことが判明した。原因は不明である。`,d:[['現金',a]],c:[['現金過不足',a]]}),
  a=>({k:'cash-short-resolve',body:`現金不足として現金過不足に計上していた ${fmt(a)}円は、通信費の記帳漏れと判明した。`,d:[['通信費',a]],c:[['現金過不足',a]]}),
  a=>({k:'cash-over-resolve',body:`現金超過として現金過不足に計上していた ${fmt(a)}円は、雑収入の記帳漏れと判明した。`,d:[['現金過不足',a]],c:[['雑益',a]]}),
  a=>{const t=Math.round(a*.1);return{k:'tax-purchase',body:`商品 ${fmt(a)}円（税抜）を掛けで仕入れた。消費税率10%、税抜方式。`,d:[['仕入',a],['仮払消費税',t]],c:[['買掛金',a+t]]}},
  a=>{const t=Math.round(a*.1);return{k:'tax-sale',body:`商品 ${fmt(a)}円（税抜）を掛けで販売した。消費税率10%、税抜方式。`,d:[['売掛金',a+t]],c:[['売上',a],['仮受消費税',t]]}},
  a=>{const fee=small(1000,5000);return{k:'bank-fee',body:`買掛金 ${fmt(a)}円を普通預金から振り込み、振込手数料 ${fmt(fee)}円も当社が負担した。`,d:[['買掛金',a],['支払手数料',fee]],c:[['普通預金',a+fee]]}},
  a=>{const freight=small(2000,10000);return{k:'purchase-freight',body:`商品 ${fmt(a)}円を現金で仕入れ、引取運賃 ${fmt(freight)}円も現金で支払った。`,d:[['仕入',a+freight]],c:[['現金',a+freight]]}},
  a=>({k:'advertising',body:`広告宣伝費 ${fmt(a)}円を普通預金から支払った。`,d:[['広告宣伝費',a]],c:[['普通預金',a]]}),
  a=>({k:'rent',body:`当月分の店舗家賃 ${fmt(a)}円を現金で支払った。`,d:[['支払家賃',a]],c:[['現金',a]]}),
  a=>({k:'supplies',body:`事務用品 ${fmt(a)}円を購入し、現金で支払った。購入時に費用処理する。`,d:[['消耗品費',a]],c:[['現金',a]]}),
  a=>{const i=small();return{k:'loan-interest',body:`借入金 ${fmt(a)}円と利息 ${fmt(i)}円を普通預金から支払った。`,d:[['借入金',a],['支払利息',i]],c:[['普通預金',a+i]]}},
  a=>{const tax=10000,soc=40000,gross=Math.max(a,180000),net=gross-tax-soc;return{k:'payroll',body:`給料総額 ${fmt(gross)}円から所得税 ${fmt(tax)}円、社会保険料 ${fmt(soc)}円を控除し、差額を普通預金から支払った。`,d:[['給料',gross]],c:[['所得税預り金',tax],['社会保険料預り金',soc],['普通預金',net]]}},
  a=>({k:'legal-welfare',body:`会社負担分の社会保険料 ${fmt(a)}円を計上し、未払いとした。`,d:[['法定福利費',a]],c:[['未払金',a]]}),
  a=>({k:'accrued-interest',body:`当期分の未払利息 ${fmt(a)}円を決算整理で計上する。`,d:[['支払利息',a]],c:[['未払利息',a]]}),
  a=>({k:'prepaid-insurance',body:`保険料のうち翌期分 ${fmt(a)}円を前払として決算整理する。`,d:[['前払保険料',a]],c:[['保険料',a]]}),
  a=>({k:'depreciation',body:`備品の当期減価償却費 ${fmt(a)}円を間接法で計上する。`,d:[['減価償却費',a]],c:[['備品減価償却累計額',a]]}),
  a=>({k:'allowance',body:`貸倒引当金の不足額 ${fmt(a)}円を差額補充法で計上する。`,d:[['貸倒引当金繰入',a]],c:[['貸倒引当金',a]]})
 ];
 let bag=[],recentK=[];
 function refill(){bag=shuffle(T.map((_,i)=>i));if(recentK.length&&bag.length>1){const last=recentK[0],p=bag.findIndex(i=>T[i]._k!==last);if(p>0)[bag[0],bag[p]]=[bag[p],bag[0]]}}
 function makeQ(){if(!bag.length)refill();let tries=0,z;do{if(!bag.length)refill();const i=bag.shift(),a=money();z=T[i](a);tries++}while(recentK.includes(z.k)&&tries<10);recentK.unshift(z.k);recentK=recentK.slice(0,5);return z}
 q4=function(){return makeQ()};
 if(typeof startJournal4==='function')startJournal4=function(){const list=Array.from({length:25},(_,i)=>{const z=makeQ();z.id='J4X:'+z.k+':'+i+':'+z.body;return z});session={mode:'j4',list,index:0,correct:0,answered:false,responses:{}};nav('quiz');renderJ4()};
 if(typeof startDropdown==='function')startDropdown=function(){const list=Array.from({length:20},(_,i)=>{const z=makeQ();z.id='JDX:'+z.k+':'+i+':'+z.body;return z});session={mode:'drop',list,index:0,correct:0,answered:false,responses:{}};nav('quiz');renderDrop()};
 const wrapRender=(name)=>{try{const old=eval(name);if(typeof old!=='function')return;window[name]=function(){const r=old.apply(this,arguments);try{remember(session?.list?.[session?.index])}catch(e){}return r}}catch(e){}};
}

// 第2問・第3問：セッション内で同型・同分野を続けない。直近問題は後ろへ回す。
if((page==='q2.html'||page==='q3.html') && typeof startMode==='function'){
 const oldStart=startMode;
 startMode=function(mode,customList=null){oldStart(mode,customList);try{if(session?.list?.length>1){const d=diversify(session.list);session.list.splice(0,session.list.length,...d);session.index=0;renderQuestion()}}catch(e){}};
 if(typeof nextQuestion==='function'){const oldNext=nextQuestion;nextQuestion=function(){try{remember(session?.list?.[session?.index])}catch(e){}return oldNext()}};
}

// 今日の10問：候補重複を除き、同じ論点が続かないよう再配置。小問も追加。
if(page==='daily.html'){
 try{
  if(typeof Q2BANK!=='undefined'&&typeof mk==='function')Q2BANK.push(
   mk('q2','補助簿','売掛金を現金で回収したとき、得意先別の内訳を更新する帳簿は？','売掛金元帳',['売掛金元帳','買掛金元帳','固定資産台帳','仕入帳'],'売掛金元帳は得意先別の売掛金残高を管理します。'),
   mk('q2','補助簿','商品を掛けで仕入れたとき、仕入先別の債務を管理する帳簿は？','買掛金元帳',['買掛金元帳','売掛金元帳','売上帳','現金出納帳'],'買掛金元帳は仕入先別の買掛金残高を管理します。'),
   mk('q2','帳簿','仕訳帳から総勘定元帳へ記入することを何という？','転記',['転記','繰越','締切','決算整理'],'仕訳を勘定科目別の元帳へ移す処理が転記です。'),
   mk('q2','試算表','残高試算表の目的として最も適切なのは？','各勘定の残高を一覧にする',['各勘定の残高を一覧にする','すべての取引を日付順に並べる','得意先別残高だけを示す','固定資産だけを集計する'],'元帳の残高を集めて貸借を確認します。'),
   mk('q2','商品有高帳','商品有高帳で管理する中心情報は？','商品の受入・払出・残高',['商品の受入・払出・残高','売掛金の得意先別残高','固定資産の減価償却','従業員別給料'],'商品有高帳は数量・単価・金額の在庫管理に使います。'),
   mk('q2','手形記入帳','約束手形を受け取った場合に記入する帳簿は？','受取手形記入帳',['受取手形記入帳','支払手形記入帳','買掛金元帳','現金出納帳'],'受け取った手形の振出人・満期日等を管理します。')
  );
  if(typeof Q3BANK!=='undefined'&&typeof mk==='function')Q3BANK.push(
   mk('q3','経過勘定','当期に発生しているがまだ支払っていない費用は？','未払費用',['未払費用','前払費用','未収収益','前受収益'],'使ったがまだ払っていないので未払費用です。'),
   mk('q3','経過勘定','すでに支払った費用のうち翌期分は？','前払費用',['前払費用','未払費用','前受収益','未収収益'],'翌期にサービスを受ける権利なので資産です。'),
   mk('q3','経過勘定','当期に稼いだがまだ受け取っていない収益は？','未収収益',['未収収益','前受収益','前払費用','未払費用'],'当期発生分を見越して資産計上します。'),
   mk('q3','経過勘定','すでに受け取った収益のうち翌期分は？','前受収益',['前受収益','未収収益','未払費用','前払費用'],'まだ稼いでいないため負債として繰り延べます。'),
   mk('q3','減価償却','減価償却費と減価償却累計額の関係として正しいものは？','費用は当期分、累計額はこれまでの合計',['費用は当期分、累計額はこれまでの合計','両方とも当期分だけ','両方とも負債','累計額は収益'],'費用と累計額の時間範囲を区別します。'),
   mk('q3','固定資産','固定資産売却損益を判定するとき比較するのは？','売却額と売却時帳簿価額',['売却額と売却時帳簿価額','売却額と取得原価','取得原価と減価償却費','売却額と減価償却累計額'],'取得原価ではなく売却時の帳簿価額と比較します。'),
   mk('q3','売上原価','売上原価の基本式は？','期首商品＋当期仕入－期末商品',['期首商品＋当期仕入－期末商品','期首商品－当期仕入＋期末商品','当期仕入＋期末商品','売上－期末商品'],'売れた原価だけを当期費用にします。'),
   mk('q3','精算表','決算整理後、収益・費用が行く先は？','P/L',['P/L','B/S','補助元帳','仕訳帳'],'収益・費用は損益計算書へ集まります。')
  );
 }catch(e){}
 try{
  if(typeof q1Questions==='function'){const o=q1Questions;q1Questions=function(n){let a=[];for(let i=0;i<5&&uniqueBySig(a).length<n;i++)a.push(...o(Math.max(n,6)));return uniqueBySig(a).slice(0,n)}}
  if(typeof q2Questions==='function'){const o=q2Questions;q2Questions=function(n){let a=[];for(let i=0;i<6&&uniqueBySig(a).length<n;i++)a.push(...o(Math.max(n,6)));return uniqueBySig(a).slice(0,n)}}
  if(typeof q3Questions==='function'){const o=q3Questions;q3Questions=function(n){let a=[];for(let i=0;i<6&&uniqueBySig(a).length<n;i++)a.push(...o(Math.max(n,6)));return uniqueBySig(a).slice(0,n)}}
  if(typeof build==='function'&&Array.isArray(list)){const d=diversify(build());list.splice(0,list.length,...d)}
  if(typeof render==='function'){const old=render;render=function(){try{remember(list?.[idx])}catch(e){}return old()}}
 }catch(e){}
}
})();