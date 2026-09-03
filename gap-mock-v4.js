(function(){
'use strict';if((location.pathname.split('/').pop()||'').toLowerCase()!=='mock.html')return;
function patch(){if(typeof build!=='function'||build.__gap4)return setTimeout(patch,120);const orig=build;const w=function(year){const a=orig(year);if(year!=='2026')return a;const q1=a.filter(x=>x.sec==='q1'),q2=a.filter(x=>x.sec==='q2');function replace(target,obj){if(!target)return;const i=a.indexOf(target);if(i>=0)a[i]={...obj,sec:target.sec,pts:target.pts}}
 replace(q1[4],{title:'正しい仕訳を選びなさい',body:'前期に貸倒れとして処理済みの売掛金40,000円を、当期に普通預金で回収した。',ans:'（借）普通預金 40,000 ／（貸）償却債権取立益 40,000',opts:['（借）普通預金 40,000 ／（貸）償却債権取立益 40,000','（借）普通預金 40,000 ／（貸）売掛金 40,000','（借）貸倒引当金 40,000 ／（貸）売掛金 40,000','（借）普通預金 40,000 ／（貸）貸倒引当金 40,000']});
 replace(q1[10],{title:'正しい仕訳を選びなさい',body:'店舗改修940,000円を普通預金から支払った。このうち270,000円は価値を高める改良で、残りは通常の修繕である。',ans:'（借）建物 270,000、修繕費 670,000 ／（貸）普通預金 940,000',opts:['（借）建物 270,000、修繕費 670,000 ／（貸）普通預金 940,000','（借）修繕費 940,000 ／（貸）普通預金 940,000','（借）建物 940,000 ／（貸）普通預金 940,000','（借）備品 270,000、消耗品費 670,000 ／（貸）普通預金 940,000']});
 replace(q2[0],{title:'第2問：剰余金の配当',body:'株主総会で、繰越利益剰余金を財源に配当350,000円と利益準備金35,000円の積立てを決議した。決議により繰越利益剰余金はいくら減少するか。',ans:'385,000円',opts:['385,000円','350,000円','35,000円','315,000円']});
 replace(q2[1],{title:'第2問：法人税等の決算処理',body:'税引前利益1,000,000円に30%の法人税等を計上する。中間納付120,000円は仮払法人税等で処理済みである。未払法人税等はいくらか。',ans:'180,000円',opts:['180,000円','300,000円','120,000円','420,000円']});return a};w.__gap4=true;window.build=w}
patch();
})();