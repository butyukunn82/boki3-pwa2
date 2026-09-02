(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='mock.html')return;
function patch(n=0){if(typeof build!=='function'){if(n<30)return setTimeout(()=>patch(n+1),120);return}if(build.__wave2)return;const orig=build;const w=function(year){const a=orig(year),q1=a.filter(x=>x.sec==='q1'),q2=a.filter(x=>x.sec==='q2'),q3=a.filter(x=>x.sec==='q3');const replace=(target,obj)=>{if(!target)return;const i=a.indexOf(target);if(i>=0)a[i]={...obj,pts:target.pts,sec:target.sec}};
 if(year==='2026'){
  replace(q1[5],{title:'正しい仕訳を選びなさい',body:'現金100,000円を貸し付け、相手から金銭貸借の証書として約束手形を受け取った。',ans:'（借）手形貸付金 100,000 ／（貸）現金 100,000',opts:['（借）手形貸付金 100,000 ／（貸）現金 100,000','（借）受取手形 100,000 ／（貸）売上 100,000','（借）貸付金 100,000 ／（貸）売上 100,000','（借）現金 100,000 ／（貸）手形借入金 100,000']});
  replace(q3[1],{title:'2つの決算整理を判断しなさい',body:'決算整理前の当座預金は貸方25,000円（当座借越契約あり）。また通信費72,000円には期末未使用切手6,000円が含まれている。適切な処理は？',ans:'当座借越25,000円を負債へ振替し、未使用切手6,000円を貯蔵品へ振替',opts:['当座借越25,000円を負債へ振替し、未使用切手6,000円を貯蔵品へ振替','当座預金貸方残高も未使用切手もそのまま','当座借越を売上へ、切手を現金へ振替','当座借越を資産へ、切手を通信費へ追加']});
 }
 replace(q2[0],{title:'複数預金口座の記録を判断しなさい',body:'銀行別に普通預金勘定を分けている。A銀行普通預金からB銀行普通預金へ50,000円を振り替えた。',ans:'（借）普通預金B銀行 50,000 ／（貸）普通預金A銀行 50,000',opts:['（借）普通預金B銀行 50,000 ／（貸）普通預金A銀行 50,000','（借）普通預金A銀行 50,000 ／（貸）普通預金B銀行 50,000','（借）現金 50,000 ／（貸）売上 50,000','仕訳は不要']});
 replace(q2[1],{title:'固定資産台帳から帳簿価額を求めなさい',body:'備品Aの取得原価480,000円、期首減価償却累計額120,000円、当期減価償却費60,000円。期末帳簿価額は？',ans:'300,000円',opts:['300,000円','360,000円','420,000円','180,000円']});
 return a};w.__wave2=true;window.build=w}
patch();
})();