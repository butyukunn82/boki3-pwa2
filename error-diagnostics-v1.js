(function(){
'use strict';
const KEY='boki3_error_diagnostics_v1';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:1,total:0,errors:0,byTag:{},byStep:{},byTopic:{},recent:[]}}catch(e){return{version:1,total:0,errors:0,byTag:{},byStep:{},byTopic:{},recent:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function bump(o,k,ok){const x=o[k]||={seen:0,ok:0,ng:0,last:0};x.seen++;if(ok)x.ok++;else x.ng++;x.last=Date.now();return x}
function record(x={}){const d=load(),ok=!!x.ok,tags=[...new Set((x.tags||[]).filter(Boolean))],topic=x.topic||'未分類',step=x.stepId||x.stepLabel||'answer';d.total++;if(!ok)d.errors++;bump(d.byTopic,topic,ok);bump(d.byStep,`${topic}::${step}`,ok);tags.forEach(t=>bump(d.byTag,t,ok));if(!ok)d.recent.unshift({ts:Date.now(),module:x.module||'',topic,questionId:x.questionId||'',stepId:step,stepLabel:x.stepLabel||step,tags,detail:x.detail||''});d.recent=d.recent.slice(0,80);save(d);window.dispatchEvent(new CustomEvent('boki-diagnostic-record',{detail:x}));return d}
function weakTags(limit=5){const d=load();return Object.entries(d.byTag).map(([tag,z])=>({tag,...z,rate:z.seen?z.ok/z.seen:0})).filter(x=>x.ng>0).sort((a,b)=>(b.ng-a.ng)||(a.rate-b.rate)).slice(0,limit)}
function weakSteps(limit=8){const d=load();return Object.entries(d.byStep).map(([key,z])=>({key,...z,rate:z.seen?z.ok/z.seen:0})).filter(x=>x.ng>0).sort((a,b)=>(b.ng-a.ng)||(a.rate-b.rate)).slice(0,limit)}
function forTopic(topic){const d=load();const prefix=topic+'::';return{topic: d.byTopic[topic]||null,steps:Object.entries(d.byStep).filter(([k])=>k.startsWith(prefix)).map(([k,v])=>({step:k.slice(prefix.length),...v})),recent:d.recent.filter(x=>x.topic===topic)}}
function summary(){const d=load();return{total:d.total,errors:d.errors,accuracy:d.total?Math.round((d.total-d.errors)/d.total*100):0,weakTags:weakTags(),weakSteps:weakSteps()}}
window.BOKI_DIAGNOSTICS={record,load,summary,weakTags,weakSteps,forTopic,key:KEY};
})();