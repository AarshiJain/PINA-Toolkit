const anyIds = Object.keys(ANYTIME).map(Number);
const anyUrl = (id, mode='start', step=0) => `#anytime/${id}/${mode}/${step}`;
const anyVal = (id, key) => String(work[`s${id}_${key}`] ?? '').trim();
const anyNumber = (id, key) => {
  const raw = anyVal(id, key);
  return raw !== '' && Number.isFinite(Number(raw)) ? Number(raw) : null;
};

function quizMarkup(quiz, title='Check your understanding', note='') {
  const [question, choices, correct, explanation] = quiz;
  return `<section class="quick-quiz" data-quick-quiz data-correct="${correct}">
    <p class="eyebrow">QUICK PRACTICE</p><h2>${esc(title)}</h2>
    ${note ? `<p class="quiz-context">${esc(note)}</p>` : ''}<p class="quiz-question">${esc(question)}</p>
    <div class="quiz-options">${choices.map((c,i)=>`<button type="button" data-quiz-choice="${i}" aria-pressed="false">${esc(c)}</button>`).join('')}</div>
    <p class="quiz-feedback" aria-live="polite" data-explanation="${esc(explanation)}"></p>
  </section>`;
}

function stageQuiz(id) {
  const j=JOURNEY[id];
  if(!j) return home();
  const contexts=[
    'A streaming service is retiring a plan that some members still use.',
    'A streaming team gets a brief that says “Make the home screen more addictive.” It suspects members may actually want to find something faster.',
    'A team thinks members need to find something to watch faster. A colleague thinks the real issue is confidence in their choice.',
    'Five people in interviews liked a prototype. The team wants to recommend launching it.',
    'The team wanted a prototype to communicate choice. An outsider understood it as a restriction.',
    'A new team removes a label from a design it inherited. The outgoing team had a reason for including it.',
    'A client wants to understand what a studio will deliver beyond production time.'
  ];
  return shell(`<section class="any-practice">
    <header><p class="eyebrow">${esc(T[id].name)}</p></header><article>
    ${quizMarkup([j.question,j.choices,j.answer,j.feedback[j.answer]],'Check your understanding',contexts[id])}
    <nav class="any-actions"><a class="ink-button quiet" href="#story/${id}/4">← Back to the map</a><a class="ink-button primary" href="#make/${id}/context">Work on my project →</a></nav>
  </article></section>`, 'chapter-page');
}

function caseStageQuiz(id) {
  const examples = {
    0: ['When a familiar plan changes, what should the message name first?', ['What changes for the member and what they can do.', 'A general statement about innovation.', 'The name of the team that wrote it.'], 0, 'A member can interpret the change once its effect and their options are clear.'],
    1: ['“Make the plan more appealing” is the request. What would you check before redesigning it?', ['Whether the plan actually lacks appeal and what members are trying to achieve.', 'Which new badge to add.', 'Which headline sounds more confident.'], 0, 'The proposed change hides an assumption about the problem. Look for evidence before accepting it.'],
    2: ['One frame says members dislike the fee. A rival says they cannot tell who counts as a household. What helps you choose?', ['The frame the team wrote first.', 'Evidence that could distinguish the two explanations.', 'A louder launch message.'], 1, 'A fair test asks what you would expect to see if each explanation were true.'],
    3: ['Member counts rose after a change. What would support a causal claim?', ['The timing alone.', 'A larger font for the number.', 'A comparison that helps separate the change from other causes.'], 2, 'An observed rise is a finding. A relevant comparison helps test what caused it.'],
    4: ['What checks whether the design still carries the original idea?', ['Ask someone unfamiliar with it to explain what they think it says.', 'Ask the team whether they remember the goal.', 'Add the goal to the project filename.'], 0, 'A fresh reading shows what the work itself communicates.'],
    5: ['What should the next team be able to reconstruct?', ['The final decision, its reasons, alternatives and open questions.', 'Only the latest design file.', 'Only the names of people who attended.'], 0, 'A good handover lets the next team understand and revisit the reasoning.'],
    6: ['Which line makes the studio’s value easier for a client to see?', ['We spent 40 hours.', 'The process was complicated.', 'A short pilot will show whether the team can make a clearer decision sooner.'], 2, 'A bounded trial with a visible result lets the client judge the value.']
  };
  return quizMarkup(examples[id], 'Try the method in this case');
}

function anyField(id,key,label,hint='',type='text',options=[]) {
  const name = `s${id}_${key}`, value=anyVal(id,key), attr=`id="${name}" data-any-input="${name}" ${hint?`aria-describedby="hint-${name}"`:''}`;
  const control = type==='select'
    ? `<select ${attr}><option value="">Choose…</option>${options.map(option=>{
        const [key,text]=Array.isArray(option)?option:[option,option];
        return `<option value="${esc(key)}" ${value===String(key)?'selected':''}>${esc(text)}</option>`;
      }).join('')}</select>`
    : type==='area' ? `<textarea ${attr} rows="3">${esc(value)}</textarea>`
    : type==='range' ? `<div class="any-range"><input ${attr} type="range" min="1" max="${options[0]}" value="${esc(value || options[1])}"><output for="${name}" data-range-readout="${name}">${esc(value || options[1])}</output></div>`
    : `<input ${attr} type="${type}" ${type==='number'?'step="any"':''} value="${esc(value)}">`;
  return `<div class="any-field"><label for="${name}">${esc(label)}</label>${hint?`<p id="hint-${name}">${esc(hint)}</p>`:''}${control}</div>`;
}

function stakeholderRows() {
  return [1,2,3,4].map(n=>({n,name:anyVal(7,'n'+n),power:anyVal(7,'p'+n),interest:anyVal(7,'i'+n),hears:anyVal(7,'h'+n)}));
}

