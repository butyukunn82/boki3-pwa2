(function(){
'use strict';
if(typeof list==='undefined'||!Array.isArray(list))return;
const ANALYSIS='boki3_mock_last_analysis_v1',EVENTS='boki3_mock_review_events_v1',RETENTION_MS=3*24*60*60*1000;
const safe=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch{return f}};
const analysis=safe(ANALYSIS,null),events=safe(EVENTS,[]);
if(!analysis||!Array.isArray(analysis.priorities)||!analysis.priorities.length)return;
function reviewFor(p){const a=(Array.isArray(events)?events:[]).filter(e=>e&&e.analysisAt===analysis.at&&e.title===p.title).sort((x,y)=>Number(y.at||0)-Number(x.at||0));const correct=a.filter(e=>e.ok).length;return{seen:a.length,correct,rate:a.length?Math.round(correct/a.length*100):null,latest:a[0]||null}}
function isImproved(p,r){if(r.seen<2||r.rate==null)return false;const delta=r.rate-Number(p.rate||0);return (r.rate>=80||delta>=20)&&r.latest?.ok!==false}
const now=Date.now(),kept=[],released=[],retention=[];
analysis.priorities.forEach(p=>{const r=reviewFor(p),improved=isImproved(p,r);if(!improved){kept.push({...p});return}const due=r.latest?.at&&now-Number(r.latest.at)>=RETENTION_MS;if(due){retention.push(p.title);kept.push({...p,rate:Math.max(50,Number(p.rate||0)),retention:true});}else released.push(p.title)});
kept.sort((a,b)=>{const ra=reviewFor(a),rb=reviewFor(b);const ea=ra.rate==null?Number(a.rate||0):ra.rate,eb=rb.rate==null?Number(b.rate||0):rb.rate;return ea-eb});
const filtered={...analysis,priorities:kept};
const proto=Storage.prototype,originalGet=proto.getItem;let restored=false;
proto.getItem=function(k){if(this===localStorage&&k===ANALYSIS)return JSON.stringify(filtered);return originalGet.call(this,k)};
function restore(){if(restored)return;restored=true;proto.getItem=originalGet;setTimeout(()=>{const reasons=document.getElementById('reasons');if(reasons){if(released.length){const s=document.createElement('span');s.textContent=`改善済み ${released.length}件は優先解除`;s.style.background='#eaf8ee';s.style.color='#267342';reasons.prepend(s)}if(retention.length){const s=document.createElement('span');s.textContent='定着確認 '+retention.map(x=>x.replace(/^第[123]問｜/,'')).join('・');s.style.background='#f0f3ff';s.style.color='#425a9a';reasons.prepend(s)}}const desc=document.querySelector('.reason-card .u-small');if(desc&&released.length)desc.textContent=`模試弱点のうち改善が確認できた${released.length}件は優先枠から外し、未改善の弱点へ入れ替えます。改善後は3日後に1問だけ定着確認します。`;},0)}
const priorityScript=document.getElementById('daily-mock-priority-v1');if(priorityScript)priorityScript.addEventListener('load',restore,{once:true});setTimeout(restore,5000);
window.BOKI_MOCK_ROTATION={analysisAt:analysis.at,released,retention,active:kept.map(x=>x.title)};
})();