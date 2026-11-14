const STAKEHOLDER_QUADRANTS = [
  ['H', 'L', 'Keep satisfied', 'They can influence the decision, even if it rarely affects their day-to-day work.', 'For example, a finance lead may only need a short note about cost and risk before approving a rollout.'],
  ['H', 'H', 'Engage closely', 'They care about the outcome and can approve, block or shape it.', 'For example, invite the team lead who owns the rollout to test the proposed workflow and identify what would make it workable.'],
  ['L', 'L', 'Monitor', 'They have little influence and the change has little direct impact on them right now.', 'For example, give an adjacent team a brief update at launch and revisit its place on the map if the new process reaches them.'],
  ['L', 'H', 'Keep informed', 'The change matters to them, though they have little formal say in the decision.', 'For example, show frontline staff what will change in their daily work, and let them flag practical problems before launch.']
];

const ANYTIME = {
  7: {
    caseTitle: "Who hears the bid differently?",
    caseReading: ["Netflix framed a narrower purchase around studios and streaming.", "A regulator may hear a simpler review. A creator may still wonder who will decide which projects go ahead.", "Put each group on the matrix, then write the question each group would ask back."],
    name: 'Stakeholder Lens', icon: '◎',
    when: 'Use it when a decision affects several groups, such as rolling out a new workflow or changing a policy. Map who can shape the decision and who will feel its effects before deciding whom to consult and what each group needs to hear.',
    output: 'An audience plan for who to engage first and what to say.',
    steps: [
      ['Why use this matrix?', 'The vertical axis shows power: how much a person or group can approve, block or shape the decision. The horizontal axis shows interest: how much the outcome matters to them. Together, the axes suggest what kind of conversation to have with each group.', 'Pick one decision, list the people affected and rate each group on both axes. Then explore the four quadrants.', 'Someone can care deeply about the outcome without having a vote. Mapping both dimensions helps you hear from them before you decide.'],
      ...STAKEHOLDER_QUADRANTS.map(([, , title, meaning, action],i)=>[title, meaning, action, [
        'A group with approval power can still delay a decision if it learns about the change too late.',
        'Early involvement gives this group a real chance to surface concerns while you can still act on them.',
        'A light check-in leaves room to notice when their power or interest changes.',
        'People who live with a decision often see practical risks before the people who approve it.'
      ][i]])
    ],
    context: 'Power is how much a group can shape the decision. Interest is how much the outcome matters to them.',
    caseQuiz: ['In the bid example, what might a regulator hear in “We are only buying the studios and streaming business”?', ['“This narrower deal may be easier to assess.”', '“I will get a cheaper streaming plan.”', '“My next show has been commissioned.”'], 0, 'This is a possible regulator reading. The message Netflix sends and what the regulator hears are two different entries.'],
    quiz: ['A new workflow affects a support team every day, but the team cannot approve or block it. Which quadrant fits?', ['Keep satisfied', 'Keep informed', 'Monitor'], 1, 'The team has high interest and low decision power. Explain what is changing and make it easy to raise concerns.']
  },
  8: {
    why: ["An audience can act on a specific request. Vague enthusiasm leaves them guessing what you need.", "A lever is easier to evaluate when you can name the exact part of the message doing the work.", "People need enough information and room to decide for themselves.", "A gentler line can make the same ask while leaving the decision with your audience."],
    caseTitle: "When does a release date persuade?",
    caseReading: ["Releasing episodes on three dates gives viewers a reason to come back.", "A real date helps people plan. An invented deadline would make the same line feel like pressure.", "Name the actual release dates and what becomes available on each one."],
    name: 'Lever Board', icon: '≋',
    when: 'Use it when you have a message that asks someone to take an action.',
    output: 'A revised line with a clear influence tactic and an ethics check.',
    steps: [
      ['Start with a real ask', 'Ask for a decision your audience can make. Start with the exact sentence they would hear.', 'Name your audience and the action you want, then paste or write the line.'],
      ['Find the lever', 'A real deadline can be scarcity. Evidence that similar people succeeded can be social proof.', 'Pick the lever that fits the wording and verify the cue you are relying on.'],
      ['Check for pressure', 'A message can be factually correct and still make people feel they cannot say no.', 'Check whether the claim is real, the tactic is open, and the audience can freely decide.'],
      ['Turn it down and rewrite', 'Dialling down the tactic can make room for a clearer reason to act.', 'Turn the lead lever down two levels and rewrite the line so it still gives a clear reason to act.']
    ],
    caseQuiz: ['The release dates were real. What makes a line about them useful to the viewer?', ['It implies the episodes disappear if you wait.', 'It tells you when each group of episodes is available.', 'It claims every fan must watch on release day.'], 1, 'A genuine release schedule is useful information. Add a deadline only if access really ends.'],
    quiz: ['The real deadline is Friday. Which line uses scarcity honestly?', ['This is your last chance ever!', 'Apply by Friday. We review applications on Monday.', 'Everyone is applying, so hurry.'], 1, 'The message gives a real deadline and a reason. The reader can make a choice.']
  },
  9: {
    why: ["A clear limit gives you a basis for deciding when to keep talking and when to walk away.", "An overlap is the starting point for negotiation. A gap tells you where you may need a different term.", "You can make progress by trading across priorities, even when the headline number is hard to move.", "Knowing your fallback makes it easier to turn down an offer that leaves you worse off."],
    caseTitle: "When the two limits stop overlapping",
    caseReading: ["Netflix set a ceiling on what it would pay in the supplied bid case.", "A competing offer gave the seller a stronger alternative and raised the threshold a buyer would have to meet.", "Compare both limits in dollars per share. If the ceiling stays below the floor, examine other terms or use the fallback."],
    name: 'Deal Table', icon: '↔',
    when: 'Use it before negotiating a price, timeline, scope or exchange.',
    output: 'A deal plan with limits, trade options and a fallback.',
    steps: [
      ['Know both limits', 'The reservation point (RP) is your limit. The desired point (DP) is your target.', 'Write your limit, estimate theirs and name the outcome you are aiming for.'],
      ['See whether they overlap', 'A deal is possible on this measure if the buyer’s maximum meets or exceeds the seller’s minimum.', 'Put the buyer’s maximum and the seller’s minimum in the same unit. Look for an overlap.'],
      ['Sort what you can trade', 'Different priorities make it possible for each side to gain something it values.', 'Rank the issues for both sides. Consider offering what matters more to them in return for what matters more to you.'],
      ['Pick a posture and fallback', 'Your fallback gives you a way to judge whether an offer is worth accepting.', 'Pick a posture, then write what each side can do if there is no deal.']
    ],
    caseQuiz: ['In the supplied bid case, one buyer stops at $27.75 per share and the seller has a $31 alternative. What changes?', ['The competing offer gives the seller a stronger fallback.', 'The first buyer automatically wins.', 'The seller’s fallback disappears.'], 0, 'A stronger alternative can change the minimum a seller will accept. The two limits then leave no overlap.'],
    quiz: ['You can pay 27.5 and the seller needs at least 99 in the same unit. What does that tell you?', ['Open at 63.25.', 'The two limits create a deal range.', 'There is no overlap on those terms.'], 2, 'The buyer’s maximum is below the seller’s minimum. Change the terms or use your fallback.']
  },
  10: {
    caseTitle: "Why a clear price can still fall flat",
    caseReading: ["Financial figures explained the change to investors.", "A viewer could understand the price and still feel that the reason for losing a familiar plan was missing.", "Keep the figures and add a plain explanation of what changes, why it matters and what choices viewers have."],
    name: 'Trust Triangle', icon: '△',
    when: 'Use it before sending a message or when a good argument is failing to land.',
    output: 'A clearer message with one specific trust repair.',
    steps: [
      ['Ethos · credibility', 'Ethos is the credibility your audience gives you. It comes from relevant experience, a record of following through, and being clear about the limits of what you know.', 'Show one reason this audience can trust you on this specific claim, such as a past result or direct experience.', 'A title may get you heard. Relevant evidence of your judgment helps people decide whether to rely on it.'],
      ['Pathos · connection', 'Pathos connects your message to what the audience feels, values or stands to lose. It can be as simple as naming a concern in the words they use.', 'Acknowledge one real concern and explain what your proposal means for the people who will feel the impact.', 'People may understand your proposal and still feel that you have missed what matters most to them.'],
      ['Logos · reasoning', 'Logos is the reasoning people can follow from your evidence to your conclusion. It shows how the facts support the decision you are asking them to make.', 'Write your claim, give the strongest relevant evidence, and explain the link between the two.', 'A claim is easier to test and discuss when people can see how you reached it.'],
      ['Go deeper · trust equation', 'The trust equation looks at credibility, reliability and whether people feel safe being candid. It also asks how much your own interests appear to drive the message.', 'Score the four factors and choose one concrete behavior that would make you more trustworthy to this audience.', 'People judge trust across repeated interactions, including whether you keep your word and how you respond to concerns.']
    ],
    caseQuiz: ['Viewers get a new price and clear financial figures. Which change addresses the weak corner in this example?', ['Repeat the figures in larger type.', 'Explain why their plan changed, acknowledge the trade-off and show their choices.', 'List more investor credentials.'], 1, 'This addresses the experience of the people being asked to accept the change.'],
    quiz: ['Your message has credible sources and sound reasoning. People still feel you missed their concern. Where do you work first?', ['Ethos', 'Pathos', 'Logos'], 1, 'Address what people care about or may lose. That is the connection the message is missing.']
  },
  11: {
    why: ["Writing down the claim makes the leap from evidence to conclusion easier to see.", "Naming the trap helps you choose a specific repair instead of arguing about whether the whole point is wrong.", "A good repair makes the claim easier to test and gives others something concrete to respond to."],
    caseTitle: "When two options hide a third",
    caseReading: ["The announcement presented a choice between two plans.", "A member who had relied on the lower-priced ad-free plan could hear the message as a forced trade-off.", "Say what changed and name every option still available, including whether a member can keep their current plan."],
    name: 'Logic Trap Deck', icon: '▤',
    when: 'Use it to practise spotting weak arguments or repair one before you share it.',
    output: 'A card naming the trap and rewriting the argument.',
    steps: [
      ['Catch the leap', 'Write the claim as it was said. Ask what the speaker is treating as evidence.'],
      ['Name the trap', 'Pick the definition that describes the reasoning error. More than one trap can be present.'],
      ['Repair the argument', 'Add a missing option, find better evidence or make the claim narrower.']
    ],
    quiz: ['“We interviewed two people. That proves everyone wants this.” What is the trap?', ['False cause', 'Hasty generalization', 'Red herring'], 1, 'Two interviews can suggest a possibility. They cannot establish what everyone wants.'],
    caseQuiz: ['“Pay $15.49 for ad-free or switch to ads at $6.99.” When would this become a false dilemma?', ['When presented as the only choices despite other real options.', 'Whenever two prices are mentioned.', 'Whenever one option costs less.'], 0, 'Two choices are fine when they really are the available choices. The trap is hiding a real alternative.']
  },
  12: {
    why: ["Start with common ground so your audience knows what the pitch is about.", "A concrete change or cost gives people a reason to act now.", "A focused question makes clear what the proposal needs to answer.", "One clear proposal is easier for people to evaluate and repeat.", "Evidence gives the audience a reason to believe your proposal can work.", "An explicit ask lets the audience turn agreement into a decision."],
    caseTitle: "A pitch that ends with a pilot",
    caseReading: ["The team wanted to make recommendations easier to understand.", "Leadership needed to see why a small label change was worth testing and what approval meant.", "Ask for one bounded pilot and say what evidence would determine whether it should continue."],
    name: 'Pitch Arc', icon: '⌁',
    when: 'Use it before a short meeting, critique or presentation where you want someone to make a decision. For example, ask a sponsor to approve a pilot, a client to choose a direction, or a team to commit time or resources.',
    output: 'A six-beat pitch and a reusable drafting prompt.',
    steps: [
      ['Situation', 'The situation sets up what is already true. Give the audience one fact or bit of context they can agree on before you introduce a change.', 'What does the audience already know or agree is true?'],
      ['Complication', 'The complication is what changed or what is getting in the way. It gives people a reason to pay attention now.', 'What changed, and what is at stake if nothing changes?'],
      ['Question', 'The question turns the complication into one thing the audience needs to resolve. The rest of the pitch should answer it.', 'What one question does the complication raise for this audience?'],
      ['Answer', 'The answer is your proposal. It states what you think the audience should do in response to the question.', 'What do you propose in one sentence?'],
      ['Proof', 'Proof is the evidence that makes your answer credible. A test, example or result helps people judge whether the proposal is worth trying.', 'What is your strongest relevant evidence? What uncertainty should you name?'],
      ['Ask', 'The ask turns the pitch into a decision or commitment. Make it clear who can act, what they need to do and by when.', 'What specific decision or small first step do you want, from whom, and by when?']
    ],
    caseQuiz: ['The team proposes a clearer label for personalised rows. Which beat is “Approve a pilot of the new label”?', ['Situation', 'Proof', 'Ask'], 2, 'The ask is the concrete decision the audience can make now.'],
    quiz: ['After your answer and proof, which ending makes it easier to act?', ['“Any thoughts?”', '“This is the future.”', '“Will you approve a two-week pilot by Friday?”'], 2, 'A concrete ask names a decision, a bounded commitment and a time.']
  }
};