function stakeholderMap(step, mode) {
  const isWork=mode==='work', rows=isWork?stakeholderRows():[];
  const pending=rows.filter(r=>r.name&&(!r.power||!r.interest));
  const priority=anyVal(7,'priority');
  const change=isWork&&anyVal(7,'change');
  return `<div class="stakeholder-map">
    <div class="any-visual-heading"><h2>Power and interest matrix</h2>${change?`<p>${esc(change)}</p>`:''}</div>
    <div class="axis-label">Power ↑</div>
    <div class="stakeholder-grid">${STAKEHOLDER_QUADRANTS.map(([p,i,title],n)=>{
      const heading=`<span class="quadrant-number">${n+1}</span><span><strong>${title}</strong>
        <small>${p==='H'?'High':'Low'} power · ${i==='H'?'High':'Low'} interest</small></span>`;
      if(mode==='learn') return `<button class="quadrant ${n+1===step?'is-current':''}" type="button" data-any-part="${n+1}" aria-pressed="${n+1===step}">${heading}</button>`;
      const members=rows.filter(r=>r.name&&r.power===p&&r.interest===i);
      return `<section class="quadrant"><div class="quadrant-title">${heading}</div>${members.length?`<ul class="matrix-entries">${members.map(r=>
        `<li><b>${esc(r.name)}</b>${priority===String(r.n)?'<small>Engage first</small>':''}${r.hears?`<p><span>Might hear</span> ${esc(r.hears)}</p>`:''}</li>`
      ).join('')}</ul>`:''}</section>`;
    }).join('')}</div><div class="axis-label axis-right">Interest →</div>
    ${pending.length?`<p class="matrix-pending"><b>To place</b> ${pending.map(r=>esc(r.name)).join(', ')}. Choose power and interest to put them on the matrix.</p>`:''}
    ${isWork&&!rows.some(r=>r.name)?'<p class="matrix-pending">Add a person or group, then choose their power and interest.</p>':''}
  </div>`;
}

function leverScores() {
  return LEVERS.map((_,i)=>anyNumber(8,'level'+i) ?? 1);
}

function chosenLever() {
  const chosen=anyNumber(8,'lead');
  if(Number.isInteger(chosen)&&LEVERS[chosen]) return chosen;
  const scores=leverScores(), top=Math.max(...scores);
  return top>1&&scores.filter(n=>n===top).length===1?scores.indexOf(top):null;
}

function meterMarkup(position,left,right,threshold=null) {
  const clip=n=>Math.min(100,Math.max(0,n));
  return `<div class="tool-meter" aria-hidden="true">
    <div class="tool-meter-track">${threshold===null?'':`<i style="--stop:${clip(threshold)}%"></i>`}
    ${position===null?'':`<b style="--stop:${clip(position)}%"></b>`}</div>
    <div class="tool-meter-labels"><span>${esc(left)}</span><span>${esc(right)}</span></div>
  </div>`;
}

function leverMeter(lead,level) {
  if(lead===null)return '';
  const passed=[1,2,3].filter(n=>work['s8_ethics'+n]).length;
  const pressure=(level-1)*10+(3-passed)*20;
  return `<div class="lever-meter">
    ${meterMarkup(pressure,'Influence','Pressure')}
    <p><b>${pressure<40?'Lower pressure':pressure<70?'Check for pressure':'Higher pressure'}</b> · ${passed}/3 checks confirmed.</p>
    <p class="any-footnote">Based on the intensity of your chosen lever and the checks you confirm.</p>
  </div>`;
}

function leverHints() {
  const line=anyVal(8,'statement');
  if(!line) return '';
  const matches=LEVERS.flatMap(([name,,pattern],i)=>{
    const match=line.match(pattern);
    return match?[`<button class="text-link" type="button" data-pick-lever="${i}">${name}</button> <span>“${esc(match[0])}”</span>`]:[];
  });
  return matches.length?`<div class="lever-hints"><b>Possible cues in your line</b><ul>${matches.map(item=>`<li>${item}</li>`).join('')}</ul></div>`:'';
}

function leverIntensity() {
  const lead=chosenLever();
  if(lead===null)return '<p class="input-caption">Choose one lever on the board to adjust its intensity.</p>';
  return `<p class="input-caption"><b>${esc(LEVERS[lead][0])} · ${leverScores()[lead]}/5</b><br>Move the selected lever on the board. 1 is subtle. 5 makes it the main reason to act.</p>`;
}

function dealStatus() {
  const ours=anyNumber(9,'ours'), theirs=anyNumber(9,'theirs'), side=anyVal(9,'side');
  if(!side||ours===null||theirs===null) return null;
  const buy=side==='buy', min=buy?theirs:ours, max=buy?ours:theirs;
  return {min,max,unit:anyVal(9,'unit'),buy};
}

function dealResult(status) {
  if(!status) return 'Choose your role and enter both limits to see the deal range.';
  const {min,max,unit}=status, u=unit?' '+unit:'';
  if(max<min) return `No overlap on these terms. The buyer can pay ${max}${u} and the seller needs ${min}${u}. Change the terms or use your fallback.`;
  if(max===min) return `One possible point at ${min}${u}. There is no room to move on this measure.`;
  return `Possible deal range: ${min} to ${max}${u}. Use your target and other terms to decide what to propose.`;
}

function tradeMove(n) {
  const u=anyNumber(9,'us'+n), t=anyNumber(9,'them'+n);
  if(u===null||t===null) return 'Set both priorities';
  if(u<t) return 'Offer in exchange';
  if(u>t) return 'Ask for or protect';
  return u===3?'Protect together':u===1?'Flexible':'Discuss together';
}

function valueMeterData() {
  const floor=anyNumber(6,'floor'), offer=anyNumber(6,'offer');
  const unit=anyVal(6,'unit'), u=unit?' '+unit:'';
  if(floor===null||offer===null) return {position:null,text:'Enter a minimum and a proposal in the same unit.'};
  const span=Math.max(Math.abs(floor)*.25,1)+Math.abs(offer-floor);
  return {position:50+(offer-floor)/span*44,text:offer<floor
    ? `Below your minimum. Decline or change the terms (${offer}${u} vs. ${floor}${u}).`
    : offer===floor ? `At your minimum (${floor}${u}). Check the other terms before agreeing.`
    : `Above your minimum (${offer}${u} vs. ${floor}${u}). There is room to create value.`};
}

function valueMeter() {
  const state=valueMeterData();
  return `${meterMarkup(state.position,'Decline','Room to create value',50)}<p>${esc(state.text)}</p>`;
}

function valueFields() {
  return `<div class="value-threshold"><h3>Compare a proposal</h3><p>Use a measure where more is better, such as a fee or hours of support.</p>
    <div class="any-inline">${anyField(6,'floor','Minimum acceptable','','number')}${anyField(6,'offer','Current proposal','','number')}${anyField(6,'unit','Unit (e.g. USD or hours)')}</div>
    <div data-value-meter aria-live="polite">${valueMeter()}</div>
  </div>`;
}

