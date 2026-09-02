(function(){
'use strict';
const KEY='boki3_exam_scope_year_v1';
const today=new Date();
const defaultYear=today>=new Date('2027-04-01T00:00:00')?'2027':'2026';
const level={covered:{label:'◎ 十分',score:1,cls:'covered'},present:{label:'○ あり',score:.8,cls:'present'},partial:{label:'△ 薄い',score:.45,cls:'partial'},missing:{label:'× 不足',score:0,cls:'missing'},legacy:{label:'対象外',score:null,cls:'legacy'}};
const T=[
 ['basic','簿記の基本原理','基礎','covered','covered','5要素・借貸・仕訳・貸借一致・P/L/B/Sの関係'],
 ['books','主要簿・総勘定元帳・転記','帳簿','covered','covered','仕訳→元帳→試算表の流れを実装'],
 ['evidence','証ひょう','帳簿','missing','missing','領収書・請求書・納品書等から処理を判断する演習が不足'],
 ['voucher','入金・出金・振替伝票と集計','帳簿','covered','covered','伝票会計・仕訳日計表を実装'],
 ['cash','現金・現金過不足','現金預金','covered','covered','通常取引から決算整理まであり'],
 ['bank','普通預金・当座預金・預貯金','現金預金','present','covered','普通預金は多用。複数口座管理は薄い'],
 ['petty','小口現金・小口現金出納帳','現金預金','partial','partial','帳簿名・基本はあるが補給と記帳の反復が薄い'],
 ['arap','売掛金・買掛金・補助元帳','債権債務','covered','covered','仕訳・元帳・補助簿判定あり'],
 ['erecord','電子記録債権・電子記録債務','債権債務','present','present','発生記録はあるが営業外取引などの幅を増やしたい'],
 ['cashless','クレジット売掛金・キャッシュレス決済','債権債務','partial','partial','勘定科目はあるが手数料を含む取引演習が薄い'],
 ['otherdebt','貸付金・借入金・未収入金・未払金','債権債務','present','present','借入・未払金は強い。未収入金・貸付金が薄い'],
 ['advance','前払金・前受金','債権債務','covered','covered','通常取引と経過勘定を区別して練習'],
 ['temporary','立替金・預り金・仮払金・仮受金','債権債務','present','present','仮勘定は強いが立替金・預り金の取引数が少ない'],
 ['gift','受取商品券','債権債務','missing','missing','代表仕訳を追加すべき論点'],
 ['deposit','差入保証金（簡易）','債権債務','partial','partial','科目・代表取引が不足'],
 ['notes','紙の手形・小切手','手形','covered','legacy','2026年度対象。2027年度から紙媒体関連は削除'],
 ['allowance','貸倒引当金','引当金','covered','covered','必要額・差額補充・P/L/B/Sまで厚い'],
 ['threeway','商品売買・3分法','商品売買','covered','covered','現金・掛け・諸掛を含む'],
 ['returns','仕入返品・売上返品','商品売買','partial','partial','返品を独立論点として反復する問題が少ない'],
 ['cogs-sale','販売のつど売上原価へ振替','商品売買','legacy','missing','2027年度から3級へ移行。新規実装が必要'],
 ['salesbooks','仕入帳・売上帳','商品売買','covered','covered','補助簿判定と実帳簿サンプルあり'],
 ['inventory','商品有高帳・先入先出法・移動平均法','商品売買','covered','covered','計算問題を多数実装'],
 ['fixed-buy','有形固定資産の取得','固定資産','covered','covered','備品等の取得仕訳あり'],
 ['fixed-sale','有形固定資産の売却','固定資産','covered','covered','期中売却ラボを含む'],
 ['fixed-dispose','有形固定資産の除却・廃棄','固定資産','legacy','missing','2027年度から3級へ移行。新規実装が必要'],
 ['dep-straight','減価償却・定額法・間接法','固定資産','covered','covered','月割り・累計額・帳簿価額まであり'],
 ['dep-decline','減価償却・定率法（基本）','固定資産','legacy','missing','2027年度から簡易な定率法が3級へ移行'],
 ['asset-ledger','固定資産台帳','固定資産','present','present','帳簿名と読解はあるが記入演習は薄い'],
 ['expenses','収益・費用の主要科目','収益費用','covered','covered','給料・福利費・通信費・家賃・利息等を実装'],
 ['tax-property','固定資産税など','税金','covered','covered','租税公課として実装'],
 ['tax-corp','法人税・住民税・事業税（簡易）','税金','covered','covered','法人税等・未払法人税等を実装'],
 ['tax-vat','消費税・税抜方式','税金','covered','covered','仮払・仮受・未払消費税を実装'],
 ['errors','未処理取引・誤謬の訂正','訂正','covered','covered','訂正ラボ・未処理取引あり'],
 ['trial','試算表の作成・読解','決算','covered','covered','残高試算表・元帳との接続あり'],
 ['worksheet','8桁精算表','決算','covered','covered','ミニ表から総合まであり'],
 ['overdraft','当座借越の決算振替','決算','partial','partial','用語説明中心で問題数が少ない'],
 ['stocktake','商品棚卸・売上原価','決算','covered','covered','計算・仕訳・総合問題あり'],
 ['supplies-stock','貯蔵品棚卸','決算','partial','partial','科目はあるが決算整理問題が薄い'],
 ['accruals','前払・前受・未払・未収','決算','covered','covered','時間軸ラボ・仕訳・計算あり'],
 ['closing','損益振替・繰越・帳簿締切','決算','covered','covered','締切・再振替・繰越を実装'],
 ['statements','損益計算書・貸借対照表の作成','決算','covered','covered','総合問題とP/L・B/S振分けあり'],
 ['capital','株式会社の設立・増資','株式会社会計','partial','partial','設立・資本金はあるが増資の反復が薄い']
].map(([id,name,area,s26,s27,note])=>({id,name,area,s26,s27,note}));
function getYear(){return localStorage.getItem(KEY)||defaultYear}
function setYear(y){if(y==='2026'||y==='2027'){localStorage.setItem(KEY,y);window.dispatchEvent(new CustomEvent('boki-scope-change',{detail:{year:y}}))}}
function status(t,y=getYear()){return level[y==='2027'?t.s27:t.s26]||level.missing}
function activeTopics(y=getYear()){return T.filter(t=>status(t,y).score!==null)}
function audit(y=getYear()){
 const xs=activeTopics(y),full=xs.filter(t=>status(t,y).score===1).length,present=xs.filter(t=>status(t,y).score===.8).length,partial=xs.filter(t=>status(t,y).score===.45).length,missing=xs.filter(t=>status(t,y).score===0).length;
 const score=xs.length?Math.round(xs.reduce((a,t)=>a+status(t,y).score,0)/xs.length*100):0;
 return{year:y,total:xs.length,full,present,partial,missing,score,topics:xs};
}
function css(){if(document.getElementById('scope-audit-css'))return;const s=document.createElement('style');s.id='scope-audit-css';s.textContent=`
.scope-audit{background:#fff;border:1px solid #d9e3ed;border-radius:18px;padding:14px;margin:13px 0;box-shadow:0 6px 20px rgba(30,60,90,.06)}.scope-audit-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.scope-audit h3{margin:0;color:#173b67}.scope-audit small{color:#6d7e90}.scope-year{border:1px solid #cbd7e3;border-radius:10px;background:#fff;padding:8px;font-weight:800}.scope-score{display:grid;grid-template-columns:82px 1fr;gap:11px;align-items:center;margin-top:12px}.scope-ring{width:78px;height:78px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#2d8f60 var(--p),#edf1f5 0);position:relative}.scope-ring:after{content:"";position:absolute;inset:8px;border-radius:50%;background:#fff}.scope-ring b{z-index:1;color:#173b67;font-size:1.05rem}.scope-counts{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}.scope-counts span{border-radius:9px;padding:6px 8px;font-size:.72rem;font-weight:800}.scope-counts .c1{background:#eaf8ef;color:#217044}.scope-counts .c2{background:#eaf3ff;color:#235f98}.scope-counts .c3{background:#fff5d8;color:#785c11}.scope-counts .c4{background:#fff0f0;color:#a23e3e}.scope-toggle{margin-top:10px;width:100%;border:1px solid #cbd7e3;background:#f7faff;color:#28577f;border-radius:10px;min-height:42px;font-weight:900}.scope-list{display:none;margin-top:10px}.scope-list.show{display:block}.scope-area{margin:10px 0 5px;font-weight:900;color:#435a72}.scope-row{display:grid;grid-template-columns:1fr auto;gap:8px;border-top:1px solid #edf1f5;padding:8px 2px}.scope-row b{font-size:.8rem}.scope-row small{display:block;margin-top:2px;line-height:1.35}.scope-badge{align-self:start;white-space:nowrap;border-radius:999px;padding:4px 7px;font-size:.68rem;font-weight:900}.scope-badge.covered{background:#eaf8ef;color:#217044}.scope-badge.present{background:#eaf3ff;color:#235f98}.scope-badge.partial{background:#fff5d8;color:#785c11}.scope-badge.missing{background:#fff0f0;color:#a23e3e}.scope-source{margin-top:9px;font-size:.68rem;color:#75869a;line-height:1.5}@media(max-width:420px){.scope-audit-head{flex-direction:column}.scope-year{width:100%}.scope-score{grid-template-columns:72px 1fr}.scope-ring{width:68px;height:68px}.scope-counts{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(s)}
function mount(){if((location.pathname.split('/').pop()||'').toLowerCase()!=='questions.html')return;if(document.getElementById('scopeAudit'))return;css();const anchor=document.querySelector('.progress-box')||document.querySelector('.hero')||document.querySelector('main');if(!anchor)return;const box=document.createElement('section');box.id='scopeAudit';box.className='scope-audit';anchor.insertAdjacentElement('afterend',box);draw(box)}
function draw(box=document.getElementById('scopeAudit')){if(!box)return;const a=audit(),areas=[...new Set(a.topics.map(t=>t.area))];box.innerHTML=`<div class="scope-audit-head"><div><h3>公式出題範囲との照合</h3><small>問題名があるだけでなく、説明・演習の厚みまで監査</small></div><select class="scope-year" aria-label="受験年度"><option value="2026" ${a.year==='2026'?'selected':''}>2026年度（～2027/3/31）</option><option value="2027" ${a.year==='2027'?'selected':''}>2027年度（2027/4/1～）</option></select></div><div class="scope-score"><div class="scope-ring" style="--p:${a.score}%"><b>${a.score}%</b></div><div class="scope-counts"><span class="c1">◎ 十分 ${a.full}</span><span class="c2">○ あり ${a.present}</span><span class="c3">△ 薄い ${a.partial}</span><span class="c4">× 不足 ${a.missing}</span></div></div><button class="scope-toggle" type="button">論点別の監査結果を見る</button><div class="scope-list">${areas.map(area=>`<div class="scope-area">${area}</div>${a.topics.filter(t=>t.area===area).map(t=>{const s=status(t,a.year);return `<div class="scope-row"><div><b>${t.name}</b><small>${t.note}</small></div><span class="scope-badge ${s.cls}">${s.label}</span></div>`}).join('')}`).join('')}<div class="scope-source">基準：日本商工会議所「商工会議所簿記検定試験出題区分表」。2026年度は2022年度版、2027年度は2026年7月31日確定版を基準に監査しています。公式サンプル問題は転載せず、論点・形式の確認にのみ使用します。</div></div>`;
 box.querySelector('.scope-year').onchange=e=>{setYear(e.target.value);draw(box)};box.querySelector('.scope-toggle').onclick=e=>{const l=box.querySelector('.scope-list');l.classList.toggle('show');e.currentTarget.textContent=l.classList.contains('show')?'監査結果を閉じる':'論点別の監査結果を見る'};
}
window.BOKI_SCOPE={topics:T,getYear,setYear,status,audit,levels:level};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,350),{once:true});else setTimeout(mount,350);
})();