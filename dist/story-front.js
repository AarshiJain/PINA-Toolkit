/* The homepage journey shares the original toolkit, notes and Ask Pip. */
const STORY_CHAPTERS=[
 {category:'Briefs & stakeholders',short:'Understand',title:'The brief arrives.<br>Pip looks closer.',line:'Before deciding what to make, Pip checks what is being asked and who it matters to.',note:'The request is only the beginning.',ids:[1,7,14],role:'The listener',ink:'#7d9b85'},
 {category:'Analysis & decisions',short:'Decide',title:'A few clues.<br>Time to choose.',line:'Pip weighs the evidence, questions the explanation and decides what can hold up.',note:'A finding is a clue, not a verdict.',ids:[2,3,11,9,13],role:'The investigator',ink:'#879da8'},
 {category:'Messages & persuasion',short:'Connect',title:'Will it land<br>the way you mean?',line:'Pip compares the message he meant to send with what someone else might hear.',note:'Check what arrives, not just what leaves.',ids:[0,10,8],role:'The communicator',ink:'#ad9670'},
 {category:'Pitches & value',short:'Pitch',title:'Give the idea<br>somewhere to go.',line:'Pip tells the story, makes the value clear and asks for one useful next step.',note:'Make the next move easy to see.',ids:[12,6],role:'The storyteller',ink:'#8f9f6b'},
 {category:'Review & handover',short:'Carry forward',title:'Leave the thinking<br>with the work.',line:'Before the project changes hands, Pip checks the thread and records why the choices were made.',note:'A handover is a beginning, too.',ids:[4,5],role:'The keeper of the thread',ink:'#78938a'}
];
const STORY_PURPOSES={
 1:'When a brief already names a solution, uncover the problem and the people behind it.',
 7:'Before a change, map who can shape the decision and how much it matters to them.',
 14:'Before a conversation, separate one person’s priorities, feelings, words and actions.',
 2:'When the meaning is uncertain, compare reasoning routes and name what could change your mind.',
 3:'When findings need to become a recommendation, check what each source can support.',
 11:'Before sharing an argument, spot its weak reasoning and repair the claim.',
 9:'Before negotiating, compare both limits and find what each side can trade.',
 13:'When two sides want different things, compare fairness, feelings and costs before opening the conversation.',
 0:'Before sending a message, compare what you mean with what someone else might hear.',
 10:'When a message needs trust, check its credibility, connection and logic.',
 8:'When asking someone to act, choose an honest influence cue and leave room to decline.',
 12:'When an idea needs a decision, build a story that leads from the situation to a clear ask.',
 6:'When explaining an offer, connect the client’s goal to a result they can inspect and try.',
 4:'When the work has drifted, trace where the agreed purpose stopped coming through.',
 5:'When reviewing or handing over, record the decision, its reasons and what remains open.'
};
const storyArrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
function storyTool(id){return `<a class="story-tool" data-story-tool="${id}" data-pip-directory="${id}" href="${hybridHref(id)}" aria-describedby="story-purpose-${id}"><span class="story-tool-art">${directoryArt(id)}</span><div class="story-tool-copy"><div class="story-tool-title"><h3>${esc((ANYTIME[id]||T[id]).name)}</h3>${storyArrow}<small data-pip-badge></small></div><p id="story-purpose-${id}" class="story-tool-purpose">${STORY_PURPOSES[id]}</p>${hybridTags(id)}</div></a>`;}
function storyDirectory(){return `<div class="story-journey-intro"><p>ONE PROJECT. LET’S GET MOVING.</p></div>
 <nav class="story-chapter-nav" aria-label="Pip’s project journey"><div>${STORY_CHAPTERS.map((c,i)=>`<button type="button" data-story-jump="${i}" aria-label="Go to ${c.category}"><i aria-hidden="true"></i>${c.short}</button>`).join('')}</div><span class="story-progress-count" aria-live="off">01 / 05</span></nav>
 <div class="pip-directory-status" data-pip-show-all hidden><span>Pip highlighted a possible starting point.</span><button type="button" class="text-link">Show all tools</button></div>
 <section id="tool-directory" class="story-chapters" aria-label="Tools through Pip’s project journey"><button type="button" id="story-traveler" aria-label="Pip is looking at the brief. Click to wave."><span class="story-traveler-figure"></span><span class="story-carried-props" aria-hidden="true"></span></button><span class="story-traveler-announcement" role="status" aria-live="polite"></span>
 ${STORY_CHAPTERS.map((c,i)=>`<section class="story-chapter" data-story-chapter="${i}" style="--chapter-ink:${c.ink}" aria-labelledby="story-title-${i}"><div class="story-illustration-col"><button type="button" class="story-scene" data-story-play="${i}" aria-label="Animate Pip as ${c.role.toLowerCase()}">${storyArt(i)}<span class="scene-play-hint">${ic('plus')} ${['Look beneath the brief','Compare the directions','Compare the two readings','Unfold the pitch','Open the handover'][i]}</span></button><p class="story-handnote">${c.note}</p><span class="story-role-label"><svg viewBox="0 0 20 16" aria-hidden="true"><path d="M2 2v5q0 3 3 3h12m-4-4 4 4-4 4"/></svg> Pip, ${c.role.toLowerCase()}</span></div><div class="story-chapter-copy"><div class="story-category"><span>${String(i+1).padStart(2,'0')}</span><p>${c.category}</p></div><h2 id="story-title-${i}">${c.title}</h2><p class="story-sentence">${c.line}</p><div class="story-tools">${c.ids.map(storyTool).join('')}</div></div></section>`).join('')}</section>
 <section class="story-ending"><p class="story-kicker">YOUR PROJECT, YOUR CALL</p><h2>A little clearer.<br>A little further forward.</h2><p>You don’t have to follow Pip in order.<br>Pick the moment you’re in, or think it through together.</p><button type="button" class="ink-button primary" data-hybrid-ask>Ask Pip ${ic('arrow')}</button></section>`;}
