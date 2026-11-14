import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';

function app(file='index.html'){
 const store=new Map(),root={addEventListener(){},querySelector(){return null},querySelectorAll(){return []},classList:{add(){},remove(){},toggle(){}}};
 const context={console,crypto:webcrypto,URL,URLSearchParams,Blob,TextEncoder,setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},addEventListener(){},matchMedia:()=>({matches:false,addEventListener(){}}),navigator:{},location:{hash:'',pathname:'/',origin:'https://pina.example'},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},document:{addEventListener(){},querySelector:s=>s.startsWith('#')?root:null,querySelectorAll:()=>[],getElementById:()=>root,fonts:null}};
 context.window=context;context.top=context;context.globalThis=context;vm.createContext(context);
 const html=readFileSync('dist/'+file,'utf8');
 for(const [,src]of html.matchAll(/<script src="([^"]+)"/g)){
  const code=readFileSync('dist/'+src,'utf8').replace(/chatInit\(\);route\(\);\s*$/,'').replaceAll('route();','void 0;');
  vm.runInContext(code,context,{filename:src});
 }
 return {run:code=>vm.runInContext(code,context),store,html};
}
test('all fifteen revised tools render context, reflection, lessons, quiz and result',()=>{
 const {run}=app();
 for(let id=0;id<15;id++){
  for(const expression of [`v2Door(${id})`,`v2Workspace(${id},'context')`,`v2Workspace(${id},0)`,`v2Workspace(${id},'output')`,`v2Workspace(${id},'notes')`,`v2Learn(${id},0)`,`v2Quiz(${id})`]){
   const html=run(expression);assert.equal(typeof html,'string',expression);assert.ok(html.length>500,expression);assert.doesNotMatch(html,/\[object Object\]|\/NaN/,expression);
  }
  const reflections=run(`v2Tool(${id}).steps.length`);
  for(let n=0;n<reflections;n++)assert.ok(run(`v2Workspace(${id},${n})`).includes('data-v2-field')||run(`v2Workspace(${id},${n})`).includes('data-v2-trap')||run(`v2Workspace(${id},${n})`).includes('v2-score-picker'));
 }
});
test('new fields, sources, draft preservation and reasoning comparisons remain distinct',()=>{
 const {run}=app();
 assert.equal(run('v2Tool(12).steps.length'),9);
 assert.equal(run('v2Tool(14).steps[1].fields.length'),5);
 const reasoning=run('JSON.stringify(pipV2Specs(2))');for(const term of ['other_ded','other_ind','other_abd'])assert.ok(reasoning.includes(term));
 run("work.s1_output='My carefully edited draft';work.s1_reframe='New answer'");assert.match(run('v2DraftPage(1)'),/My carefully edited draft/);
 const shelf=run('shelf()');assert.doesNotMatch(shelf,/Schön|Weick|Gioia|Dorst|Edmondson|Collins, Brown/);assert.match(shelf,/Persuasion/);
 assert.doesNotMatch(run('v2Workspace(13,0)'),/fair-play/i);
 assert.equal(run('v2Tool(5).steps[0].fields.length'),4);
});
test('a message and small trial carry forward without overwriting existing answers',()=>{
 const {run}=app();run("meta.v2Route={key:'proposal',tools:[6,3,12]};work.s6_idea='A shared queue';work.s6_trial='Two teams for two weeks';v2Prefill(3,v2CarryMessage(6),6);v2Prefill(12,v2CarryMessage(3),3)");
 assert.equal(run('work.s3_act'),'Two teams for two weeks');assert.equal(run('work.s12_p8'),'Two teams for two weeks');
 run("work.s12_source='My own draft';v2Prefill(12,'Carried message',3)");assert.equal(run('work.s12_source'),'My own draft');assert.equal(run('work.s12_incoming'),'Carried message');
});
test('the story entrance shares the revised toolkit and keeps one traveling Pip',()=>{
 const {run,html}=app('story.html');assert.match(html,/toolkit-v2/);
 assert.equal(run('typeof V2'),'object');assert.equal(run('v2Tool(12).steps.length'),9);
 const story=run('storyDirectory()');assert.equal((story.match(/id="story-traveler"/g)||[]).length,1);assert.doesNotMatch(story,/story-connecting-thread/);
 assert.equal((story.match(/class="story-pip-landing"/g)||[]).length,5);
 assert.doesNotMatch(story,/class="story-pip"/);
});
test('complete project backups preserve files, revised fields and route results',()=>{
 const{run}=app();const parsed=JSON.parse(run(`JSON.stringify(parseProject3({format:'pina-fieldguide',version:1,meta:{project:'Practice',v2Route:{key:'brief',tools:[1,7,14]},pipRouteEntries:[{title:'Route',text:'My edited result',tools:[1,7,14]}]},work:{s5_dec_confirmed:true,s14_think_basis:'inferred',s1_output:'Edited draft'},pipProject:{files:[{name:'meeting.txt',text:'Run a pilot.'}],messages:[{role:'assistant',tool:999,text:'bad reference'},{role:'user',text:'My question'}],material:'Original brief',type:'brief',route:{tools:[1,7,14]},walk:{tool:1,index:2},tool:1,field:'assume'}}))`));assert.equal(parsed.work.s5_dec_confirmed,true);assert.equal(parsed.work.s14_think_basis,'inferred');assert.equal(parsed.work.s1_output,'Edited draft');assert.equal(parsed.project.files[0].text,'Run a pilot.');assert.equal(parsed.project.walk.index,2);assert.equal(parsed.project.messages.length,1);assert.equal(parsed.meta.pipRouteEntries[0].text,'My edited result');
});
test('asking Pip for help does not become a project answer',()=>{const{run}=app();for(const q of ['What is anchoring?','Summarize the book I mentioned.','Check the reasoning in my message.','Rewrite this for a different audience.'])assert.equal(run(`chatIsRequest(${JSON.stringify(q)})`),true);for(const answer of ['The design team','Our goal is a two-week trial','Maya will confirm the review date'])assert.equal(run(`chatIsRequest(${JSON.stringify(answer)})`),false);});
test('all tool tabs share one shell and one framework label group',()=>{const{run}=app();for(let id=0;id<15;id++){for(const expression of [`door(${id})`,`toolCase(${id})`,`make(${id},'context')`]){const html=run(expression);assert.match(html,/v4-tool-page/);assert.equal((html.match(/aria-label="Tool sections"/g)||[]).length,1);assert.equal((html.match(/aria-label="Frameworks behind this tool"/g)||[]).length,1);}const c=run(`toolCase(${id})`);assert.match(c,/v4-case-visual/);assert.equal((c.match(/Try it on my project/g)||[]).length,1);assert.doesNotMatch(c,/SBIZ 738|trust lecture/);}run("work.s1_brief='My own request';toolCase(1)");assert.equal(run('work.s1_brief'),'My own request');assert.doesNotMatch(run("v2Map(13,'learn',0)"),/Our side|Their side|100/);assert.match(run("v2Map(13,'work',0)"),/Our side/);});
test('chat reset keeps answers, files and the shared connection state',()=>{const{run}=app();run("work.s1_brief='A retained brief';chat3.files=[{name:'brief.txt',text:'source'}];chat3.material='Original material';chat3.status={ready:true};chat3.messages=[{role:'user',text:'Old chat'}];chat3.walk={tool:1,index:1};chat3.field='assume';chat3.busy=true;chatClearState3()");assert.equal(run('work.s1_brief'),'A retained brief');assert.equal(run('chat3.files[0].name'),'brief.txt');assert.equal(run('chat3.material'),'Original material');assert.equal(run('chat3.status.ready'),true);assert.equal(run('chat3.messages.length'),0);assert.equal(run('chat3.walk'),null);assert.equal(run('chat3.busy'),false);});
test('chat uses clear speakers, topic boundaries and named tool links',()=>{const{run}=app();run("chat3.messages=[{role:'assistant',tool:1,text:'First topic',topicStart:true,topicLabel:'Brief X-Ray'},{role:'user',text:'My answer'},{role:'assistant',tool:7,topicStart:true,topicLabel:'Stakeholder Lens',reply:{message:'Another topic',tools:[7],suggestions:[]}}]");const html=run('chatMessages()');assert.equal((html.match(/class="chat3-avatar"/g)||[]).length,3);assert.equal((html.match(/class="chat3-topic"/g)||[]).length,2);assert.match(html,/Open Stakeholder Lens/);assert.doesNotMatch(html,/Start this route/);assert.deepEqual(JSON.parse(run('JSON.stringify(chatRecentHistory3())')).map(m=>m.text),['Another topic']);});
test('readable thread controls and quiet empathy diagram keep their data hooks',()=>{const{run}=app();run("work.s4_c2=true;work.s14_decision='Caption that should stay in the form'");const thread=run('v5StoryDiagram()');assert.equal((thread.match(/class="v5-thread-label"/g)||[]).length,5);assert.equal((thread.match(/data-v2-map-part=/g)||[]).length,5);assert.match(thread,/Seen · checked/);assert.doesNotMatch(run("v2Map(14,'work',0)"),/Caption that should stay in the form/);assert.match(run('header()'),/Reset toolkit/);assert.doesNotMatch(run('home()'),/Pip suggests\. You decide/);});

