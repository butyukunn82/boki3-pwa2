(function(){
'use strict';
try{
if(typeof Q==='undefined'||!Array.isArray(Q)||typeof ACC==='undefined'||!Array.isArray(ACC))return;
if(!ACC.includes('小口現金'))ACC.push('小口現金');
const i=Q.findIndex(x=>x&&x.id==='capex-repair');
if(i>=0){
  Q[i]={
    id:'petty-cash-imprest',
    topic:'小口現金',
    text:'定額資金前渡制度を採用している。小口現金係へ100,000円を普通預金から前渡しした。',
    d:[['小口現金',100000]],
    c:[['普通預金',100000]],
    pool:['小口現金','普通預金','現金','仮払金','前払金','立替金'],
    exp:'小口現金係へ一定額を前渡しした時点では、小口現金という資産が増え、普通預金が減ります。'
  };
}
}catch(e){console.warn('q1 CBT content audit skipped',e)}
})();
