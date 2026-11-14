import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import worker from '../dist/server/index.js';
import {localInviteDb} from './local-db.mjs';

const origin='https://pina.example';
const env={PIP_VAULT_SECRET:randomBytes(32).toString('hex'),DB:localInviteDb()};
const password='Testing a longer phrase';
const fixtureKey='sk-test-only-never-a-real-provider-key';
const browser=new Map();
function request(action,body,jar=browser,requestOrigin=origin){
  return worker.fetch(new Request(origin+'/api/pip/'+action,{
    method:body===undefined?'GET':'POST',
    headers:{Origin:requestOrigin,'Content-Type':'application/json',Cookie:[...jar].map(pair=>pair.join('=')).join('; ')},
    ...(body===undefined?{}:{body:JSON.stringify(body)})
  }),env);
}
async function visit(action,body,jar=browser){
  const response=await request(action,body,jar);
  for(const cookie of response.headers.getSetCookie()){
    const [pair]=cookie.split(';');const split=pair.indexOf('='),key=pair.slice(0,split),value=pair.slice(split+1);
    assert.match(cookie,key.startsWith('__Secure-PIP_P')?
      /HttpOnly; SameSite=None; Secure; Partitioned; Max-Age=\d+/:
      /HttpOnly; SameSite=Strict; Secure; Max-Age=0/);
    assert.ok(!cookie.includes(fixtureKey)&&!cookie.includes(password));
    if(value)jar.set(key,value);else jar.delete(key);
  }
  return {status:response.status,data:await response.json()};
}
test('manual toolkit and all fifteen tool scopes load',async()=>{
  const home=await worker.fetch(new Request(origin),{});
  assert.equal(home.status,200);
  assert.match(await home.text(),/pip-studio\.js/);
  assert.equal(PIP_TOOLS.length,15);
  for(let id=0;id<PIP_TOOLS.length;id++)assert.ok(Object.keys(pipSpecs(id)).length>=4);
});
test('vault gates keys, checks origin, locks, and isolates browsers',async()=>{
  assert.equal((await visit('config',{provider:'openai',key:fixtureKey})).status,401);
  assert.equal((await request('create',{password},browser,'https://other.example')).status,403);
  assert.equal((await visit('create',{password:'0000'})).status,400);
  assert.equal((await visit('create',{password})).data.unlocked,true);
  assert.equal((await visit('config',{provider:'openai',key:fixtureKey})).data.configured,true);
  assert.equal((await visit('status',undefined,new Map())).data.created,false);
  assert.ok(!JSON.stringify(await visit('status')).includes(fixtureKey));
  await visit('lock',{});
  assert.equal((await visit('test',{})).data.code,'vault_locked');
  assert.equal((await visit('unlock',{password:'An incorrect passphrase'})).status,401);
  assert.equal((await visit('unlock',{password})).data.configured,true);
});
test('both provider adapters and source-backed suggestions',async t=>{
  const source='The brief asks us to build a dashboard.';
  const fixture={reply:'Start by checking the brief.',question:'',tools:[{id:1,reason:'A solution is already named.',quote:'build a dashboard'},{id:91,reason:'Invalid',quote:''}],
    suggestions:[{field:'anchor',value:'Dashboard',quote:'build a dashboard',kind:'stated'},{field:'assume',value:'Visibility causes delays',quote:'made-up evidence',kind:'stated'},{field:'unknown',value:'discard',quote:'',kind:'inference'}],next:['Check the cause of delays.']};
  let calls=0;
  t.mock.method(globalThis,'fetch',async(url,opts)=>{
    calls++;
    const body=JSON.parse(opts.body);
    if(url.includes('api.openai.com')){
      assert.equal(opts.headers.Authorization,'Bearer '+fixtureKey);
      assert.equal(body.store,false);
      if(body.text)assert.equal(body.text.format.type,'json_schema');
      return Response.json({output:[{content:[{type:'output_text',text:JSON.stringify(fixture)}]}]});
    }
    assert.match(url,/generativelanguage\.googleapis\.com/);
    assert.equal(opts.headers['x-goog-api-key'],fixtureKey);
    assert.equal(body.generationConfig.responseMimeType,'application/json');
    assert.equal(body.contents[0].parts[1].inlineData.mimeType,'application/pdf');
    return Response.json({candidates:[{content:{parts:[{text:JSON.stringify(fixture)}]}}]});
  });
  assert.equal((await visit('test',{})).data.ok,true);
  const route=await visit('assist',{material:source,goal:'brief'});
  assert.equal(route.data.tools.length,1);
  assert.equal(route.data.suggestions.length,0);
  const project=await visit('assist',{tool:1,material:source});
  assert.deepEqual(project.data.suggestions.map(x=>[x.field,x.kind,x.source]),[['anchor','stated','text'],['assume','inference','none']]);
  const oldSession=browser.get('__Secure-PIP_PS');
  assert.equal((await visit('config',{provider:'gemini',key:fixtureKey})).data.provider,'gemini');
  const stale=new Map(browser);stale.set('__Secure-PIP_PS',oldSession);
  assert.equal((await visit('status',undefined,stale)).data.unlocked,false);
  const pdf=btoa('%PDF-1.7\nfixture');
  assert.equal((await visit('assist',{tool:1,attachment:{mime:'application/pdf',data:pdf}})).data.suggestions[0].source,'attachment');
  assert.equal((await visit('assist',{attachment:{mime:'application/pdf',data:btoa('plain text')}})).status,400);
  assert.equal(calls,4);
  assert.equal((await visit('remove-key',{})).data.configured,false);
  assert.equal((await visit('assist',{material:source})).status,412);
  assert.equal((await visit('forget',{})).data.created,false);
});
test('a saved legacy vault migrates on unlock and reports Gemini key failures separately',async t=>{
  const jar=new Map();
  await visit('create',{password},jar);
  await visit('config',{provider:'gemini',key:fixtureKey},jar);
  const legacy=new Map([['__Secure-PIP_V',jar.get('__Secure-PIP_PV')]]);
  assert.equal((await visit('status',undefined,legacy)).data.created,true);
  assert.equal((await visit('unlock',{password},legacy)).data.configured,true);
  assert.ok(!legacy.has('__Secure-PIP_V'));
  assert.ok(legacy.has('__Secure-PIP_PV')&&legacy.has('__Secure-PIP_PS'));
  t.mock.method(globalThis,'fetch',async()=>Response.json({
    error:{details:[{reason:'API_KEY_INVALID'}]}
  },{status:400}));
  const result=await visit('test',{},legacy);
  assert.equal(result.status,422);
  assert.match(result.data.error,/Google AI Studio/);
  assert.equal((await visit('status',undefined,legacy)).data.unlocked,true);
});
test('session expiry keeps the vault and Gemini key available for the existing passphrase',async t=>{
  const jar=new Map();
  await visit('create',{password},jar);
  await visit('config',{provider:'gemini',key:fixtureKey},jar);
  const later=Date.now()+31*60000;
  t.mock.method(Date,'now',()=>later);
  const locked=await visit('status',undefined,jar);
  assert.equal(locked.data.created,true);
  assert.equal(locked.data.unlocked,false);
  assert.equal((await visit('create',{password},jar)).data.code,'vault_exists');
  const unlocked=await visit('unlock',{password},jar);
  assert.equal(unlocked.data.unlocked,true);
  assert.equal(unlocked.data.configured,true);
  assert.equal(unlocked.data.provider,'gemini');
});
test('shared links keep the key private and allow guests to ask until the owner revokes access',async t=>{
  const owner=new Map(),guest=new Map(),visitor=new Map();
  await visit('create',{password},owner);
  await visit('config',{provider:'gemini',key:fixtureKey},owner);
  assert.equal((await visit('assist',{question:'Where do I start?'},visitor)).status,401);
  const share=await visit('share-link',{},owner);
  assert.match(share.data.token,/^[A-Za-z0-9_-]{43}$/);
  assert.equal((await visit('share-link',{},owner)).data.token,share.data.token);
  assert.ok(!JSON.stringify(share).includes(fixtureKey));
  assert.equal((await visit('accept-invite',{token:share.data.token},guest)).status,200);
  const guestStatus=(await visit('status',undefined,guest)).data;
  assert.equal(guestStatus.shared,true);
  assert.equal(guestStatus.created,false);
  assert.equal(guestStatus.configured,false);
  assert.ok(!JSON.stringify(guestStatus).includes(share.data.token));
  assert.equal((await visit('share-link',{},guest)).status,401);
  assert.equal((await visit('stop-sharing',{},guest)).status,401);
  let calls=0;
  t.mock.method(globalThis,'fetch',async(url,opts)=>{
    calls++;
    assert.equal(opts.headers['x-goog-api-key'],fixtureKey);
    return Response.json({candidates:[{content:{parts:[{text:JSON.stringify({reply:'Start with the brief.',question:'',tools:[],suggestions:[],next:[]})}]}}]});
  });
  await visit('lock',{},owner);
  const response=await visit('assist',{question:'Where do I start?'},guest);
  assert.equal(response.data.reply,'Start with the brief.');
  assert.ok(!JSON.stringify(response).includes(fixtureKey));
  assert.equal((await visit('unlock',{password},owner)).data.configured,true);
  assert.equal((await visit('stop-sharing',{},owner)).status,200);
  assert.equal((await visit('status',undefined,guest)).data.shared,false);
  assert.equal((await visit('assist',{question:'Still there?'},guest)).data.code,'invite_inactive');
  assert.equal((await visit('accept-invite',{token:share.data.token},visitor)).status,403);
  assert.equal(calls,1);
  const nextShare=await visit('share-link',{},owner);
  assert.notEqual(nextShare.data.token,share.data.token);
  assert.equal((await visit('remove-key',{},owner)).status,200);
  assert.equal((await visit('accept-invite',{token:nextShare.data.token},visitor)).status,403);
});

