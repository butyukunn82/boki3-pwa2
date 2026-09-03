(function(){
'use strict';
if(typeof makeQ2!=='function'||typeof mockSet==='undefined')return;
const previousMakeQ2=makeQ2;
function s(k,o){return `<select data-q2a="${k}"><option value="">選択</option>${o.map(x=>`<option>${x}</option>`).join('')}</select>`}
function i(k){return `<input data-q2a="${k}" inputmode="numeric">`}
function originalInterest(){
 const oldPrincipal=3600000,open=36000,maturity=72000,currentOld=36000,newPrincipal=4800000,accrued=48000,revenue=currentOld+accrued;
 const o=['普通預金','未収利息','受取利息','損益','前期繰越','次期繰越'];
 const ans={io:'未収利息',ion:open,ib:'普通預金',ibn:maturity,ia:'未収利息',ian:accrued,ic:'損益',icn:revenue,ao:'前期繰越',aon:open,ar:'受取利息',arn:open,an:'受取利息',ann:accrued,ac:'次期繰越',acn:accrued,t1:'未収利息',t2:'受取利息'};
 const html=`<div class="card"><b>利息・未収利息</b><p class="note">会計期間は4/1～3/31。前期10/1に${Y(oldPrincipal)}円を年2%・1年・利息満期受取で貸付け、当期9/30に回収。当期12/1には${Y(newPrincipal)}円を年3%・1年・利息満期受取で貸付けています。月割計算・期首再振替を行います。</p><div class="wrap"><table class="tbl"><tr><th>勘定</th><th>側</th><th>摘要</th><th>金額</th></tr>${[['受取利息','借','io','ion'],['受取利息','貸','ib','ibn'],['受取利息','貸','ia','ian'],['受取利息','借','ic','icn'],['未収利息','借','ao','aon'],['未収利息','貸','ar','arn'],['未収利息','借','an','ann'],['未収利息','貸','ac','acn']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${s(r[2],o)}</td><td>${i(r[3])}</td></tr>`).join('')}</table></div></div><div class="theory-grid"><div class="theory"><b>決算日に、まだ受け取っていない当期分の貸付利息を資産計上する科目は？</b>${s('t1',['未収利息','未払利息','受取利息','前受収益'])}</div><div class="theory"><b>貸付によって発生する利息収益の勘定科目は？</b>${s('t2',['受取利息','支払利息','未収利息','雑損'])}</div></div>`;
 return{mode:'interest',label:'利息・経過勘定',ans,html};
}
makeQ2=function(){const z=previousMakeQ2();return z&&z.mode==='interest'?originalInterest():z};
})();
