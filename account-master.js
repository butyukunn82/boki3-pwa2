const make=(name,element,opts={})=>({
  name,
  element,
  normalSide:opts.normalSide||(element==='資産'||element==='費用'?'借方':element==='その他'?'—':'貸方'),
  statement:opts.statement||(element==='収益'||element==='費用'?'P/L':element==='その他'?'整理用':'B/S'),
  carry:opts.carry!==undefined?opts.carry:!(element==='収益'||element==='費用'||element==='その他'),
  role:opts.role||'',
  desc:opts.desc||'',
  pair:opts.pair||'',
  difficulty:opts.difficulty||1,
  aliases:opts.aliases||[],
  official:opts.official!==false
});
/*
  2026年度（2022年度適用）の商業簿記標準・許容勘定科目表を基準に、
  3級で扱う標準科目とアプリ内で必要な経過勘定を整理。
  aliases は「問題文の指定がない場合に常に正解」という意味ではない。
  採点で許容するかは問題ごとに明示的に決める。
*/
const BOKI_ACCOUNTS=[
make("現金","資産"),
make("小口現金","資産"),
make("当座預金","資産"),
make("普通預金","資産",{"aliases":["銀行預金"]}),
make("定期預金","資産",{"aliases":["銀行預金"]}),
make("受取手形","資産"),
make("売掛金","資産",{"pair":"売上・貸倒引当金"}),
make("クレジット売掛金","資産",{"pair":"売上・支払手数料","difficulty":2}),
make("電子記録債権","資産"),
make("貸倒引当金","資産",{"normalSide":"貸方","role":"資産の控除評価勘定","desc":"売掛金などの回収不能見込額を、対象資産から控除して表示するための勘定。負債ではありません。","pair":"貸倒引当金繰入"}),
make("繰越商品","資産",{"pair":"仕入"}),
make("貸付金","資産"),
make("手形貸付金","資産",{"aliases":["貸付金"],"pair":"手形借入金","difficulty":2}),
make("従業員貸付金","資産",{"aliases":["貸付金"]}),
make("役員貸付金","資産",{"aliases":["貸付金"]}),
make("立替金","資産"),
make("従業員立替金","資産",{"aliases":["立替金"]}),
make("前払金","資産",{"aliases":["前渡金"]}),
make("未収入金","資産",{"aliases":["未収金"]}),
make("仮払金","資産"),
make("受取商品券","資産"),
make("差入保証金","資産"),
make("貯蔵品","資産"),
make("仮払消費税","資産",{"aliases":["仮払金"]}),
make("仮払法人税等","資産",{"aliases":["仮払金"]}),
make("前払費用","資産"),
make("前払保険料","資産",{"aliases":["前払費用"],"pair":"保険料"}),
make("前払家賃","資産",{"aliases":["前払費用"],"pair":"支払家賃"}),
make("未収収益","資産"),
make("未収利息","資産",{"aliases":["未収収益"],"pair":"受取利息"}),
make("未収家賃","資産",{"aliases":["未収収益"],"pair":"受取家賃"}),
make("建物","資産"),
make("建物減価償却累計額","資産",{"aliases":["減価償却累計額"],"normalSide":"貸方","role":"資産の控除評価勘定","desc":"建物について過年度を含む減価償却累計額を示し、建物の取得原価から控除して表示します。","pair":"減価償却費"}),
make("備品","資産"),
make("備品減価償却累計額","資産",{"aliases":["減価償却累計額"],"normalSide":"貸方","role":"資産の控除評価勘定","desc":"備品について過年度を含む減価償却累計額を示し、備品の取得原価から控除して表示します。","pair":"減価償却費"}),
make("車両運搬具","資産",{"aliases":["車両","運搬具"]}),
make("車両運搬具減価償却累計額","資産",{"aliases":["車両減価償却累計額","減価償却累計額"],"normalSide":"貸方","role":"資産の控除評価勘定","pair":"減価償却費"}),
make("土地","資産"),
make("支払手形","負債"),
make("買掛金","負債"),
make("電子記録債務","負債"),
make("前受金","負債"),
make("借入金","負債",{"aliases":["銀行借入金"]}),
make("役員借入金","負債",{"aliases":["借入金"]}),
make("手形借入金","負債",{"aliases":["借入金"],"pair":"手形貸付金","difficulty":2}),
make("当座借越","負債",{"aliases":["借入金"]}),
make("未払金","負債"),
make("仮受金","負債"),
make("未払費用","負債"),
make("未払利息","負債",{"aliases":["未払費用"],"pair":"支払利息"}),
make("未払給料","負債",{"aliases":["未払費用"],"pair":"給料"}),
make("未払家賃","負債",{"aliases":["未払費用"],"pair":"支払家賃"}),
make("前受収益","負債"),
make("前受家賃","負債",{"aliases":["前受収益"],"pair":"受取家賃"}),
make("前受地代","負債",{"aliases":["前受収益"],"pair":"受取地代"}),
make("預り金","負債"),
make("従業員預り金","負債",{"aliases":["預り金"]}),
make("所得税預り金","負債",{"aliases":["預り金"],"pair":"給料"}),
make("住民税預り金","負債",{"aliases":["預り金"],"pair":"給料"}),
make("社会保険料預り金","負債",{"aliases":["預り金"],"pair":"給料・法定福利費"}),
make("仮受消費税","負債",{"aliases":["仮受金"]}),
make("未払消費税","負債",{"aliases":["未払金"]}),
make("未払法人税等","負債"),
make("未払配当金","負債",{"aliases":["未払株主配当金"]}),
make("資本金","純資産"),
make("利益準備金","純資産"),
make("繰越利益剰余金","純資産",{"pair":"損益"}),
make("売上","収益"),
make("受取家賃","収益"),
make("受取地代","収益"),
make("受取手数料","収益"),
make("受取利息","収益"),
make("雑益","収益",{"aliases":["雑収入","雑収益"]}),
make("貸倒引当金戻入","収益",{"aliases":["貸倒引当金戻入益"]}),
make("償却債権取立益","収益"),
make("固定資産売却益","収益",{"aliases":["備品売却益","土地売却益","建物売却益"]}),
make("仕入","費用"),
make("売上原価","費用"),
make("発送費","費用",{"aliases":["支払運賃","発送運賃"],"pair":"仕入","difficulty":2}),
make("給料","費用",{"aliases":["給料手当","賃金給料"]}),
make("法定福利費","費用",{"aliases":["社会保険料"]}),
make("広告宣伝費","費用",{"aliases":["広告費","広告料","宣伝費"]}),
make("支払手数料","費用",{"aliases":["販売手数料"]}),
make("支払利息","費用"),
make("旅費交通費","費用",{"aliases":["旅費","交通費"]}),
make("貸倒引当金繰入","費用",{"aliases":["貸倒引当金繰入額"],"pair":"貸倒引当金"}),
make("貸倒損失","費用"),
make("減価償却費","費用",{"aliases":["建物減価償却費","備品減価償却費"],"pair":"減価償却累計額"}),
make("通信費","費用"),
make("消耗品費","費用",{"aliases":["事務用消耗品費"]}),
make("水道光熱費","費用",{"aliases":["光熱水費"]}),
make("支払家賃","費用",{"aliases":["地代家賃","支払賃借料","賃借料","支払不動産賃借料","不動産賃借料"]}),
make("支払地代","費用",{"aliases":["地代家賃","支払賃借料","賃借料","支払不動産賃借料","不動産賃借料"]}),
make("保険料","費用",{"aliases":["支払保険料","火災保険料"],"pair":"前払保険料"}),
make("租税公課","費用",{"aliases":["公租公課","固定資産税","印紙税"]}),
make("修繕費","費用",{"aliases":["支払修繕料","修繕料","修理費"]}),
make("雑費","費用"),
make("雑損","費用",{"aliases":["雑損失"]}),
make("固定資産売却損","費用",{"aliases":["備品売却損","建物売却損","土地売却損"]}),
make("保管費","費用",{"aliases":["保管料","倉庫料"]}),
make("諸会費","費用"),
make("法人税、住民税及び事業税","費用",{"aliases":["法人税等"]}),
make("法人税等","費用",{"aliases":["法人税、住民税及び事業税"]}),
make("現金過不足","その他",{"desc":"現金実査額と帳簿残高の差額について、原因が判明するまで一時的に使用する整理勘定。","difficulty":2}),
make("損益","その他",{"desc":"決算で収益・費用を集め、当期純損益を求めるための決算用勘定。","difficulty":2,"official":false})
];
const BOKI_ACCOUNT_TERMS=[];
BOKI_ACCOUNTS.forEach(x=>{
  BOKI_ACCOUNT_TERMS.push(x);
  (x.aliases||[]).forEach(a=>BOKI_ACCOUNT_TERMS.push({...x,name:a,canonical:x.name,isAlias:true}));
});
function findBokiAccount(n){
  return BOKI_ACCOUNTS.find(x=>x.name===n)||BOKI_ACCOUNT_TERMS.find(x=>x.name===n);
}
function acceptedBokiAccountNames(expected){
  const x=BOKI_ACCOUNTS.find(v=>v.name===expected);
  return x?[x.name,...(x.aliases||[])]:[expected];
}
function isAcceptedBokiAccount(expected,got,allowOfficialAliases=false){
  if(expected===got)return true;
  if(!allowOfficialAliases)return false;
  return acceptedBokiAccountNames(expected).includes(got);
}
(function(){
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(!['q1.html','daily.html'].includes(page))return;
  addEventListener('DOMContentLoaded',()=>{
    const load=src=>new Promise((resolve,reject)=>{
      if(document.querySelector(`script[data-boki-src="${src}"]`))return resolve();
      const s=document.createElement('script');
      s.src=src;s.dataset.bokiSrc=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)
    });
    load('phrase-bank.js').then(()=>load('phrase-bridge.js')).catch(()=>{})
  })
})();