function trustScores() {
  return TRUST_CORNERS.map((_,i)=>anyNumber(10,'corner'+i));
}

function weakestTrust() {
  const scores=trustScores();
  if(scores.some(s=>s===null)) return [];
  return TRUST_CORNERS.filter((_,i)=>scores[i]===Math.min(...scores));
}

function trustEquation() {
  const scores=TRUST_EQUATION.map((_,i)=>anyNumber(10,'eq'+i) ?? 5);
  return ((scores[0]+scores[1]+scores[2])/scores[3]).toFixed(1);
}

function trustTriangle() {
  const corners=[[150,29],[32,193],[268,193]], center=[150,137], scores=trustScores();
  const points=corners.map(([x,y],i)=>{
    const fraction=(scores[i]??0)/5;
    return `${center[0]+(x-center[0])*fraction},${center[1]+(y-center[1])*fraction}`;
  }).join(' ');
  const weak=weakestTrust();
  return `<svg class="any-diagram" viewBox="0 0 300 225" role="img" aria-label="Trust triangle">
    <polygon points="${corners.map(p=>p.join(',')).join(' ')}" class="trust-outline"/>
    ${corners.map(([x,y])=>`<line x1="150" y1="137" x2="${x}" y2="${y}" class="trust-spoke"/>`).join('')}
    ${scores.some(s=>s!==null)?`<polygon points="${points}" class="trust-fill"/>`:''}
    <text x="150" y="19" text-anchor="middle">Ethos</text><text x="32" y="216" text-anchor="start">Pathos</text><text x="268" y="216" text-anchor="end">Logos</text>
  </svg><p>${scores.some(s=>s!==null)?TRUST_CORNERS.map((label,i)=>`${label} ${scores[i]??'unscored'}`).join(' · '):'Score your three corners to see where to work.'}</p>
  ${weak.length?`<p><b>${weak.length===3?'All corners are even':'Start with '+weak.join(' or ')}</b></p>`:''}`;
}

function pitchArc(active=-1) {
  const coords=[[30,118],[78,86],[125,53],[172,38],[219,59],[268,91]];
  return `<svg class="any-diagram pitch-diagram" viewBox="0 0 300 153" role="img" aria-label="Pitch arc, from situation to ask">
    <path d="M30 118C60 101 93 64 125 53S155 34 172 38S237 70 268 91" fill="none" stroke="#497562" stroke-width="3"/>
    ${coords.map(([x,y],i)=>`<circle class="${i===active?'arc-current':anyVal(12,'beat'+i)?'arc-filled':'arc-empty'}" cx="${x}" cy="${y}" r="12"/><text x="${x}" y="${y+4}" text-anchor="middle">${i+1}</text>`).join('')}
  </svg><ol class="pitch-labels">${ANYTIME[12].steps.map(([label],i)=>`<li ${i===active?'aria-current="step"':''}>${label}${anyVal(12,'beat'+i)?' ✓':''}</li>`).join('')}</ol>`;
}

function dealGraphic(mode) {
  const isWork=mode==='work';
  const status=isWork?dealStatus():null;
  const unit=isWork&&anyVal(9,'unit');
  const side=isWork&&anyVal(9,'side');
  const amount=key=>{
    const number=isWork?anyNumber(9,key):null;
    return number===null?'Awaiting entry':`${number}${unit?' '+unit:''}`;
  };
  const trades=isWork?[1,2,3].filter(n=>anyVal(9,'trade'+n)):[];
  const range=status?dealRange(status):'<p class="deal-note">The deal range appears when both limits are set.</p>';
  return `<div class="deal-board"><div class="any-visual-heading"><h2>Deal Table</h2></div>
    <table class="deal-limits"><thead><tr><th scope="col">Term</th><th scope="col">Our side</th><th scope="col">Their side</th></tr></thead>
      <tbody><tr><th scope="row">Role</th><td>${side==='buy'?'Buyer':side==='sell'?'Seller':'Choose a role'}</td><td>${side==='buy'?'Seller':side==='sell'?'Buyer':'Other party'}</td></tr>
      <tr><th scope="row">Limit (RP)</th><td>${esc(amount('ours'))}</td><td>${esc(amount('theirs'))}</td></tr>
      <tr><th scope="row">Target (DP)</th><td>${esc(amount('target'))}</td><td>Not estimated</td></tr></tbody>
    </table>
    ${range}
    ${trades.length?`<ul class="deal-trades">${trades.map(n=>`<li><b>${esc(anyVal(9,'trade'+n))}</b><span>${esc(tradeMove(n))}</span></li>`).join('')}</ul>`:''}
    ${isWork&&anyVal(9,'posture')?`<p class="deal-note"><b>Posture</b> ${esc(anyVal(9,'posture'))}</p>`:''}
  </div>`;
}

function dealRange(status) {
  const {min,max}=status;
  const diff=Math.abs(min-max), left=diff?26:50, right=diff?74:50;
  const seller=min<=max?left:right, buyer=min<=max?right:left;
  return `<div class="deal-key"><span>Buyer’s range</span><span>Seller’s range</span></div>
    <div class="deal-scale" aria-hidden="true" style="--seller:${seller}%;--buyer:${buyer}%">
      <span class="deal-seller"></span><span class="deal-buyer"></span>
    </div><p class="deal-note">${esc(dealResult(status))}</p>`;
}

function leverBoard(step,mode) {
  const project=mode==='work', lead=project?chosenLever():null;
  const level=lead===null?null:leverScores()[lead];
  const picking=project&&step===1;
  return `<div class="lever-board" data-lever-board>
    <div class="any-visual-heading"><h2>Lever Board</h2></div>
    <div class="lever-cards">${LEVERS.map(([name],i)=>{
      const selected=i===lead;
      return `<div class="lever-slot ${selected?'is-current':''}">
        <button type="button" class="lever-card" data-lever-info="${i}"
          ${picking?`data-pick-lever="${i}" aria-pressed="${selected}"`:''}>
          <strong>${esc(name)}</strong>
          ${selected&&picking?'':`<span class="lever-track" style="--lever-position:${selected?(level-1)*25:0}%" aria-hidden="true"><i></i></span>`}
        </button>
        ${selected&&picking?`<input class="lever-control" type="range" min="1" max="5" value="${level}" data-board-slider data-any-input="s8_level${i}" aria-label="${esc(name)} intensity">`:''}
        <span class="lever-level" aria-hidden="true">${selected?level+'/5':''}</span>
      </div>`;
    }).join('')}</div>
    <div class="lever-definition" data-lever-definition role="status">${leverDefinition(lead)}</div>
    ${project&&step===0?leverHints():''}
    ${project&&step===2?leverMeter(lead,level):''}</div>`;
}