const LEVERS = [
  ['Reciprocity', 'Offer something genuinely useful with no strings.', /\b(free|gift|give|sample|help|credit|trial)\b/i],
  ['Commitment and consistency', 'Build on a step the person chose freely.', /\b(already|committed|signed|pledged|promised|agreed)\b/i],
  ['Social proof', 'Show what relevant peers actually did.', /\b(peers|teams|members|reviews|rated|adopted|most|customers)\b/i],
  ['Liking', 'Use an honest personal connection or shared interest.', /\b(friend|friendly|favourite|favorite|shared interest|like you)\b/i],
  ['Authority', 'Use a credible expert whose expertise fits the claim.', /\b(expert|certified|researcher|doctor|qualified|specialist|accredited)\b/i],
  ['Scarcity', 'Name a real limit, deadline or limited capacity.', /\b(limited|only \d+|deadline|last chance|few spots|remaining|by friday|sold out)\b/i],
  ['Unity', 'Speak from a shared identity people actually claim.', /\b(our community|one of us|together|fellow|our members|our team)\b/i]
];
const POSTURES = [
  ['Reactive strict', 'Hold the position and concede little.'],
  ['Reactive lenient', 'Concede early to preserve the relationship.'],
  ['Strategic', 'Plan concessions around your limit and the things each side values.'],
  ['Principled', 'Work from interests, fair criteria and possible joint gains.']
];
const TRUST_CORNERS = ['Ethos', 'Pathos', 'Logos'];
const TRUST_EQUATION = [
  ['Credibility', 'How believable are your words and expertise?'],
  ['Reliability', 'Do people expect you to follow through?'],
  ['Intimacy', 'Can they raise a concern safely?'],
  ['Self-orientation', 'How much do you seem focused on your own interests?']
];
const LOGIC_DECK = [
  ['False dilemma', 'Shows two options when others exist.', 'Either launch this week or give up on the project.', [4, 1], 'Name real alternatives, such as a smaller pilot or a later launch.'],
  ['Ad hominem', 'Attacks the speaker instead of their reasoning.', 'That evidence is worthless. She has never worked here.', [3, 4], 'Test the evidence itself.'],
  ['Slippery slope', 'Predicts an extreme chain of events without support.', 'If we allow one exception, soon none of the rules will matter.', [6, 0], 'Ask for evidence for each link in the chain.'],
  ['Straw man', 'Replaces a claim with a weaker version and argues against that.', 'You asked for a smaller pilot. So you want us to stop innovating.', [1, 4], 'Restate the original request fairly before responding.'],
  ['Red herring', 'Diverts attention to an unrelated issue.', 'Why debate the missing safety checks? We delivered on time.', [5, 3], 'Return to the question about the missing checks.'],
  ['Hasty generalization', 'Makes a broad claim from too little evidence.', 'Two customers disliked the menu. Nobody wants this design.', [7, 9], 'Describe the small sample and test with more of the intended audience.'],
  ['False cause', 'Assumes that one event caused another because they happened together or in sequence.', 'Sales rose after we changed the logo. The logo caused the increase.', [2, 5], 'Check alternative explanations and compare against a baseline.'],
  ['Bandwagon', 'Treats popularity as proof that a choice is right.', 'Every competitor uses this tool, so it must solve our problem.', [1, 6], 'Ask what the tool does in your own context.'],
  ['Anchoring', 'Gives the first number or idea too much weight.', 'The first quote was 100. The next offer was 85, so it must be good.', [7, 0], 'Set your own benchmark before evaluating the offers.'],
  ['Confirmation bias', 'Favours evidence that supports the belief you already hold.', 'We ignored the surveys that disagreed with the concept because we knew it would work.', [8, 5], 'Look for evidence that could change your mind.']
];

