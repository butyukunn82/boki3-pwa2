(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'').toLowerCase();
if(page!=='q2-cbt.html'&&page!=='q3-cbt.html')return;
const wanted=new URLSearchParams(location.search).get('mode');if(!wanted)return;
function go(){
 const bar=document.getElementById('modebar');if(!bar)return false;
 const buttons=[...bar.querySelectorAll('button')];
 const names=page==='q2-cbt.html'?{closing:'商品売買・締切',dividend:'配当・法人税',asset:'固定資産台帳',accrual:'経過勘定'}:{statements:'B/S・P/L',worksheet:'精算表',adjusted:'整理後残高試算表'};
 const label=names[wanted];if(!label)return true;
 const b=buttons.find(x=>x.textContent.trim()===label||x.dataset.mode===wanted);
 if(b){b.click();setTimeout(()=>window.scrollTo({top:0,left:0,behavior:'auto'}),30);return true}
 return false;
}
let n=0;const t=setInterval(()=>{n++;if(go()||n>20)clearInterval(t)},60);
})();