test('home has one clip attachment, quiet routing label and the complete fifteen tool journey',()=>{const{run}=app();const html=run('home()');assert.equal((html.match(/data-chat-attach/g)||[]).length,1);assert.match(html,/aria-label="Attach material"/);assert.doesNotMatch(html,/Let Pip decide|current PINA homepage stays/);assert.match(html,/Find the best fit/);assert.equal((html.match(/data-story-tool=/g)||[]).length,15);const art=run('storyArt(2)');assert.match(art,/data-message-card="meant"/);assert.match(art,/message-links/);assert.doesNotMatch(art,/data-travel-card/);});


test('collection pages keep the sources, actual covers and one common introduction without the planning matrix',()=>{const{run}=app();const research=run('shelf()');assert.equal((research.match(/class="book-cover"/g)||[]).length,9);assert.doesNotMatch(research,/What needs to become clearer|v2-thinking-matrix/);assert.match(research,/Jasper Kim/);assert.match(research,/Lectures and other sources/);assert.equal(run('v2ThinkingMatrix()'),'');for(const name of ['shelf()','notebook()','casebook()'])assert.match(run(name),/class="collection-head"/);assert.match(run('casebook()'),/class="casebook-tool-links"/);});


function motionFixture(run){
 run(`var motionFixture={parentTop:800,floor:160,viewport:940,maxScroll:7500,landings:[
 {at:600,leaveAt:1500,x:120,w:190,angle:-3,pinTop:158,normalTop:758,endTop:1658,offset:210},
 {at:1900,leaveAt:2700,x:160,w:200,angle:2,pinTop:158,normalTop:2134,endTop:2858,offset:215},
 {at:3100,leaveAt:3900,x:130,w:195,angle:0,pinTop:158,normalTop:3258,endTop:4058,offset:220},
 {at:4300,leaveAt:5100,x:145,w:198,angle:-2,pinTop:158,normalTop:4458,endTop:5258,offset:218},
 {at:5500,x:125,w:196,angle:0,pinTop:158,normalTop:5658,endTop:6458,offset:225}
 ]};motionFixture.landings.forEach(a=>{a.pinStart=a.normalTop-a.pinTop;a.pinEnd=a.endTop-a.pinTop;})`);
}
test('scroll path is continuous through departure and an unpinned destination, in both directions',()=>{
 const {run}=app();motionFixture(run);
 for(const boundary of [1500,1900,2700,3100,3900,4300,5100,5500]){
  const poses=JSON.parse(run(`JSON.stringify([${boundary}-.001,${boundary},${boundary}+.001].map(s=>PIP_MOTION.pose(s,motionFixture)))`));
  for(const key of ['x','y','w','angle']){assert.ok(Math.abs(poses[0][key]-poses[1][key])<.002,`${boundary}: ${key} before`);assert.ok(Math.abs(poses[2][key]-poses[1][key])<.002,`${boundary}: ${key} after`);}
 }
 const sequence=[0,900,1550,1750,1880,1900,3800,5300,6000,1880,1550,0];
 const forward=sequence.map(s=>run(`JSON.stringify(PIP_MOTION.pose(${s},motionFixture))`));
 assert.deepEqual(sequence.slice().reverse().map(s=>run(`JSON.stringify(PIP_MOTION.pose(${s},motionFixture))`)),forward.reverse());
});
test('first and final poses stay with their artwork and reading intervals remain still',()=>{
 const {run}=app();motionFixture(run);
 assert.equal(run('PIP_MOTION.phase(1400,motionFixture).moving'),false);
 assert.equal(run('PIP_MOTION.phase(1700,motionFixture).moving'),true);
 assert.equal(run('PIP_MOTION.phase(7000,motionFixture).moving'),false);
 for(const s of [0,599,600,1400,5500,6000,7000])assert.equal(run(`JSON.stringify(PIP_MOTION.pose(${s},motionFixture))`),run(`JSON.stringify(PIP_MOTION.rest(${s},motionFixture.landings[${s<1500?0:4}],motionFixture))`));
 assert.match(run('storyArt(0)'),/data-ground="434"/);assert.match(run('storyArt(4)'),/data-ground="442"/);
});
test('native scroll keyframes cover the entire page and preserve every landing boundary',()=>{
 const {run}=app();motionFixture(run);
 const frames=JSON.parse(run('JSON.stringify(PIP_MOTION.frames(motionFixture))'));
 assert.equal(frames[0].offset,0);assert.equal(frames.at(-1).offset,1);
 frames.forEach((f,i)=>{assert.doesNotMatch(f.transform,/NaN|undefined/);if(i)assert.ok(f.offset>frames[i-1].offset);});
 for(const s of [1500,1900,2700,3100,3900,4300,5100,5500])assert.ok(frames.some(f=>Math.abs(f.offset-s/7500)<1e-10));
});
