(function(){
'use strict';
if(typeof buildQ1!=='function')return;
if(typeof ACCOUNTS!=='undefined'&&Array.isArray(ACCOUNTS))['発送費','受取家賃','前受家賃'].forEach(a=>{if(!ACCOUNTS.includes(a))ACCOUNTS.push(a)});
const previousBuildQ1=buildQ1;
buildQ1=function(){
  const list=previousBuildQ1();
  return list.map(z=>{
    if(z&&typeof z.text==='string'&&z.text.includes('当社負担の発送費')){
      return {...z,debits:(z.debits||[]).map(([a,n])=>[a==='支払手数料'?'発送費':a,n])};
    }
    if(z&&typeof z.text==='string'&&z.text.includes('翌期分として受け取っていた家賃')){
      const n=(z.debits&&z.debits[0]&&Number(z.debits[0][1]))||(z.credits&&z.credits[0]&&Number(z.credits[0][1]))||0;
      return {...z,debits:[['受取家賃',n]],credits:[['前受家賃',n]]};
    }
    return z;
  });
};
})();
