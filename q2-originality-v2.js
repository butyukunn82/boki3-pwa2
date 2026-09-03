(function(){
'use strict';
try{
if(typeof builders==='undefined'||!builders||typeof inputHtml!=='function'||typeof selectHtml!=='function'||typeof theoryHtml!=='function')return;
builders.interest=function(){
 const oldPrincipal=3600000,oldRate=.02,open=Math.round(oldPrincipal*oldRate*6/12),maturity=Math.round(oldPrincipal*oldRate),currentOld=maturity-open;
 const newPrincipal=4800000,newRate=.03,accrued=Math.round(newPrincipal*newRate*4/12),revenue=currentOld+accrued;
 state={mode:'interest',ans:{intOpen:'未収利息',intOpenN:open,intBank:'普通預金',intBankN:maturity,intAcc:'未収利息',intAccN:accrued,intClose:'損益',intCloseN:revenue,arOpen:'前期繰越',arOpenN:open,arReverse:'受取利息',arReverseN:open,arNew:'受取利息',arNewN:accrued,arCarry:'次期繰越',arCarryN:accrued},explain:`前期末に未収計上した利息 ${Y(open)}円は期首に再振替します。旧貸付の当期分は ${Y(currentOld)}円、新貸付の当期4か月分は ${Y(accrued)}円なので、当期の受取利息は合計 ${Y(revenue)}円です。`};
 const opts=['普通預金','未収利息','受取利息','損益','前期繰越','次期繰越'];
 return `<div class="section">第2問（1）利息・未収利息</div><section class="card"><p>会計期間は4月1日～3月31日です。前期10月1日に <b>${Y(oldPrincipal)}円</b> を年${oldRate*100}%・1年・利息満期受取で貸し付け、当期9月30日に元利を回収しました。さらに当期12月1日に <b>${Y(newPrincipal)}円</b> を年${newRate*100}%・1年・利息満期受取で貸し付けています。利息は月割計算し、期首に再振替を行います。</p><div class="wrap"><table class="tbl"><tr><th>勘定</th><th>側</th><th>日付</th><th>摘要</th><th>金額</th></tr><tr><td>受取利息</td><td>借方</td><td>4/1</td><td>${selectHtml('intOpen',opts)}</td><td>${inputHtml('intOpenN')}</td></tr><tr><td>受取利息</td><td>貸方</td><td>9/30</td><td>${selectHtml('intBank',opts)}</td><td>${inputHtml('intBankN')}</td></tr><tr><td>受取利息</td><td>貸方</td><td>3/31</td><td>${selectHtml('intAcc',opts)}</td><td>${inputHtml('intAccN')}</td></tr><tr><td>受取利息</td><td>借方</td><td>3/31</td><td>${selectHtml('intClose',opts)}</td><td>${inputHtml('intCloseN')}</td></tr><tr><td>未収利息</td><td>借方</td><td>4/1</td><td>${selectHtml('arOpen',opts)}</td><td>${inputHtml('arOpenN')}</td></tr><tr><td>未収利息</td><td>貸方</td><td>4/1</td><td>${selectHtml('arReverse',opts)}</td><td>${inputHtml('arReverseN')}</td></tr><tr><td>未収利息</td><td>借方</td><td>3/31</td><td>${selectHtml('arNew',opts)}</td><td>${inputHtml('arNewN')}</td></tr><tr><td>未収利息</td><td>貸方</td><td>3/31</td><td>${selectHtml('arCarry',opts)}</td><td>${inputHtml('arCarryN')}</td></tr></table></div><div class="note" style="margin-top:8px">貸付金の利息収益と未収利息を題材にした、このアプリ独自の問題です。期首再振替→当期回収→期末未収計上→損益振替の流れを練習します。</div></section>`+theoryHtml();
};
}catch(e){console.warn('q2 originality upgrade skipped',e)}
})();
