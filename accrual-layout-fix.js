(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'').toLowerCase();
if(page!=='labs.html')return;

const style=document.createElement('style');
style.id='accrual-layout-v2-style';
style.textContent=`
.accrual-colheads{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0 7px}
.accrual-colhead{border-radius:13px;padding:9px 8px;text-align:center;font-weight:950;font-size:.9rem}
.accrual-colhead.asset{background:#e8f7ec;color:#197642;border:1px solid #bfe4cb}
.accrual-colhead.liability{background:#fff1e8;color:#bc5b1d;border:1px solid #f0c7aa}
#accrualMatrix{grid-template-columns:1fr 1fr!important;gap:9px!important;margin-top:0!important}
#accrualMatrix .accrual-term-card{position:relative;min-height:118px;padding:13px 10px 12px;border-width:2px;cursor:pointer;transition:.15s ease;display:flex;flex-direction:column;justify-content:center}
#accrualMatrix .accrual-term-card strong{font-size:1rem;margin-bottom:5px}
#accrualMatrix .accrual-term-card.asset-card{background:#f4fbf6;border-color:#c8e8d1}
#accrualMatrix .accrual-term-card.liability-card{background:#fff8f3;border-color:#efd5c3}
#accrualMatrix .accrual-term-card.sel{outline:3px solid #efcc4c;background:#fff9df!important;border-color:#e0b830!important}
#accrualMatrix .accrual-term-card:active{transform:scale(.985)}
.accrual-typebadge{position:absolute;right:7px;top:7px;border-radius:999px;padding:3px 6px;font-size:.61rem;font-weight:950;line-height:1}
.asset-card .accrual-typebadge{background:#dff3e5;color:#207445}
.liability-card .accrual-typebadge{background:#ffeadc;color:#a34e1a}
.accrual-detail{margin-top:10px;border-radius:14px;padding:12px 13px;border:1px solid #d7e2eb;background:linear-gradient(135deg,#f8fbff,#fff)}
.accrual-detail-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.accrual-detail-head strong{font-size:1.02rem}.accrual-detail-head span{font-size:.67rem;border-radius:999px;padding:4px 7px;font-weight:950}
.accrual-detail.asset .accrual-detail-head span{background:#e5f5e9;color:#1d7541}
.accrual-detail.liability .accrual-detail-head span{background:#ffecdf;color:#aa511a}
.accrual-detail p{margin:4px 0;font-size:.8rem;line-height:1.65;color:#465a6f}
.accrual-detail .reason{font-weight:850;color:#243b52}
.accrual-journal{margin-top:8px;background:#eef6ff;border:1px solid #cfe0f2;border-radius:10px;padding:8px 9px;font-size:.75rem;color:#285d8c;font-weight:800;line-height:1.55}
.accrual-rule{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.accrual-rule div{border-radius:12px;padding:9px;font-size:.72rem;line-height:1.55;font-weight:800}
.accrual-rule .asset{background:#edf8f0;color:#276d43;border:1px solid #cce5d3}
.accrual-rule .liability{background:#fff4ec;color:#955023;border:1px solid #edd0bb}
#accrualTabs{grid-template-columns:1fr 1fr!important}
#accrualTabs button{min-height:50px}
@media(max-width:365px){.accrual-colheads,#accrualMatrix,.accrual-rule{grid-template-columns:1fr 1fr!important}.accrual-term-card{font-size:.88rem}}
`;
document.head.appendChild(style);

const TERM={
 '前払':{side:'asset',kind:'繰延',title:'前払 = 資産',desc:'払ったが、まだ使っていない。',reason:'将来サービスを受ける権利が残っているので資産です。',journal:'決算整理例：（借）前払費用 ／（貸）保険料など'},
 '前受':{side:'liability',kind:'繰延',title:'前受 = 負債',desc:'もらったが、まだ稼いでいない。',reason:'将来サービスを提供する義務が残っているので負債です。',journal:'決算整理例：（借）受取家賃など ／（貸）前受収益'},
 '未収':{side:'asset',kind:'見越',title:'未収 = 資産',desc:'稼いだが、まだもらっていない。',reason:'将来お金を受け取る権利があるので資産です。',journal:'決算整理例：（借）未収収益 ／（貸）受取利息など'},
 '未払':{side:'liability',kind:'見越',title:'未払 = 負債',desc:'使ったが、まだ払っていない。',reason:'将来お金を支払う義務があるので負債です。',journal:'決算整理例：（借）支払利息など ／（貸）未払費用'}
};

