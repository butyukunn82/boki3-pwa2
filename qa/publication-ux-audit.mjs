import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ok=(cond,msg)=>assert.ok(cond,msg);

console.log('UX 1. Learning progression');
const loader=read('learning-map-nav.js');
ok(loader.includes("['q1.html','q2.html','q3.html']"),'CBT launch must cover Q1-Q3');
ok(loader.includes('第1問　仕上げ：本番形式で解く'),'Q1 CBT finish-step label is missing');
ok(loader.includes('第2問　仕上げ：本番形式で解く'),'Q2 CBT finish-step label is missing');
ok(loader.includes('第3問　仕上げ：本番形式で解く'),'Q3 CBT finish-step label is missing');
ok(loader.includes("loadAddon('publication-ux-v1','publication-ux-v1.js')"),'Publication UX script is not loaded');
ok(loader.includes("daily.insertAdjacentElement('afterend',box)"),'CBT finish card should follow the recommended practice card when available');

console.log('UX 2. Q1 recommendation consistency');
const ux=read('publication-ux-v1.js');
ok(ux.includes("kind==='basic'")&&ux.includes('session.list.slice(0,10)'),'Q1 recommended 10-question session fix is missing');
const q1=read('q1.html');
ok(q1.includes('5要素分類を10問'),'Q1 recommended card must promise 10 questions');

console.log('UX 3. Mock completion safeguards');
ok(ux.includes('ux-input-progress'),'Mock input progress display is missing');
ok(ux.includes('未入力が ${blank} か所あります'),'Mock unfinished-answer confirmation is missing');
ok(ux.includes('beforeunload'),'Mock accidental-exit safeguard is missing');

console.log('UX 4. Mobile table usability');
ok(ux.includes('表は横にスクロールできます'),'Horizontal-scroll hint is missing');
ok(ux.includes('.tbl th:first-child')&&ux.includes('position:sticky'),'Sticky first-column support is missing');

console.log('UX 5. Offline availability');
const sw=read('sw.js');
ok(sw.includes("'./publication-ux-v1.js'"),'Publication UX script is not cached for offline use');
ok(sw.includes("v3.0.24-ux-audit"),'Expected UX cache generation is not active');

console.log('Publication UX audit: PASS');