function leverDefinition(index){
  if(index===null)return '<p>Explore a lever to see what it does.</p>';
  const [name,definition]=LEVERS[index];
  return `<p><b>${esc(name)}</b> ${esc(definition)}</p>`;
}

const TRAP_MARKS=['M4 12h5m0 0 7-7m-7 7 7 7m0-14v5m0-5h-5m5 14v-5m0 5h-5',
  'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 7c0-7 14-7 14 0M4 4l16 16',
  'M4 5l6 5 3-1 7 9m-5 0h5v-5','M6 20V8m12 12V8M4 8h16M8 4l4 3 4-3m-4 4v10',
  'M5 12c5-6 10-6 13 0-3 6-8 6-13 0Zm0 0-3-4v8l3-4m9 0h1',
  'M4 6h6m-3-3v6m6 4h7m-7 4h7m-7 4h7M7 13v7',
  'M4 12h6m4 0h6m-3-3 3 3-3 3M11 8l2 8',
  'M5 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3 17v-3h4v3m3 0v-3h4v3m3 0v-3h4v3',
  'M12 5v13m-3-9h6m-10 4c0 5 3 7 7 7s7-2 7-7m-2 2 2-2 2 2M10 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z',
  'M3 5h18l-7 8v5l-4 2v-7z'];

let trapListCount=0;
function logicDefinitions() {
  const list=++trapListCount;
  return `<div class="logic-definitions" aria-label="Fallacy definitions">${LOGIC_DECK.map(([name,def],i)=>{
    const panel=`trap-${list}-${i}`;
    return `<section class="logic-trap">
      <button type="button" class="trap-toggle" aria-expanded="false" aria-controls="${panel}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${TRAP_MARKS[i]||'M3 7h18M3 12h18M3 17h18'}"/></svg><b>${esc(name)}</b><span aria-hidden="true">+</span></button>
      <div class="trap-panel" id="${panel}" aria-hidden="true"><div><p class="trap-definition">${esc(def)}</p></div></div>
    </section>`;
  }).join('')}</div>`;
}

function anyVisual(id,step,mode) {
  if(id===7) return stakeholderMap(step,mode);
  if(id===8) return leverBoard(step,mode);
  if(id===9) return dealGraphic(mode);
  if(id===10) return trustTriangle();
  if(id===11) return logicDefinitions();
  if(id===13) return threeVisual(mode);
  if(id===14) return empathyVisual(mode);
  return pitchArc(step);
}

function anytimeWorkFields(id) {
  if(id===13||id===14)return extendedWorkFields(id);
  const field=(...args)=>anyField(id,...args);
  const area=(key,label,hint)=>field(key,label,hint,'area');
  const select=(key,label,options,hint='')=>field(key,label,hint,'select',options);
  const range=(key,label,max,start,hint='')=>field(key,label,hint,'range',[max,start]);
  const steps={
    7: [
      ['What change are you planning?',()=>area('change','The change in one sentence','What are you asking people to accept, support or do?')],
      ['Who is affected?',()=>stakeholderRows().map(({n})=>`<fieldset class="stakeholder-entry"><legend>Person or group ${n}</legend>
        ${field('n'+n,'Name')}`+
        `<div class="any-inline">${select('p'+n,'Power',[['H','High'],['L','Low']],'Can they change or block the decision?')}
        ${select('i'+n,'Interest',[['H','High'],['L','Low']],'How much does the change affect or matter to them?')}</div>
        ${area('h'+n,'What might they hear?','Write their possible reading in their voice. For example, “Will this make it harder for my team to get approval?”')}</fieldset>`).join('')],
      ['Who do you engage first?',()=>`${priorityField()}${area('lead','We lead with','Write the actual opening line you would use with the person or group you chose.')}`]
    ],
    8: [
      ['What are you asking someone to do?',()=>field('audience','Who is your audience?')+field('action','What action do you want them to take?')+
        area('statement','Paste or write the message','Use the exact wording they would hear. The board looks for possible cues as you type.')],
      ['Which lever fits the message?',()=>`<p class="input-caption">Choose one lever on the board. Then adjust how strongly you use that lever.</p>
        <div data-lever-intensity>${leverIntensity()}</div>`+
        area('real','Evidence you can point to (optional)','For example, add the actual deadline or a link to feedback from similar teams.')],
      ['Is the message fair to the audience?',()=>`<fieldset class="ethics-list"><legend>Which of these can you verify?</legend>
        ${['I can show where the claim or limit comes from.','I would be comfortable explaining the tactic to the audience.','The audience can see the benefit and freely say no.'].map((label,i)=>`<label><input type="checkbox" data-any-input="s8_ethics${i+1}" ${work['s8_ethics'+(i+1)]?'checked':''}> <span>${label}</span></label>`).join('')}</fieldset>
        <button class="ink-button small quiet" type="button" data-turn-down>Turn the chosen lever down by 2</button>`+
        area('revision','Write the quieter version','Keep the relevant facts. Remove wording that rushes people or makes agreement feel compulsory.')]
    ],
    9: [
      ['Where are the limits?',()=>select('side','We are',[['buy','Buying'],['sell','Selling']],'Choose which side of the exchange you are preparing for.')+
        `<div class="any-inline">${field('ours','Our reservation point (RP)','The most we pay if buying, or the least we accept if selling.','number')}
        ${field('theirs','Their estimated RP','The other side’s limit. Use your best estimate.','number')}</div>
        <div class="any-inline">${field('target','Our desired point (DP)','The price, scope or amount we aim for.','number')}${field('unit','Unit','For example, USD per share, work hours or review rounds.')}</div>`],
      ['What can you trade?',()=>[1,2,3].map(n=>`<fieldset class="stakeholder-entry"><legend>Trade ${n}</legend>${field('trade'+n,'Issue','For example, delivery date or number of revisions.')}
        <div class="any-inline">${select('us'+n,'Matters to us',importance)}${select('them'+n,'Matters to them',importance)}</div>
        <p class="trade-move" data-trade-move="${n}">${tradeMove(n)}</p></fieldset>`).join('')],
      ['How will you negotiate?',()=>`<p class="input-caption">Reactive postures respond in the moment. Strategic negotiators plan trades in advance. Principled negotiators work from both sides’ interests and a shared standard of fairness.</p>`+
        `<dl class="posture-definitions">${POSTURES.map(([name,def])=>`<div><dt>${name}</dt><dd>${def}</dd></div>`).join('')}</dl>`+
        select('posture','Negotiation posture',POSTURES.map(([name])=>name))+
        area('fallback','Our best alternative (BATNA)','What will we do if there is no deal?')+area('theirfallback','Their likely alternative','What can they do if there is no deal?')]
    ],
    10: [
      ['What message are you testing?',()=>field('audience','Who needs to trust this message?')+area('message','The message as it stands')],
      ['Where is trust strong or weak?',()=>TRUST_CORNERS.map((name,i)=>`<fieldset class="stakeholder-entry"><legend>${name}</legend>
        ${area('reason'+i,'What do you see in the message?',ANYTIME[10].steps[i][2])}
        ${select('corner'+i,'Score',[1,2,3,4,5],'1 is missing or weak. 5 is clear and convincing.')}</fieldset>`).join('')],
      ['What would you improve first?',()=>`<details class="deep-trust"><summary>D · Go deeper with the trust equation</summary>
        <p>Trust = (Credibility + Reliability + Intimacy) ÷ Self-orientation.</p>
        ${TRUST_EQUATION.map(([label,hint],i)=>range('eq'+i,label,10,5,hint)).join('')}
        <p data-trust-equation>Current score: ${trustEquation()}</p>
        <p class="any-footnote">Use the result to compare changes to this message.</p></details>`+
        area('repair','Write one concrete repair','Start with the lowest corner, or choose one if they tie. What would you add, remove or say differently?')]
    ],
    11: [
      ['Write your own card',()=>area('claim','What was said?','Paste the claim exactly as you heard it.')+area('evidence','What is being treated as evidence?','Record the fact, example, quote or assumption used to support that claim. You can write “None given”.')+
        select('trap','Which trap fits?',LOGIC_DECK.map(([label])=>label))+
        area('reason','What makes it a trap?','Which assumption, distraction or leap makes the argument weak?')+
        area('fix','What would you say or do instead?','Rewrite the line or name the evidence or option you would add.')]
    ],
    12: ANYTIME[12].steps.map(([label,hint],i)=>[label,()=>`${i===0?field('audience','Who is the pitch for?')+select('route','How will your audience decide?',Object.entries(PITCH_ROUTES).map(([k,[name]])=>[k,name]),'Choose a route to get guidance for each beat.'):''}<div data-pitch-route-guide>${pitchRouteGuide(i,anyVal(12,'route'))}</div>${area('beat'+i,'Your '+label.toLowerCase(),ANYTIME[12].steps[i][2])}`])
  };
  return steps[id];
}

