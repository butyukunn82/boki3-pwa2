(function(){
'use strict';
if(document.getElementById('boki-contrast-mode-fix-style'))return;
const st=document.createElement('style');st.id='boki-contrast-mode-fix-style';st.textContent=`
html[data-boki-theme="contrast"]{color-scheme:light}
html[data-boki-theme="contrast"] body,
html[data-boki-theme="contrast"] .app,
html[data-boki-theme="contrast"] .u-app,
html[data-boki-theme="contrast"] .screen{background:#fff!important;color:#000!important}

/* 白系の面は黒字・太い枠線 */
html[data-boki-theme="contrast"] :is(
 .u-card,.u-form-card,.u-stat,.u-hero,.map-current,.stage,.ready-row,.journey a,
 .mode,.weak-card,.panel,.pill,.timer,.question-card,.choice,.answer-select,
 .calc-toggle,.calculator-panel,.calc-history-empty,.calc-history-row,.calc-key,
 .calc-clear-history,.exp,.think-step,.modal-card,.glossary-item,.search,
 .daily-card,.parent-card,.reason-btn,.memo-labels button,.flow-box,
 .route,.matrix div,.box,.steps div,.formula,.crate,.log div,.best,
 .mini-check-card,.mini-check-choice,.term-card,.jcol,.homepos>div,.route4 div,
 .calc-note,.table-wrap,.lab-card,.understand-card,.u-card--learn,
 .app-learning-head,.specialbox,.transaction,.hint-step,.hintbox,.concept
 ){
  background:#fff!important;color:#000!important;border-color:#111!important;
  box-shadow:none!important
}
html[data-boki-theme="contrast"] :is(select,input,textarea,.num-input,.search){
  background:#fff!important;color:#000!important;border:2px solid #111!important
}
html[data-boki-theme="contrast"] option{background:#fff;color:#000}
html[data-boki-theme="contrast"] :is(.ledger,.cbt-table){background:#fff!important;color:#000!important}
html[data-boki-theme="contrast"] :is(.ledger th,.cbt-table th){background:#e6e6e6!important;color:#000!important;border-color:#111!important}
html[data-boki-theme="contrast"] :is(.ledger td,.cbt-table td){background:#fff!important;color:#000!important;border-color:#111!important}

/* 薄い文字を廃止 */
html[data-boki-theme="contrast"] :is(
 .u-small,small,.u-muted,.app-brand-sub,.app-learning-head p,.daily-card p,
 .u-card-copy span,.u-section-head span,.stat span,.mode span,.small,.title p,
 .calc-hint,.multi-note,.exp h4,.complete p,.map-section-title span,.stage .desc,
 .stage-pct,.parent-card span,.calc-history-no,.element-question p,.lab-card p,
 .understand-card p,.matrix span,.box span,.card small,.steps div,.cat,.skill-tag
 ){color:#111!important;opacity:1!important}

/* 白背景上で濃すぎる青・灰色を読みやすい濃色へ */
html[data-boki-theme="contrast"] :is(
 .u-top a,.u-stat strong,.stat strong,.mode b,.daily-card h3,.parent-card strong,
 .calc-history-result,.complete .big,.glossary-item b,.mock-title,.score,
 .map-current strong,.stage strong,.journey a b,.title h2,.panel h3,.qtitle,
 .question,.element-question h2,.app-learning-head h1,.u-card-copy b,
 .map-section-title h2,.section-title,.quiz-head,.progress,.visual,.formula
 ){color:#000!important}
html[data-boki-theme="contrast"] :is(.term-link,.accountlink){color:#004f9e!important;text-decoration-thickness:2px!important}

/* 濃色カード・ボタンは白字を固定 */
html[data-boki-theme="contrast"] :is(
 .app-dashboard,.app-main-card,.app-support-card,.topic-button,.daily-go,
 .u-primary,.primary,.u-danger,.exam,.dests button,.pl,.bs,.card,
 .hero,.modal-head,.calc-key.eq,.pill.active,.tabs button.on,.three button.on
 ),
html[data-boki-theme="contrast"] :is(
 .app-dashboard,.app-main-card,.app-support-card,.topic-button,.daily-go,
 .u-primary,.primary,.u-danger,.exam,.dests button,.pl,.bs,.card,.hero
 ) :is(b,strong,small,span,p,h1,h2,h3,em){color:#fff!important;opacity:1!important}
html[data-boki-theme="contrast"] .app-continue{color:#111!important;border:2px solid #111!important}
html[data-boki-theme="contrast"] .u-secondary{background:#ffd740!important;color:#111!important;border:2px solid #111!important}
html[data-boki-theme="contrast"] .u-ghost,html[data-boki-theme="contrast"] .secondary,html[data-boki-theme="contrast"] .ghost{background:#fff!important;color:#000!important;border:2px solid #111!important}

/* 5要素など淡色カードは黒字＋太枠 */
html[data-boki-theme="contrast"] .five-map .choice,
html[data-boki-theme="contrast"] .special-choice{color:#000!important;border-width:3px!important}
html[data-boki-theme="contrast"] .five-map .asset{background:#eaffea!important;border-color:#117a28!important}
html[data-boki-theme="contrast"] .five-map .liability{background:#f1eaff!important;border-color:#5230a8!important}
html[data-boki-theme="contrast"] .five-map .equity{background:#fff0df!important;border-color:#bb4a00!important}
html[data-boki-theme="contrast"] .five-map .expense{background:#e8f6ff!important;border-color:#005e9e!important}
html[data-boki-theme="contrast"] .five-map .revenue{background:#fff0e5!important;border-color:#b84500!important}

/* 正誤・注意は色に加え文字も十分濃く */
html[data-boki-theme="contrast"] :is(.choice.correct,.u-good,.result-banner.good,.gain.profit){background:#e8ffef!important;color:#003d1b!important;border-color:#006b30!important}
html[data-boki-theme="contrast"] :is(.choice.wrong,.choice.incorrect,.u-bad,.result-banner.bad,.gain.loss){background:#fff0f2!important;color:#700012!important;border-color:#9b0019!important}
html[data-boki-theme="contrast"] :is(.u-note,.u-warn,.feedback,.reason-box,.dontknow,.hintbtn,.calc-total){color:#111!important;border-color:#7a5c00!important}

/* 下部ナビ */
html[data-boki-theme="contrast"] .u-nav,html[data-boki-theme="contrast"] .footer-nav{background:#fff!important;border-top:2px solid #111!important}
html[data-boki-theme="contrast"] .u-nav a,html[data-boki-theme="contrast"] .navbtn{color:#111!important}
html[data-boki-theme="contrast"] .u-nav a.active,html[data-boki-theme="contrast"] .navbtn.active{color:#004f9e!important;text-decoration:underline;text-underline-offset:3px}
`;
document.head.appendChild(st);
})();