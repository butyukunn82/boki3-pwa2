(function(){
'use strict';
if(typeof record!=='function'||typeof list==='undefined'||typeof idx==='undefined'||typeof responses==='undefined')return;
const KEY='boki3_mock_review_events_v1';
const TOPIC_TO_TITLE={
 '模試復習・商品売買':'第1問｜商品売買',
 '模試復習・決済':'第1問｜決済・前払前受',
 '模試復習・固定資産':'第1問｜固定資産',
 '模試復習・給与税金':'第1問｜給与・税金',
 '模試復習・決算整理':'第1問｜決算整理',
 '模試復習・純資産':'第1問｜純資産・特殊処理',
 '模試復習・特殊処理':'第1問｜純資産・特殊処理',
 '模試復習・商品売買締切':'第2問｜商品売買・締切',
 '模試復習・固定資産台帳':'第2問｜固定資産台帳',
 '模試復習・経過勘定':'第2問｜経過勘定',
 '模試復習・配当法人税':'第2問｜配当・法人税',
 '模試復習・B/S・P/L':'第3問｜B/S・P/L',
 '模試復習・精算表':'第3問｜精算表',
 '模試復習・整理後試算表':'第3問｜整理後残高試算表'
};
const original=record;
record=function(value,unknown){
 const current=list[idx],before=!!responses[idx],analysis=(()=>{try{return JSON.parse(localStorage.getItem('boki3_mock_last_analysis_v1')||'null')}catch{return null}})();
 const title=current&&TOPIC_TO_TITLE[current.topic];
 const out=original.apply(this,arguments);
 if(!before&&title&&responses[idx]){
   let events;try{events=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(events))events=[]}catch{events=[]}
   events.unshift({at:Date.now(),analysisAt:analysis?.at||0,title,topic:current.topic,source:current.source,ok:!!responses[idx].ok,unknown:!!responses[idx].unknown});
   localStorage.setItem(KEY,JSON.stringify(events.slice(0,300)));
 }
 return out;
};
})();