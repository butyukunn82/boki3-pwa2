(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='mock.html')return;
function patch(){if(typeof build!=='function'||build.__practical)return setTimeout(patch,120);const orig=build;const w=function(year){const a=orig(year);if(year!=='2026')return a;const q2=a.filter(x=>x.sec==='q2'),q3=a.filter(x=>x.sec==='q3');function replace(target,obj){if(!target)return;const i=a.indexOf(target);if(i>=0)a[i]={...obj,sec:target.sec,pts:target.pts}}
 replace(q2[q2.length-1],{title:'第2問：複数取引と補助簿',body:'次の取引をまとめて処理する。\n① 商品100,000円をA社へ掛けで販売した。\n② 後日、A社から30,000円が普通預金へ振り込まれた。\n期首のA社売掛金残高は0円。\n\nこの2取引後のA社に対する売掛金残高はいくらか。',ans:'70,000円',opts:['70,000円','130,000円','30,000円','100,000円']});
 replace(q3[q3.length-1],{title:'第3問：複数の決算整理',body:'決算整理事項は次のとおり。\n・通信費に含まれる未使用切手6,000円を貯蔵品へ振り替える。\n・保険料に含まれる翌期分20,000円を前払へ振り替える。\n・当期未計上の支払利息4,000円を見越す。\n\nこれら3項目による当期費用の純減額はいくらか。',ans:'22,000円',opts:['22,000円','30,000円','18,000円','26,000円']});return a};w.__practical=true;window.build=w}
patch();
})();