test('site chat persists across locks, expiry and fresh browsers while settings remain protected',async t=>{
  const owner=new Map();
  await visit('create',{password},owner);
  await visit('config',{provider:'gemini',key:fixtureKey},owner);
  await visit('share-link',{},owner);
  const oldRows=await env.DB.prepare('SELECT vault_id FROM pip_invites').bind().first();
  const siteEnv={...env,PIP_SITE_VAULT_IDS:oldRows.vault_id};
  const call=async(action,body,jar=new Map(),customOrigin=origin)=>{
    const response=await worker.fetch(new Request(origin+'/api/pip/'+action,{
      method:body===undefined?'GET':'POST',headers:{Origin:customOrigin,'Content-Type':'application/json',Cookie:[...jar].map(p=>p.join('=')).join('; ')},
      ...(body===undefined?{}:{body:JSON.stringify(body)})
    }),siteEnv);
    for(const c of response.headers.getSetCookie()){
      const pair=c.split(';')[0],n=pair.indexOf('='),key=pair.slice(0,n),value=pair.slice(n+1);
      if(value)jar.set(key,value);else jar.delete(key);
    }
    return {status:response.status,data:await response.json()};
  };
  let calls=0;
  t.mock.method(globalThis,'fetch',async(url,opts)=>{
    calls++;
    assert.equal(opts.headers['x-goog-api-key'],fixtureKey);
    return Response.json({candidates:[{content:{parts:[{text:JSON.stringify({reply:'Start with Brief X-Ray.',question:'',tools:[],suggestions:[],next:[]})}]}}]});
  });
  const first=(await call('status')).data;
  assert.equal(first.siteMode,true);assert.equal(first.shared,true);assert.equal(first.unlocked,false);
  assert.ok(!JSON.stringify(first).includes(fixtureKey));
  assert.equal((await call('assist',{question:'Which tool fits my brief?'})).status,200);
  assert.equal((await call('config',{provider:'gemini',key:fixtureKey})).status,401);
  assert.equal((await call('create',{password})).status,403);
  assert.equal((await call('assist',{question:'Hello'},new Map(),'https://other.example')).status,403);
  await call('lock',{},owner);
  assert.equal((await call('assist',{question:'Still available?'})).status,200);
  assert.equal((await call('unlock',{password},owner)).status,200);
  assert.equal((await call('status')).data.created,true);
  const otherDevice=new Map();
  assert.equal((await call('unlock',{password:'Wrong settings passphrase'},otherDevice)).status,401);
  assert.equal((await call('unlock',{password},otherDevice)).status,200);
  await call('lock',{},otherDevice);
  const later=Date.now()+31*60000;t.mock.method(Date,'now',()=>later);
  assert.equal((await call('status',undefined,owner)).data.unlocked,false);
  assert.equal((await call('assist',{question:'No session or invite needed.'})).data.reply,'Start with Brief X-Ray.');
  assert.equal((await call('remove-key',{})).status,401);
  assert.equal(calls,3);
});


