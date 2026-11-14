/* Fictional practice answers. Existing project entries take precedence. */
const PROJECT_CONTEXT = [
  ['A streaming service plans to explain how it might change its ad policy.','Current subscribers','Set expectations without making a permanent promise.'],
  ['The brief asks for more members to use discovery features.','Members choosing what to watch','Find the obstacle that keeps people from making a choice.'],
  ['The design team is debating why members leave the home screen without choosing.','Product and design team','Agree on a problem frame to test.'],
  ['The team has interviews, observation notes and a small test.','Product lead','Recommend one next step and name the limits of the evidence.'],
  ['The prototype now includes more prompts and navigation than the original concept.','People trying to choose something to watch','Check whether the design still makes the first choice easier.'],
  ['A new team is taking over the home screen prototype.','Incoming product designer','Hand over the decision and the reasoning behind it.'],
  ['A client is considering a small interpretation workshop before committing to redesign.','Client sponsor','Explain the value of a pilot and how to measure it.']
];

const PROJECT_EXAMPLES = {
  0:{ledger:[['Qualify the announcement','There are no plans today','A permanent promise','Ask three subscribers to paraphrase it','Communications lead','No reader reports a permanent promise']]},
  1:{s1_trigger:"Netflix lost about 200,000 members in early 2022 and named password sharing as a cause",s1_brief:'Design a new home-screen feature to increase discovery. Members browse for a long time before choosing. We would like to add a quick-pick row before the next release.'},
  2:{s2_rt:'Inductive'},
  5:{s5_review:'Showed the prototype without narration. Compared what users could find in the first minute.'},
  6:{s6_floor:'4',s6_offer:'6',s6_unit:'hours'},
  7:{
    change:'Pilot a shared process for approving urgent requests.',
    n1:'Operations lead',p1:'H',i1:'H',h1:'Will we be accountable for delays?',
    n2:'Finance sponsor',p2:'H',i2:'L',h2:'Does this need a new budget?',
    n3:'Support team',p3:'L',i3:'H',h3:'Will this add steps for us?',
    n4:'Adjacent teams',p4:'L',i4:'L',h4:'Will this affect us later?',
    priority:'1',lead:'Let’s test one approval route with your team and agree how to track delays.'
  },
  8:{
    audience:'Team leads who approve requests',action:'Nominate one person for a two-week pilot',
    statement:'Three teams tried the checklist and shared their results. Would you nominate someone for the next pilot?',
    lead:'2',level2:'3',real:'The pilot notes show what the three teams used and what changed.',
    ethics1:true,ethics2:true,ethics3:true,revision:'Here is what the first three teams found. If the checklist fits your workflow, nominate someone for the next pilot.'
  },
  9:{
    side:'buy',ours:'80',theirs:'65',target:'70',unit:'hours',
    trade1:'Delivery date',us1:'1',them1:'3',trade2:'Review rounds',us2:'3',them2:'2',trade3:'Handover format',us3:'1',them3:'1',
    posture:'Principled',fallback:'Run a smaller pilot with the internal team.',theirfallback:'Use their standard package with another client.'
  },
  10:{
    audience:'Support staff affected by a new workflow',message:'The pilot cut repeat requests by 20%. We plan to roll it out next month.',
    reason0:'The pilot team can share how it ran and who checked the results.',corner0:'4',
    reason1:'The message leaves out the time staff will need to learn the process.',corner1:'2',
    reason2:'The reduction is promising. Include how many requests were in the pilot.',corner2:'4',
    eq0:'7',eq1:'6',eq2:'4',eq3:'4',
    repair:'We know training takes time. We’ll set aside one hour per shift and ask you where the new steps slow things down.'
  },
  11:{
    claim:'Two teams liked the pilot, so every team will want this workflow.',trap:'Hasty generalization',
    reason:'Two teams tell us how the workflow worked in two contexts. Other teams may face different constraints.',
    fix:'Two pilot teams wanted to keep it. Test with teams that handle different request types before deciding on rollout.'
  },
  12:{
    route:'beh',audience:'Operations sponsor',beat0:'Teams send urgent requests through three different channels.',
    beat1:'Requests get duplicated or missed when ownership is unclear.',
    beat2:'How could we make ownership visible without adding approval time?',
    beat3:'Try one shared intake queue with two teams for two weeks.',
    beat4:'A small trial found fewer duplicates. We still need to check whether urgent requests move as quickly.',
    beat5:'Will you approve a two-week pilot and name one owner by Friday?'
  },
  13:{
  "us": "Netflix",
  "them": "Members who share",
  "issue": "paid sharing",
  "speak": "naming what sharers lose and why the change is fair, before the price",
  "f1": "y",
  "f2": "y",
  "u0": "15",
  "u1": "10",
  "u2": "75",
  "t0": "30",
  "t1": "50",
  "t2": "20"
},
  14:{
  "who": "members who shared their password with family",
  "feel": "punished, and a little betrayed",
  "care": "fairness, and keeping their family on one account",
  "say": "they'd quit rather than pay (62% in one survey)",
  "do": "stayed and paid in their millions",
  "mine": "Sharing costs us revenue we need to keep making shows",
  "theirs": "You're charging me for something you told me was fine"
}
};

function projectExample(id) {
  const base={...EXAMPLES['s'+id]};
  const context=PROJECT_CONTEXT[id];
  if(context) ['situation','audience','purpose'].forEach((key,i)=>base['s'+id+'_'+key]=context[i]);
  for(const [key,value] of Object.entries(PROJECT_EXAMPLES[id]||{})){
    base[key==='ledger'||id<7?key:'s'+id+'_'+key]=value;
  }
  return base;
}

const FRAME_PROMISE_EXAMPLE={
  "s2_rt": "Abductive",
  "s2_q": "Best guess",
  "s2_see": "a new, cheaper plan, not a reversal",
  "s2_then": "present ads as a choice viewers can make, and say plainly what changed since 2015",
  "s2_grounds": "Viewers called it a broken promise, yet the 2015 words never changed. Only the reading of them did",
  "s2_warrant": "People read \"Period\" as a promise, so the plan needs the reason, not just the price",
  "s2_rival": "Netflix broke its word to viewers",
  "s2_wrong": "Viewers still feel tricked even after hearing the reason",
  "s2_ded": "If \"Period\" was a promise, adding ads broke it. Certain only if it was a promise",
  "s2_ind": "HBO Max (2021), Disney+ (2022) and Prime Video (2024) all added ads, so this looks like an industry shift",
  "s2_abd": "The likeliest meaning in 2015 was \"not now,\" not \"never\""
};

function framePromiseCase(){
  return `<details class="small-disclosure frame-promise"><summary>Another Netflix example: did “Period” mean a promise?</summary>
    <p>The original toolkit compares how the same 2015 statement could be read after Netflix added an ad-supported plan. These are possible readings of the statement.</p>
    <dl class="people-notes">${['s2_ded','s2_ind','s2_abd'].map(key=>`<div><dt>${FIELD_LABELS[key]}</dt><dd>${esc(FRAME_PROMISE_EXAMPLE[key])}</dd></div>`).join('')}</dl>
    <p><b>Rival reading</b> · ${esc(FRAME_PROMISE_EXAMPLE.s2_rival)}</p>
    <p><b>What would change your mind?</b> · ${esc(FRAME_PROMISE_EXAMPLE.s2_wrong)}</p></details>`;
}