const importance=[[1,'Low'],[2,'Medium'],[3,'High']];

function priorityField() {
  const rows=stakeholderRows().filter(r=>r.name);
  const high=rows.filter(r=>r.power==='H'&&r.interest==='H');
  const suggestion=high.length===1?`The grid suggests ${high[0].name} because they have high power and high interest.`
    :high.length>1?'Several groups have high power and high interest. Choose who needs to hear from you first.'
    :'Choose who needs to hear from you first. Place each group on the map to see which have high power and high interest.';
  return anyField(7,'priority','Priority person or group',suggestion,'select',rows.map(r=>[r.n,r.name]));
}

function pitchRouteGuide(step,route){
  const entry=PITCH_ROUTES[route];
  if(!entry)return '';
  const [title,description]=entry[1][step];
  return `<div class="pitch-route-note"><b>${title}</b><p>${description}</p></div>`;
}

function pitchPrompt() {
  const audience=anyVal(12,'audience')||'[audience]';
  return `Draft a short spoken pitch for ${audience}. Use my six beats below. Keep the evidence and ask specific, flag gaps in the evidence and do not invent details. End with a decision the audience can make.${PITCH_ROUTES[anyVal(12,'route')]?' Their decision style: '+PITCH_ROUTES[anyVal(12,'route')][0]+'.':''}\n\n`+
    ANYTIME[12].steps.map(([label],i)=>`${label}: ${anyVal(12,'beat'+i)||'['+label.toLowerCase()+']'}`).join('\n');
}

function anytimeDraft(id) {
  const v=key=>anyVal(id,key);
  const line=(label,value)=>value?`${label}: ${value}`:'';
  let lines=[];
  if(id===7) {
    const rows=stakeholderRows(), high=rows.filter(r=>r.name&&r.power==='H'&&r.interest==='H');
    const priority=rows.find(r=>r.name&&String(r.n)===v('priority'))||(high.length===1?high[0]:null);
    lines=[line('Change',v('change')),line('Engage first',priority?.name||'Choose a person or group'),
      line('What they might hear',priority?.hears||'Capture their likely reading'),line('We lead with',v('lead')),
      ...rows.filter(r=>r.name).map(r=>`${r.name} · ${{H:'High',L:'Low'}[r.power]||'Unrated'} power · ${{H:'High',L:'Low'}[r.interest]||'Unrated'} interest${r.hears?'\nThey may hear: '+r.hears:''}`)];
  }
  if(id===8) {
    const lead=chosenLever();
    lines=[line('Audience',v('audience')),line('Action',v('action')),line('Original line',v('statement')),
      line('Lead with',lead===null?'Choose a lead lever':LEVERS[lead][0]),line('It holds up because',v('real')),
      line('Ethics checks confirmed',String([1,2,3].filter(n=>work['s8_ethics'+n]).length)+'/3'),
      line('Revised line',v('revision'))];
  }
  if(id===9) {
    const unit=v('unit')?' '+v('unit'):'';
    lines=[line('Our role',{buy:'Buying',sell:'Selling'}[v('side')]),line('Our limit',v('ours')&&v('ours')+unit),
      line('Their estimated limit',v('theirs')&&v('theirs')+unit),line('Our target',v('target')&&v('target')+unit),dealResult(dealStatus()),
      ...[1,2,3].filter(n=>v('trade'+n)).map(n=>line(v('trade'+n),tradeMove(n))),
      line('Posture',v('posture')),line('Our fallback',v('fallback')),line('Their likely fallback',v('theirfallback'))];
  }
  if(id===10) {
    const weak=weakestTrust();
    lines=[line('Audience',v('audience')),line('Message',v('message')),
      ...TRUST_CORNERS.map((c,i)=>line(c,[v('corner'+i)&&v('corner'+i)+'/5',v('reason'+i)].filter(Boolean).join(' · '))),
      weak.length&&weak.length<3?line('Start with',weak.join(' or ')):'',
      TRUST_EQUATION.some((_,i)=>v('eq'+i))?line('Trust equation score',trustEquation()):'',line('Repair',v('repair'))];
  }
  if(id===11) lines=[line('Original claim',v('claim')),line('Evidence offered',v('evidence')),line('Trap',v('trap')),line('Why it fits',v('reason')),line('Better move',v('fix'))];
  if(id===13||id===14)lines=extendedDraft(id);
  if(id===12) lines=[line('Audience',v('audience')),line('Decision route',PITCH_ROUTES[v('route')]?.[0]),...ANYTIME[12].steps.map(([label],i)=>line(label,v('beat'+i)))];
  return [ANYTIME[id].name.toUpperCase(),lines.filter(Boolean).join('\n\n')||'Add your project notes to build this draft.'].join('\n\n');
}

