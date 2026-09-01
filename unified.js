(function(){
  const defaults={theme:'standard',font:'standard',size:'standard',motion:'standard',daily:10};
  let s={...defaults};
  try{s={...s,...JSON.parse(localStorage.getItem('boki3_unified_settings')||'{}')}}catch(e){}
  window.BOKI_SETTINGS=s;

  const r=document.documentElement;
  if(s.theme==='dark'){
    r.style.setProperty('--u-bg','#101722');
    r.style.setProperty('--u-card','#17202c');
    r.style.setProperty('--u-text','#edf3f8');
    r.style.setProperty('--u-muted','#aeb9c6');
    r.style.setProperty('--u-line','#324153');
  }
  if(s.theme==='gentle')r.style.setProperty('--u-bg','#fffaf0');
  if(s.theme==='contrast'){
    r.style.setProperty('--u-text','#000');
    r.style.setProperty('--u-line','#4b5563');
  }
  const sizes={small:'14px',standard:'16px',large:'18px',xlarge:'20px'};
  document.documentElement.style.fontSize=sizes[s.size]||'16px';
  if(s.font==='rounded')document.body.style.fontFamily='"Hiragino Maru Gothic ProN","Yu Gothic UI",sans-serif';
  if(s.font==='serif')document.body.style.fontFamily='"Yu Mincho","Hiragino Mincho ProN",serif';
  if(s.motion==='off'){
    const st=document.createElement('style');
    st.textContent='*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';
    document.head.appendChild(st);
  }

  const p=location.pathname.split('/').pop()||'index.html';
  if(!['index.html','management.html','settings.html','glossary.html','learn.html'].includes(p)){
    localStorage.setItem('boki3_last_page',p+location.search);
  }

  const CHECK_STORE='boki3_understanding_checks_v1';
  const checkDefs={
    worksheet:{
      title:'精算表連動・What-if',
      short:'精算表連動',
      questions:[
        {
          q:'保険料120,000円のうち翌期分30,000円を前払保険料へ振り替えた。正しい影響はどれ？',
          choices:['保険料費用が30,000円減り、前払保険料（資産）が30,000円増える','保険料費用が30,000円増え、前払保険料が30,000円減る','現金が30,000円増える','売上が30,000円増える'],
          answer:'保険料費用が30,000円減り、前払保険料（資産）が30,000円増える',
          exp:'翌期分は当期の費用から外します。費用の保険料を減らし、将来のサービスを受ける権利である前払保険料（資産）へ移します。'
        },
        {
          q:'未払給料30,000円を決算整理で計上すると、P/LとB/Sはどう動く？',
          choices:['P/Lの給料が増え、B/Sの未払給料（負債）が増える','P/Lの給料が減り、B/Sの現金が増える','P/Lの売上が増え、B/Sの売掛金が増える','B/Sだけが動きP/Lは動かない'],
          answer:'P/Lの給料が増え、B/Sの未払給料（負債）が増える',
          exp:'まだ支払っていなくても当期に発生した給料は当期費用です。同時に、将来支払う義務として未払給料という負債が増えます。'
        },
        {
          q:'減価償却費60,000円を計上したとき、利益への影響は？',
          choices:['利益が60,000円減る','利益が60,000円増える','利益は変わらない','現金が60,000円必ず減る'],
          answer:'利益が60,000円減る',
          exp:'減価償却費は当期の費用なので利益を減らします。ただし、この決算整理仕訳そのものでは現金は動きません。'
        }
      ]
    },
    ledger:{
      title:'仕訳→元帳→試算表',
      short:'元帳・試算表',
      questions:[
        {
          q:'仕訳帳と総勘定元帳の違いとして正しいものは？',
          choices:['仕訳帳は日付順、総勘定元帳は勘定科目別','仕訳帳は科目別、総勘定元帳は日付順','どちらも必ず得意先別に記録する','試算表を作った後に仕訳帳を作る'],
          answer:'仕訳帳は日付順、総勘定元帳は勘定科目別',
          exp:'取引はまず日付順に仕訳され、その内容を各勘定科目の元帳へ転記します。'
        },
        {
          q:'試算表の数字は主にどこから集める？',
          choices:['総勘定元帳の各勘定の合計・残高','請求書だけ','貸借対照表だけ','補助元帳だけ'],
          answer:'総勘定元帳の各勘定の合計・残高',
          exp:'試算表は、総勘定元帳に集まった各勘定の合計や残高を一覧にして貸借一致などを確認する表です。'
        },
        {
          q:'補助元帳の役割として最も適切なのは？',
          choices:['総勘定元帳の残高を得意先・仕入先などの内訳に分けて管理する','仕訳の借方と貸方を逆にする','収益と費用を翌期へ繰り越す','決算書を税務署へ送信する'],
          answer:'総勘定元帳の残高を得意先・仕入先などの内訳に分けて管理する',
          exp:'総勘定元帳が会社全体の科目別残高、補助元帳がその内訳です。売掛金元帳なら得意先別に管理します。'
        }
      ]
    },
    carry:{
      title:'締切・繰越',
      short:'締切・繰越',
      questions:[
        {
          q:'3月31日の現金100,000円は、翌4月1日にどうなる？',
          choices:['前期繰越として翌期へ引き継ぐ','損益勘定へ振り替えて0にする','売上へ振り替える','必ず現金を全額引き出す'],
          answer:'前期繰越として翌期へ引き継ぐ',
          exp:'現金は資産であり、会社に残る状態です。資産・負債・純資産は翌期へ引き継ぎます。'
        },
        {
          q:'当期の売上500,000円は翌期首にどうなる？',
          choices:['売上勘定は0から始める','前期繰越500,000円として売上勘定に残す','現金勘定へ移す','買掛金へ移す'],
          answer:'売上勘定は0から始める',
          exp:'収益・費用は「その1年間の成績」なので、損益勘定へ振り替えて締め、翌期は0から始めます。'
        },
        {
          q:'翌期へ残るグループはどれ？',
          choices:['資産・負債・純資産','収益・費用だけ','費用・資産だけ','収益・純資産だけ'],
          answer:'資産・負債・純資産',
          exp:'B/Sの3要素は期末時点の状態なので翌期へつながります。P/Lの収益・費用は期間ごとにリセットします。'
        }
      ]
    },
    lab:{
      title:'総合簿記ラボ',
      short:'総合簿記ラボ',
      questions:[
        {
          q:'簿記の基本的な流れとして最も適切なのは？',
          choices:['取引→仕訳→総勘定元帳→試算表→決算整理→精算表・決算書','試算表→取引→仕訳→決算書→元帳','決算書→仕訳→取引→試算表','仕訳→決算書→取引→元帳'],
          answer:'取引→仕訳→総勘定元帳→試算表→決算整理→精算表・決算書',
          exp:'現実の取引を仕訳に翻訳し、科目別に集め、残高を試算表にまとめ、期末修正をして決算書へつなげます。'
        },
        {
          q:'貸倒引当金繰入3,000円を計上したとき、正しい組合せは？',
          choices:['P/Lに貸倒引当金繰入3,000円、B/Sでは貸倒引当金が売掛金から控除される','P/Lに売掛金3,000円、B/Sに売上3,000円','P/Lには何も出ず、B/Sに現金3,000円が増える','貸倒引当金は負債として買掛金に加算する'],
          answer:'P/Lに貸倒引当金繰入3,000円、B/Sでは貸倒引当金が売掛金から控除される',
          exp:'貸倒引当金繰入は費用なのでP/L、貸倒引当金は売掛金等の資産を控除する評価勘定としてB/Sに関係します。'
        },
        {
          q:'試算表で貸借が一致していることから必ず言えることは？',
          choices:['少なくとも借方合計と貸方合計は一致している','すべての仕訳が絶対に正しい','決算整理がすべて完了している','利益が必ず出ている'],
          answer:'少なくとも借方合計と貸方合計は一致している',
          exp:'貸借一致は重要なチェックですが、同額を誤った科目へ記録するなど、一致していても残る誤りがあります。'
        }
      ]
    }
  };

  function ready(fn){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }
  function escHtml(v){
    return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function shuffledIndexes(n){
    const a=Array.from({length:n},(_,i)=>i);
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function loadCheckData(){
    try{return JSON.parse(localStorage.getItem(CHECK_STORE)||'{}')||{}}
    catch(e){return {}}
  }
  function saveCheckData(d){
    localStorage.setItem(CHECK_STORE,JSON.stringify(d));
  }
  const checkRuntime={};

  function injectCheckStyles(){
    if(document.getElementById('boki-mini-check-styles'))return;
    const st=document.createElement('style');
    st.id='boki-mini-check-styles';
    st.textContent=`
      .mini-check-shell{margin:18px 0 8px}
      .mini-check-card{background:#fff;border:1px solid #d9e2ec;border-radius:18px;padding:15px;box-shadow:0 8px 28px rgba(26,48,79,.08)}
      .mini-check-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px}
      .mini-check-kicker{display:inline-flex;align-items:center;gap:6px;font-size:.72rem;font-weight:900;color:#2d6dad;background:#edf6ff;border:1px solid #cfe2f5;border-radius:999px;padding:4px 8px;margin-bottom:5px}
      .mini-check-title{font-size:1.05rem;font-weight:900;color:#243244}
      .mini-check-desc{font-size:.78rem;color:#6f7f91;margin-top:3px}
      .mini-check-best{flex:none;background:#f4f7fb;border:1px solid #d9e2ec;border-radius:12px;padding:7px 9px;text-align:center;font-size:.7rem;color:#6f7f91}
      .mini-check-best b{display:block;font-size:1rem;color:#173b67}
      .mini-check-start{width:100%;border:0;border-radius:13px;min-height:48px;background:linear-gradient(135deg,#2568ad,#173b67);color:#fff;font-weight:900;font-size:.92rem;cursor:pointer}
      .mini-check-dots{display:flex;gap:6px;margin:8px 0 13px}
      .mini-check-dot{height:7px;flex:1;border-radius:999px;background:#e7edf3}
      .mini-check-dot.done{background:#69b97d}.mini-check-dot.current{background:#2f6fad}
      .mini-check-q{font-weight:900;font-size:.96rem;line-height:1.6;margin:5px 0 12px}
      .mini-check-options{display:grid;gap:8px}
      .mini-check-choice{width:100%;min-height:49px;text-align:left;border:2px solid #d7e0ea;background:#fff;border-radius:12px;padding:11px 12px;font-size:.86rem;font-weight:700;color:#243244;cursor:pointer}
      .mini-check-choice.correct{border-color:#2d8a58;background:#edf9f2;color:#216b45}
      .mini-check-choice.wrong{border-color:#c95555;background:#fff1f1;color:#a53535}
      .mini-check-choice:disabled{opacity:1;cursor:default}
      .mini-check-feedback{margin-top:10px;border-radius:12px;padding:10px 11px;font-size:.82rem;line-height:1.55}
      .mini-check-feedback.good{background:#edf9f2;border:1px solid #acd8be;color:#225f40}
      .mini-check-feedback.bad{background:#fff6e8;border:1px solid #ead09d;color:#78581b}
      .mini-check-actions{display:flex;gap:8px;margin-top:11px}
      .mini-check-next,.mini-check-sub{flex:1;min-height:45px;border:0;border-radius:11px;font-weight:900;cursor:pointer}
      .mini-check-next{background:#173b67;color:#fff}.mini-check-sub{background:#eaf0f6;color:#334b64}
      .mini-check-next:disabled{opacity:.45;cursor:default}
      .mini-check-result{text-align:center;padding:8px 2px 2px}
      .mini-check-score{font-size:2rem;font-weight:900;color:#173b67;line-height:1.1}
      .mini-check-result h3{margin:8px 0 5px}
      .mini-check-result p{font-size:.82rem;color:#6f7f91;margin:0 0 12px}
      .mini-check-result-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .mini-check-result-actions.one{grid-template-columns:1fr}
      .understanding-progress{background:linear-gradient(135deg,#f8fbff,#fff);border:1px solid #d8e4ef;border-radius:16px;padding:12px;margin:10px 0 14px}
      .understanding-progress-top{display:flex;justify-content:space-between;gap:10px;align-items:center}
      .understanding-progress-top b{font-size:.9rem}.understanding-progress-top strong{color:#216bb0}
      .understanding-progress-chips{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
      .understanding-chip{border:1px solid #dce4ec;border-radius:10px;padding:7px 8px;background:#fff;font-size:.7rem;color:#617386}
      .understanding-chip b{display:block;color:#243244;font-size:.76rem}
      .understanding-chip.done{background:#eef9f2;border-color:#b9ddc5}
      .understanding-chip.done b{color:#216b45}
      .mini-check-link-badge{display:inline-block;margin-top:6px;border-radius:999px;padding:3px 7px;background:#eef7ff;color:#2366a5;border:1px solid #cfe1f3;font-size:.66rem;font-weight:900}
      @media(max-width:520px){.mini-check-result-actions{grid-template-columns:1fr}.understanding-progress-chips{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(st);
  }

  function recordFor(screen){
    const data=loadCheckData();
    return data[screen]||{attempts:0,best:0,last:0,completed:false,updated:0};
  }

  function renderCheckIntro(screen){
    const mount=document.getElementById(`mini-check-${screen}`);
    const def=checkDefs[screen];
    if(!mount||!def)return;
    const rec=recordFor(screen);
    mount.innerHTML=`
      <div class="mini-check-card">
        <div class="mini-check-head">
          <div>
            <div class="mini-check-kicker">✓ 3問で定着確認</div>
            <div class="mini-check-title">${escHtml(def.title)} 理解チェック</div>
            <div class="mini-check-desc">教材を触った直後に、迷わず答えられるか確認します。選択肢の位置は毎回変わります。</div>
          </div>
          <div class="mini-check-best">ベスト<b>${rec.best}/3</b>${rec.completed?'定着':''}</div>
        </div>
        <button class="mini-check-start" type="button" onclick="BOKI_MINICHECK.start('${screen}')">${rec.best===3?'もう一度確認する':'3問チェックを始める'}</button>
      </div>`;
  }

  function ensureCheck(screen){
    const host=document.getElementById(screen);
    if(!host||!checkDefs[screen])return;
    let mount=document.getElementById(`mini-check-${screen}`);
    if(!mount){
      mount=document.createElement('section');
      mount.id=`mini-check-${screen}`;
      mount.className='mini-check-shell';
      host.appendChild(mount);
    }
    renderCheckIntro(screen);
  }

  function startCheck(screen,indices){
    const def=checkDefs[screen];
    if(!def)return;
    const order=(indices&&indices.length?indices:[0,1,2]).slice();
    checkRuntime[screen]={
      screen,
      order,
      pos:0,
      score:0,
      answered:false,
      selected:null,
      wrong:[],
      choiceOrders:{},
      full:order.length===def.questions.length
    };
    renderCheckQuestion(screen);
  }

  function renderCheckQuestion(screen){
    const state=checkRuntime[screen],def=checkDefs[screen],mount=document.getElementById(`mini-check-${screen}`);
    if(!state||!def||!mount)return;
    const qIndex=state.order[state.pos],q=def.questions[qIndex];
    if(!state.choiceOrders[state.pos])state.choiceOrders[state.pos]=shuffledIndexes(q.choices.length);
    const correctIndex=q.choices.indexOf(q.answer);
    const dots=state.order.map((_,i)=>`<span class="mini-check-dot ${i<state.pos?'done':i===state.pos?'current':''}"></span>`).join('');
    const opts=state.choiceOrders[state.pos].map(originalIndex=>{
      let cls='mini-check-choice';
      if(state.answered&&originalIndex===correctIndex)cls+=' correct';
      if(state.answered&&originalIndex===state.selected&&originalIndex!==correctIndex)cls+=' wrong';
      return `<button type="button" class="${cls}" ${state.answered?'disabled':''} onclick="BOKI_MINICHECK.answer('${screen}',${originalIndex})">${escHtml(q.choices[originalIndex])}</button>`;
    }).join('');
    const ok=state.answered&&state.selected===correctIndex;
    const feedback=state.answered?`
      <div class="mini-check-feedback ${ok?'good':'bad'}">
        <b>${ok?'✓ 正解':'✕ 正解：'+escHtml(q.answer)}</b><br>${escHtml(q.exp)}
      </div>`:'';
    mount.innerHTML=`
      <div class="mini-check-card">
        <div class="mini-check-head">
          <div>
            <div class="mini-check-kicker">${state.pos+1} / ${state.order.length}</div>
            <div class="mini-check-title">${escHtml(def.title)} 理解チェック</div>
          </div>
          <div class="mini-check-best">今回<b>${state.score}/${state.order.length}</b></div>
        </div>
        <div class="mini-check-dots">${dots}</div>
        <div class="mini-check-q">${escHtml(q.q)}</div>
        <div class="mini-check-options">${opts}</div>
        ${feedback}
        <div class="mini-check-actions">
          <button type="button" class="mini-check-sub" onclick="BOKI_MINICHECK.cancel('${screen}')">教材へ戻る</button>
          <button type="button" class="mini-check-next" ${state.answered?'':'disabled'} onclick="BOKI_MINICHECK.next('${screen}')">${state.pos===state.order.length-1?'結果を見る':'次の問題 →'}</button>
        </div>
      </div>`;
  }

  function answerCheck(screen,originalIndex){
    const state=checkRuntime[screen],def=checkDefs[screen];
    if(!state||state.answered||!def)return;
    const qIndex=state.order[state.pos],q=def.questions[qIndex];
    const correctIndex=q.choices.indexOf(q.answer);
    state.answered=true;
    state.selected=originalIndex;
    if(originalIndex===correctIndex)state.score++;
    else if(!state.wrong.includes(qIndex))state.wrong.push(qIndex);
    renderCheckQuestion(screen);
  }

  function nextCheck(screen){
    const state=checkRuntime[screen];
    if(!state||!state.answered)return;
    if(state.pos<state.order.length-1){
      state.pos++;
      state.answered=false;
      state.selected=null;
      renderCheckQuestion(screen);
      return;
    }
    finishCheck(screen);
  }

  function finishCheck(screen){
    const state=checkRuntime[screen],def=checkDefs[screen],mount=document.getElementById(`mini-check-${screen}`);
    if(!state||!def||!mount)return;
    const data=loadCheckData();
    const prev=data[screen]||{attempts:0,best:0,last:0,completed:false,updated:0};
    prev.attempts=(prev.attempts||0)+1;
    prev.last=state.score;
    if(state.full)prev.best=Math.max(prev.best||0,state.score);
    else if(state.score===state.order.length)prev.best=3;
    prev.completed=(prev.best||0)>=3;
    prev.updated=Date.now();
    data[screen]=prev;
    saveCheckData(data);

    const perfect=state.wrong.length===0;
    const title=perfect?'3問すべて定着しています！':state.score>=2?'あと少しです':'もう一度、動きを確認しましょう';
    const desc=perfect?'この論点は反射的に判断できる状態です。':`間違えた ${state.wrong.length} 問だけをすぐにやり直せます。`;
    mount.innerHTML=`
      <div class="mini-check-card">
        <div class="mini-check-result">
          <div class="mini-check-kicker">理解チェック結果</div>
          <div class="mini-check-score">${state.score}/${state.order.length}</div>
          <h3>${title}</h3>
          <p>${desc}</p>
          <div class="mini-check-result-actions ${perfect?'one':''}">
            ${perfect?'':`<button type="button" class="mini-check-next" onclick="BOKI_MINICHECK.retryWrong('${screen}')">間違いだけやり直す</button>`}
            <button type="button" class="mini-check-sub" onclick="BOKI_MINICHECK.start('${screen}')">3問をもう一度</button>
          </div>
        </div>
      </div>`;
    renderUnderstandingProgress();
    decorateUnderstandingLinks();
  }

  function retryWrong(screen){
    const state=checkRuntime[screen];
    if(!state||!state.wrong.length){startCheck(screen);return}
    startCheck(screen,state.wrong);
  }

  function cancelCheck(screen){
    renderCheckIntro(screen);
  }

  window.BOKI_MINICHECK={
    start:(screen)=>startCheck(screen),
    answer:answerCheck,
    next:nextCheck,
    retryWrong,
    cancel:cancelCheck
  };

  function renderUnderstandingProgress(){
    const keys=['worksheet','ledger','carry','lab'];
    const data=loadCheckData();
    const done=keys.filter(k=>(data[k]?.best||0)>=3).length;
    const chips=keys.map(k=>{
      const best=data[k]?.best||0;
      return `<div class="understanding-chip ${best>=3?'done':''}"><b>${escHtml(checkDefs[k].short)}</b>${best}/3 ${best>=3?'✓':''}</div>`;
    }).join('');
    const html=`
      <div class="understanding-progress-top"><b>理解チェック進捗</b><strong>${done} / ${keys.length} 完了</strong></div>
      <div class="understanding-progress-chips">${chips}</div>`;

    if(p==='q3.html'){
      const learn=document.getElementById('learn');
      if(learn){
        let card=document.getElementById('understanding-progress-q3');
        if(!card){
          card=document.createElement('div');
          card.id='understanding-progress-q3';
          card.className='understanding-progress';
          const hero=learn.querySelector('.learn-hero');
          hero?.insertAdjacentElement('afterend',card);
        }
        if(card)card.innerHTML=html;
      }
    }

    if(p==='understand.html'){
      const more=document.getElementById('more');
      if(more){
        let card=document.getElementById('understanding-progress-understand');
        if(!card){
          card=document.createElement('div');
          card.id='understanding-progress-understand';
          card.className='understanding-progress';
          more.insertAdjacentElement('afterend',card);
        }
        if(card)card.innerHTML=html;
      }
    }
  }

  function decorateUnderstandingLinks(){
    const data=loadCheckData();
    if(p==='understand.html'){
      Object.keys(checkDefs).forEach(screen=>{
        document.querySelectorAll(`a[href*="screen=${screen}"]`).forEach(a=>{
          const copy=a.querySelector('.u-card-copy')||a;
          let badge=copy.querySelector(`.mini-check-link-badge[data-check="${screen}"]`);
          if(!badge){
            badge=document.createElement('span');
            badge.className='mini-check-link-badge';
            badge.dataset.check=screen;
            copy.appendChild(badge);
          }
          const best=data[screen]?.best||0;
          badge.textContent=best>=3?'✓ 理解チェック 3/3':`理解チェック ${best}/3`;
        });
      });
    }
    if(p==='q3.html'){
      document.querySelectorAll('.understand-card').forEach(card=>{
        const code=card.getAttribute('onclick')||'';
        const screen=Object.keys(checkDefs).find(k=>code.includes(`'${k}'`)||code.includes(`"${k}"`));
        if(!screen)return;
        let badge=card.querySelector('.mini-check-link-badge');
        if(!badge){
          badge=document.createElement('span');
          badge.className='mini-check-link-badge';
          card.appendChild(badge);
        }
        const best=data[screen]?.best||0;
        badge.textContent=best>=3?'✓ 3/3 定着':`確認 ${best}/3`;
      });
    }
  }

  ready(()=>{
    injectCheckStyles();

    if(p==='q3.html'){
      Object.keys(checkDefs).forEach(ensureCheck);
    }
    renderUnderstandingProgress();
    decorateUnderstandingLinks();

    // q3.html?screen=... で指定された理解教材を確実に開く。
    if(p==='q3.html'){
      const screen=new URLSearchParams(location.search).get('screen');
      if(screen){
        const allowed=new Set(['map','journey','worksheet','ledger','carry','year','lab','learn','home']);
        if(allowed.has(screen)&&document.getElementById(screen)&&typeof window.nav==='function'){
          window.nav(screen);
          window.scrollTo({top:0,behavior:'auto'});
        }
      }
    }
  });
})();