const storyOriginalHeader=header;
header=function(){return storyOriginalHeader().replace('<span aria-hidden="true">⌄</span>','<svg class="story-nav-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>');};
const storyOriginalHome=home;
home=function(){const html=storyOriginalHome();const start=html.indexOf('<section class="hybrid-directory-intro">'),end=html.lastIndexOf('</main>');return (html.slice(0,start)+storyDirectory()+html.slice(end)).replace('welcome-page hybrid-home','welcome-page hybrid-home story-home').replace(/<div class="hybrid-paper">[\s\S]*?<\/div>/,'');};
let storyObserver=null,storyFrame=0,storyTimer=new Map();
const storyReduced=matchMedia('(prefers-reduced-motion: reduce)');
let storyLandings=[],storyTravelerMood='',storyMotionGeometry=null,storyNativeAnimation=null,storyResizeObserver=null,storyResizeFrame=0;
function storyMeasureThread(){
 storyNativeAnimation?.cancel();storyNativeAnimation=null;
 const parent=document.querySelector('.story-chapters'),pip=document.querySelector('#story-traveler');
 if(!parent||!pip){storyMotionGeometry=null;return;}
 if(pip.parentElement!==parent)parent.prepend(pip);
 pip.style.width='200px';pip.style.position='absolute';pip.style.transformOrigin='0 0';
 storyMotionGeometry=PIP_MOTION.measure();storyLandings=storyMotionGeometry.landings;
 if(!storyReduced.matches&&typeof ScrollTimeline==='function'){
  storyNativeAnimation=pip.animate(PIP_MOTION.frames(storyMotionGeometry),{fill:'both',easing:'linear',timeline:new ScrollTimeline({source:document.scrollingElement,axis:'block'})});
  pip.dataset.motionEngine='native-scroll';
 }else pip.dataset.motionEngine=storyReduced.matches?'reduced-motion':'direct-scroll';
}
function storyResizeMotion(){if(!storyResizeFrame)storyResizeFrame=requestAnimationFrame(()=>{storyResizeFrame=0;storyMeasureThread();storySchedule();});}
function storyCarryMarkup(){return `<svg viewBox="0 0 200 235" overflow="visible"><g class="carry-magnifier"><circle cx="196" cy="61" r="28" fill="#d9e9df" fill-opacity=".55" stroke="#303f38" stroke-width="2"/><circle cx="196" cy="61" r="22" fill="none" stroke="#7b9987"/><path d="m177 81-28 35" stroke="#303f38" stroke-width="10" stroke-linecap="round"/><path d="m177 81-28 35" stroke="#e7c57e" stroke-width="6" stroke-linecap="round"/></g><g class="carry-comparison">${[-1,1].map((side,i)=>`<g transform="translate(${i?157:-78} 72) rotate(${i?6:-6} 56 48)"><rect x="3" y="4" width="112" height="96" fill="#283c3014"/><rect width="112" height="96" rx="2" fill="${i?'#e6e6ce':'#fffdf5'}" stroke="#303f38" stroke-width="1.2"/><g class="carry-direction"><text x="8" y="18" font-size="9" font-family="Inter,Arial">DIRECTION ${i?'B':'A'}</text><path d="M9 35h90M9 48h80M9 61h87" stroke="#708375" stroke-width="1.2"/></g><g class="carry-reading"><text x="8" y="18" font-size="8.5" font-family="Inter,Arial">${i?'WHAT THEY HEARD':'WHAT I MEANT'}</text><text x="9" y="40" font-size="11.5" font-family="Inter,Arial">${i?'Is this decided?':'Let’s try it.'}</text><path d="M9 65h90" stroke="#708375"/></g></g>`).join('')}</g><g class="carry-mic"><path d="M163 71v123m-20 7q20-16 40 0" fill="none" stroke="#303f38" stroke-width="2.5"/><path d="M149 51v10q0 15 14 15t14-15V51" fill="none" stroke="#303f38" stroke-width="2"/><rect x="154" y="30" width="18" height="36" rx="9" fill="#8da59b" stroke="#303f38" stroke-width="1.8"/><path d="M158 41h10m-10 7h10m-10 7h10" stroke="#e1ece0"/></g><g class="carry-next-paper" transform="rotate(7 175 120)"><rect x="143" y="83" width="74" height="97" rx="2" fill="#fffdf5" stroke="#303f38" stroke-width="1.3"/><text x="152" y="102" font-size="7" font-family="Inter,Arial">NEXT STEP</text><path d="M153 118h53m-53 12h45m-45 25h37m-8-7 8 7-8 7" fill="none" stroke="#708375" stroke-width="1.2"/></g></svg>`;}
function storyTravel(){
 const parent=document.querySelector('.story-chapters'),pip=document.querySelector('#story-traveler'),g=storyMotionGeometry;if(!parent||!pip||!g)return;
 const {i,t,moving}=PIP_MOTION.phase(scrollY,g),a=storyLandings[i],b=storyLandings[Math.min(i+1,storyLandings.length-1)],still=storyReduced.matches,nearest=t>.5?b:a;
 // Native scroll timelines own the transform. Scroll handlers only update the story's props and labels.
 if(!storyNativeAnimation){const p=still?PIP_MOTION.rest(scrollY,nearest,g):PIP_MOTION.pose(scrollY,g);pip.style.transform=PIP_MOTION.transform(p);}
 pip.hidden=false;pip.classList.toggle('is-docked',!moving);
 if(storyTravelerMood!==nearest.mood||!pip.querySelector('.story-traveler-figure svg')){pip.querySelector('.story-traveler-figure').innerHTML=guide(nearest.mood,'large');storyTravelerMood=nearest.mood;pip.setAttribute('aria-label',`Pip, ${STORY_CHAPTERS[storyLandings.indexOf(nearest)].role.toLowerCase()}. Click to wave.`);}
 const props=pip.querySelector('.story-carried-props');if(props&&!props.firstElementChild)props.innerHTML=storyCarryMarkup();
 const glass=still?0:i===0?1:i===1?1-Math.min(1,t*3):0;
 const cards=i===1&&moving?Math.min(1,t*8)*(1-Math.max(0,(t-.9)/.1)):0;
 const arrival=i>1?1:i===1?Math.max(0,Math.min(1,(t-.68)/.32)):0;
 const pickup=still?0:i===2?Math.max(0,(t-.72)/.28):i===3?1:0;
 const delivered=i>=4?1:i===3?Math.max(0,(t-.88)/.12):0;
 const paper=pickup*(1-delivered);
 pip.style.setProperty('--carry-glass',glass);pip.style.setProperty('--carry-cards',cards);pip.style.setProperty('--carry-reading',i===1?t:1);pip.style.setProperty('--carry-mic',0);pip.style.setProperty('--carry-paper',paper);
 pip.style.setProperty('--carry-card-scale',1+arrival*.5);
 parent.style.setProperty('--brief-glass',still?1:0);parent.style.setProperty('--analysis-glass',still||i>=2?1:1-glass);
 parent.style.setProperty('--card-left-static',i===1?1-Math.min(1,t*8):1);
 parent.style.setProperty('--message-arrival',arrival);parent.style.setProperty('--mic-static',1);
 parent.style.setProperty('--paper-pickup',pickup);parent.style.setProperty('--paper-received',delivered);
 pip.classList.toggle('is-travelling',moving&&!still);pip.classList.toggle('is-dwelling',!moving);
 parent.dataset.travelerChapter=String(storyLandings.indexOf(nearest));
}
function storyUpdate(){
 storyFrame=0;const chapters=[...document.querySelectorAll('[data-story-chapter]')];if(!chapters.length)return;
 const viewport=innerHeight;let nearest=Infinity,active=0;
 chapters.forEach((chapter,i)=>{const box=chapter.getBoundingClientRect(),distance=Math.abs(box.top+box.height*.45-viewport*.5);if(distance<nearest){nearest=distance;active=i;}if(box.bottom<0||box.top>viewport)return;
 const progress=Math.max(0,Math.min(1,(viewport-box.top)/(viewport+box.height)));
 chapter.style.setProperty('--scene-progress',progress.toFixed(3));chapter.style.setProperty('--ink-progress',Math.min(1,progress*2.1).toFixed(3));
 });
 document.querySelectorAll('[data-story-jump]').forEach((b,i)=>{b.classList.toggle('is-current',i===active);if(i===active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 const count=document.querySelector('.story-progress-count');if(count)count.textContent=String(active+1).padStart(2,'0')+' / 05';
 storyTravel();
}
function storySchedule(){if(!storyFrame)storyFrame=requestAnimationFrame(storyUpdate);}
function storyBind(){
 storyObserver?.disconnect();storyResizeObserver?.disconnect();storyNativeAnimation?.cancel();storyNativeAnimation=null;const chapters=[...document.querySelectorAll('[data-story-chapter]')];if(!chapters.length)return;
 document.title='PINA · Make your next move';
 storyObserver=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.classList.toggle('is-in-view',e.isIntersecting);if(e.isIntersecting)e.target.classList.add('has-entered');}),{threshold:.13});chapters.forEach(c=>storyObserver.observe(c));
 document.querySelectorAll('[data-story-jump]').forEach(b=>b.addEventListener('click',()=>{const chapter=document.querySelector(`[data-story-chapter="${b.dataset.storyJump}"]`);window.scrollTo({top:chapter.getBoundingClientRect().top+scrollY-(document.querySelector('.studio-header').getBoundingClientRect().height+document.querySelector('.story-chapter-nav').getBoundingClientRect().height+16),behavior:storyReduced.matches?'instant':'smooth'});}));
 document.querySelectorAll('[data-story-play]').forEach(b=>b.addEventListener('click',event=>{const chapter=b.closest('.story-chapter'),n=Number(b.dataset.storyPlay);if(n===1){chapter.dataset.choice=event.target.closest('[data-story-option]')?.dataset.storyOption||String(chapter.dataset.choice==='1'?0:1);document.querySelector('.story-traveler-announcement').textContent='Direction '+(chapter.dataset.choice==='1'?'B':'A')+' is brought forward for a closer look.';}if(n===2){chapter.classList.toggle('is-reading-reply');document.querySelector('.story-traveler-announcement').textContent=chapter.classList.contains('is-reading-reply')?'What they heard: Is this decided?':'What Pip meant: Let’s try it.';}chapter.classList.remove('is-playing');requestAnimationFrame(()=>chapter.classList.add('is-playing'));clearTimeout(storyTimer.get(chapter));storyTimer.set(chapter,setTimeout(()=>chapter.classList.remove('is-playing'),2800));}));
 document.querySelectorAll('[data-story-tool]').forEach(a=>{const chapter=a.closest('.story-chapter'),set=()=>chapter.dataset.focus=a.dataset.storyTool,clear=()=>{delete chapter.dataset.focus;};a.addEventListener('mouseenter',set);a.addEventListener('mouseleave',clear);a.addEventListener('focus',set);a.addEventListener('blur',clear);});
 const traveler=document.querySelector('#story-traveler');traveler.addEventListener('click',()=>{traveler.classList.remove('is-waving');void traveler.offsetWidth;traveler.classList.add('is-waving');const n=Number(document.querySelector('.story-chapters').dataset.travelerChapter||0);document.querySelector('.story-traveler-announcement').textContent=STORY_CHAPTERS[n].note;setTimeout(()=>traveler.classList.remove('is-waving'),900);});
 storyMeasureThread();storyUpdate();
 if(typeof ResizeObserver==='function'){storyResizeObserver=new ResizeObserver(storyResizeMotion);storyResizeObserver.observe(document.querySelector('.story-chapters'));}
}
const storyBaseBind=bind;bind=function(){storyBaseBind();storyBind();};
addEventListener('scroll',storySchedule,{passive:true});addEventListener('resize',storyResizeMotion,{passive:true});
storyReduced.addEventListener('change',storyResizeMotion);
if(document.fonts)document.fonts.ready.then(()=>{storyMeasureThread();storySchedule();});
route();