function logicCard(step) {
  const [name,def,example,distractors,repair]=LOGIC_DECK[step];
  const choices=distractors.map(i=>LOGIC_DECK[i][0]), answer=(step+1)%3;
  choices.splice(answer,0,name);
  return quizMarkup(['Which trap is this?',choices,answer,`${name}. ${def} ${repair}`],`Card ${step+1} of ${LOGIC_DECK.length}`,`“${example}”`);
}

function anytimeLink(label,url,primary=false) {
  return `<a class="ink-button ${primary?'primary':'quiet'}" href="${url}">${label}</a>`;
}

function anytimeWhy(id,step){
  return ANYTIME[id].steps[step][3]||ANYTIME[id].why[step];
}

function anytimeLearnPanel(id,step) {
  const [title,meaning,action]=ANYTIME[id].steps[step];
  const quadrant=id===7&&STAKEHOLDER_QUADRANTS[step-1];
  return `<article class="map-callout">
    <div class="callout-heading"><span class="reading-number">${String(step+1).padStart(2,'0')}</span><h2>${esc(title)}</h2></div>
    ${quadrant?`<p class="eyebrow quadrant-profile">${quadrant[0]==='H'?'HIGH':'LOW'} POWER · ${quadrant[1]==='H'?'HIGH':'LOW'} INTEREST</p>`:''}
    <p class="part-meaning">${esc(meaning)}</p>
    ${action?`<div class="callout-action"><b>What you do</b><p>${esc(action)}</p></div>`:''}
    ${id===12?`<details class="small-disclosure"><summary>Compare the two audience routes</summary>${Object.entries(PITCH_ROUTES).map(([key,[label]])=>`<div><b>${label}</b>${pitchRouteGuide(step,key)}</div>`).join('')}</details>`:''}
    ${mapSpeaker(anytimeWhy(id,step),step===ANYTIME[id].steps.length-1)}
  </article>`;
}

function anytimeLearnVisual(id,step) {
  const visual=anyVisual(id,step,'learn');
  if(id===7) return visual;
  if(id===11) return `<div class="any-learn-content">
    <nav class="logic-step-tabs" aria-label="Method parts">${ANYTIME[id].steps.map(([name],i)=>`<button type="button" data-any-part="${i}" aria-pressed="${i===step}">${esc(name)}</button>`).join('')}</nav>
    ${visual}</div>`;
  return `<div class="any-learn-content">${visual}
    <div class="any-method-parts" aria-label="Method parts">${ANYTIME[id].steps.map(([name],i)=>
      `<button class="diagram-node ${i===step?'is-current':''}" type="button" data-any-part="${i}" aria-pressed="${i===step}">
        <span class="node-number">${i+1}</span><strong>${name}</strong></button>`).join('')}</div></div>`;
}