Object.assign(ANYTIME,{
  13:{
    name:'3E Scale',icon:'⚖',
    when:'Use it before a negotiation or a change people may push back on. Compare what each side values before choosing your opening.',
    output:'A side-by-side 3E read, an opening line, and a fair-play check.',
    caseTitle:'What felt fair to Netflix and to its members?',
    caseReading:[
      'Netflix made an economic case for paid sharing by talking about its ability to invest in shows.',
      'People who had shared with family could weigh emotion and fairness more heavily, especially given Netflix’s earlier message about sharing.',
      'Acknowledge what members are losing and explain why the change is fair before you get to the price.'
    ],
    steps:[
      ['Name the issue','Ethics asks what is fair, emotion asks how it feels, and economics asks what it costs or returns. The same issue can carry a different mix for each side.','Name the two sides and the decision you are preparing for.','Start with one concrete decision. The same two sides can weigh the three Es differently on a different issue.'],
      ['Allocate 100 points','A fixed budget forces each side to show its priorities. The other side’s weights are working estimates.','Give each side 100 points across ethics, emotion, and economics.','Ask what each party has said or done before you settle on the weights.'],
      ['Compare and open','The biggest gap shows where you see the issue differently. Their strongest E gives you a place to start.','Name what matters to them in your opening line, then explain your own case.','Showing you understand their priority gives them a reason to keep listening.'],
      ['Check fair play','Both sides should know the rules and be free to decline. Imagine they could read your plan or use the same approach on you.','Answer the four checks. Revise the approach wherever you answer no.','If the approach only works when someone is kept in the dark or cannot walk away, revise it before going in.']
    ],
    quiz:['Their biggest priority is fairness. Yours is cost. Where do you open?',['Start with the financial upside.','Acknowledge their fairness concern, then explain the costs.','Keep your plan secret so it sounds neutral.'],1,'Open with the strongest consideration on their side. Then make your own case.']
  },
  14:{
    name:'Empathy Lens',icon:'◎',
    when:'Use it before a pitch, a hard conversation, or a change that lands on someone. Pick one person or audience segment you need to understand better.',
    output:'A one-person empathy read and a statement in their words to check with them.',
    caseTitle:'Paid sharing from the viewer’s side',
    caseReading:[
      'Netflix framed the change around revenue and continued investment in shows.',
      'A person who shared with family might hear that something they were encouraged to do had become a problem.',
      'Listen for the words they use. Compare survey intentions with observed behaviour, and check the interpretation with a viewer.'
    ],
    steps:[
      ['Choose one person','The Stakeholder Lens maps the groups affected. The Empathy Lens goes deeper on one person or a narrowly defined group.','Name whose perspective you want to understand.','A specific person gives you something to listen for. A broad label can hide people with different priorities.'],
      ['Feel, care, and do','Feelings, values, and behaviour each tell you something different. What people say they would do and what they actually do can differ.','Record feelings and priorities as hypotheses where needed. Keep their words separate from observed actions.','Comparing all three gives you a fuller account without guessing someone’s motives from one remark.'],
      ['Write both truths','Put your explanation alongside how the same event might sound to them. Empathy means understanding their view while leaving room for disagreement.','Write their view in their words. Ask them whether it sounds right before you act on it.','Checking their version with them makes it easier to find out what you missed.']
    ],
    quiz:['People say they will stop using a service, and many continue using it. What should you do?',['Ignore what they said.','Assume they approve of the change.','Keep both observations and ask what explains the gap.'],2,'The words and the behaviour can each be meaningful. Find out what matters in the gap.']
  }
});