test('curriculum 2 accepts revised fields without changing the story preview schema',async t=>{
  const jar=new Map();
  await visit('create',{password},jar);
  await visit('config',{provider:'gemini',key:fixtureKey},jar);
  let revised=false;
  t.mock.method(globalThis,'fetch',async(url,opts)=>{
    const body=JSON.parse(opts.body),prompt=body.systemInstruction.parts[0].text;
    if(revised){
      assert.match(prompt,/NINE fields p0/);
      assert.match(prompt,/confirm.*each part/i);
      assert.match(prompt,/Everyday Business Storytelling/);
      assert.match(prompt,/Reading Check → 13 3E Scale → 10 Trust Triangle/);
    }else assert.doesNotMatch(prompt,/curriculum 2/);
    return Response.json({candidates:[{content:{parts:[{text:JSON.stringify({reply:'Review these drafts.',question:'',tools:[],next:[],suggestions:[
      {field:'p0',value:'A request went missing.',quote:'',kind:'inference'},
      {field:'p8',value:'Approve a small pilot.',quote:'',kind:'inference'},
      {field:'beat0',value:'Legacy beat kept separate.',quote:'',kind:'inference'},
      {field:'unknown',value:'Ignore this.',quote:'',kind:'inference'}
    ]})}]}}]});
  });
  const legacy=await visit('assist',{tool:12,material:'A proposal.'},jar);
  assert.equal(legacy.status,200);assert.deepEqual(legacy.data.suggestions.map(x=>x.field),['beat0']);
  revised=true;
  const current=await visit('assist',{tool:12,curriculum:2,material:'A proposal.',fields:{p0:'A request went missing.',p8:'A pilot.'}},jar);
  assert.equal(current.status,200);assert.deepEqual(current.data.suggestions.map(x=>x.field),['p0','p8']);
});
test('curriculum 2 keeps confirmations manual and limits fields to the chosen tool',async t=>{
  const jar=new Map();await visit('create',{password},jar);await visit('config',{provider:'gemini',key:fixtureKey},jar);
  t.mock.method(globalThis,'fetch',async()=>Response.json({candidates:[{content:{parts:[{text:JSON.stringify({reply:'Check the record against the notes.',question:'Who owns the open question?',tools:[],next:[],suggestions:[
    {field:'dec',value:'Run a pilot.',quote:'Run a pilot.',kind:'stated'},
    {field:'dec_confirmed',value:'true',quote:'',kind:'inference'},
    {field:'think_basis',value:'named',quote:'',kind:'inference'},
    {field:'p0',value:'Not a record field.',quote:'',kind:'inference'}
  ]})}]}}]}));
  const response=await visit('assist',{tool:5,curriculum:2,material:'Run a pilot.'},jar);
  assert.equal(response.status,200);assert.deepEqual(response.data.suggestions.map(x=>x.field),['dec']);
});
