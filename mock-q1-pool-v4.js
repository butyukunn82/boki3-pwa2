(function(){
'use strict';
if(typeof buildQ1!=='function'||typeof jr!=='function'||typeof shuffle!=='function')return;
const addAccounts=['修繕費','固定資産売却益','固定資産売却損','仮払法人税等','当座借越','小口現金','通信費','貯蔵品'];
if(typeof ACCOUNTS!=='undefined'&&Array.isArray(ACCOUNTS)) addAccounts.forEach(a=>{if(!ACCOUNTS.includes(a))ACCOUNTS.push(a)});
const rnd=(a,b,step=1000)=>Math.floor((a+Math.floor(Math.random()*((b-a)/step+1))*step)/step)*step;
const q=(cat,text,debits,credits)=>Object.assign(jr(text,debits,credits),{cat});
const G={
trade:[
 ()=>{const n=rnd(60000,180000,5000);return q('trade',`商品${n.toLocaleString()}円を掛けで販売した。`,[['売掛金',n]],[['売上',n]])},
 ()=>{const n=rnd(50000,160000,5000);return q('trade',`商品${n.toLocaleString()}円を現金で販売した。`,[['現金',n]],[['売上',n]])},
 ()=>{const n=rnd(60000,180000,5000);return q('trade',`商品${n.toLocaleString()}円を掛けで仕入れた。`,[['仕入',n]],[['買掛金',n]])},
 ()=>{const n=rnd(40000,140000,5000);return q('trade',`商品${n.toLocaleString()}円を現金で仕入れた。`,[['仕入',n]],[['現金',n]])},
 ()=>{const n=rnd(10000,50000,1000);return q('trade',`掛けで販売した商品のうち${n.toLocaleString()}円が返品された。`,[['売上',n]],[['売掛金',n]])},
 ()=>{const n=rnd(10000,50000,1000);return q('trade',`掛けで仕入れた商品のうち${n.toLocaleString()}円を返品した。`,[['買掛金',n]],[['仕入',n]])},
 ()=>{const n=rnd(70000,180000,5000),f=rnd(2000,6000,1000);return q('trade',`商品${n.toLocaleString()}円を掛けで販売し、当社負担の発送費${f.toLocaleString()}円を現金で支払った。`,[['売掛金',n],['支払手数料',f]],[['売上',n],['現金',f]])},
 ()=>{const base=rnd(60000,150000,5000),tax=base*.1;return q('trade',`商品${base.toLocaleString()}円（税抜）を掛けで販売した。消費税10%、税抜方式。`,[['売掛金',base+tax]],[['売上',base],['仮受消費税',tax]])},
 ()=>{const base=rnd(50000,140000,5000),tax=base*.1;return q('trade',`商品${base.toLocaleString()}円（税抜）を掛けで仕入れた。消費税10%、税抜方式。`,[['仕入',base],['仮払消費税',tax]],[['買掛金',base+tax]])}
],
settlement:[
 ()=>{const n=rnd(50000,150000,5000);return q('settlement',`売掛金${n.toLocaleString()}円が普通預金口座へ振り込まれた。`,[['普通預金',n]],[['売掛金',n]])},
 ()=>{const n=rnd(50000,150000,5000);return q('settlement',`買掛金${n.toLocaleString()}円を普通預金から支払った。`,[['買掛金',n]],[['普通預金',n]])},
 ()=>{const n=rnd(30000,90000,5000);return q('settlement',`得意先から商品注文を受け、手付金${n.toLocaleString()}円が普通預金に入金された。`,[['普通預金',n]],[['前受金',n]])},
 ()=>{const n=rnd(30000,90000,5000);return q('settlement',`商品注文にあたり、仕入先へ手付金${n.toLocaleString()}円を普通預金から支払った。`,[['前払金',n]],[['普通預金',n]])},
 ()=>{const n=rnd(10000,50000,1000);return q('settlement',`普通預金に${n.toLocaleString()}円の入金があったが、内容が不明である。`,[['普通預金',n]],[['仮受金',n]])},
 ()=>{const n=rnd(10000,50000,1000);return q('settlement',`取引先への支払額${n.toLocaleString()}円について内容が確定していないため、現金で概算払いした。`,[['仮払金',n]],[['現金',n]])},
 ()=>{const n=rnd(10000,50000,1000);return q('settlement',`従業員が立て替えていた会社負担の通信費${n.toLocaleString()}円を現金で精算した。`,[['通信費',n]],[['現金',n]])}
],
asset:[
 ()=>{const n=rnd(120000,480000,10000);return q('asset',`備品${n.toLocaleString()}円を購入し、代金は翌月支払うこととした。`,[['備品',n]],[['未払金',n]])},
 ()=>{const n=rnd(900000,2400000,100000);return q('asset',`建物${n.toLocaleString()}円を購入し、代金を普通預金から支払った。`,[['建物',n]],[['普通預金',n]])},
 ()=>{const n=rnd(50000,180000,5000);return q('asset',`備品の通常の修理代${n.toLocaleString()}円を現金で支払った。修理は現状維持のためのものである。`,[['修繕費',n]],[['現金',n]])},
 ()=>{const n=rnd(50000,180000,5000);return q('asset',`備品の機能を向上させる改良費${n.toLocaleString()}円を現金で支払った。`,[['備品',n]],[['現金',n]])},
 ()=>{const n=rnd(30000,90000,5000);return q('asset',`備品の当期減価償却費${n.toLocaleString()}円を間接法で計上する。`,[['減価償却費',n]],[['備品減価償却累計額',n]])},
 ()=>{const cost=rnd(300000,600000,50000),acc=rnd(120000,240000,30000),book=cost-acc,cash=book+rnd(20000,60000,10000),gain=cash-book;return q('asset',`取得原価${cost.toLocaleString()}円、減価償却累計額${acc.toLocaleString()}円の備品を${cash.toLocaleString()}円で現金売却した。`,[['現金',cash],['備品減価償却累計額',acc]],[['備品',cost],['固定資産売却益',gain]])},
 ()=>{const cost=rnd(300000,600000,50000),acc=rnd(120000,240000,30000),book=cost-acc,cash=book-rnd(20000,60000,10000),loss=book-cash;return q('asset',`取得原価${cost.toLocaleString()}円、減価償却累計額${acc.toLocaleString()}円の備品を${cash.toLocaleString()}円で現金売却した。`,[['現金',cash],['備品減価償却累計額',acc],['固定資産売却損',loss]],[['備品',cost]])}
],
payrollTax:[
 ()=>{const gross=rnd(220000,360000,10000),it=rnd(8000,18000,1000),si=rnd(28000,48000,1000),net=gross-it-si;return q('payrollTax',`給料総額${gross.toLocaleString()}円から所得税${it.toLocaleString()}円、社会保険料${si.toLocaleString()}円を控除し、差額を普通預金から支払った。`,[['給料',gross]],[['所得税預り金',it],['社会保険料預り金',si],['普通預金',net]])},
 ()=>{const n=rnd(30000,60000,1000);return q('payrollTax',`会社負担分の社会保険料${n.toLocaleString()}円を計上し、未払いとした。`,[['法定福利費',n]],[['未払金',n]])},
 ()=>{const p=rnd(40000,100000,5000);return q('payrollTax',`法人税等${(p*2).toLocaleString()}円を確定し、中間納付額${p.toLocaleString()}円を差し引いた残額を未払いとして計上した。`,[['法人税等',p*2]],[['仮払法人税等',p],['未払法人税等',p]])},
 ()=>{const inTax=rnd(50000,90000,5000),outTax=inTax+rnd(20000,60000,5000),due=outTax-inTax;return q('payrollTax',`決算にあたり、仮受消費税${outTax.toLocaleString()}円と仮払消費税${inTax.toLocaleString()}円を相殺し、差額を未払消費税とした。`,[['仮受消費税',outTax]],[['仮払消費税',inTax],['未払消費税',due]])},
 ()=>{const n=rnd(12000,30000,1000);return q('payrollTax',`従業員から預かっていた所得税${n.toLocaleString()}円を現金で納付した。`,[['所得税預り金',n]],[['現金',n]])},
 ()=>{const n=rnd(40000,90000,5000);return q('payrollTax',`法人税等の中間納付額${n.toLocaleString()}円を普通預金から支払った。`,[['仮払法人税等',n]],[['普通預金',n]])}
],
adjusting:[
 ()=>{const n=rnd(12000,36000,1000);return q('adjusting',`保険料のうち翌期分${n.toLocaleString()}円を決算整理で前払へ振り替える。`,[['前払保険料',n]],[['保険料',n]])},
 ()=>{const n=rnd(4000,12000,1000);return q('adjusting',`当期分の未払利息${n.toLocaleString()}円を決算整理で計上する。`,[['支払利息',n]],[['未払利息',n]])},
 ()=>{const n=rnd(3000,9000,1000);return q('adjusting',`貸倒引当金の不足額${n.toLocaleString()}円を差額補充法で計上する。`,[['貸倒引当金繰入',n]],[['貸倒引当金',n]])},
 ()=>{const n=rnd(10000,30000,1000);return q('adjusting',`前期に貸倒処理した売掛金${n.toLocaleString()}円を当期に現金で回収した。`,[['現金',n]],[['償却債権取立益',n]])},
 ()=>{const n=rnd(10000,30000,1000);return q('adjusting',`決算日に未使用の郵便切手${n.toLocaleString()}円分を貯蔵品へ振り替えた。`,[['貯蔵品',n]],[['通信費',n]])},
 ()=>{const oi=rnd(200000,360000,20000),ci=rnd(180000,340000,20000);return q('adjusting',`決算整理で、期首商品${oi.toLocaleString()}円を仕入勘定へ振り替え、期末商品${ci.toLocaleString()}円を繰越商品として計上する。`,[['仕入',oi],['繰越商品',ci]],[['繰越商品',oi],['仕入',ci]])},
 ()=>{const n=rnd(30000,90000,5000);return q('adjusting',`翌期分として受け取っていた家賃${n.toLocaleString()}円を決算整理で前受分として振り替える。`,[['売上',n]],[['前受金',n]])}
],
equity:[
 ()=>{const d=rnd(80000,180000,10000),r=Math.round(d*.1);return q('equity',`株主総会で配当金${d.toLocaleString()}円と利益準備金${r.toLocaleString()}円の積立てを決議した。`,[['繰越利益剰余金',d+r]],[['未払配当金',d],['利益準備金',r]])},
 ()=>{const n=rnd(70000,180000,10000);return q('equity',`未払配当金${n.toLocaleString()}円を普通預金から支払った。`,[['未払配当金',n]],[['普通預金',n]])},
 ()=>{const n=rnd(250000,700000,50000);return q('equity',`決算で当期純利益${n.toLocaleString()}円を損益勘定から繰越利益剰余金へ振り替えた。`,[['損益',n]],[['繰越利益剰余金',n]])},
 ()=>{const n=rnd(20000,60000,5000);return q('equity',`得意先に対する売掛金${n.toLocaleString()}円が当期に貸倒れとなり、貸倒引当金残高はない。`,[['貸倒損失',n]],[['売掛金',n]])},
 ()=>{const n=rnd(20000,60000,5000);return q('equity',`商品以外の備品を売却し、代金${n.toLocaleString()}円を後日受け取ることになった。売却損益はないものとする。`,[['未収入金',n]],[['備品',n]])}
]};
if(typeof ACCOUNTS!=='undefined'&&!ACCOUNTS.includes('貸倒損失'))ACCOUNTS.push('貸倒損失');
const quota={trade:4,settlement:2,asset:2,payrollTax:2,adjusting:3,equity:2};
buildQ1=function(){
 const out=[];
 Object.keys(quota).forEach(cat=>{const gens=shuffle(G[cat]).slice(0,quota[cat]);gens.forEach(fn=>out.push(fn()))});
 const mixed=shuffle(out);
 const note=document.getElementById('q1PoolNote');if(note)note.textContent=`第1問は${Object.values(G).reduce((n,a)=>n+a.length,0)}種類の問題プールから、主要6カテゴリをバランス抽選しています。`;
 return mixed;
};
const intro=document.getElementById('start');
if(intro&&!document.getElementById('q1PoolNote'))intro.insertAdjacentHTML('beforebegin','<div id="q1PoolNote" class="note" style="margin-top:8px">第1問は問題プールから15問をバランス抽選します。</div>');
})();