LOGIC_DECK.push(
  ['Availability','Judges likelihood by how easily an example comes to mind.','Everyone remembers last week’s outage, so outages must be getting more frequent.',[9,5],'Check the actual outage rate across a meaningful period.'],
  ['Representativeness','Judges by resemblance to a familiar type while overlooking how common it is.','The small team acts like a famous startup, so it is probably headed for the same success.',[10,8],'Check how often similar teams succeed and what evidence makes this team comparable.']
);

const PITCH_ROUTES={
  beh:['Deciding quickly',[
    ['Priming','Open with an idea they already accept. It sets the lens for what follows.'],
    ['Framing','Show what could be lost by leaving things as they are. Use a real consequence.'],
    ['Availability','Make the decision concrete with one vivid, relevant example.'],
    ['Representativeness','Show how your proposal resembles an approach that worked in a comparable setting.'],
    ['Evidence ladder','Lead with your strongest relevant proof. Show what you tested, saw, or heard.'],
    ['Anchoring','Name the scope or number, then ask for one small, specific decision.']
  ]],
  rat:['Weighing it up',[
    ['Facts first','State where things stand in plain numbers the audience can check.'],
    ['Cost of doing nothing','Estimate what it costs to leave things as they are and show your assumptions.'],
    ['The decision','Name the decision and the options on the table.'],
    ['Costs and benefits','Lay out the costs, benefits, and trade-offs of the proposal.'],
    ['Expected value','Show the likely outcome and uncertainty using the strongest evidence you have.'],
    ['Terms and walk-away','State the terms clearly, including what happens if they decline.']
  ]]
};
