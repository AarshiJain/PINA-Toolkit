/* Navigation reset keeps the project; chat reset only clears the conversation. */
v2StoryMap=v5StoryDiagram;
function resetToolkit5(){meta.studioProgress={};meta.last=1;delete meta.v2Route;saveMeta();savedScrolls.clear();savedPanelScrolls.clear();Object.assign(chat3,{walk:null,pendingStart:null,route:null});chatPersist();chatClose();if(location.hash==='#home')route();else location.hash='#home';requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));toast('Back at the beginning. Your project notes are kept.');}
const header5=header;header=()=>header5().replace('<a href="#shelf">Research</a>',`<button type="button" class="v5-reset-toolkit" data-reset-toolkit aria-label="Reset toolkit" title="Return to the beginning. Your project notes and chat are kept."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 9M4 4v6h6"/></svg><span>Reset toolkit</span></button><a href="#shelf">Research</a>`);
const bind5=bind;bind=function(){bind5();const think=document.querySelector('.v4-project #s14_think'),reading=document.querySelector('.v4-think-reading');if(think&&reading){const help=think.closest('.v2-field').querySelector('[data-chat-help]');if(help)help.before(reading);}};
document.addEventListener('click',e=>{if(e.target.closest('[data-reset-toolkit]'))resetToolkit5();});
route();
