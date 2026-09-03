(function(){
'use strict';
function patch(n=0){const s=window.BOKI_SCOPE;if(!s?.topics){if(n<35)return setTimeout(()=>patch(n+1),100);return}const bank=s.topics.find(t=>t.id==='bank');if(bank){bank.s26='covered';bank.note='銀行別普通預金の残高追跡、口座間振替、入金後残高まで実戦連結で補強'}const evidence=s.topics.find(t=>t.id==='evidence');if(evidence)evidence.note='領収書・請求書を読み、仕訳→補助簿→支払まで連続処理する実戦問題を追加';const petty=s.topics.find(t=>t.id==='petty');if(petty)petty.note='小口現金出納帳の集計→残高→補給仕訳→補給後残高まで連続処理';window.dispatchEvent(new CustomEvent('boki-scope-wave3',{detail:s.audit?.('2026')}))}
patch();
})();