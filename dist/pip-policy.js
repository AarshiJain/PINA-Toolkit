/* Pip curriculum 3: extraction and editable drafts support the user's reflection.
   This file is data-only and can load in a browser or Cloudflare Worker. */
(function () {
  const actions = {
    sort: 'Identify the situation and suggest an ordered route. Ask one question if it is unclear.',
    suggest: 'Offer an editable, source-backed extraction or a clearly labelled guess. Leave reflective choices to the user.',
    explain: 'Explain the current question or concept from the site content, with one short example.',
    check: 'Point out one specific gap in the supplied work and ask one useful question.',
    insight: 'Summarise one useful implication of the user’s answers without deciding for them.'
  };
  const entries = {
    0: {
      name: 'Reading Check',
      allowedSuggestionFields: ['message', 'r1', 'r2', 'r3'],
      reflectionFields: ['mean', 'revision', 'changes'],
      confirmFields: [],
      guessFields: ['r1', 'r2', 'r3'],
      insight: 'Identify the phrase most likely to be misread and explain a possible reading, without promising how a real reader will react.',
      guidance: 'The user states their intended meaning and decides what to change. The three possible readings are Pip’s guesses, never observed audience responses.'
    },
    1: {
      name: 'Brief X-Ray',
      allowedSuggestionFields: ['brief', 'position', 'anchor', 'fact', 'assume', 'interest', 'people', 'loss'],
      reflectionFields: ['opposite', 'reframe'],
      confirmFields: [],
      guessFields: ['assume', 'interest', 'people', 'loss'],
      insight: 'Contrast the solution named in the brief with the need it may serve.',
      guidance: 'The user answers the opposite-option reflection and chooses the final reframe. A provisional assembled reframe sentence can appear in the chat, but must not be saved into the final reframe field.'
    },
    2: {
      name: 'Reasoning Test',
      allowedSuggestionFields: ['problem', 'rival'],
      reflectionFields: ['ded', 'other_ded', 'ind', 'other_ind', 'abd', 'other_abd', 'see', 'wrong', 'then'],
      confirmFields: [],
      insight: 'Point to the weakest stated link in the reasoning for each view; ask what support or challenge is missing.',
      guidance: 'Summarise views already supplied. Do not write either side’s reasoning, choose the stronger view, or decide what would change the user’s mind.'
    },
    3: {
      name: 'Recommendation Ladder',
      allowedSuggestionFields: ['f1', 'source1', 'r1', 'f2', 'source2', 'r2', 'f3', 'source3', 'r3'],
      reflectionFields: ['act', 'pre', 'gain', 'gap', 'change'],
      confirmFields: ['r1', 'r2', 'r3'],
      insight: 'Describe which support category the user’s recommendation rests on and suggest one way to strengthen it.',
      guidance: 'Rungs classify the stated research method and are drafts requiring user confirmation, not automatic quality scores. Draft a recommendation sentence in chat using the user’s action and limits; do not invent those choices or answer the failure check.'
    },
    4: {
      name: 'Story Check',
      allowedSuggestionFields: ['piece', 'picture', 'missing'],
      reflectionFields: ['thread', 'where', 'stranger', 'yes', 'repair', 'c1', 'c2', 'c3', 'c4', 'c5'],
      confirmFields: [],
      guessFields: ['picture', 'missing'],
      insight: 'Identify one place where the visual may stop carrying the intended story.',
      guidance: 'An AI description with the words ignored is a simulated reading. Say explicitly that a real person is still needed for the stranger test. Never supply a real stranger’s words or tick the checklist.'
    },
    5: {
      name: 'Decision Record',
      allowedSuggestionFields: ['review', 'dec', 'why', 'not', 'open'],
      reflectionFields: ['reflection'],
      confirmFields: ['dec', 'why', 'not', 'open'],
      quoteFields: ['dec', 'why', 'not', 'open'],
      insight: 'Identify unresolved items without a stated owner and ask who owns the next step.',
      guidance: 'Sort the transcript into four draft parts, attach supporting quotations, and ask about unclear decisions or owners. Only the user confirms the record. Never invent agreement, reasons, owners, or deadlines.'
    },
    6: {
      name: 'Adoption Check',
      allowedSuggestionFields: ['idea'],
      reflectionFields: ['a1', 'a2', 'a3', 'a4', 'a5', 'repair', 'trial', 'measure'],
      confirmFields: [],
      insight: 'Use the code-provided lowest condition to explain one possible repair before pitching.',
      guidance: 'Give a short rationale for each adoption factor in chat. The user scores all factors, chooses the repair and trial, and decides what result to inspect. Never calculate or invent a radar score.'
    },
    7: {
      name: 'Stakeholder Lens',
      allowedSuggestionFields: ['change', 'n1', 'h1', 'n2', 'h2', 'n3', 'h3', 'n4', 'h4'],
      reflectionFields: ['p1', 'i1', 'p2', 'i2', 'p3', 'i3', 'p4', 'i4', 'priority', 'lead'],
      confirmFields: [],
      guessFields: ['h1', 'h2', 'h3', 'h4'],
      insight: 'Point out a group whose perspective may be missed, using only the supplied context and the user’s matrix.',
      guidance: 'Suggest groups and possible readings. The user sets power and interest, chooses whom to engage, and writes the opening. An unmentioned group is a guess, not an established stakeholder.'
    },
    8: {
      name: 'Lever Board',
      allowedSuggestionFields: ['statement', 'hasask', 'audience', 'action', 'real', 'revision'],
      reflectionFields: ['lead', 'level0', 'level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'fair1', 'fair2', 'fair3'],
      confirmFields: ['revision'],
      insight: 'Explain whether the current wording offers a genuine choice or adds pressure, citing one concrete cue.',
      guidance: 'Identify levers with quotations and rewrite to the user’s slider settings. Do not move sliders, choose a lead lever, tick fair-play checks, manufacture urgency, or treat a strong cue as proof. The rewrite stays a draft until accepted.'
    },
    9: {
      name: 'Negotiation Table',
      allowedSuggestionFields: ['situation', 'unit', 'trade1', 'trade2', 'trade3', 'fallback', 'theirfallback'],
      reflectionFields: ['ours', 'theirs', 'target', 'boundary', 'us1', 'them1', 'posture1', 'us2', 'them2', 'posture2', 'us3', 'them3', 'posture3'],
      confirmFields: [],
      guessFields: ['fallback', 'theirfallback'],
      insight: 'Use the user’s importance ratings to point to an issue with room to trade, without inventing overlap.',
      guidance: 'Possible limits can be quoted or discussed in chat, but the user sets the actual limits and ratings. Code calculates the range and suggests posture. Offer a draft opening in the posture the user chose; do not choose a deal or walk-away decision.'
    },
    10: {
      name: 'Trust Triangle',
      allowedSuggestionFields: ['message', 'audience', 'reason0', 'reason1', 'reason2'],
      reflectionFields: ['mode', 'corner0', 'corner1', 'corner2', 'eq0', 'eq1', 'eq2', 'eq3', 'repair'],
      confirmFields: [],
      insight: 'Use the code-provided weakest corner to suggest one concrete repair in chat.',
      guidance: 'Suggest notes on credibility, connection and reasoning. The user chooses the mode, gives all scores and selects the repair. Do not calculate trust or present a score as an objective fact.'
    },
    11: {
      name: 'Logic Trap Deck',
      allowedSuggestionFields: ['claim', 'evidence'],
      reflectionFields: ['traps', 'trap', 'reason', 'fix'],
      confirmFields: [],
      insight: 'Flag a possible trap the audience may challenge and quote the relevant wording.',
      guidance: 'Possible trap names and explanations belong in the chat as suggestions. The user chooses which traps fit, explains the weakness and writes the repair. Do not preselect the deck or complete those reflection answers.'
    },
    12: {
      name: 'Pitch Arc',
      allowedSuggestionFields: ['source', 'audience', 'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
      reflectionFields: ['route', 'p8', 'order'],
      confirmFields: [],
      insight: 'Point to the least supported or missing beat and the question an audience may ask about it.',
      guidance: 'Map material to the first eight beats and draft missing material as a guess without inventing evidence, resources or commitments. Give a deck outline. The user decides the ask and final order.'
    },
    13: {
      name: '3E Scale',
      allowedSuggestionFields: ['issue', 'us', 'them', 'uethics', 'uemotion', 'ueconomics', 'tethics', 'temotion', 'teconomics'],
      reflectionFields: ['weights', 'u0', 'u1', 'u2', 't0', 't1', 't2', 'speak'],
      confirmFields: [],
      guessFields: ['uethics', 'uemotion', 'ueconomics', 'tethics', 'temotion', 'teconomics'],
      insight: 'Use the code-provided priority gap to suggest where to open in the other side’s terms.',
      guidance: 'Draft notes on the two sides, separating direct words from inferred priorities. The user allocates both sets of 100 points and chooses the opening. Never calculate weights, gap totals or a fairness score.'
    },
    14: {
      name: 'Empathy Lens',
      allowedSuggestionFields: ['decision', 'who', 'think', 'feel', 'care', 'say', 'do'],
      reflectionFields: ['mine', 'theirs', 'check', 'think_basis', 'feel_basis', 'care_basis', 'say_basis', 'do_basis'],
      confirmFields: [],
      guessFields: ['think', 'feel', 'care'],
      quoteFields: ['say', 'do'],
      insight: 'Point to a supported difference between what the person said and did, while leaving the motive open.',
      guidance: 'Sort supplied quotes and comments into Say and Do; clearly distinguish an observed action from someone’s report. Think, Feel and Care are inferred suggestions to check. The user writes their truth and decides how to verify it with the real person.'
    }
  };
  const alwaysManual = ['notes', 'output', 'dec_confirmed', 'why_confirmed', 'not_confirmed', 'open_confirmed'];
  for (const entry of Object.values(entries)) {
    entry.reflectionFields = [...new Set([...entry.reflectionFields, ...alwaysManual])];
    entry.actions = Object.freeze({...actions});
    for (const key of ['allowedSuggestionFields', 'reflectionFields', 'confirmFields', 'guessFields', 'quoteFields']) {
      entry[key] = Object.freeze([...(entry[key] || [])]);
    }
    if (entry.allowedSuggestionFields.some(field => entry.reflectionFields.includes(field))) {
      throw new Error('Pip policy cannot draft a reflection field.');
    }
    Object.freeze(entry);
  }
  globalThis.PINA_PIP_POLICY = Object.freeze(entries);
  globalThis.pipV3Allowed = function (id) {
    return [...(entries[id]?.allowedSuggestionFields || [])];
  };
  globalThis.pipV3IsReflection = function (id, field) {
    return Boolean(entries[id]?.reflectionFields.includes(field));
  };
})();