function anytimePage(id,mode,requestedStep) {
  const t=ANYTIME[id];
  if(!t) return home();
  const workspaceTitle=id===7?'Power and Interest Matrix':t.name;
  const n=Number(requestedStep), raw=Number.isInteger(n)&&n>=0?n:0;
  const last=t.steps.length-1;
  const isLogic=id===11;
  const link=anytimeLink;
  if(mode==='case') {
    const [intended,heard,change]=t.caseReading;
    const tags=id===7?['Power and interest','Trust','Authority']:id===9?['Reservation points','Reactive and strategic postures','Principled negotiation']:t.steps.map(([tag])=>tag);
    return shell(`<div class="case-layout"><aside class="case-reference"><h1>${t.name}</h1>
      <div class="case-method-tags" aria-label="Methods in the original toolkit">${tags.map(tag=>`<span>${tag}</span>`).join('')}</div></aside>
      <section class="standalone-case"><p class="eyebrow">NETFLIX USE CASE</p><h2 class="case-title">${t.caseTitle}</h2>
        ${ANYTIME_SOURCE[id].case.map((p,i)=>`<p${i===0?' class="case-line"':''}>${esc(p)}</p>`).join('')}
        <div class="two-readings"><div><h2>What was intended</h2><p>${intended}</p></div><div><h2>How it could be understood</h2><p>${heard}</p></div></div>
        <div class="speech"><h2>What could change?</h2><p>${change}</p></div>
        <div class="case-method-note"><h2>How this relates to ${t.name}</h2><p>${t.context||t.output}</p></div>
        <div class="any-research"><h2>The research behind it</h2><p>${esc(ANYTIME_SOURCE[id].research)}</p></div>
        ${quizMarkup(t.caseQuiz||t.quiz,'Try the method in this case')}
        <a class="ink-button primary" href="${anyUrl(id,'learn')}">Explain the method →</a>
        <a class="text-link" href="${anyUrl(id,'work')}">Use it on my own project →</a>
        <p class="provenance">Case analysis from your PINA Stage Templates. Check the original references before citing case figures.</p>
      </section></div>`,'chapter-page case-page');
  }
  if(mode==='learn') {
    const step=Math.min(raw,last);
    return shell(`<div class="map-page-head"><h1>${workspaceTitle}</h1></div>
      <section class="map-theatre any-theatre" data-any-learn="${id}" data-any-part-current="${step}">
        <div class="diagram-surface any-method-surface">${anytimeLearnVisual(id,step)}</div>
        <aside class="diagram-explanation" aria-label="Explanation of the selected part" aria-live="polite">${anytimeLearnPanel(id,step)}</aside>
        <nav class="map-controls" aria-label="Method walkthrough">
          <button class="ink-button quiet" data-any-prev ${step===0?'disabled':''}>← Previous</button>
          <span class="map-position">${step+1} / ${last+1}</span>
          <button class="ink-button primary" data-any-next ${step===last?'hidden':''}>Next →</button>
          <a class="ink-button primary" data-any-quiz href="${anyUrl(id,'quiz')}" ${step===last?'':'hidden'}>Check understanding →</a>
        </nav>
      </section>`,'map-page');
  }
  if(mode==='quiz'||(mode==='deck'&&isLogic)) {
    const deck=mode==='deck', step=Math.min(raw,LOGIC_DECK.length-1);
    const buttons=deck
      ? [link('← Back',step?anyUrl(id,'deck',step-1):anyUrl(id,'quiz')),step<LOGIC_DECK.length-1?link('Next card →',anyUrl(id,'deck',step+1),true):link('Write my own card →',anyUrl(id,'work'),true)]
      : [link('← Back to the method',anyUrl(id,'learn',last)),isLogic?link('Play the full deck →',anyUrl(id,'deck'),true):link('Work on my project →',anyUrl(id,'work'),true),...(id===7?[link('Show me the Netflix use case',anyUrl(id,'case'))]:[])];
    return shell(`<section class="any-practice ${isLogic?'any-practice-with-visual':''}"><header><p class="eyebrow">${t.name}</p></header>
      ${isLogic?`<aside class="any-method-surface logic-reference" aria-label="Trap definitions">${logicDefinitions()}</aside>`:''}
      <article>${deck?logicCard(step):quizMarkup(t.quiz)}
      <nav class="any-actions" aria-label="Practice steps">${buttons.join('')}</nav></article></section>`,'chapter-page');
  }
  if(mode==='work') {
    const plan=anytimeWorkFields(id), step=Math.min(raw,plan.length-1);
    const methodPart=({7:[0,1,2],9:[0,2,3],10:[0,1,3],14:[0,1,4]})[id]?.[step]??step;
    const next=step+1===plan.length?link('Build my draft →',anyUrl(id,'draft'),true):link('Keep going →',anyUrl(id,'work',step+1),true);
    return shell(`<div class="chapter-top"><h2 class="working-breadcrumb">${workspaceTitle}</h2><div class="chapter-tools">${restartButton(id)}</div></div>
      <section class="make-spread clarity-work any-workspace" data-any-work="${id}" data-pip-workspace="${id}" data-any-step="${step}">
        <aside class="conversation-pip" aria-label="Working visual"><div class="any-live">${anyVisual(id,step,'work')}</div></aside>
        <article class="conversation-work" tabindex="0" aria-label="Project questions">
          ${exampleButton(id)}<div class="conversation-title"><p class="eyebrow">YOUR PROJECT · ${step+1} OF ${plan.length}</p><h1>${plan[step][0]}</h1></div>
          <div class="answer-sheet any-fields">${plan[step][1]()}</div>
          <div class="question-guidance">${mapSpeaker(anytimeWhy(id,methodPart))}</div>
        </article>
      </section>
      <div class="make-dock"><nav class="make-progress" aria-label="Making progress">
        ${plan.map(([title],i)=>`<a href="${anyUrl(id,'work',i)}" ${i===step?'class="active" aria-current="step"':''} aria-label="${esc(title)}"><span>${i+1}</span></a>`).join('')}
      </nav><div class="working-step-buttons">${link('← Go back',step?anyUrl(id,'work',step-1):anyUrl(id))}${next}</div></div>`,'make-page');
  }
  if(mode==='draft') {
    const file=t.name.replaceAll(' ','-'), step=anytimeWorkFields(id).length-1;
    return shell(`<nav class="draft-breadcrumbs" aria-label="Breadcrumb"><a href="${anyUrl(id)}">${t.name}</a><span aria-hidden="true">›</span>
      <a href="${anyUrl(id,'work')}">Project</a><span aria-hidden="true">›</span><span aria-current="page">Draft</span>${restartButton(id)}</nav>
      <section class="draft-spread" data-pip-workspace="${id}"><aside class="draft-guide ${isLogic?'logic-reference':''}"><div class="any-method-surface" aria-label="Working visual">${anyVisual(id,-1,'work')}</div></aside>
      <article class="draft-paper"><h1 class="paper-tab">${id===12?'Your six-beat pitch':'Your working draft'}</h1>
        <pre class="any-draft">${esc(anytimeDraft(id))}</pre>
        ${id===12?`<details class="deep-trust" open><summary>Reusable pitch prompt</summary><pre class="any-draft">${esc(pitchPrompt())}</pre><button type="button" class="ink-button small" data-copy-pitch>Copy pitch prompt</button></details>`:''}
        <div class="output-actions"><button type="button" class="ink-button primary" data-any-copy="${id}">Copy my draft ${ic('arrow')}</button>
          <button type="button" class="ink-button" data-any-download="${id}" data-file="${file}">Download as text ${ic('download')}</button></div>
      </article></section><nav class="draft-step-nav" aria-label="Working journey">
        <a class="text-link" href="${anyUrl(id,'work')}">Revisit my answers</a>
        <div class="working-step-buttons">${link('← Go back',anyUrl(id,'work',step))}${link('Back to all tools →','#home/0/tools',true)}</div>
      </nav>`,'draft-page');
  }
  return toolDoor({
    name:t.name, id, when:t.when, intro:t.context||t.output, out:t.output,
    diagram:`<div class="any-method-surface any-door-visual">${anyVisual(id,-1,'start')}</div>`,
    idea:anyUrl(id,'learn'), project:anyUrl(id,'work'), useCase:anyUrl(id,'case'),
    projectHint:'Bring your context. Work through the method with guidance.',
    next:id===7?`<p class="stage-next">To go deeper on one person, <a class="text-link" href="${anyUrl(14)}">open Empathy Lens →</a></p>`:id===14?`<p class="stage-next">To map all affected groups, <a class="text-link" href="${anyUrl(7)}">open Power &amp; Interest Matrix →</a></p>`:''
  });
}

async function anyCopy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied to your clipboard.');
  } catch {
    toast('Select the text to copy it, or download the draft.');
  }
}