function textKey(el){
 const s=(el?.querySelector('strong')?.textContent||el?.textContent||'').trim();
 return ['前払','前受','未収','未払'].find(k=>s.startsWith(k))||'';
}
function findTab(tabs,key){return [...tabs.querySelectorAll('button')].find(b=>b.textContent.trim()===key)}

function enhance(){
 const root=document.getElementById('interactive');
 if(!root)return;
 const panel=[...root.querySelectorAll('.panel')].find(p=>(p.querySelector('h3')?.textContent||'').includes('4つ'));
 if(!panel)return;
 const h=panel.querySelector('h3');
 if(h)h.textContent='① 4つを「資産」と「負債」で分ける';
 const tabs=panel.querySelector('.tabs');
 const matrix=panel.querySelector('.matrix');
 if(!tabs||!matrix)return;
 tabs.id='accrualTabs';matrix.id='accrualMatrix';

 // 1行目「前払 / 前受」、2行目「未収 / 未払」へ統一
 ['前払','前受','未収','未払'].forEach(k=>{const b=findTab(tabs,k);if(b)tabs.appendChild(b)});
 const cards={};[...matrix.children].forEach(c=>{const k=textKey(c);if(k)cards[k]=c});
 ['前払','前受','未収','未払'].forEach(k=>{if(cards[k])matrix.appendChild(cards[k])});

 let heads=panel.querySelector('.accrual-colheads');
 if(!heads){
   heads=document.createElement('div');heads.className='accrual-colheads';
   heads.innerHTML='<div class="accrual-colhead asset">左列：資産</div><div class="accrual-colhead liability">右列：負債</div>';
   matrix.before(heads);
 }

 Object.entries(cards).forEach(([k,c])=>{
   const t=TERM[k];if(!t)return;
   c.classList.add('accrual-term-card',t.side==='asset'?'asset-card':'liability-card');
   c.setAttribute('role','button');c.tabIndex=0;
   if(!c.querySelector('.accrual-typebadge')){const b=document.createElement('span');b.className='accrual-typebadge';b.textContent=t.kind;c.appendChild(b)}
   const act=()=>{const b=findTab(tabs,k);if(b)b.click()};
   c.onclick=act;c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}};
 });

 const active=[...matrix.children].find(c=>c.classList.contains('sel'))||cards['前払'];
 const key=textKey(active),t=TERM[key]||TERM['前払'];
 let detail=panel.querySelector('.accrual-detail');
 if(!detail){detail=document.createElement('div');matrix.after(detail)}
 detail.className='accrual-detail '+t.side;
 detail.innerHTML=`<div class="accrual-detail-head"><strong>${t.title}</strong><span>${t.kind}</span></div><p>${t.desc}</p><p class="reason">${t.reason}</p><div class="accrual-journal">${t.journal}</div>`;

 let rule=panel.querySelector('.accrual-rule');
 if(!rule){rule=document.createElement('div');rule.className='accrual-rule';detail.after(rule)}
 rule.innerHTML='<div class="asset"><b>資産の仲間</b><br>前払・未収<br>→ これから使える／もらえる</div><div class="liability"><b>負債の仲間</b><br>前受・未払<br>→ これから提供する／払う</div>';
}

function patchQuiz(){
 try{
  if(typeof defs!=='undefined'&&defs.accrual){
   defs.accrual.qs=[
    ['経過勘定のうち、資産になる組合せは？','前払費用・未収収益',['前払費用・未収収益','前受収益・未払費用','前払費用・未払費用','前受収益・未収収益'],'前払は将来使える価値、未収は将来受け取る権利なので、どちらも資産です。'],
    ['経過勘定のうち、負債になる組合せは？','前受収益・未払費用',['前受収益・未払費用','前払費用・未収収益','前受収益・未収収益','前払費用・未払費用'],'前受は将来サービスを提供する義務、未払は将来支払う義務なので、どちらも負債です。'],
    ['「稼いだが、まだもらっていない」に当てはまるのは？','未収収益（資産）',['未収収益（資産）','未払費用（負債）','前受収益（負債）','前払費用（資産）'],'すでに当期の収益ですが、将来受け取る権利が残るため未収収益は資産です。']
   ];
  }
 }catch(e){}
}

function boot(){
 patchQuiz();
 const original=window.accrual;
 if(typeof original==='function'&&!original.__assetLiabilityLayout){
   const wrapped=function(){const r=original.apply(this,arguments);enhance();return r};
   wrapped.__assetLiabilityLayout=true;window.accrual=wrapped;
 }
 if(new URLSearchParams(location.search).get('lab')==='accrual'){
   if(typeof window.accrual==='function')window.accrual();else setTimeout(enhance,80);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));else setTimeout(boot,0);
})();
