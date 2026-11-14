const pipState={open:false,tab:'studio',status:null,tool:null,replyTool:null,goal:'',material:'',question:'',file:null,
  carried:'',include:true,result:null,recommendations:[],busy:false,error:'',notice:'',focus:null,revision:0,fileRevision:0};
const pipGear='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1"/></svg>';
const pipFind=s=>document.querySelector('#pip-layer '+s);
const pipName=id=>PIP_TOOLS[id]?.[0]||'Ask Pip';
const pipHref=id=>id<7?`#make/${id}/context`:anyUrl(id,'work');
const pipActive=()=>document.querySelector('[data-pip-workspace]');
const pipKey=(id,field)=>`s${id}_${field}`;
const pipAnswered=(id,field)=>String(work[pipKey(id,field)]??'').trim()!=='';
const pipAnswers=id=>Object.fromEntries(Object.keys(pipSpecs(id)).filter(key=>pipAnswered(id,key)).map(key=>[key,work[pipKey(id,key)]]));
function pipLabel(id,field){
  const spec=pipSpecs(id)[field];
  return Array.isArray(spec)?spec[0].replace(/ \((0 Reciprocity|beh Deciding).*$/,''):spec||field;
}
function pipValue(id,field,value){
  if(id===3&&/^r[1-3]$/.test(field))return EVIDENCE_RUNGS[Number(value)-1]||value;
  if(id===8&&field==='lead')return LEVERS[Number(value)]?.[0]||value;
  if(id===7&&/^[pi][1-4]$/.test(field))return value==='H'?'High':'Low';
  if(id===9&&field==='side')return value==='buy'?'Buying':'Selling';
  if(id===12&&field==='route')return PITCH_ROUTES[value]?.[0]||value;
  return value;
}
async function pipRequest(action,body){
  let response,data;
  try{
    response=await fetch('/api/pip/'+action,body===undefined?{cache:'no-store'}:{
      method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)
    });
    data=await response.json();
  }catch{throw Error('Ask Pip could not connect. Try again in a moment.');}
  if(!response.ok)throw Object.assign(new Error(data.error||'Ask Pip could not complete that request.'),{code:data.code});
  return data;
}
function pipInit(){
  const layer=document.querySelector('#pip-layer');
  layer.innerHTML=`<button type="button" class="pip-launcher" aria-label="Ask Pip" data-pip-click="launcher" aria-expanded="false" aria-controls="pip-panel">${guide('curious','tiny')}<span>Ask Pip</span></button>
    <aside id="pip-panel" class="pip-panel" aria-labelledby="pip-title" hidden>
      <header class="pip-panel-head"><div>${guide('curious','tiny')}<div><p class="eyebrow">PINA STUDIO</p><h2 id="pip-title">Ask Pip</h2></div></div>
      <div class="pip-head-actions"><button type="button" class="round-button" data-pip-click="settings" aria-label="AI settings lock" aria-pressed="false" title="AI settings lock">${pipGear}</button>
      <button type="button" class="round-button" data-pip-click="close" aria-label="Close Ask Pip">${ic('close')}</button></div></header>
      <div class="pip-panel-content"></div>
    </aside>`;
  layer.addEventListener('click',pipClick);
  layer.addEventListener('submit',pipSubmit);
  layer.addEventListener('keydown',e=>{if(e.key==='Escape'&&pipState.open){e.preventDefault();pipClose();}});
  layer.addEventListener('input',e=>{
    if(e.target.name==='material')pipState.material=e.target.value;
    if(e.target.name==='question')pipState.question=e.target.value;
  });
  layer.addEventListener('change',pipChange);
}
function pipOpen(id){
  pipState.focus=document.activeElement;
  if(pipState.tool!==id){pipState.tool=id;pipState.result=null;}
  pipState.tab='studio';pipState.open=true;
  pipRender();pipFind('[data-pip-click="close"]').focus({preventScroll:true});pipStatus();
}
function pipClose(){
  pipState.open=false;pipState.inviteLink='';pipRender();
  (pipState.focus?.isConnected?pipState.focus:pipFind('.pip-launcher')).focus({preventScroll:true});
}
async function pipStatus(){
  const revision=pipState.revision;
  try{
    const result=await pipRequest('status');
    if(revision!==pipState.revision)return;
    pipState.status=result;
  }catch(err){
    if(revision!==pipState.revision)return;
    pipState.error=err.message;
  }
  if(!pipState.busy&&!document.activeElement?.matches('#pip-panel input,#pip-panel textarea,#pip-panel select'))pipRender();
}
function pipStandaloneLink(){
  return '<a class="text-link" href="https://pina-fieldguide.vivek-kr-jain.chatgpt.site/" target="_blank" rel="noopener noreferrer">Open PINA in its own tab ↗</a>';
}
function pipSharing(s){
  if(!s.configured||!s.sharingAvailable)return '';
  return `<section class="pip-sharing" aria-label="Share Ask Pip">
    <h3>Share Ask Pip</h3>
    <p>Anyone with your invite link can use AI without a passphrase. Requests count toward your provider quota. The link allows up to 100 requests per day.</p>
    <div class="pip-actions"><button class="ink-button quiet small" type="button" data-pip-click="share-link">${s.sharing?'Show invite link':'Create invite link'}</button>
      ${s.sharing?'<button type="button" class="text-link" data-pip-click="stop-sharing">Turn off sharing</button>':''}</div>
    ${pipState.inviteLink?`<div class="pip-form"><label for="pip-invite-url">Ask Pip invite link</label>
      <input id="pip-invite-url" value="${esc(pipState.inviteLink)}" readonly>
      <button class="ink-button quiet small" type="button" data-pip-click="copy-invite">Copy invite link</button></div>`:''}
  </section>`;
}
function pipSettings(){
  const s=pipState.status;
  if(!s)return '<p>Checking the vault…</p><button class="ink-button quiet small" type="button" data-pip-click="refresh">Check again</button>';
  if(s.siteMode&&!s.unlocked){
    return `<h3>AI settings</h3><p>Chat is available to visitors without a password. Unlock only when you want to change the provider connection.</p>
      ${s.settingsReady?'':`<p class="pip-note">For the first settings update, use the browser where you originally saved the key. Unlocking there once moves your existing settings lock to the server.</p>`}
      <form class="pip-form" data-pip-form="unlock"><label for="pip-password">Existing settings passphrase</label>
      <input id="pip-password" name="password" type="password" minlength="12" maxlength="256" autocomplete="current-password" required>
      <button class="ink-button primary" type="submit">Unlock settings</button></form>
      <button type="button" class="text-link" data-pip-click="settings">Back to Ask Pip</button>`;
  }
  if(!s.unlocked){
    const create=!s.created;
    return `<p><b>${create?'No vault found here':'Your saved vault is locked'}</b></p>
      <p>${create?'Already set up Ask Pip? Return to the browser profile and PINA tab where you saved your key. Use the form below only if you want a new vault here.':'Enter your existing PINA passphrase. Any API key you saved in this vault stays saved when it locks.'}</p>
      ${window.top!==window&&!pipState.showStandalone?pipStandaloneLink():''}
      <form class="pip-form" data-pip-form="${create?'create':'unlock'}">
        <label for="pip-password">${create?'Choose a new PINA passphrase':'Your existing PINA passphrase'}</label>
        <input id="pip-password" name="password" type="password" minlength="12" maxlength="256" autocomplete="${create?'new-password':'current-password'}" required>
        ${create?'<label for="pip-confirm">Confirm passphrase</label><input id="pip-confirm" name="confirm" type="password" minlength="12" maxlength="256" autocomplete="new-password" required>':''}
        <button class="ink-button primary" type="submit">${create?'Create a new vault':'Unlock saved vault'}</button>
      </form>
      <p class="pip-note">${create?'Use at least 12 characters. The vault is stored in this browser’s site data.':'Ask Pip locks after 30 minutes. Clearing this browser’s site data removes the vault and key.'}</p>
      ${create?'':'<button type="button" class="text-link" data-pip-click="forget">Reset this browser’s vault</button>'}`;
  }
  const provider=pipState.providerDraft||s.provider||'openai';
  return `<h3>AI settings</h3><p>${s.siteMode?'The connection is saved securely on the server. Locking settings does not interrupt visitor chat.':s.configured?'Your API key stays saved in this browser when you reload or lock Ask Pip.':'Vault unlocked. Choose a provider to start.'} The vault locks after 30 minutes.</p>
    <form class="pip-form" data-pip-form="config">
      <label for="pip-provider">AI provider</label><select id="pip-provider" name="provider"><option value="openai" ${provider==='openai'?'selected':''}>OpenAI</option><option value="gemini" ${provider==='gemini'?'selected':''}>Google Gemini</option></select>
      <p class="pip-note" data-pip-google-help ${provider==='gemini'?'':'hidden'}>Use a Gemini API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio ↗</a>. You can sign in there with your Workspace account if your organization allows access.</p>
      <label for="pip-key">API key</label><input id="pip-key" name="key" type="password" maxlength="500" spellcheck="false" autocomplete="off" ${s.configured?'placeholder="Leave blank to keep the key"':'placeholder="Paste your provider key" required'}>
      <details><summary>Choose a model</summary><label for="pip-model">Model ID</label><input id="pip-model" name="model" maxlength="100" value="${esc(s.provider===provider?s.model:'')}" placeholder="Use the provider default"></details>
      <button class="ink-button primary" type="submit">Save connection</button>
    </form>
    <div class="pip-actions">${s.configured?'<button type="button" class="ink-button quiet small" data-pip-click="test">Test connection</button><button type="button" class="text-link" data-pip-click="remove-key">Remove key</button>':''}
      <button type="button" class="text-link" data-pip-click="lock">Lock settings</button></div>
    ${pipSharing(s)}<p class="pip-note">Only material you submit is sent to your chosen provider. Provider API billing applies.</p>`;
}
function pipCitation(item){
  return item.quote?`<blockquote class="pip-quote"><b>${item.source==='attachment'?'From the attachment · check the original':'From your material'}</b>“${esc(item.quote)}”</blockquote>`:'';
}
function pipAnswerEditor(id,item,i){
  const spec=pipSpecs(id)[item.field],label='Edit '+pipLabel(id,item.field);
  if(Array.isArray(spec)&&spec[1]!=='#number')return `<select name="edit${i}" aria-label="${esc(label)}">${spec.slice(1).map(value=>`<option value="${esc(value)}" ${item.value===value?'selected':''}>${esc(pipValue(id,item.field,value))}</option>`).join('')}</select>`;
  if(Array.isArray(spec))return `<input name="edit${i}" aria-label="${esc(label)}" type="number" step="any" value="${esc(item.value)}">`;
  return `<textarea name="edit${i}" aria-label="${esc(label)}" rows="2" maxlength="1800">${esc(item.value)}</textarea>`;
}
function pipResult(){
  const result=pipState.result,id=pipState.replyTool;
  if(!result)return '';
  return `<section class="pip-result" aria-label="Pip’s reply">
    <p class="eyebrow">PIP SAYS</p><p class="pip-reply">${esc(result.reply)}</p>
    ${result.question?`<p class="pip-followup"><b>A question to consider</b> ${esc(result.question)}</p>`:''}
    ${result.tools.map((item,i)=>`<article class="pip-card"><span class="pip-tag">${i===0?'START HERE':'OPTIONAL FOLLOW-UP'}</span>
      <h3>${esc(pipName(item.id))}</h3><p>${esc(item.reason)}</p>${pipCitation(item)}
      <button type="button" class="ink-button quiet small" data-pip-project="${item.id}">Open project →</button>
      ${id!==null&&id!==item.id&&Object.keys(pipAnswers(id)).length?`<button type="button" class="text-link" data-pip-carry="${item.id}">Carry current notes →</button>`:''}</article>`).join('')}
    ${result.next.length?`<ul class="pip-next">${result.next.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
    ${id!==null&&result.suggestions.length?`<form data-pip-form="apply" class="pip-answers"><h3>Review suggested answers</h3>
      <p class="pip-note">Choose the answers to add. Existing answers start unchecked.</p>
      ${result.suggestions.map((item,i)=>`<article class="pip-card"><label class="pip-check"><input name="answer" type="checkbox" value="${i}" ${pipAnswered(id,item.field)?'':'checked'}><b>${esc(pipLabel(id,item.field))}</b></label>
        <span class="pip-tag">${item.kind==='stated'?'Source claim':'Pip’s suggestion'}</span>${pipAnswerEditor(id,item,i)}${pipCitation(item)}
        ${pipAnswered(id,item.field)?`<p class="pip-note">Current answer: ${esc(pipValue(id,item.field,work[pipKey(id,item.field)]))}</p>`:''}
      </article>`).join('')}
      <button class="ink-button primary small" type="submit">Apply selected answers</button></form>`:''}
    <button class="text-link" type="button" data-pip-click="clear">Clear reply</button>
  </section>`;
}
const PIP_SHORTCUTS=[
 ['Compare audience readings','How might this message be read differently?'],
 ['Look for assumptions','What does this brief assume, and what should I ask?'],
 ['Find a competing explanation','What rival explanation fits the same evidence?'],
 ['Check my evidence','Where does my recommendation go beyond the evidence?'],
 ['Compare purpose and draft','Where has the work moved away from its original purpose?'],
 ['Draft a decision record','Which decisions were made and which are still open?'],
 ['Propose a small trial','What trial would show the promised outcome?'],
 ['Look for missed stakeholders','Who may be affected but missing from this discussion?'],
 ['Lower the pressure','How can I keep the ask and reduce pressure?'],
 ['Find a possible trade','What trade could meet both sides’ priorities?'],
 ['Find one trust repair','What one change would help this message earn trust?'],
 ['Check my reasoning','Where does the argument jump beyond its support?'],
 ['Rehearse a pitch','Play a skeptical audience member. Ask me one specific question about this pitch.'],
 ['Find a fair opening','What opening would address their priorities, and what should I check before making it?'],
 ['Separate evidence and guesses','What do I actually know about this person’s perspective, and what should I ask them?']
];
function pipStudio(){
  const s=pipState.status,ready=s?.shared||(s?.configured&&s?.unlocked),id=pipState.tool,scoped=id!==null;
  return `<p class="pip-intro"><b>Hi, I’m Pip.</b> I’m PINA’s folded-paper guide. Bring a brief, a message, or a question. I’ll help you find a place to start and see what another reader might hear.</p>
    ${s?.siteMode?(ready?'':'<p class="pip-note">The owner can check the provider connection using the settings lock.</p>'):s?.shared?'<p class="pip-note">AI access enabled by invite.</p>':ready?'':'<p class="pip-note">Connect a provider in settings to use AI.</p>'}
    ${scoped?`<div class="pip-connect"><b>${esc(pipName(id))}</b><button type="button" class="text-link" data-pip-click="route">Choose a tool instead</button></div>`:''}
    <form class="pip-form" data-pip-form="assist">
      <label for="pip-material">Your brief, message or notes</label>
      <textarea id="pip-material" name="material" rows="3" maxlength="36000" placeholder="${scoped?'Add more context if you need it.':'Paste material you want Pip to read.'}">${esc(pipState.material)}</textarea>
      <div class="pip-upload"><label for="pip-file">Attach a file</label><input id="pip-file" name="attachment" type="file" accept=".txt,.md,.csv,.json,.docx,.pdf,.png,.jpg,.jpeg,.webp">
        ${pipState.file?`<span>${esc(pipState.file.name)}</span><button type="button" class="text-link" data-pip-click="remove-file">Remove</button>`:''}</div>
      ${pipState.carried?'<p class="pip-note">Notes carried from the previous tool. <button type="button" class="text-link" data-pip-click="remove-notes">Remove notes</button></p>':''}
      ${scoped?'':`<fieldset class="pip-goals"><legend>What do you want to do?</legend><div>${PIP_GOALS.map(([goal,label])=>`<button type="button" data-pip-goal="${goal}" aria-pressed="${pipState.goal===goal}">${label}</button>`).join('')}</div></fieldset>`}
      <label for="pip-question">Ask a question <span class="pip-note">(optional)</span></label><input id="pip-question" name="question" maxlength="2600" value="${esc(pipState.question)}">
      ${scoped?`<button class="text-link pip-shortcut" type="button" data-pip-click="shortcut">${PIP_SHORTCUTS[id][0]}</button>
        <label class="pip-check"><input type="checkbox" name="include" ${pipState.include?'checked':''}> Include my current answers for this tool</label>`:''}
      <div class="pip-actions"><button type="submit" class="ink-button primary" ${ready?'':'disabled'}>${scoped?'Ask Pip about this project':'Ask Pip'}</button>
      ${scoped?'':'<button type="button" class="text-link" data-pip-click="show-all">Show all tools</button>'}</div>
      <p class="pip-note">Your request goes to the connected provider. Suggestions go into your project only when you apply them.</p>
    </form>${pipResult()}`;
}
function pipRender(){
  const panel=pipFind('#pip-panel');
  if(!panel)return;
  panel.hidden=!pipState.open;
  pipFind('.pip-launcher').setAttribute('aria-expanded',String(pipState.open));
  if(!pipState.open)return;
  pipFind('[data-pip-click="settings"]').setAttribute('aria-pressed',String(pipState.tab==='settings'));
  panel.setAttribute('aria-busy',String(pipState.busy));
  pipFind('.pip-panel-content').innerHTML=`<div class="pip-feedback" aria-live="polite">${pipState.busy?'<p>One moment…</p>':pipState.error?`<p role="alert" class="pip-error">${esc(pipState.error)}</p>${pipState.showStandalone?pipStandaloneLink():''}`:pipState.notice?`<p class="pip-notice">${esc(pipState.notice)}</p>`:''}</div>`+
    (pipState.tab==='settings'?pipSettings():pipStudio());
  if(pipState.busy)panel.querySelectorAll('.pip-panel-content input,.pip-panel-content button,.pip-panel-content textarea,.pip-panel-content select').forEach(el=>el.disabled=true);
}
function pipHighlight(){
  const directory=document.querySelector('#tool-directory');
  if(!directory)return;
  const ranked=new Map(pipState.recommendations.map((item,index)=>[item.id,index]));
  directory.classList.toggle('pip-filtered',ranked.size>0);
  directory.querySelectorAll('[data-pip-directory]').forEach(card=>{
    const index=ranked.get(Number(card.dataset.pipDirectory));
    card.classList.toggle('pip-recommended',index!==undefined);
    card.querySelector('[data-pip-badge]').textContent=index===undefined?'':index===0?'Pip’s starting point':'Pip’s follow-up';
  });
  document.querySelector('[data-pip-show-all]').hidden=!ranked.size;
}
function pipShowAll(){pipState.recommendations=[];pipHighlight();}
async function pipTask(task){
  pipState.revision++;pipState.busy=true;pipState.error='';pipState.notice='';pipState.showStandalone=false;pipRender();
  try{await task();}
  catch(err){
    pipState.error=err.message;
    if(['vault_locked','vault_exists','vault_missing'].includes(err.code)){
      pipState.status=await pipRequest('status').catch(()=>({...pipState.status,unlocked:false,configured:false}));
      if(!pipState.status.created)pipState.error='This browser did not keep the Ask Pip vault. Open PINA in its own tab and try again.';
    }
    if(err.code==='invite_inactive')pipState.status=await pipRequest('status').catch(()=>({...pipState.status,shared:false}));
    if(['vault_locked','vault_missing','open_site','vault_cookie'].includes(err.code))pipState.showStandalone=true;
  }finally{pipState.busy=false;pipRender();}
}
function pipClick(e){
  const button=e.target.closest('button');
  if(!button)return;
  const {pipClick:action,pipGoal:goal,pipProject:project,pipCarry:carry}=button.dataset;
  if(action==='close'){pipClose();return;}
  if(action==='launcher'){if(pipState.open)pipClose();else pipOpen(pipActive()?Number(pipActive().dataset.pipWorkspace):null);return;}
  if(pipState.busy)return;
  if(action==='settings'){
    pipState.tab=pipState.tab==='settings'?'studio':'settings';
    pipState.inviteLink='';pipState.error='';pipState.notice='';pipRender();return;
  }
  if(goal!==undefined){
    pipState.goal=pipState.goal===goal?'':goal;
    button.closest('.pip-goals').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pipGoal===pipState.goal)));
    return;
  }
  if(project!==undefined||carry!==undefined){
    const id=Number(project??carry),from=pipState.replyTool;
    if(carry!==undefined&&from!==null)pipState.carried=(pipName(from)+' project notes\n'+Object.entries(pipAnswers(from)).map(([field,value])=>pipLabel(from,field)+': '+value).join('\n')).slice(0,18000);
    pipState.tool=id;pipState.result=null;location.hash=pipHref(id);pipRender();return;
  }
  if(action==='refresh'){pipStatus();return;}
  if(action==='show-all'){pipShowAll();return;}
  if(action==='route'){pipState.tool=null;pipState.result=null;pipRender();return;}
  if(action==='clear'){pipState.result=null;pipRender();return;}
  if(action==='remove-file'){pipState.file=null;pipState.fileRevision++;pipRender();return;}
  if(action==='remove-notes'){pipState.carried='';pipRender();return;}
  if(action==='shortcut'){pipState.question=PIP_SHORTCUTS[pipState.tool][1];pipFind('#pip-question').value=pipState.question;pipFind('#pip-question').focus();return;}
  if(action==='copy-invite'){
    const input=pipFind('#pip-invite-url');
    navigator.clipboard?.writeText(input.value).then(()=>{pipState.notice='Invite link copied.';pipRender();},
      ()=>{input.focus();input.select();});
    if(!navigator.clipboard){input.focus();input.select();}
    return;
  }
  if(!['test','lock','forget','remove-key','share-link','stop-sharing'].includes(action))return;
  if(action==='forget'&&!confirm('Remove this browser’s vault and saved API key?'))return;
  if(action==='remove-key'&&!confirm('Remove the provider connection? Visitor AI will stop until another key is saved.'))return;
  pipTask(async()=>{
    const result=await pipRequest(action,{});
    if(action==='test'){pipState.notice='The provider accepted the connection.';return;}
    pipState.status=await pipRequest('status');
    if(action==='share-link'){
      const invite=new URL('/',location.origin);
      invite.hash='ask-it/'+result.token;
      pipState.inviteLink=invite.href;
      return;
    }
    pipState.inviteLink='';
    pipState.notice={lock:'Settings locked. Chat remains available.',forget:'Vault reset for this browser.','remove-key':'API key removed.','stop-sharing':'Sharing turned off. The invite link is inactive.'}[action];
  });
}
function pipSubmit(e){
  const form=e.target.closest('[data-pip-form]');
  if(!form)return;
  e.preventDefault();
  if(pipState.busy)return;
  const action=form.dataset.pipForm,data=new FormData(form);
  if(action==='apply'){
    const id=pipState.replyTool;
    const choices=data.getAll('answer').map(n=>[pipState.result.suggestions[Number(n)],String(data.get('edit'+n)||'').trim()]).filter(([item,value])=>item&&value);
    if(!choices.length){toast('Select at least one answer with text.');return;}
    if(choices.some(([item])=>pipAnswered(id,item.field))&&!confirm('Replace the existing answers you selected?'))return;
    const chosen=new Set();
    for(const [item,value] of choices){
      const spec=pipSpecs(id)[item.field];
      if(!spec||Array.isArray(spec)&&!(spec[1]==='#number'?Number.isFinite(Number(value)):spec.slice(1).includes(value)))continue;
      work[pipKey(id,item.field)]=value.slice(0,1800);chosen.add(item);
    }
    if(!chosen.size){toast('Enter a valid answer first.');return;}
    saveWork();
    pipState.result.suggestions=pipState.result.suggestions.filter(x=>!chosen.has(x));
    pipState.notice=`Added ${chosen.size} ${chosen.size===1?'answer':'answers'} to ${pipName(id)}.`;
    if(Number(pipActive()?.dataset.pipWorkspace)===id)route();else location.hash=pipHref(id);
    pipRender();return;
  }
  if(action==='assist'){
    const tool=pipState.tool,fields=tool!==null&&data.get('include')?pipAnswers(tool):{};
    const material=[pipState.material,pipState.file?.text,pipState.carried].filter(Boolean).join('\n\n'),attachment=pipState.file?.attachment;
    const question=pipState.question.trim();
    if(material.length>36000||(!material.trim()&&!attachment&&!question&&!Object.keys(fields).length)){
      pipState.error=material.length>36000?'Keep combined text below 36,000 characters.':'Add material, a question, or a project answer.';
      pipRender();return;
    }
    const previous=question&&pipState.result?.reply?'\nPrevious reply for context (unverified):\n'+pipState.result.reply:'';
    pipTask(async()=>{
      pipState.result=await pipRequest('assist',{tool,goal:pipState.goal,material,attachment,fields,question:(question+previous).slice(0,2600)});
      pipState.replyTool=tool;
      if(tool===null){pipState.recommendations=pipState.result.tools;pipHighlight();}
      requestAnimationFrame(()=>pipFind('.pip-result')?.scrollIntoView({block:'nearest'}));
    });
    return;
  }
  const body=Object.fromEntries(data);
  if(action==='create'&&body.password!==body.confirm){
    pipFind('.pip-feedback').innerHTML='<p class="pip-error" role="alert">The passphrases do not match.</p>';return;
  }
  delete body.confirm;
  form.querySelectorAll('[type="password"]').forEach(el=>el.value='');
  pipTask(async()=>{
    await pipRequest(action,body);
    pipState.status=await pipRequest('status');
    if(!pipState.status.unlocked||(action==='config'&&(!pipState.status.configured||pipState.status.provider!==body.provider))){
      throw Object.assign(Error('Your browser did not keep the unlocked vault. Open PINA in its own tab and try again.'),{code:'vault_cookie'});
    }
    if(action==='config')pipState.notice='Connection saved. Test it or return to Studio.';
    if(action==='unlock')pipState.notice='Settings unlocked. The connection stays available to visitors when you lock settings.';
  });
}
async function pipChange(e){
  if(e.target.name==='include'){pipState.include=e.target.checked;return;}
  if(e.target.name==='provider'){
    pipState.providerDraft=e.target.value;
    pipFind('#pip-model').value='';
    pipFind('[data-pip-google-help]').hidden=e.target.value!=='gemini';
    return;
  }
  const file=e.target.name==='attachment'&&e.target.files?.[0];
  if(!file)return;
  const revision=++pipState.fileRevision;
  pipState.error='';pipState.notice='';
  try{
    if(file.size>5*1024*1024)throw Error('Choose a file up to 5 MB.');
    const ext=file.name.split('.').pop().toLowerCase();
    const mime={pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'}[ext];
    let entry;
    if(mime){
      const data=await new Promise((resolve,reject)=>{
        const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);
        reader.onerror=()=>reject(Error('The file could not be read.'));reader.readAsDataURL(file);
      });
      entry={name:file.name,attachment:{mime,data}};
    }else{
      if(!['txt','md','csv','json','docx'].includes(ext))throw Error('Choose a Word document, text file, PDF, or supported image.');
      const text=ext==='docx'?await pipWordText(file):await file.text();
      if(!text.trim()||text.length>36000)throw Error('Use a readable excerpt of up to 36,000 characters.');
      entry={name:file.name,text};
    }
    if(revision===pipState.fileRevision)pipState.file=entry;
  }catch(err){if(revision===pipState.fileRevision)pipState.error=err.message;}
  if(revision===pipState.fileRevision)pipRender();
}
function bindPipStudio(){
  if(!pipFind('#pip-panel'))pipInit();
  document.querySelectorAll('[data-ask-pip]').forEach(button=>button.onclick=()=>pipOpen(Number(button.dataset.askPip)));
  document.querySelector('[data-pip-show-all] button')?.addEventListener('click',pipShowAll);
  pipHighlight();
  const invite=location.hash.match(/^#ask-it\/([A-Za-z0-9_-]{43})$/);
  if(invite){
    history.replaceState(history.state,'','#home');
    pipOpen(null);
    pipTask(async()=>{
      await pipRequest('accept-invite',{token:invite[1]});
      pipState.status=await pipRequest('status');
      if(!pipState.status.shared)throw Error('This browser could not keep the invite. Open the original invite link in a standalone browser tab.');
      pipState.notice='You can now use Ask Pip.';
    });
  }
}
