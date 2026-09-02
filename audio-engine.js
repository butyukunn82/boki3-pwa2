(function(){
'use strict';
const KEY='boki3_audio_settings_v1';
const defaults={effects:true,bgm:false,volume:.55};
let settings={...defaults};
try{settings={...settings,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){}
let ctx=null,master=null,bgmGain=null,bgmTimer=null,bgmStep=0,streak=0,unlocked=false;
let answerToken=0,handledToken=0,lastAnswerAt=0;
const AC=window.AudioContext||window.webkitAudioContext;
function save(){try{localStorage.setItem(KEY,JSON.stringify(settings))}catch(e){}updateQuickUI()}
function ensure(){
 if(!AC)return null;
 if(!ctx){
  ctx=new AC();master=ctx.createGain();master.gain.value=Math.max(.08,Math.min(1,Number(settings.volume)||.55));master.connect(ctx.destination);
  bgmGain=ctx.createGain();bgmGain.gain.value=.12;bgmGain.connect(master)
 }
 if(ctx.state==='suspended')ctx.resume().catch(()=>{});
 unlocked=true;return ctx
}
function tone(freq,dur=.12,when=0,type='sine',vol=.1,target=master){
 const c=ensure();if(!c||!target)return;
 const t=c.currentTime+when,o=c.createOscillator(),g=c.createGain();
 o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,vol),t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 o.connect(g);g.connect(target);o.start(t);o.stop(t+dur+.025)
}
function brightCorrect(preview=false){
 if(!preview&&!settings.effects)return;
 ensure();if(!preview)streak++;
 // 明るい「正解」らしい上昇チャイム C6-E6-G6
 tone(1046.5,.10,0,'triangle',.105);tone(1318.5,.13,.055,'sine',.09);tone(1568,.17,.115,'triangle',.075);
 if(!preview&&streak>=5)tone(2093,.16,.18,'sine',.04);
 if(!preview)showStreak()
}
function softWrong(preview=false){
 if(!preview&&!settings.effects)return;
 ensure();if(!preview)streak=0;
 // ブザーではなく、柔らかい確認音
 tone(440,.11,0,'sine',.055);tone(349.23,.15,.075,'triangle',.045)
}
function neutralSound(){if(!settings.effects)return;ensure();tone(659.25,.08,0,'sine',.035)}
function showStreak(){
 if(streak<3)return;
 let el=document.getElementById('bokiStreakToast');
 if(!el){el=document.createElement('div');el.id='bokiStreakToast';el.className='boki-streak-toast';document.body.appendChild(el)}
 el.textContent=streak>=10?`✨ ${streak}連続正解！ 絶好調！`:`✨ ${streak}連続正解！`;
 el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1050)
}
function bpm(){return Math.min(84,72+Math.min(streak,6)*2)}
const melody=[523.25,659.25,783.99,880,783.99,659.25,587.33,783.99];
function bgmNote(freq,beat){
 const c=ensure();if(!c||!bgmGain)return;
 const t=c.currentTime;
 // 軽い木琴/ベル風。低い持続音は使わない
 const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=freq;
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.032,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+Math.min(.34,beat*.56));
 o.connect(g);g.connect(bgmGain);o.start(t);o.stop(t+Math.min(.38,beat*.62));
 // 4拍ごとに明るい高音を薄く足す
 if(bgmStep%4===0){tone(freq*1.5,.22,.045,'sine',.014,bgmGain)}
}
function bgmLoop(){
 clearTimeout(bgmTimer);bgmTimer=null;
 if(!settings.bgm||!unlocked||document.hidden)return;
 const beat=60/bpm(),freq=melody[bgmStep%melody.length];bgmNote(freq,beat);bgmStep++;
 bgmTimer=setTimeout(bgmLoop,beat*1000)
}
function startBgm(){if(!settings.bgm)return;ensure();if(!bgmTimer)bgmLoop()}
function stopBgm(){clearTimeout(bgmTimer);bgmTimer=null}
function setEffects(v){settings.effects=!!v;save()}
function setBgm(v){settings.bgm=!!v;save();if(settings.bgm){ensure();startBgm()}else stopBgm()}
function setVolume(v){settings.volume=Math.max(.1,Math.min(1,Number(v)||.55));if(master&&ctx)master.gain.setTargetAtTime(settings.volume,ctx.currentTime,.03);save()}
function visible(el){if(!el)return false;const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>0&&el.getClientRects().length>0}
function classifyResult(){
 // 正誤専用の要素だけを見る。正答率や「連続正解」という通常表示は対象外。
 const wrongSelectors=['.feedback.show.bad','.feedback.bad.show','.result-banner.bad','.choice.incorrect','.choice.wrong','.wrong.show','.incorrect.show','#feedback.bad','#feedback.incorrect'];
 const correctSelectors=['.feedback.show.good','.feedback.good.show','.result-banner.good','.choice.correct','.correct.show','#feedback.good','#feedback.correct'];
 for(const s of wrongSelectors){const els=[...document.querySelectorAll(s)];if(els.some(visible))return 'wrong'}
 for(const s of correctSelectors){const els=[...document.querySelectorAll(s)];if(els.some(visible))return 'correct'}
 const feedbacks=[...document.querySelectorAll('#feedback,.feedback,.result-banner')].filter(visible);
 for(const el of feedbacks){const txt=(el.textContent||'').trim();if(/^×\s*不正解|^不正解|^×/.test(txt))return 'wrong'}
 for(const el of feedbacks){const txt=(el.textContent||'').trim();if(/^○\s*正解|^正解です|^正解！|^○/.test(txt))return 'correct'}
 return ''
}
function resolveAnswer(token,attempt=0){
 if(token!==answerToken||handledToken===token)return;
 const r=classifyResult();
 if(r){handledToken=token;if(r==='correct')brightCorrect(false);else softWrong(false);return}
 if(attempt<8)setTimeout(()=>resolveAnswer(token,attempt+1),90+attempt*35)
}
function isAnswerControl(target){
 const e=target.closest?.('button,.choice,[data-val],[data-answer],select,input');if(!e)return false;
 if(e.matches('.choice,[data-val],[data-answer]'))return true;
 const text=(e.textContent||e.value||'').trim();
 return /回答する|回答|判定|採点|分からない|わからない/.test(text)
}
function beginAnswer(target){
 if(!isAnswerControl(target))return;
 const now=Date.now();if(now-lastAnswerAt<180)return;lastAnswerAt=now;
 answerToken++;const token=answerToken;ensure();setTimeout(()=>resolveAnswer(token,0),25)
}
document.addEventListener('pointerdown',e=>{ensure();if(settings.bgm)startBgm()},{capture:true,passive:true});
document.addEventListener('click',e=>beginAnswer(e.target),{capture:true});
function injectStyles(){
 const st=document.createElement('style');st.textContent=`
.boki-audio-fab{position:fixed;right:12px;top:82px;z-index:58;width:44px;height:44px;border:1px solid #c9d8e8;border-radius:50%;background:rgba(255,255,255,.96);box-shadow:0 5px 16px rgba(25,59,98,.16);font-size:20px;display:grid;place-items:center;color:#173b67}.boki-audio-panel{position:fixed;right:12px;top:132px;z-index:59;width:min(280px,calc(100vw - 24px));background:#fff;color:#243244;border:1px solid #ccd9e7;border-radius:16px;padding:12px;box-shadow:0 12px 32px rgba(20,45,75,.22);display:none}.boki-audio-panel.show{display:block}.boki-audio-panel b{display:block;margin-bottom:8px}.boki-audio-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;border-top:1px solid #e8eef4}.boki-audio-toggle{border:1px solid #c9d6e3;background:#eef5fb;color:#173b67;border-radius:999px;padding:7px 11px;font-weight:900}.boki-audio-toggle.on{background:#176bc1;color:#fff;border-color:#176bc1}.boki-streak-toast{position:fixed;left:50%;bottom:88px;z-index:70;transform:translate(-50%,14px);opacity:0;pointer-events:none;background:#173b67;color:#fff;border-radius:999px;padding:9px 15px;font-weight:900;box-shadow:0 8px 22px rgba(0,0,0,.2);transition:.18s}.boki-streak-toast.show{opacity:1;transform:translate(-50%,0)}html[data-boki-theme="dark"] .boki-audio-fab,body[data-boki-theme="dark"] .boki-audio-fab,html[data-boki-theme="dark"] .boki-audio-panel,body[data-boki-theme="dark"] .boki-audio-panel{background:#17202b;color:#f5f7fa;border-color:#506174}.boki-audio-settings-note{margin-top:8px;font-size:.78rem;color:#637589;line-height:1.55}`;document.head.appendChild(st)
}
function quizPage(){return /^(q1|q2|q3|daily|labs)\.html$/.test((location.pathname.split('/').pop()||''))}
function updateQuickUI(){const e=document.getElementById('bokiFxToggle'),b=document.getElementById('bokiBgmToggle');if(e){e.textContent=settings.effects?'ON':'OFF';e.classList.toggle('on',settings.effects)}if(b){b.textContent=settings.bgm?'ON':'OFF';b.classList.toggle('on',settings.bgm)}const fab=document.getElementById('bokiAudioFab');if(fab)fab.textContent=settings.bgm?'🎵':'🔊'}
function addQuick(){
 if(!quizPage()||document.getElementById('bokiAudioFab'))return;
 const f=document.createElement('button');f.id='bokiAudioFab';f.className='boki-audio-fab';f.type='button';f.setAttribute('aria-label','音の設定');
 const p=document.createElement('div');p.id='bokiAudioPanel';p.className='boki-audio-panel';p.innerHTML=`<b>音の設定</b><div class="boki-audio-row"><span>🔊 効果音</span><button class="boki-audio-toggle" id="bokiFxToggle" type="button"></button></div><div class="boki-audio-row"><span>🎵 明るい集中BGM</span><button class="boki-audio-toggle" id="bokiBgmToggle" type="button"></button></div><div class="boki-audio-settings-note">正解音は明るいチャイム。不正解音は柔らかい確認音。BGMは高めのメジャー系で軽く流れます。</div>`;
 document.body.append(f,p);f.onclick=()=>{ensure();p.classList.toggle('show')};p.querySelector('#bokiFxToggle').onclick=()=>{setEffects(!settings.effects);if(settings.effects)brightCorrect(true)};p.querySelector('#bokiBgmToggle').onclick=()=>setBgm(!settings.bgm);document.addEventListener('click',e=>{if(!p.contains(e.target)&&e.target!==f)p.classList.remove('show')});updateQuickUI()
}
function addSettings(){
 if((location.pathname.split('/').pop()||'')!=='settings.html'||document.getElementById('bokiAudioSettings'))return;
 const cards=document.querySelectorAll('.u-form-card'),anchor=cards[cards.length-1];if(!anchor)return;
 const s=document.createElement('section');s.id='bokiAudioSettings';s.className='u-form-card';s.innerHTML=`<div class="u-form-card-title"><div class="u-icon">🎵</div><div><b>音・集中</b><div class="u-small">気持ちよくテンポを作る</div></div></div><div class="u-note">正解は明るい3音チャイム、不正解は柔らかい下降音です。BGMは歌詞なし・高めのメジャー系で、約72〜84BPMの範囲で緩やかに変化します。</div><div class="u-form-row"><div><b>正解・不正解の効果音</b><div class="u-small">初期値はON。</div></div><select id="audioEffects"><option value="on">ON</option><option value="off">OFF</option></select></div><div class="u-form-row"><div><b>明るい集中BGM</b><div class="u-small">初期値はOFF。学習開始後に再生できます。</div></div><select id="audioBgm"><option value="off">OFF</option><option value="on">ON</option></select></div><div class="u-form-row"><div><b>音量</b><div class="u-small">効果音とBGMの全体音量。</div></div><select id="audioVolume"><option value="0.35">小</option><option value="0.55">標準</option><option value="0.75">大</option></select></div><div class="u-actions"><button class="u-btn u-ghost" type="button" id="tryCorrect">♪ 正解音を試す</button><button class="u-btn u-ghost" type="button" id="tryWrong">♪ 不正解音を試す</button></div>`;
 anchor.parentNode.insertBefore(s,anchor);
 const fx=s.querySelector('#audioEffects'),bg=s.querySelector('#audioBgm'),v=s.querySelector('#audioVolume');fx.value=settings.effects?'on':'off';bg.value=settings.bgm?'on':'off';v.value=String(settings.volume<=.4?.35:settings.volume>=.7?.75:.55);fx.onchange=()=>setEffects(fx.value==='on');bg.onchange=()=>setBgm(bg.value==='on');v.onchange=()=>setVolume(v.value);s.querySelector('#tryCorrect').onclick=()=>brightCorrect(true);s.querySelector('#tryWrong').onclick=()=>softWrong(true)
}
function init(){injectStyles();addQuick();addSettings();updateQuickUI();if(settings.bgm)document.addEventListener('pointerdown',()=>startBgm(),{once:true,capture:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopBgm();else if(settings.bgm&&unlocked)startBgm()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.BokiAudio={get settings(){return{...settings}},setEffects,setBgm,setVolume,correct:()=>brightCorrect(true),wrong:()=>softWrong(true),neutral:neutralSound,startBgm,stopBgm};
})();
