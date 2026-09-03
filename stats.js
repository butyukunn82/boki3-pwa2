(function(){
  const KEYS={q1:'boki3_q1_trainer_v1',q2:'boki3trainer_v2',q3:'boki3_q3_trainer_v1'};
  function safe(k){try{return JSON.parse(localStorage.getItem(k)||'null')||{}}catch(e){return {}}}
  function dateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function pct(c,a){return a?Math.round(c/a*100):null}
  function rateObj(c,a){return {answered:a||0,correct:c||0,rate:pct(c||0,a||0)}}
  function read(){return {q1:safe(KEYS.q1),q2:safe(KEYS.q2),q3:safe(KEYS.q3)}}
  function practice(s){
    const cbt=s.q1.cbt||{};
    const q1a=Math.max(0,(s.q1.answered||0)-(cbt.answered||0));
    const q1c=Math.max(0,(s.q1.correct||0)-(cbt.correct||0));
    return rateObj(q1c+(s.q2.correct||0)+(s.q3.correct||0), q1a+(s.q2.answered||0)+(s.q3.answered||0));
  }
  function exam(s){const c=s.q1.cbt||{};return rateObj(c.correct||0,c.answered||0)}
  function moduleStats(s){return [
    {name:'第1問 仕訳',href:'q1.html',answered:s.q1.answered||0,correct:s.q1.correct||0,rate:pct(s.q1.correct||0,s.q1.answered||0)},
    {name:'第2問 帳簿・勘定',href:'q2.html',answered:s.q2.answered||0,correct:s.q2.correct||0,rate:pct(s.q2.correct||0,s.q2.answered||0)},
    {name:'第3問 決算・精算表',href:'q3.html',answered:s.q3.answered||0,correct:s.q3.correct||0,rate:pct(s.q3.correct||0,s.q3.answered||0)}
  ]}
  function today(s){const k=dateKey();let a=0,c=0;[s.q1,s.q2,s.q3].forEach(x=>{const h=(x.history||{})[k]||{};a+=h.answered||0;c+=h.correct||0});return rateObj(c,a)}
  function last7(s){let a=0,c=0;const rows=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dateKey(d);let da=0,dc=0;[s.q1,s.q2,s.q3].forEach(x=>{const h=(x.history||{})[k]||{};da+=h.answered||0;dc+=h.correct||0});a+=da;c+=dc;rows.push({key:k,answered:da,correct:dc,rate:pct(dc,da)})}return {...rateObj(c,a),rows}}
  function streak(s){const days=new Set();[s.q1,s.q2,s.q3].forEach(x=>Object.entries(x.history||{}).forEach(([k,v])=>{if((v.answered||0)>0)days.add(k)}));let n=0;for(let i=0;i<365;i++){const d=new Date();d.setDate(d.getDate()-i);const k=dateKey(d);if(days.has(k))n++;else if(i===0)continue;else break}return n}
  function weak(s){
    const step=Object.entries(s.q1.stepErrors||{}).sort((a,b)=>b[1]-a[1]);
    if(step.length){return {label:step[0][0],count:step[0][1],href:'q1.html',detail:`「${step[0][0]}」でつまずくことが多いです。`}}
    const reasons=[];
    Object.entries(s.q2.errorReasons||{}).forEach(([k,v])=>reasons.push({label:k,count:v,href:'q2.html'}));
    Object.entries(s.q3.errorReasons||{}).forEach(([k,v])=>reasons.push({label:k,count:v,href:'q3.html'}));
    reasons.sort((a,b)=>b.count-a.count);
    if(reasons.length){const w=reasons[0];return {...w,detail:`「${w.label}」でのミスが多めです。`}}
    const mods=moduleStats(s).filter(x=>x.answered>=5&&x.rate!==null)|.sort((a,b)=>a.rate-b.rate);
    if(mods.length){const w=mods[0];return {label:w.name,count:null,href:w.href,detail:`${w.name}の正答率が${w.rate}%c��す。`}}
    return {label:'第1問 仕訳',count:null,href:'q1.html',detail:'まずは仕訳の基本を10問だけ進めましょう。'}
  }
  function recommendation(s){const w=weak(s);return {title:'今日のおすすめ',text:w.detail,href:w.href,button:'ここから始める'}}
  function get(){const s=read();return {raw:s,practice:practice(s),exam:exam(s),modules:moduleStats(s),today:today(s),week:last7(s),streak:streak(s),weak:weak(s),recommendation:recommendation(s)}}
  window.BOKI_STATS={get,dateKey};
})();
