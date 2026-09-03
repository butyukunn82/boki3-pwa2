(function(){
'use strict';
if(typeof finishExam!=='function'||typeof gradeQ1!=='function'||typeof gradeQ2!=='function'||typeof gradeQ3!=='function'||typeof state==='undefined')return;
const originalFinish=finishExam;
function safeArray(k){try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
finishExam=function(auto=false){
 const wasEnded=!!state.ended;
 const out=originalFinish.apply(this,arguments);
 if(wasEnded||!state.ended)return out;
 try{
  const a=gradeQ1(),b=gradeQ2(),c=gradeQ3();
  const total=Math.round((Number(a.score||0)+Number(b.score||0)+Number(c.score||0))*10)/10;
  const now=Date.now(),set=state.setKey||'random',q2Mode=state.q2?.mode||'',q3Mode=state.q3?.mode||'';
  const v3=safeArray('boki3_mock_cbt_v3');
  if(v3.length&&Math.abs(Number(v3[0].at||0)-now)<15000){
   v3[0]={...v3[0],q1Score:Number(a.score||0),q2Score:Number(b.score||0),q3Score:Number(c.score||0),q2Mode,q3Mode};
   localStorage.setItem('boki3_mock_cbt_v3',JSON.stringify(v3.slice(0,20)));
  }
  const unified=safeArray('boki3_mock_results_v1');
  unified.push({at:now,total,q1:Number(a.score||0),q2:Number(b.score||0),q3:Number(c.score||0),set,q2Mode,q3Mode,source:'cbt-v3'});
  localStorage.setItem('boki3_mock_results_v1',JSON.stringify(unified.slice(-30)));
 }catch(e){console.warn('mock history bridge skipped',e)}
 return out;
};
})();
