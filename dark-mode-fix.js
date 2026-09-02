(function(){
'use strict';
if(document.getElementById('boki-dark-mode-fix-style'))return;
const st=document.createElement('style');
st.id='boki-dark-mode-fix-style';
st.textContent=`
/* Dark mode compatibility for pages that still have page-local light colors. */
html[data-boki-theme="dark"]{
  color-scheme:dark;
  --bg:#0e1620!important;
  --card:#18222e!important;
  --text:#f2f6fa!important;
  --muted:#b6c0ca!important;
  --line:#3a4857!important;
  --blue:#69b7ff!important;
  --good:#78d99b!important;
  --goodbg:#153423!important;
  --bad:#ff9b9b!important;
  --badbg:#3a1b1e!important;
  --warn:#f0cf74!important;
  --warnbg:#352d18!important;
}
html[data-boki-theme="dark"] body,
html[data-boki-theme="dark"] .app,
html[data-boki-theme="dark"] .u-app,
html[data-boki-theme="dark"] .screen{
  background:#0e1620!important;
  color:#f2f6fa!important;
}
html[data-boki-theme="dark"] .u-top,
html[data-boki-theme="dark"] .u-nav,
html[data-boki-theme="dark"] .footer-nav{
  background:rgba(17,27,38,.98)!important;
  color:#f2f6fa!important;
  border-color:#344250!important;
}
html[data-boki-theme="dark"] .u-top a,
html[data-boki-theme="dark"] .u-brand,
html[data-boki-theme="dark"] .brand{color:#f2f6fa!important}

/* Normal cards, answer controls and modal surfaces. */
html[data-boki-theme="dark"] :is(
 .u-card,.u-form-card,.u-stat,.map-current,.stage,.ready-row,.journey a,
 .mode,.weak-card,.panel,.pill,.timer,.question-card,.choice,.answer-select,
 .calc-toggle,.calculator-panel,.calc-history-empty,.calc-history-row,.calc-key,
 .calc-clear-history,.exp,.think-step,.modal-card,.glossary-item,.search,
 .daily-card,.parent-card,.reason-btn,.memo-labels button,.flow-box,
 .route,.choices button,.matrix div,.box,.steps div,.formula,.crate,.log div,
 .best,.mini-check-card,.mini-check-choice,.term-card,.jcol,.homepos>div,
 .route4 div,.calc-note,.table-wrap
 ){
  background:#18222e!important;
  color:#f2f6fa!important;
  border-color:#3a4857!important;
}
html[data-boki-theme="dark"] :is(select,input,textarea,.num-input){
  background:#141f2b!important;
  color:#f2f6fa!important;
  border-color:#526173!important;
}
html[data-boki-theme="dark"] option{background:#141f2b;color:#f2f6fa}
html[data-boki-theme="dark"] :is(.ledger,.cbt-table){background:#18222e!important;color:#f2f6fa!important}
html[data-boki-theme="dark"] :is(.ledger th,.cbt-table th){background:#243444!important;color:#f2f6fa!important;border-color:#5b6a78!important}
html[data-boki-theme="dark"] :is(.ledger td,.cbt-table td){background:#18222e!important;color:#f2f6fa!important;border-color:#516171!important}

/* Headings and hard-coded navy text that became invisible on dark surfaces. */
html[data-boki-theme="dark"] :is(
 .stat strong,.mode b,.daily-card h3,.parent-card strong,.calc-history-result,
 .complete .big,.glossary-item b,.mock-title,.score,.map-current strong,
 .stage strong,.journey a b,.title h2,.panel h3,.qtitle,.question,
 .element-question h2,.app-learning-head h1,.u-card-copy b,.map-section-title h2,
 .section-title,.quiz-head,.progress
 ){color:#f2f6fa!important}
html[data-boki-theme="dark"] :is(.term-link,.accountlink){color:#8fc8ff!important}
html[data-boki-theme="dark"] :is(
 .stat span,.mode span,.small,.u-small,.title p,.calc-hint,.multi-note,
 .exp h4,.complete p,.map-section-title span,.stage .desc,.stage-pct,
 .u-card-copy span,.daily-card p,.parent-card span,.calc-history-no
 ){color:#b6c0ca!important}

/* Page-local light panels. */
html[data-boki-theme="dark"] .app-learning-head{
  background:linear-gradient(135deg,#182738,#111b26)!important;
  border-color:#3a4b5d!important;
  color:#f2f6fa!important;
}
html[data-boki-theme="dark"] .app-learning-head p{color:#c3ced8!important}
html[data-boki-theme="dark"] :is(.qbody,.transaction,.parent-tip,.concept){
  background:#172738!important;color:#e8f2fb!important;border-color:#4c8ec6!important;
}
html[data-boki-theme="dark"] :is(.specialbox,.reason-box,.hintbox,.feedback,.dontknow,.calc-total){
  background:#352d18!important;color:#f5dfa1!important;border-color:#766335!important;
}
html[data-boki-theme="dark"] :is(.hint-step){background:#292719!important;color:#f5dfa1!important;border-color:#635b35!important}
html[data-boki-theme="dark"] .think-step{background:#172432!important;color:#eef5fb!important}
html[data-boki-theme="dark"] .secondary{background:#273444!important;color:#eef5fb!important;border-color:#46566a!important}
html[data-boki-theme="dark"] .ghost{background:#18222e!important;color:#dce8f3!important;border-color:#526173!important}
html[data-boki-theme="dark"] :is(.calc-key.op,.calc-note-btn){background:#21354a!important;color:#9fd2ff!important;border-color:#49647c!important}
html[data-boki-theme="dark"] .calc-live{background:#080e15!important;color:#fff!important}
html[data-boki-theme="dark"] .calculator-panel{background:#111b26!important}

/* Status and feedback colors: preserve meaning while keeping contrast. */
html[data-boki-theme="dark"] :is(.choice.correct,.answer-select.correct,.result-banner.good,.gain.profit,.u-good){
  background:#153423!important;color:#8ee5aa!important;border-color:#4b9f6b!important;
}
html[data-boki-theme="dark"] :is(.choice.incorrect,.choice.wrong,.answer-select.incorrect,.result-banner.bad,.gain.loss,.u-bad){
  background:#3a1b1e!important;color:#ffaaaa!important;border-color:#a3545b!important;
}
html[data-boki-theme="dark"] :is(.cat,.tag,.skill-tag,.badge){background:#20354a!important;color:#a8d6ff!important;border-color:#42617c!important}
html[data-boki-theme="dark"] .review-badge{background:#3a311a!important;color:#f0d47e!important}
html[data-boki-theme="dark"] .bar{background:#293544!important}
html[data-boki-theme="dark"] .mini-bar{background:#293544!important}

/* Difficult-topic lab semantic boxes. */
html[data-boki-theme="dark"] .current{background:#153726!important;color:#91e2ac!important}
html[data-boki-theme="dark"] .future{background:#392f19!important;color:#f1d17b!important}
html[data-boki-theme="dark"] .book{background:#18324d!important;color:#9bd0ff!important}
html[data-boki-theme="dark"] .used{background:#402022!important;color:#ffb0ae!important}
html[data-boki-theme="dark"] .matrix div.sel{background:#3a321c!important;outline-color:#d9b94d!important}
html[data-boki-theme="dark"] .hot{background:#382719!important;border-color:#b66e2d!important;color:#f3d3ac!important}
html[data-boki-theme="dark"] .out{background:#153327!important;border-color:#3b946d!important;color:#9de4c0!important}
html[data-boki-theme="dark"] .route.sel{background:#17304a!important;border-color:#579bd4!important;color:#b9dcfa!important}

/* Five-element map: retain category colors without glaring white cards. */
html[data-boki-theme="dark"] .five-map .asset{background:#163322!important;color:#91e9a2!important;border-color:#4a9c59!important}
html[data-boki-theme="dark"] .five-map .liability{background:#2a2140!important;color:#c9adff!important;border-color:#7d63b8!important}
html[data-boki-theme="dark"] .five-map .equity{background:#3a2818!important;color:#ffc78f!important;border-color:#b9793e!important}
html[data-boki-theme="dark"] .five-map .expense{background:#183246!important;color:#9fd5ff!important;border-color:#4c8bb7!important}
html[data-boki-theme="dark"] .five-map .revenue{background:#3b2919!important;color:#ffc394!important;border-color:#b87743!important}
html[data-boki-theme="dark"] .special-choice{background:#173638!important;color:#9de7e7!important;border-color:#4f9c9f!important}

/* Learning map and settings feedback. */
html[data-boki-theme="dark"] .map-hero{background:linear-gradient(135deg,#182738,#111b26)!important;border-color:#3a4b5d!important}
html[data-boki-theme="dark"] .map-hero p{color:#c2ced9!important}
html[data-boki-theme="dark"] .map-note{background:#332b19!important;color:#f0d58a!important;border-color:#6c5b34!important}
html[data-boki-theme="dark"] #settingsLiveStatus{background:#18324a!important;color:#b8ddff!important;border-color:#42617c!important}

/* Keep intentionally colored navigation/action cards readable. */
html[data-boki-theme="dark"] :is(.primary,.daily-go,.pill.active,.tabs button.on,.three button.on,.calc-key.eq,.modal-head,.think-step b,.switch.on){
  background:#245f9d!important;color:#fff!important;
}
html[data-boki-theme="dark"] :is(.topic-button,.app-main-card,.touch-lab-card,.lab-all,.personal-daily,.next-card,.card,.hero,.app-dashboard){color:#fff!important}
html[data-boki-theme="dark"] :is(.topic-button small,.app-main-card small,.touch-lab-card small,.lab-all small,.personal-daily small,.card small,.hero p){color:rgba(255,255,255,.92)!important}
`;
document.head.appendChild(st);
})();