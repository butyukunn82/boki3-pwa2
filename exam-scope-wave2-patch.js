(function(){
'use strict';
const upgrades={
 evidence:['covered','領収書・請求書を模した証ひょうから仕訳する問題まで拡張'],
 petty:['covered','定額資金前渡法・補給仕訳・小口現金出納帳の読解計算まで拡張'],
 otherdebt:['covered','貸付・返済、未収入金と売掛金の区別まで反復'],
 temporary:['covered','立替金・預り金の発生・回収・5要素まで反復'],
 gift:['covered','受取商品券の受取・精算・債権性まで反復'],
 deposit:['covered','差入保証金の仕訳と家賃等との区別まで補強'],
 'note-loan':['covered','手形貸付金・手形借入金を商品取引の手形と区別して反復'],
 erecord:['covered','発生記録・振替・決済・5要素まで専用問題を追加'],
 cashless:['covered','販売時の手数料、入金、通常の売掛金との違いまで補強'],
 returns:['covered','現金・掛けの売上返品、仕入返品、元取引からの判断まで補強'],
 asset-ledger:['covered','固定資産台帳の項目・帳簿価額計算・総勘定元帳との関係まで補強'],
 overdraft:['covered','決算振替・翌期首再振替・負債判定・総合決算まで補強'],
 stock:['covered','切手・収入印紙の貯蔵品振替・費用調整・総合決算まで補強'],
 capital:['covered','設立・増資と売上等の資金流入との区別まで補強']
};
function patch(n=0){const s=window.BOKI_SCOPE;if(!s?.topics){if(n<30)return setTimeout(()=>patch(n+1),100);return}for(const t of s.topics){const u=upgrades[t.id];if(u){t.s26=u[0];t.note=u[1]}if(t.id==='bank'){t.s26='present';t.note='複数の銀行別普通預金6問を追加。口座別管理は実装済みだが、帳簿記入のパターンをさらに増やす余地あり'}}window.dispatchEvent(new CustomEvent('boki-scope-wave2',{detail:s.audit?.('2026')}))}
patch();
})();