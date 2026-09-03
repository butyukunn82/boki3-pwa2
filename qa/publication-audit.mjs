import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ok=(cond,msg)=>assert.ok(cond,msg);

console.log('1. JavaScript syntax');
for(const name of fs.readdirSync(root).filter(x=>x.endsWith('.js'))){
  execFileSync(process.execPath,['--check',path.join(root,name)],{stdio:'pipe'});
}

console.log('2. PWA cache integrity');
const sw=read('sw.js');
ok(!/\.navigate\s*\(/.test(sw),'Service Worker must not force-navigate open study/exam pages');
const assetMatch=sw.match(/const ASSETS=(\[[\s\S]*?\]);/);
ok(assetMatch,'ASSETS list was not found in sw.js');
const assets=vm.runInNewContext(assetMatch[1]);
for(const a of assets){
  if(a==='./')continue;
  const rel=a.replace(/^\.\//,'').split('?')[0];
  ok(fs.existsSync(path.join(root,rel)),`Cached asset does not exist: ${a}`);
}
ok(assets.includes('./about.html'),'about.html must be available offline');
ok(assets.includes('./public-info-v1.js'),'public-info-v1.js must be cached');

console.log('3. Public information');
const about=read('about.html');
for(const phrase of ['個人制作・非公式教材','公式教材ではありません','プライバシー・学習データ','試験合格、得点、学習効果を保証するものではありません','GitHub Issues']){
  ok(about.includes(phrase),`about.html is missing: ${phrase}`);
}
const publicInfo=read('public-info-v1.js');
ok(publicInfo.includes('非公式学習アプリ'),'Global unofficial notice is missing');

console.log('4. Grade 3 account master and aliases');
const accountCode=read('account-master.js')+'\n;globalThis.__audit={accounts:BOKI_ACCOUNTS,accept:isAcceptedBokiAccount,find:findBokiAccount};';
const accountCtx={console,location:{pathname:'/qa-audit'},addEventListener(){},document:{querySelector(){return null},body:{appendChild(){}}},Promise};
vm.createContext(accountCtx);vm.runInContext(accountCode,accountCtx);
const {accounts,accept}=accountCtx.__audit;
const names=new Set(accounts.map(x=>x.name));
const required=['現金','小口現金','当座預金','普通預金','定期預金','受取手形','売掛金','クレジット売掛金','電子記録債権','貸倒引当金','繰越商品','貸付金','立替金','前払金','未収入金','仮払金','受取商品券','差入保証金','貯蔵品','仮払消費税','仮払法人税等','建物','備品','車両運搬具','土地','支払手形','買掛金','電子記録債務','前受金','借入金','当座借越','未払金','仮受金','未払費用','前受収益','預り金','所得税預り金','住民税預り金','社会保険料預り金','仮受消費税','未払消費税','未払法人税等','未払配当金','資本金','利益準備金','繰越利益剰余金','売上','受取家賃','受取地代','受取手数料','受取利息','雑益','貸倒引当金戻入','償却債権取立益','固定資産売却益','仕入','売上原価','発送費','給料','法定福利費','広告宣伝費','支払手数料','支払利息','旅費交通費','貸倒引当金繰入','貸倒損失','減価償却費','通信費','消耗品費','水道光熱費','支払家賃','支払地代','保険料','租税公課','修繕費','雑費','雑損','固定資産売却損','保管費','諸会費','法人税、住民税及び事業税','現金過不足'];
for(const n of required)ok(names.has(n),`Grade 3 account missing: ${n}`);
ok(accept('普通預金','銀行預金',true),'銀行預金 alias missing');
ok(accept('未収入金','未収金',true),'未収金 alias missing');
ok(accept('給料','給料手当',true),'給料手当 alias missing');
ok(accept('法定福利費','社会保険料',true),'社会保険料 alias missing');
ok(accept('支払家賃','地代家賃',true),'地代家賃 alias missing');
ok(accept('租税公課','公租公課',true),'公租公課 alias missing');
ok(!accept('給料','給料手当',false),'Aliases must not be accepted unless a question explicitly allows them');

console.log('5. Original Q2 interest scenario');
const q2ctx={console,builders:{},state:null,inputHtml:()=>'',selectHtml:()=>'',theoryHtml:()=>'',Y:n=>String(n)};
vm.createContext(q2ctx);vm.runInContext(read('q2-originality-v2.js'),q2ctx);
ok(typeof q2ctx.builders.interest==='function','Original Q2 interest builder is missing');
q2ctx.builders.interest();
const a=q2ctx.state.ans;
assert.equal(a.intOpenN,36000);assert.equal(a.intBankN,72000);assert.equal(a.intAccN,48000);assert.equal(a.intCloseN,84000);
assert.equal(a.intOpenN+a.intCloseN,a.intBankN+a.intAccN,'受取利息 ledger does not balance');
assert.equal(a.arOpenN+a.arNewN,a.arReverseN+a.arCarryN,'未収利息 ledger does not balance');
const q2text=read('q2-originality-v2.js');
ok(q2text.includes('前期10月1日')&&q2text.includes('当期12月1日'),'Original interest chronology changed unexpectedly');

console.log('6. Original Q3 comprehensive scenario');
const noop=()=>{};
const q3ctx={console,make:noop,gradeAll:noop,pick:a=>a[0],mode:'comprehensive',p:null,common:{innerHTML:''},answerArea:{innerHTML:''},result:{classList:{remove:noop,add:noop},scrollIntoView:noop},window:{scrollTo:noop},document:{querySelectorAll:()=>[]},score:{textContent:''},summary:{textContent:''},explain:{innerHTML:''},localStorage:{getItem:()=>null,setItem:noop},Y:n=>String(n)};
vm.createContext(q3ctx);vm.runInContext(read('q3-originality-v2.js'),q3ctx);
q3ctx.make();
const x=q3ctx.p.ox;
assert.equal(x.assets,x.le,'Original Q3: assets do not equal liabilities + equity');
assert.equal(x.assets,7155100,'Original Q3 total changed without audit update');
assert.equal(x.cogs,3940000);assert.equal(x.bad,6400);assert.equal(x.dep,250000);assert.equal(x.pretax,1261100);assert.equal(x.tax,378330);assert.equal(x.net,882770);
const q3text=read('q3-originality-v2.js');
for(const risky of ['仮払消費税','通信費1,500円','商品20,000円（税抜）'])ok(!q3text.includes(risky),`Old sample-like Q3 pattern returned: ${risky}`);

console.log('7. Publication policy');
const policy=read('CONTENT_AUDIT.md');
for(const phrase of ['数値だけを変更','資産合計＝負債・純資産合計','強制再読み込みしない'])ok(policy.includes(phrase),`CONTENT_AUDIT.md is missing rule: ${phrase}`);

console.log('Publication audit: PASS');
