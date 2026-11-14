const THREE_ES=['Ethics','Emotion','Economics'];
const THREE_HINTS=['Is it right and fair?','How does it feel?','What does it cost or return?'];
const FAIR_PLAY=[
 ['Do they know the rules we are playing by?','Say the rules out loud.'],
 ['Are they free to walk away?','Give them a way to decline without pressure.'],
 ['Would we be comfortable if they read our prep notes?','Find and remove anything you would need to conceal.'],
 ['Would we accept this approach if they used it on us?','Change the approach before using it.']
];
const threeMix=side=>THREE_ES.map((_,i)=>Math.max(0,Math.min(100,Math.round(anyNumber(13,side+i)||0))));
const threeSum=mix=>mix.reduce((a,b)=>a+b,0);
const threeNames=values=>THREE_ES.filter((_,i)=>values[i]===Math.max(...values)).join(' and ');
function threeComparison(){
  const us=threeMix('u'),them=threeMix('t');
  if(threeSum(us)!==100||threeSum(them)!==100)return 'Place exactly 100 points on each side to compare priorities.';
  const gaps=us.map((v,i)=>Math.abs(v-them[i])),max=Math.max(...gaps);
  const opening=threeNames(them);
  const gap=max===0?'Both sides have the same mix.':`Biggest gap: ${threeNames(gaps)} (${max} points).`;
  return `${gap} Their strongest E: ${opening}. Open there, then explain your own case.`;
}
function threeFairRead(){
  const values=FAIR_PLAY.map((_,i)=>anyVal(13,'f'+(i+1)));
  const no=values.filter(v=>v==='n').length;
  if(no)return `Revise ${no===1?'the flagged answer':'the flagged answers'} before going in.`;
  return values.every(v=>v==='y')?'All four fair-play checks passed.':'Answer all four checks before going in.';
}
function threeVisual(mode){
  const project=mode==='work';
  const sides=project?[[anyVal(13,'us')||'Our side',threeMix('u')],[anyVal(13,'them')||'Their side',threeMix('t')]]:
    [['Our side',[55,25,20]],['Their side',[25,50,25]]];
  return `<div class="three-visual"><div class="any-visual-heading"><h2>${project?'Your 3E comparison':'Two sides, three priorities'}</h2></div>
  ${project?'':'<p class="input-caption">Illustrative allocations</p>'}
  ${sides.map(([label,mix])=>`<div class="three-bar-row"><strong>${esc(label)}</strong>
   <div class="three-bar" aria-hidden="true">${mix.map((n,i)=>n?`<span class="three-color-${i}" style="flex-basis:${n}%">${n>=12?n:''}</span>`:'').join('')}</div>
   <p>${THREE_ES.map((name,i)=>`${name} ${mix[i]}`).join(' · ')}</p></div>`).join('')}
  ${project?`<p class="three-insight">${threeComparison()}</p><p class="input-caption">${threeFairRead()}</p>`:''}</div>`;
}
function threePoints(){
  return `<p class="input-caption">Give each side 100 points. Their numbers are estimates to check in conversation. A change to one E leaves the other two alone.</p>
    <div class="three-point-grid">${[['u',anyVal(13,'us')||'Our side'],['t',anyVal(13,'them')||'Their side']].map(([side,title])=>{
      const mix=threeMix(side);
      return `<fieldset><legend>${esc(title)}</legend><p class="input-caption" aria-live="polite" data-three-total="${side}">${threeTotalText(mix)}</p>
      ${THREE_ES.map((name,i)=>`<div class="three-point"><label for="three-${side}${i}">${name}<small>${THREE_HINTS[i]}</small></label>
        <div><button type="button" class="ink-button quiet" data-three-change="${side}${i}" data-delta="-5" aria-label="Less ${name.toLowerCase()} for ${esc(title)}" ${mix[i]===0?'disabled':''}>−</button>
        <input id="three-${side}${i}" data-three-input="${side}${i}" type="number" inputmode="numeric" min="0" max="100" step="1" value="${mix[i]}">
        <button type="button" class="ink-button quiet" data-three-change="${side}${i}" data-delta="5" aria-label="More ${name.toLowerCase()} for ${esc(title)}" ${threeSum(mix)>=100?'disabled':''}>+</button></div></div>`).join('')}</fieldset>`;
    }).join('')}</div>`;
}
function threeTotalText(mix){
  const left=100-threeSum(mix);
  return left===0?'All 100 points placed':left>0?`${left} points left`:`Remove ${-left} points`;
}
function updateThreePoint(key,value){
  if(!/^[ut][0-2]$/.test(key))return;
  const side=key[0],i=Number(key[1]),mix=threeMix(side),others=threeSum(mix)-mix[i];
  mix[i]=Math.min(Math.max(0,100-others),Math.max(0,Math.round(Number(value)||0)));
  work['s13_'+key]=String(mix[i]);
  const total=$(`[data-three-total="${side}"]`);
  if(total)total.textContent=threeTotalText(mix);
  mix.forEach((n,index)=>{
    const k=side+index,input=$(`[data-three-input="${k}"]`);
    if(input)input.value=n;
    const less=$(`[data-three-change="${k}"][data-delta="-5"]`);
    const more=$(`[data-three-change="${k}"][data-delta="5"]`);
    if(less)less.disabled=n===0;
    if(more)more.disabled=threeSum(mix)>=100;
  });
}
function threeFair(){
  return `<div class="three-fair">${FAIR_PLAY.map(([q,tip],i)=>{
    const key='f'+(i+1);
    return anyField(13,key,q,tip,'select',[['y','Yes'],['n','No']]);
  }).join('')}</div>`;
}
function empathyVisual(mode){
  const active=mode==='work', filled=[
    active&&Boolean(anyVal(14,'feel')),active&&Boolean(anyVal(14,'care')),active&&Boolean(anyVal(14,'say')||anyVal(14,'do'))
  ];
  return `<div class="empathy-visual"><div class="any-visual-heading"><h2>${active&&anyVal(14,'who')?esc(anyVal(14,'who')):'One person, three lenses'}</h2></div>
    <svg class="any-diagram" viewBox="0 0 380 295" role="img" aria-label="Overlapping feel, care, and do lenses">
      ${[[140,104],[239,104],[189,185]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="76" class="empathy-circle three-color-${i}" opacity="${active?(filled[i]?'.72':'.23'):'.53'}"/>`).join('')}
      <text x="117" y="84" text-anchor="middle">Feel</text><text x="265" y="84" text-anchor="middle">Care</text><text x="189" y="218" text-anchor="middle">Say / do</text>
      <text x="189" y="132" text-anchor="middle" class="empathy-center">${active&&filled.some(x=>!x)?filled.filter(Boolean).length+' of 3':'Their view'}</text>
    </svg><p class="input-caption">${active&&anyVal(14,'theirs')?`“${esc(anyVal(14,'theirs'))}” · Check this with them.`:'Keep what you observed separate from what you infer.'}</p></div>`;
}
function extendedWorkFields(id){
  const field=(key,label,hint='',type='text')=>anyField(id,key,label,hint,type);
  const area=(key,label,hint)=>field(key,label,hint,'area');
  if(id===13)return [
    ['Who is at the table?',()=>field('us','Our side')+field('them','Their side')+area('issue','The issue','Describe one decision or change you are preparing for.')],
    ['How does each side weigh the three Es?',threePoints],
    ['How will you open?',()=>area('speak','We will open by…','Speak to their strongest E in their terms, then explain your case.')],
    ['Does your plan pass fair play?',threeFair]
  ];
  return [
    ['Whose perspective do you need to understand?',()=>field('who','Person or group','Pick one person or a narrow group from Stakeholder Lens.')],
    ['What do you notice through the three lenses?',()=>area('feel','What might they feel?','Separate feelings they named from feelings you infer.')+
      area('care','What do they care about?','What do their priorities or choices suggest?')+area('say','What do they say?','Record their actual words or label a paraphrase.')+
      area('do','What do they actually do?','Record observed behaviour. Note any gap between words and actions.')],
    ['What are the two truths?',()=>area('mine','Our truth','What we believe and want to say.')+area('theirs','Their truth','The same situation in their words. If you drafted it, check it with them.')]
  ];
}
function extendedDraft(id){
  const v=key=>anyVal(id,key);
  const line=(label,value)=>value?`${label}: ${value}`:'';
  if(id===13)return [line('Issue',v('issue')),
    ...[['u',v('us')||'Our side'],['t',v('them')||'Their side']].map(([side,label])=>line(label,threeMix(side).map((n,i)=>THREE_ES[i]+' '+n).join(' · '))),
    threeComparison(),line('Opening line',v('speak')),threeFairRead(),
    ...FAIR_PLAY.map(([question,tip],i)=>{const result=v('f'+(i+1));return line(question,result==='y'?'Yes':result==='n'?'No. '+tip:'Unanswered');})
  ];
  return [line('Person or group',v('who')),line('What they may feel',v('feel')),line('What matters to them',v('care')),
    line('What they say',v('say')),line('What they do',v('do')),line('Our truth',v('mine')),line('Their truth to check with them',v('theirs'))];
}

const THINKING_PILLARS=[
 ['Foundation','Definitions, models and core skills'],
 ['Process','Identify, research, analyze and conclude'],
 ['Improvement','Reflect and consider other perspectives'],
 ['Application','Make decisions and communicate clearly']
];
const THINKING_COVERAGE=[
 [0,2],[0,1],[1,2],[1,3],[3],[0,2],[3],[2,3],[0,3],[1,3],[2,3],[0,2],[3],[1,3],[0,2]
];
const THINKING_PROCESS=[
 ['Identify the problem',[1]],['Research',[3]],['Analyze arguments',[2]],
 ['Check assumptions and biases',[1,11]],['Evaluate data',[3]],['Draw conclusions',[3,5]]
];
function thinkingToolLink(id){
  const tool=ANYTIME[id]||T[id];
  return `<a href="${ANYTIME[id]?anyUrl(id):'#door/'+id}">${esc(tool.name)}</a>`;
}
function thinkingCoverage(){
  return `<details class="small-disclosure thinking-coverage"><summary>How the tools support critical thinking</summary>
    <ol class="thinking-process">${THINKING_PROCESS.map(([label,ids])=>`<li><b>${label}</b><span>${ids.map(thinkingToolLink).join(' · ')}</span></li>`).join('')}</ol>
    <div class="thinking-table" role="region" tabindex="0" aria-label="Critical thinking coverage matrix">
      <table><caption>Where each tool contributes</caption><thead><tr><th scope="col">Tool</th>${THINKING_PILLARS.map(([name,desc])=>`<th scope="col">${name}<small>${desc}</small></th>`).join('')}</tr></thead>
      <tbody>${THINKING_COVERAGE.map((coverage,id)=>`<tr><th scope="row">${thinkingToolLink(id)}</th>${THINKING_PILLARS.map(([name],i)=>coverage.includes(i)?`<td aria-label="Covers ${name}">✓</td>`:'<td></td>').join('')}</tr>`).join('')}</tbody></table>
    </div>
  </details>`;
}
