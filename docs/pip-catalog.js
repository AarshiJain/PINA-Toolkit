/* Field suffixes map to the existing PINA project data. An array lists allowed values. */
globalThis.PIP_TOOLS=[
 ['Reading Check','Compare likely audience readings and clarify a message.',{
  mean:'Intended meaning',r1:'Aligned reading',r2:'Reading with reservations',r3:'Fair opposing reading'
 }],
 ['Brief X-Ray','Separate a requested solution from the underlying problem.',{
  brief:'Original brief, using source words',fact:'Stated facts',anchor:'Solution already named',position:'Requested task',assume:'Assumption to test',
  opposite:'Alternative approach',interest:'Desired outcome',people:'People affected',loss:'What is at stake',trigger:'Immediate event that prompted the brief',reframe:'Tentative problem statement'
 }],
 ['Reasoning Test','Apply rules, identify patterns and compare explanations, then name an observable challenge.',{
  rt:['Reasoning type','Deductive','Inductive','Abductive'],grounds:'Grounds',warrant:'Why the grounds support the explanation',see:'Working interpretation',then:'Proposed direction',rival:'Strong alternative explanation',wrong:'Observation that would change your mind',ded:'Rule, application to this case and conclusion',ind:'Cases, pattern and limits',abd:'Plausible explanation and why it fits'
 }],
 ['Evidence Ladder','Match findings to how they were gathered and check a recommendation.',{
  f1:'Finding 1 with source',r1:['Support for finding 1','1','2','3','4'],f2:'Finding 2 with source',r2:['Support for finding 2','1','2','3','4'],
  f3:'Finding 3 with source',r3:['Support for finding 3','1','2','3','4'],pre:'Plausible reason for failure',act:'Proposed action',gain:'Audience benefit',gap:'Uncertainty',change:'Evidence that would change the recommendation'
 }],
 ['Thread Check','Compare an agreed purpose with the current work.',{
  thread:'Original purpose',where:'Where it appears in the current work',yes:'Earlier commitment',stranger:'Possible fresh reading, explicitly simulated'
 }],
 ['Reasoned Review','Turn review notes into a decision and handover record.',{
  review:'Review notes',dec:'Decision explicitly recorded',why:'Reasons for the decision',not:'Rejected alternatives and reasons',open:'Open questions'
 }],
 ['Value Case','Tie the offer to outcomes, evidence and a measurable trial.',{
  walk:'Walk-away condition if given',more:'Scope or outcomes to discuss',out:'Outcome the client is paying for',hours:'Production measure to put in context',got:'Evidence of value already delivered',trial:'Proposed bounded trial',measure:'How to measure the result'
 }],
 ['Stakeholder Lens','Identify who can shape a change, who is affected, and what they may hear.',{
  change:'Proposed change',
  ...Object.fromEntries([1,2,3,4].flatMap(i=>[['n'+i,'Stakeholder '+i],['p'+i,['Power of group '+i,'H','L']],['i'+i,['Interest of group '+i,'H','L']],['h'+i,'What group '+i+' might hear']])),
  lead:'Proposed opening line'
 }],
 ['Lever Board','Identify a persuasion lever and revise an ask to reduce pressure.',{
  audience:'Audience',action:'Action requested',statement:'Original message',
  lead:['Lead lever (0 Reciprocity, 1 Commitment, 2 Social proof, 3 Liking, 4 Authority, 5 Scarcity, 6 Unity)','0','1','2','3','4','5','6'],
  real:'Evidence for the claim or cue',revision:'Lower-pressure revision'
 }],
 ['Deal Table','Extract negotiation terms and find trades without inventing limits.',{
  side:['Our role','buy','sell'],ours:['Our documented limit','#number'],theirs:['Their documented or explicitly estimated limit','#number'],target:['Documented target','#number'],unit:'Shared unit',
  trade1:'Tradeable issue 1',trade2:'Tradeable issue 2',trade3:'Tradeable issue 3',fallback:'Our fallback',theirfallback:'Their fallback if known'
 }],
 ['Trust Triangle','Examine credibility, connection and reasoning in a message.',{
  audience:'Audience',message:'Original message',reason0:'Credibility explanation',corner0:['Credibility score','1','2','3','4','5'],
  reason1:'Connection explanation',corner1:['Connection score','1','2','3','4','5'],reason2:'Reasoning explanation',corner2:['Reasoning score','1','2','3','4','5'],repair:'One proposed repair'
 }],
 ['Logic Trap Deck','Locate a possible reasoning error and offer a repair.',{
  claim:'Original claim',evidence:'What the speaker is treating as evidence',trap:['Possible trap','False dilemma','Ad hominem','Slippery slope','Straw man','Red herring','Hasty generalization','False cause','Bandwagon','Anchoring','Confirmation bias','Availability','Representativeness'],
  reason:'Why the trap might fit',fix:'A more defensible claim or test'
 }],
 ['Pitch Arc','Turn material into a six-beat pitch and a specific ask.',{
  audience:'Audience',route:['Decision route (beh Deciding quickly, rat Weighing it up)','beh','rat'],beat0:'Situation',beat1:'Complication',beat2:'Question',beat3:'Answer',beat4:'Proof if supported',beat5:'Ask'
 }],
 ['3E Scale','Compare how both sides weigh ethics, emotion, and economics before making an offer.',{
  us:'Our side',them:'Their side',issue:'The issue under negotiation',speak:'Possible opening line'
 }],
 ['Empathy Lens','Explore how one person experiences a change and compare what both sides need.',{
  who:'Person or group affected',feel:'What they may feel',care:'What they may care about',say:'What they said or might say',do:'What they did or might do',mine:'Our side of the situation',theirs:'Their possible side of the situation'
 }]
];
globalThis.PIP_GOALS=[
 ['brief','Understand a brief'],['people','Map people affected'],['frame','Test an interpretation'],['evidence','Check evidence or reasoning'],
 ['message','Revise a message'],['pitch','Prepare a pitch'],['deal','Plan a negotiation'],['review','Review or hand over work']
];
globalThis.pipSpecs=id=>globalThis.PIP_TOOLS[id]?
  {...globalThis.PIP_TOOLS[id][2],...(id<=6?{situation:'Situation',audience:'Audience',purpose:'Purpose'}:{})}:{};
