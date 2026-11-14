/* Full-size method diagrams. SVG is geometry; labels and controls are native HTML. */
const THREAD_PINS=['Restated','Visible','Stranger agrees','Picture first','Past yes'];
function mapNode(step,title,desc='',cls='',meta='',number=true){return `<button class="diagram-node ${cls}" data-map-step="${step}" aria-label="${step+1}. ${esc(title)}" aria-pressed="false">${number?`<span class="node-number">${step+1}</span>`:'<span class="node-number-space" aria-hidden="true"></span>'}<strong>${esc(title)}</strong></button>`}
function diagramMarkup(id,active=-1){let body='';
if(id===1){body=`<svg class="ice-landscape" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="water-${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#eaf4f0"/><stop offset="1" stop-color="#bbd9cf"/></linearGradient></defs><rect x="18" y="200" width="964" height="483" rx="20" fill="url(#water-${id})"/><path d="M18 379h964M18 551h964" stroke="#a9cabe" opacity=".45"/><path d="M500 35 560 143 588 200 652 319 597 497 510 654 417 527 353 328 416 200 452 113Z" fill="#bddbd2" stroke="#719e91" stroke-width="1.5"/><path d="M500 35 482 200 416 200 452 113Z" fill="#ffffff"/><path d="M500 35 560 143 588 200 482 200Z" fill="#deeee8"/><path d="M482 200 417 527 353 328 416 200Z" fill="#9cc5b8"/><path d="M482 200 652 319 510 654 417 527Z" fill="#cce3da"/><path d="M482 200 588 200 652 319Z" fill="#b0d1c5"/><path d="M652 319 597 497 510 654Z" fill="#88b3a4"/><path d="M18 200H982" stroke="#67988a" stroke-width="2"/><path d="M439 379h193M428 551h139" stroke="#779e91" opacity=".45" stroke-width="1.5"/></svg><svg class="map-connectors" aria-hidden="true"></svg><div class="ice-visible">${mapNode(0,'Facts · Anchor · Position','','ice-visible-title')}</div>${mapNode(1,'Assumptions','','ice-assumptions')}${mapNode(2,'The opposite option','','ice-opposite')}${mapNode(3,'The interest','','ice-interest')}${mapNode(4,'The real problem','','ice-reframe')}`;}
else if(id===2){body=`<div class="argument-board"><svg class="map-connectors" aria-hidden="true"></svg><div class="argument-chain">${mapNode(0,'Grounds','','argument-grounds')}<span class="argument-arrow" aria-hidden="true"></span>${mapNode(1,'Warrant','','argument-warrant')}<span class="argument-arrow" aria-hidden="true"></span>${mapNode(2,'Your claim','','argument-claim')}</div><div class="argument-challenge">${mapNode(3,'Rival frame','','argument-rival')}<span class="argument-arrow" aria-hidden="true"></span>${mapNode(4,'Change-of-mind test','','argument-test')}</div></div>`;}
else if(id===3){
 body=`<div class="ladder-board"><div class="ladder-diagram">
  <svg class="ladder-landscape" viewBox="0 0 610 510" preserveAspectRatio="none" aria-hidden="true">
   ${ladderLandscape()}${LADDER_Y.map(y=>`<path d="M316 ${y}h24m-6-4 6 4-6 4" fill="none" stroke="#54796f" stroke-width="1.5"/>`).join('')}
  </svg>
  ${[3,2,1,0].map((rung,i)=>`<div class="ladder-rung" style="--rung-y:${LADDER_Y[i]/510*100}%">${mapNode(rung,EVIDENCE_RUNGS[rung])}</div>`).join('')}
 </div><div class="ladder-result">${mapNode(4,'Your recommendation')}</div></div>`;
}
else if(id===4){
 body=`<div class="thread-board"><svg class="thread-line map-connectors" aria-hidden="true"></svg><div class="thread-pins">${THREAD_PINS.map((label,i)=>mapNode(i,label,'','thread-pin')).join('')}</div></div>`;
}
else if(id===5){body=`<svg class="review-ring map-connectors" aria-hidden="true"></svg><div class="review-center"><strong>Review<br>together</strong></div>${['Maker explains','Agreed criteria','Ask, then model','Missing information','Reflect together'].map((a,i)=>mapNode(i,a,'','review-node review-node-'+i)).join('')}`;}
else if(id===6){
 const labels=['Advantage','Fit','Simplicity','Trial','Visibility'];
 body=`<svg class="value-radar" aria-hidden="true"></svg>${labels.map((label,i)=>mapNode(i,label,'','radar-node radar-node-'+i)).join('')}`;
}
else{body=`<div class="reading-board"><svg class="reading-merge map-connectors" aria-hidden="true"></svg><div class="reading-intent">${mapNode(0,'Your intention','What do you want someone to understand?','','START WITH THE MEANING')}</div><svg class="reading-branches" viewBox="0 0 900 80" preserveAspectRatio="none" aria-hidden="true"><path d="M450 0V32M150 32H750M150 32V80M450 32V80M750 32V80" fill="none" stroke="#9fbaaa" stroke-width="2"/></svg><div class="reading-options">${[['Intended reading','They accept your meaning.'],['Negotiated reading','They accept it, with reservations.'],['Oppositional reading','They understand it and disagree.']].map(([a,b],i)=>mapNode(i+1,a,b,'','TRY ANOTHER READING')).join('')}</div><div class="reading-close">${mapNode(4,'Close the gap','Give the reason, say the change first or name the cost.','','DECIDE WHAT TO CLARIFY')}</div></div>`;}
return `<div class="method-scene scene-${id}" role="group" aria-label="${esc(T[id].name)} interactive map">${body}</div>`}
function mapSpeaker(why,finalPart=false){
 return `<div class="map-speaker"><div class="speaker-bubble"><b>Pip · why this matters</b><p>${esc(why)}</p></div>${guide(finalPart?'confident':'curious','tiny')}</div>`;
}
function explanationPane(id,part){part=Math.max(0,Math.min(4,part));const l=LESSONS[id][part],title=id===1?['What the brief says','Assumptions','The opposite option','The interest','The reframe'][part]:id===2?['Grounds','Warrant','Your claim','Rival frame','Change-of-mind test'][part]:id===5?['Maker explains','Agreed criteria','Ask, then model','Missing information','Reflect together'][part]:T[id].map[part][0];return `<article class="map-callout"><div class="callout-heading"><span class="reading-number">${String(part+1).padStart(2,'0')}</span><h2>${esc(title)}</h2></div><p class="part-meaning">${esc(l[1])}</p>${id===1&&part===3?'<dl class="people-notes"><div><dt>People affected</dt><dd>Who uses, makes, approves or experiences the result?</dd></div><div><dt>What they could lose</dt><dd>Check what is at stake: time, trust, autonomy or opportunity.</dd></div></dl>':''}<div class="callout-action"><b>What you do</b><p>${esc(l[2])}</p></div>${id===2&&part===0?frameReasoningGuide():''}${id===1&&part===4?'<p class="input-caption">Separate the event that triggered the brief from the underlying difficulty that may keep happening.</p>':''}${mapSpeaker(l[3],part===4)}</article>`}