function bindAnytime() {
  $('[data-any-input="s12_route"]')?.addEventListener('change',event=>{
    const guide=$('[data-pitch-route-guide]');
    if(guide)guide.innerHTML=pitchRouteGuide(0,event.target.value);
  });
  const walkthrough=$('[data-any-learn]');
  if(walkthrough) {
    const id=Number(walkthrough.dataset.anyLearn), last=ANYTIME[id].steps.length-1;
    let step=Number(walkthrough.dataset.anyPartCurrent);
    const surface=walkthrough.querySelector('.any-method-surface');
    const prev=walkthrough.querySelector('[data-any-prev]');
    const next=walkthrough.querySelector('[data-any-next]');
    const quiz=walkthrough.querySelector('[data-any-quiz]');
    const show=(part,restoreFocus=false)=>{
      step=Math.max(0,Math.min(last,part));
      walkthrough.dataset.anyPartCurrent=step;
      if(id===12) surface.innerHTML=anytimeLearnVisual(id,step);
      surface.querySelectorAll('[data-any-part]').forEach(button=>{
        const selected=Number(button.dataset.anyPart)===step;
        button.classList.toggle('is-current',selected);
        button.setAttribute('aria-pressed',String(selected));
        if(selected&&restoreFocus) button.focus({preventScroll:true});
      });
      walkthrough.querySelector('.diagram-explanation').innerHTML=anytimeLearnPanel(id,step);
      walkthrough.querySelector('.map-position').textContent=`${step+1} / ${last+1}`;
      prev.disabled=step===0;
      next.hidden=step===last;
      quiz.hidden=step!==last;
    };
    surface.addEventListener('click',e=>{
      const button=e.target.closest('[data-any-part]');
      if(button) show(Number(button.dataset.anyPart),id===12);
    });
    prev.onclick=()=>{
      show(step-1);
      if(prev.disabled) next.focus({preventScroll:true});
    };
    next.onclick=()=>{
      show(step+1);
      if(next.hidden) quiz.focus({preventScroll:true});
    };
  }
  $$('[data-quick-quiz]').forEach(quiz=>{
    const options=[...quiz.querySelectorAll('[data-quiz-choice]')], feedback=quiz.querySelector('.quiz-feedback');
    options.forEach(button=>button.onclick=()=>{
      const correct=button.dataset.quizChoice===quiz.dataset.correct;
      options.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      feedback.textContent=(correct?'That’s right. ':'Try again. Think about what the method asks you to check.')+
        (correct?feedback.dataset.explanation:'');
      feedback.dataset.result=correct?'right':'retry';
    });
  });
  const root=$('#main');
  const describeLever=e=>{
    const button=e.target.closest('[data-lever-info]');
    if(!button)return;
    const description=button.closest('[data-lever-board]').querySelector('[data-lever-definition]');
    description.innerHTML=leverDefinition(Number(button.dataset.leverInfo));
  };
  root.addEventListener('click',e=>{
    describeLever(e);
    const toggle=e.target.closest('.trap-toggle');
    if(!toggle)return;
    const list=toggle.closest('.logic-definitions');
    const open=toggle.getAttribute('aria-expanded')==='false';
    list.querySelectorAll('.trap-toggle').forEach(button=>{
      const expanded=button===toggle&&open;
      button.setAttribute('aria-expanded',String(expanded));
      document.getElementById(button.getAttribute('aria-controls')).setAttribute('aria-hidden',String(!expanded));
    });
  });
  const workspace=$('[data-any-work]');
  const refresh=()=>{
    const value=$('[data-value-meter]');
    if(value) value.innerHTML=valueMeter();
    if(!workspace) return;
    const id=+workspace.dataset.anyWork;
    if(id!==11)workspace.querySelector('.any-live').innerHTML=anyVisual(id,+workspace.dataset.anyStep,'work');
    $$('[data-trade-move]').forEach(node=>node.textContent=tradeMove(+node.dataset.tradeMove));
    const equation=$('[data-trust-equation]');
    if(equation) equation.textContent='Current score: '+trustEquation();
  };
  root.addEventListener('input',e=>{
    const el=e.target.closest('[data-any-input]');
    if(!el)return;
    const key=el.dataset.anyInput;
    work[key]=el.type==='checkbox'?el.checked:el.value;
    const out=$(`[data-range-readout="${key}"]`);
    if(out)out.value=el.value;
    saveWork();
    if(el.hasAttribute('data-board-slider')){
      const slot=el.closest('.lever-slot');
      slot.querySelector('.lever-level').textContent=el.value+'/5';
      $('[data-lever-intensity]').innerHTML=leverIntensity();
    }else refresh();
  });
  workspace?.addEventListener('change',e=>{
    const input=e.target.closest('[data-three-input]');
    if(!input)return;
    updateThreePoint(input.dataset.threeInput,input.value);saveWork();refresh();
  });
  workspace?.addEventListener('click',e=>{
    const three=e.target.closest('[data-three-change]');
    if(three){
      const key=three.dataset.threeChange;
      updateThreePoint(key,(anyNumber(13,key)||0)+Number(three.dataset.delta));saveWork();refresh();return;
    }
    const choice=e.target.closest('[data-pick-lever]');
    if(!choice)return;
    const i=Number(choice.dataset.pickLever);
    work.s8_lead=String(i);
    const intensity=$('[data-lever-intensity]');
    if(intensity)intensity.innerHTML=leverIntensity();
    saveWork();
    refresh();
    workspace.querySelector(`[data-pick-lever="${i}"]`)?.focus({preventScroll:true});
  });
  $('[data-turn-down]')?.addEventListener('click',()=>{
    const lead=chosenLever();
    if(lead===null) return toast('Choose a lever on the previous step.');
    work.s8_lead=String(lead);
    const levels=leverScores(), reduced=Math.max(1,levels[lead]-2);
    if(reduced===levels[lead]) return toast('This lever is already at the lowest level.');
    work['s8_level'+lead]=String(reduced);
    saveWork();
    refresh();
    toast(`${LEVERS[lead][0]} is now at level ${reduced}. Rewrite the message below.`);
  });
  $('[data-copy-pitch]')?.addEventListener('click',()=>anyCopy(pitchPrompt()));
  $('[data-any-copy]')?.addEventListener('click',e=>anyCopy(anytimeDraft(+e.currentTarget.dataset.anyCopy)));
  $('[data-any-download]')?.addEventListener('click',e=>download('PINA-'+e.currentTarget.dataset.file+'.txt',anytimeDraft(+e.currentTarget.dataset.anyDownload)));
}
