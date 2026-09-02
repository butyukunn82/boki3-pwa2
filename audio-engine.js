(function(){
'use strict';
const KEY='boki3_audio_settings_v1';
const defaults={effects:true,bgm:false,volume:.55};
let settings={...defaults};
try{settings={...settings,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){}
let ctx=null,master=null,bgmGain=null,bgmTimer=null,bgmStep=0,streak=0,unlocked=false,lastResultAt=0,lastResult='',answerIntentAt=0;
const AC=window.AudioContext||window.webkitAudioContext;
function save(){try{localStorage.setItem(KEY,JSON.stringify(settings))}catch(e){} updateQuickUI()}
function ensure(){
 if(!AC)return null;
 if(!ctx){ctx=new AC();master=ctx.createGain();master.gain.value=Math.max(.08,Math.min(1,Number(settings.volume)||.55));master.connect(ctx.destination);bgmGain=ctx.createGain();bgmGain.gain.value=.16;bgmGain.connect(master)}
 if(ctx.state==='suspended')ctx.resume().catch(()=>{});
 unlocked=true;
 return ctx;
}
function tone(freq,dur=.12,when=0,type='sine',vol=.12){
 const c=ensure();if(!c)return;
 const t=c.currentTime+when,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,vol),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.03)
}
function sparkle(level){
 const root=level>=10?659.25:level>=5?587.33:523.25;
 tone(root,.13,0,'sine',.09);tone(root*1.25,.16,.07,'triangle',.075);tone(root*1.5,.2,.14,'sine',.06)
}
function correctSound(force=false){
 if(!force&&!settings.effects)return;
 ensure();streak++;
 const shift=Math.min(streak,6)*8;
 tone(523.25+shift,.105,0,'sine',.11);tone(659.25+shift,.14,.065,'triangle',.09);
 if(streak>=3)tone(783.99+shift,.16,.13,'sine',.065);
 if([3,5,10].includes(streak))setTimeout(()=>sparkle(streak),90);
 showStreak();
}
function wrongSound(force=false){
 if(!force&&!settings.effects)return;
 ensure();streak=0;
 tone(349.23,.10,0,'sine',.055);tone(311.13,.13,.075,'triangle',.045)
}
function neutralSound(){if(!settings.effects)return;ensure();tone(440,.09,0,'sine',.045)}
function showStreak(){
 if(streak<3)return;
 let el=document.getElementById('bokiStreakToast');
 if(!el){el=document.createElement('div');el.id='bokiStreakToast';el.className='boki-streak-toast';document.body.appendChild(el)}
 el.textContent=streak>=10?`✨ ${streak}連続正解！ すごい！`:`✨ ${streak}連続正解！`;
 el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1200)
}
function bpm(){return Math.min(76,64+Math.min(streak,6)*2)}
const scale=[261.63,329.63,392,440,523.25,440,392,329.63];
function bgmNote(freq,beat){
 if(!ctx||!bgmGain)return;const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='sine';o.frequency.value=freq;f.type='lowpass';f.frequency.value=1100;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.035,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+Math.min(.8,beat*.85));o.connect(f);f.connect(g);g.connect(bgmGain);o.start(t);o.stop(t+Math.min(.85,beat*.9));
 if(bgmStep%4===0){const p=ctx.createOscillator(),pg=ctx.createGain();p.type='triangle';p.frequency.value=freq/2;pg.gain.setValueAtTime(.0001,t);pg.gain.exponentialRampToValueAtTime(.018,t+.15);pg.gain.exponentialRampToValueAtTime(.0001,t+beat*2.8);p.connect(pg);pg.connect(bgmGain);p.start(t);p.stop(t+beat*3)}
}
function bgmLoop(){
 clearTimeout(bgmTimer);if(!settings.bgm||!unlocked||document.hidden)return;
 ensure();const beat=60/bpm(),freq=scale[bgmStep%scale.length];bgmNote(freq,beat);bgmStep++;bgmTimer=setTimeout(bgmLoop,beat*1000)
}
function startBgm(){if(!settings.bgm)return;ensure();if(!bgmTimer)bgmLoop()}
function stopBgm(){clearTimeout(bgmTimer);bgmTimer=null}
function setEffects(v){settings.effects=!!v;save()}
function setBgm(v){settings.bgm=!!v;save();if(settings.bgm){ensure();startBgm()}else stopBgm()}
function setVolume(v){settings.volume=Math.max(.1,Math.min(1,Number(v)||.55));if(master)master.gain.setTargetAtTime(settings.volume,ctx.currentTime,.03);save()}
function resultFrom(root){
 const el=root&&root.nodeType===1?root:null;if(!el)return '';
 let scope=el.closest?.('.qcard,.question-card,#quizCard,.u-card,.panel,main')||el;
 if(scope.querySelector?.('.wrong,.incorrect,.feedback.bad,.result-banner.bad'))return 'wrong';
 const txt=(el.textContent||'').slice(0,700);
 if(/×\s*不正解|不正解|間違|誤り/.test(txt))return 'wrong';
 if(scope.querySelector?.('.feedback.good,.result-banner.good'))return 'correct';
 if(/○\s*正解|正解です|正解！|正解$/.test(txt.trim()))return 'correct';
 return ''
}
function maybePlay(root){
 if(Date.now()-answerIntentAt>2600)return;
 const r=resultFrom(root);if(!r)return;
 const now=Date.now();if(r===lastResult&&now-lastResultAt<650)return;lastResult=r;lastResultAt=now;
 if(r==='correct')correctSound();else wrongSound()
}
function answerish(t){
 const e=t.closest?.('button,.choice,[data-val],[data-answer],select,input');if(!e)return false;
 const text=(e.textContent||e.value||'').trim();
 if(e.matches('.choice,[data-val],[data-answer]'))return true;
 return /回答|判定|採点|分からない|わからない/.test(text)
}
document.addEventListener('pointerdown',e=>{ensure();if(answerish(e.target))answerIntentAt=Date.now();if(settings.bgm)startBgm()},{capture:true,passive:true});
document.addEventListener('click',e=>{if(answerish(e.target))answerIntentAt=Date.now()},{capture:true});
const obs=new MutationObserver(ms=>{for(const m of ms){if(m.type==='attributes'){maybePlay(m.target)}else{for(const n of m.addedNodes)maybePlay(n)}}});
function observe(){if(document.body)obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})}
function injectStyles(){
 const st=document.createElement('style');st.textContent=`
.boki-audio-fab{position:fixed;right:12px;top:82px;z-index:58;width:44px;height:44px;border:1px solid #c9d8e8;border-radius:50%;background:rgba(255,255,255,.96);box-shadow:0 5px 16px rgba(25,59,98,.16);font-size:20px;display:grid;place-items:center;color:#173b67}
.boki-audio-panel{position:fixed;right:12px;top:132px;z-index:59;width:min(280px,calc(100vw - 24px));background:#fff;color:#243244;border:1px solid #ccd9e7;border-radius:16px;padding:12px;box-shadow:0 12px 32px rgba(20,45,75,.22);display:none}.boki-audio-panel.show{display:block}.boki-audio-panel b{display:block;margin-bottom:8px}.boki-audio-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;border-top:1px solid #e8eef4}.boki-audio-toggle{border:1px solid #c9d6e3;background:#eef5fb;color:#173b67;border-radius:999px;padding:7px 11px;font-weight:900}.boki-audio-toggle.on{background:#176bc1;color:#fff;border-color:#176bc1}.boki-streak-toast{position:fixed;left:50%;bottom:88px;z-index:70;transform:translate(-50%,14px);opacity:0;pointer-events:none;background:#173b67;color:#fff;border-radius:999px;padding:9px 15px;font-weight:900;box-shadow:0 8px 22px rgba(0,0,0,.2);transition:.18s}.boki-streak-toast.show{opacity:1;transform:translate(-50%,0)}
html[data-boki-theme="dark"] .boki-audio-fab,body[data-boki-theme="dark"] .boki-audio-fab,html[data-boki-theme="dark"] .boki-audio-panel,body[data-boki-theme="dark"] .boki-audio-panel{background:#17202b;color:#f5f7fa;border-color:#506174}.boki-audio-settings-note{margin-top:8px;font-size:.78rem;color:#637589;line-height:1.55}`;document.head.appendChild(st)
}
function quizPage(){return /^(q1|q2|q3|daily|labs)\.html$/.test((location.pathname.split('/').pop()||''))}
function updateQuickUI(){
 const e=document.getElementById('bokiFxToggle'),b=document.getElementById('bokiBgmToggle');if(e){e.textContent=settings.effects?'ON':'OFF';e.classList.toggle('on',settings.effects)}if(b){b.textContent=settings.bgm?'ON':'OFF';b.classList.toggle('on',settings.bgm)}
 const fab=document.getElementById('bokiAudioFab');if(fab)fab.textContent=settings.bgm?'🎵':'🔊'
}
function addQuick(){
 if(!quizPage()||document.getElementById('bokiAudioFab'))return;
 const f=document.createElement('button');f.id='bokiAudioFab';f.className='boki-audio-fab';f.type='button';f.setAttribute('aria-label','音の設定');
 const p=document.createElement('div');p.id='bokiAudioPanel';p.className='boki-audio-panel';p.innerHTML=`<b>音の設定</b><div class="boki-audio-row"><span>🔊 効果音</span><button class="boki-audio-toggle" id="bokiFxToggle" type="button"></button></div><div class="boki-audio-row"><span>🎵 リラックスBGM</span><button class="boki-audio-toggle" id="bokiBgmToggle" type="button"></button></div><div class="boki-audio-settings-note">連続正解すると正解音とBGMのテンポが少しずつ上がります。BGMは低音量です。</div>`;
 document.body.append(f,p);f.onclick=()=>{ensure();p.classList.toggle('show')};p.querySelector('#bokiFxToggle').onclick=()=>{setEffects(!settings.effects);if(settings.effects)correctSound(true)};p.querySelector('#bokiBgmToggle').onclick=()=>setBgm(!settings.bgm);document.addEventListener('click',e=>{if(!p.contains(e.target)&&e.target!==f)p.classList.remove('show')});updateQuickUI()
}
function addSettings(){
 if((location.pathname.split('/').pop()||'')!=='settings.html'||document.getElementById('bokiAudioSettings'))return;
 const cards=document.querySelectorAll('.u-form-card'),anchor=cards[cards.length-1];if(!anchor)return;
 const s=document.createElement('section');s.id='bokiAudioSettings';s.className='u-form-card';s.innerHTML=`<div class="u-form-card-title"><div class="u-icon">🎵</div><div><b>音・集中</b><div class="u-small">気持ちよくテンポを作る</div></div></div><div class="u-note">正解は短い上昇音、不正解は柔らかい確認音です。連続正解では少しずつ華やかになります。BGMは歌詞なし・低音量で、連続正解に合わせて約64〜76BPMの範囲で緩やかに変化します。</div><div class="u-form-row"><div><b>正解・不正解の効果音</b><div class="u-small">初期値はON。嫌なブザー音は使いません。</div></div><select id="audioEffects"><option value="on">ON</option><option value="off">OFF</option></select></div><div class="u-form-row"><div><b>リラックスBGM</b><div class="u-small">初期値はOFF。学習開始後に再生できます。</div></div><select id="audioBgm"><option value="off">OFF</option><option value="on">ON</option></select></div><div class="u-form-row"><div><b>音量</b><div class="u-small">効果音とBGMの全体音量。</div></div><select id="audioVolume"><option value="0.35">小</option><option value="0.55">標準</option><option value="0.75">大</option></select></div><div class="u-actions"><button class="u-btn u-ghost" type="button" id="tryCorrect">♪ 正解音を試す</button><button class="u-btn u-ghost" type="button" id="tryWrong">♪ 不正解音を試す</button></div>`;
 anchor.parentNode.insertBefore(s,anchor);
 const fx=s.querySelector('#audioEffects'),bg=s.querySelector('#audioBgm'),v=s.querySelector('#audioVolume');fx.value=settings.effects?'on':'off';bg.value=settings.bgm?'on':'off';v.value=String(settings.volume<=.4?.35:settings.volume>=.7?.75:.55);fx.onchange=()=>setEffects(fx.value==='on');bg.onchange=()=>setBgm(bg.value==='on');v.onchange=()=>setVolume(v.value);s.querySelector('#tryCorrect').onclick=()=>{streak=Math.max(streak,2);correctSound(true)};s.querySelector('#tryWrong').onclick=()=>wrongSound(true)
}
function init(){injectStyles();observe();addQuick();addSettings();updateQuickUI();if(settings.bgm)document.addEventListener('pointerdown',()=>startBgm(),{once:true,capture:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopBgm();else if(settings.bgm&&unlocked)startBgm()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.BokiAudio={get settings(){return{...settings}},setEffects,setBgm,setVolume,correct:()=>correctSound(true),wrong:()=>wrongSound(true),neutral:neutralSound,startBgm,stopBgm};
})();