/* Connect to the actual element edges, after fonts and responsive layout settle. */
function layoutMethodMaps(root=document){root.querySelectorAll('.method-scene').forEach(scene=>{
 const id=Number([...scene.classList].find(c=>/^scene-\d$/.test(c))?.slice(-1));
 const w=scene.clientWidth,h=scene.clientHeight;if(!w||!h)return;
 const svg=scene.querySelector('.map-connectors');if(!svg&&id!==6)return;
 if(svg){svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('preserveAspectRatio','none');}
 const base=scene.getBoundingClientRect();const box=n=>{const r=n.getBoundingClientRect();return {x:r.x-base.x,y:r.y-base.y,w:r.width,h:r.height,cx:r.x-base.x+r.width/2,cy:r.y-base.y+r.height/2}};
 const path=(d,arrow=false)=>`<path d="${d}" fill="none" stroke="#779b8e" stroke-width="1.7" ${arrow?'marker-end="url(#edge-arrow-'+id+')"':''}/>`;
 const defs=`<defs><marker id="edge-arrow-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 9 5 1 9" fill="none" stroke="#779b8e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
 let lines='';
 if(id===0){
  const close=box(scene.querySelector('.reading-close>.diagram-node'));
  const options=[...scene.querySelectorAll('.reading-options>.diagram-node')].map(box);
  options.forEach((reading,i)=>{
   const start=reading.y+reading.h, end=close.y-3, bend=(start+end)/2;
   const x=close.x+close.w*(.24+.26*i);
   lines+=path(`M${reading.cx} ${start}C${reading.cx} ${bend} ${x} ${bend} ${x} ${end}`,true);
  });
 }
 if(id===1){const anchors=[.5,.385,.5,.43,.535];scene.querySelectorAll('.diagram-node').forEach((n,i)=>{const r=box(n),right=i%2===0,tx=anchors[i]*w,ty=r.cy;const end=right?r.x-6:r.x+r.w+6;lines+=path(`M${tx} ${ty}H${end}`,true);lines+=`<circle cx="${tx}" cy="${ty}" r="3" fill="#5b8c7b"/>`;});}
 if(id===2&&!scene.classList.contains('reasoning-scene')){const c=box(scene.querySelector('.argument-claim')),r=box(scene.querySelector('.argument-rival'));const mid=(c.y+c.h+r.y)/2;lines+=path(`M${c.cx} ${c.y+c.h}V${mid}H${r.cx}V${r.y-7}`,true);}
 if(id===4){
  const pins=[...scene.querySelectorAll('.thread-pin')];
  const wide=w>=490;
  const positions=wide?[[.16,.25],[.29,.53],[.48,.68],[.68,.52],[.83,.29]]
                      :[[.30,.14],[.60,.30],[.69,.50],[.55,.68],[.34,.84]];
  const points=pins.map((pin,i)=>{
   const bounds=box(pin);
   const x=Math.max(bounds.w/2+6,Math.min(w-bounds.w/2-6,positions[i][0]*w));
   const y=positions[i][1]*h;
   Object.assign(pin.style,{left:x+'px',top:y+'px',right:'auto',transform:'translate(-50%,-50%)'});
   return [x,y];
  });
  points.unshift([w*.035,h*.14]);
  points.push(wide?[w*.97,h*.20]:[w*.15,h*.94]);
  const curve=points.map(([x,y],i)=>{
   if(!i)return `M${x} ${y}`;
   const [px,py]=points[i-1], [ax,ay]=points[i-2]||points[i-1], [bx,by]=points[i+1]||points[i];
   return `C${px+(x-ax)*.17} ${py+(y-ay)*.17} ${x-(bx-px)*.17} ${y-(by-py)*.17} ${x} ${y}`;
  }).join(' ');
  lines+=`<path d="${curve}" fill="none" stroke="#bdd6cb" stroke-width="7" stroke-linecap="round"/>
   <path d="${curve}" fill="none" stroke="#5b8677" stroke-width="2" stroke-linecap="round"/>`;
 }
 if(id===5){
  const nodes=[...scene.querySelectorAll('.review-node')];
  const angles=nodes.map((_,i)=>(162+i*72)*Math.PI/180);
  const cx=w/2,cy=h/2;
  const preferredRadius=Math.min(w*.35,h*.38);
  nodes.forEach(node=>node.style.maxWidth=Math.min(w*.34,preferredRadius*1.1)+'px');
  const radius=Math.min(preferredRadius,...nodes.map((node,i)=>{
   const bounds=box(node),angle=angles[i];
   return Math.min(
    (cx-bounds.w/2-8)/Math.max(.001,Math.abs(Math.cos(angle))),
    (cy-bounds.h/2-8)/Math.max(.001,Math.abs(Math.sin(angle)))
   );
  }));
  const onCircle=angle=>[cx+radius*Math.cos(angle),cy+radius*Math.sin(angle)];
  nodes.forEach((node,i)=>{
   const [x,y]=onCircle(angles[i]);
   node.style.left=x+'px';
   node.style.right='auto';
   node.style.top=y+'px';
  });
  const bounds=nodes.map(box);
  const inside=([x,y],r)=>x>=r.x-7&&x<=r.x+r.w+7&&y>=r.y-7&&y<=r.y+r.h+7;
  angles.forEach((angle,i)=>{
   const next=(i+1)%nodes.length;
   let start=angle,end=angle+72*Math.PI/180;
   while(start<end&&inside(onCircle(start),bounds[i]))start+=.006;
   while(end>start&&inside(onCircle(end),bounds[next]))end-=.006;
   const from=onCircle(start),to=onCircle(end);
   lines+=path(`M${from.join(' ')}A${radius} ${radius} 0 0 1 ${to.join(' ')}`,true);
  });
 }
 if(id===6){
  const chart=scene.querySelector('.value-radar');
  const nodes=[...scene.querySelectorAll('.radar-node')];
  const cx=w/2,cy=h/2;
  const directions=nodes.map((_,i)=>{
   const angle=(-90+i*72)*Math.PI/180;
   return [Math.cos(angle),Math.sin(angle)];
  });
  const preferredRadius=Math.min(w*.39,h*.43,h/2-36);
  nodes.forEach(node=>node.style.maxWidth=Math.min(w*.34,preferredRadius*1.1)+'px');
  const bounds=nodes.map(box);
  const labelRadius=Math.min(preferredRadius,...bounds.map((r,i)=>{
   const [dx,dy]=directions[i];
   return Math.min(
    (cx-r.w/2-10)/Math.max(.001,Math.abs(dx)),
    (cy-r.h/2-10)/Math.max(.001,Math.abs(dy))
   );
  }));
  nodes.forEach((node,i)=>{
   const [dx,dy]=directions[i];
   node.style.left=(cx+labelRadius*dx)+'px';
   node.style.top=(cy+labelRadius*dy)+'px';
   node.style.right='auto';
   node.style.transform='translate(-50%,-50%)';
  });
  // Every axis shares one radius, sized for the label that needs the most room.
  const labelInset=Math.max(...bounds.map((r,i)=>{
   const [dx,dy]=directions[i];
   return Math.min(r.w/2/Math.max(.001,Math.abs(dx)),r.h/2/Math.max(.001,Math.abs(dy)));
  }));
  const radius=Math.max(0,labelRadius-labelInset-10);
  const point=(i,fraction)=>[cx+directions[i][0]*radius*fraction,cy+directions[i][1]*radius*fraction].join(',');
  chart.setAttribute('viewBox',`0 0 ${w} ${h}`);
  chart.setAttribute('preserveAspectRatio','xMidYMid meet');
  chart.innerHTML=[1,2,3,4,5].map(level=>`<polygon points="${directions.map((_,i)=>point(i,level/5)).join(' ')}" fill="none" stroke="#bfd1c4" stroke-width="1.2"/>`).join('')
   +directions.map((_,i)=>`<path d="M${cx},${cy}L${point(i,1)}" stroke="#bfd1c4" stroke-width="1.2"/>`).join('')
   +`<polygon class="value-profile" points="${directions.map((_,i)=>point(i,(Number(work['s6_a'+(i+1)])||3)/5)).join(' ')}" fill="#7dad9125" stroke="#547f61" stroke-width="2"/>`;
 }
 if(svg)svg.innerHTML=defs+lines;
 });}
let mapLayoutFrame;function scheduleMapLayout(){cancelAnimationFrame(mapLayoutFrame);mapLayoutFrame=requestAnimationFrame(()=>layoutMethodMaps());}
window.addEventListener('resize',scheduleMapLayout);document.fonts?.ready.then(scheduleMapLayout);

const EVIDENCE_RUNGS=['Someone said it','Many said it','We saw it','We tested it'];
const LADDER_Y=[120,220,320,420];

function ladderLandscape(){
 return `<rect x="7" y="7" width="596" height="496" rx="18" fill="#f1f7fa"/>
 <g stroke="#638f81" stroke-width="1.4" stroke-linejoin="round">
  ${LADDER_Y.map(y=>`<path d="M102 ${y-7}h195l12 7H102Z" fill="#edf7f0"/><path d="M102 ${y}h207v10H102Z" fill="#8eb8ab"/>`).join('')}
  <path d="M89 60h13v405H89Z" fill="#a9cfc2"/><path d="m89 60 7-6h13l-7 6zm13 0 7-6v403l-7 8z" fill="#edf7f0"/>
  <path d="M298 60h13v405h-13Z" fill="#a9cfc2"/><path d="m298 60 7-6h13l-7 6zm13 0 7-6v403l-7 8z" fill="#edf7f0"/>
 </g>`;
}

function evidenceVisual(current=-1){
 const ys=[...LADDER_Y].reverse(),xs=[140,205,270];
 const findings=[1,2,3].filter(i=>String(work['s3_f'+i]||'').trim()&&ys[+work['s3_r'+i]-1]!==undefined);
 return `<div class="evidence-graphic"><svg viewBox="0 0 610 510" role="img" aria-label="Your findings placed by kind of support">
 ${ladderLandscape()}
 ${ys.map((y,i)=>`<text x="345" y="${y+6}" fill="#171717" font-size="19" font-weight="600">${EVIDENCE_RUNGS[i]}</text>`).join('')}
 ${findings.map(i=>{
  const rung=+work['s3_r'+i],y=ys[rung-1]-26;
  return `<g class="finding-dot ${current===i?'active':''}" data-finding-pin="${i}" data-rung-position="${rung}" role="img" aria-label="${esc('F'+i+': '+work['s3_f'+i]+'. '+EVIDENCE_RUNGS[rung-1])}">
   <circle cx="${xs[i-1]}" cy="${y}" r="22" fill="${current===i?'#efd9b5':'#fffef9'}" stroke="#547b5b" stroke-width="1.5"/>
   <text x="${xs[i-1]}" y="${y+5}" text-anchor="middle" fill="#171717" font-size="15" font-weight="600">F${i}</text></g>`;
 }).join('')}
 <text x="89" y="35" fill="#171717" font-size="14" letter-spacing="1">KIND OF SUPPORT</text></svg></div>
 <p class="visual-caption">F1, F2 and F3 follow the findings you enter. A higher rung describes the support. Check its quality and relevance too.</p>`;
}

function workingVisual(id,screen,part=0){
 const question=questionPlan(id)[Number(screen)];
 const finding=question?.type==='finding'?Number(question.key.slice(-1)):-1;
 let visual=id===3?evidenceVisual(finding):`<div class="live-method">${diagramMarkup(id,part)}</div>`;
 if(id===4)visual+=`<p class="thread-purpose" data-thread-purpose>${esc(work.s4_thread||'Your purpose will stay visible along this thread.')}</p>`;
 if(id===6)visual+=`<div class="live-scores">${['Advantage','Fit','Simplicity','Trial','Visibility'].map((s,i)=>`<span><b>${s}</b>${work['s6_a'+(i+1)]||3}/5</span>`).join('')}</div><p class="visual-caption">Scores start at 3. Adjust each lens to reflect your evidence.</p>`;
 if(![3,4,6].includes(id)){
  const value=work[question?.key];
  if(typeof value==='string'&&value.trim())visual+=`<p class="live-excerpt">${esc(value)}</p>`;
 }
 return `<section class="working-visual visual-${id}" aria-label="${esc(T[id].name)} diagram">${visual}</section>`;
}
function updateWorkingVisual(){
 const question=document.querySelector('[data-question-key]')?.dataset.questionKey;
 if(/^s3_f[123]$/.test(question||'')){
  const rung=Number(work['s3_r'+question.slice(-1)]);
  const speech=document.querySelector('.question-guidance .speaker-bubble>p');
  if(speech&&rung)speech.textContent=LESSONS[3][rung-1][3];
 }
 document.querySelectorAll('[data-live-visual]').forEach(el=>{
  const id=Number(el.dataset.liveVisual);
  if(id===4){
   // Keep the walkthrough geometry in place. Only the check and purpose change.
   const purpose=el.querySelector('[data-thread-purpose]');
   purpose.textContent=work.s4_thread||'Your purpose will stay visible along this thread.';
   purpose.title=work.s4_thread||'';
   el.querySelectorAll('[data-map-step]').forEach((node,i)=>{
    const checked=Boolean(work['s4_c'+(i+1)]);
    node.disabled=true;
    node.classList.toggle('thread-checked',checked);
    node.classList.toggle('is-current',i===Number(el.dataset.livePart));
    node.setAttribute('aria-label',`${THREAD_PINS[i]}, ${checked?'checked':'to investigate'}`);
   });
   return;
  }
  el.innerHTML=workingVisual(id,el.dataset.liveScreen,+el.dataset.livePart);
  el.querySelectorAll('[data-map-step]').forEach(node=>{
   node.classList.toggle('is-current',+node.dataset.mapStep===+el.dataset.livePart);
   node.disabled=true;
  });
 });
 scheduleMapLayout();
}

const METHOD_TAGS=[['Intended reading','Negotiated reading','Oppositional reading'],['Critical thinking','Anchoring','Interests vs. positions','Empathy','Proximate vs. root cause'],['Deductive reasoning','Inductive reasoning','Abductive reasoning','Framing'],['Evidence','Bad logic','Confirmation bias','Rhetoric'],['Storytelling','Commitment and consistency'],['Argumentation','Principled negotiation',"Hanlon’s Razor",'Coaching'],['Innovation pitch','Value negotiation','Reciprocity','Trust']];
