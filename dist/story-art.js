/* Five original, layered paper scenes. Every moving part belongs to the story. */
const storyInk='#303f38';
// One invisible landing marker per scene. The same live Pip travels between them.
function storyPip(x,y,width,mood='curious',angle=0,ground=460){
 return `<rect class="story-pip-landing" x="${x}" y="${y}" width="${width}" height="${width*1.2}" data-mood="${mood}" data-angle="${angle}" data-ground="${ground}" fill="none" pointer-events="none"/>`;
}
const storyNote=(x,y,w,h,fill,angle,body,cls='')=>`<g class="paper-piece ${cls}" transform="rotate(${angle} ${x+w/2} ${y+h/2})"><path d="M${x+4} ${y+7}H${x+w+5}V${y+h+7}H${x+4}Z" fill="#33483b" opacity=".09"/><path d="M${x} ${y}Q${x+w/2} ${y-3} ${x+w} ${y}L${x+w-2} ${y+h}Q${x+w/2} ${y+h-2} ${x} ${y+h}Z" fill="${fill}" stroke="${storyInk}" stroke-width="1.7"/>${body}</g>`;
const storyLabel=(x,y,text,size=15,anchor='start')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${storyInk}" font-family="Inter,Arial,sans-serif">${text}</text>`;
const storyLines=(x,y,w,count=3)=>Array.from({length:count},(_,i)=>`<path d="M${x} ${y+i*15}q${w/2} ${i%2?2:-1} ${w-(i===count-1?25:0)} 0" class="pencil-line"/>`).join('');
function storyFace(x,y,fill='#e5d3b4'){
  return `<g class="person-token"><circle cx="${x}" cy="${y}" r="23" fill="${fill}" stroke="${storyInk}" stroke-width="1.5"/><path d="M${x-12} ${y-12}q12-15 25 1M${x-9} ${y+8}q9 8 18-1" class="pencil-line"/><circle cx="${x-8}" cy="${y}" r="1.6" fill="${storyInk}"/><circle cx="${x+8}" cy="${y}" r="1.6" fill="${storyInk}"/></g>`;
}
const storyScenes=[
 ()=>`<path d="M65 329C25 177 157 58 326 69S565 191 534 347 335 484 186 452 82 402 65 329Z" fill="#e4ece0" class="scene-cloud"/>
 <path d="M83 434Q250 408 492 437" class="ground-line"/>
 <g class="scene-main-paper">${storyNote(251,110,222,290,'#fffdf4',5,
 storyLabel(276,147,'THE BRIEF',13)+storyLines(276,174,161,3)+'<path d="M252 231q105-5 220 0" stroke="#789181" stroke-width="1.3" stroke-dasharray="5 5"/>'+storyLabel(279,267,'what lies beneath?',16)+storyLines(279,291,143,3)+
 '<g class="brief-reveal" data-art-tool="1"><path d="M271 252q85-16 175-2l-2 92q-87 11-171-1Z" fill="#e9d59a" opacity=".58"/><path d="m405 351 7 8 14-18" class="pencil-line"/></g>')}</g>
 <g class="stakeholder-orbit" data-art-tool="7"><path d="M111 151Q234 4 422 84M135 165l-20 57M422 95l67 55" class="sketch-dash"/>${storyFace(109,142,'#d5e6ed')}${storyFace(320,53,'#f0d4aa')}${storyFace(492,167,'#d1dfc7')}</g>
 <g class="empathy-glance" data-art-tool="14"><path d="M98 213q-33-18-56 6l4 36h42l13 13-4-18q20-14 1-37Z" fill="#fffdf5" stroke="${storyInk}" stroke-width="1.5"/><path d="M62 226q-12-8-12 4t13 17q22-16 8-20-5-1-9 4" fill="#e5c3ac" stroke="${storyInk}" stroke-width="1.2"/></g>
 ${storyPip(63,232,220,'curious',-5,434)}
 <g class="magnifier" data-art-tool="1"><circle cx="336" cy="291" r="42" fill="#d9e9df" fill-opacity=".4" stroke="${storyInk}" stroke-width="3"/><circle cx="336" cy="291" r="33" fill="none" stroke="#7b9987" stroke-width="1"/><path d="m306 322-54 57" stroke="${storyInk}" stroke-width="13" stroke-linecap="round"/><path d="m306 322-54 57" stroke="#e7c57e" stroke-width="8" stroke-linecap="round"/><path d="m350 267 9 12" stroke="#fffef7" stroke-width="4" stroke-linecap="round"/></g>
 <path d="M183 99q18-21 49-17m-10-7 12 7-12 6" class="pencil-line"/>`,
 ()=>`<path d="M61 188C103 65 274 47 425 97S581 283 507 401 229 497 118 430 24 298 61 188Z" fill="#e1eaee" class="scene-cloud"/>
 <path d="M53 460q245-21 492 0" class="ground-line"/>
 <g class="decision-note decision-a" data-story-option="0" data-travel-card="a">${storyNote(28,168,176,145,'#fffdf5',-6,storyLabel(47,199,'DIRECTION A',12)+storyLines(48,226,128,3)+'<circle class="decision-choice" cx="174" cy="198" r="10" fill="#c6d8c2" stroke="'+storyInk+'"/><path class="decision-check" d="m169 198 4 4 8-10" fill="none" stroke="'+storyInk+'" stroke-width="2"/>')}</g>
 <g class="decision-note decision-b" data-story-option="1" data-travel-card="b">${storyNote(397,168,176,145,'#f1e1ba',6,storyLabel(416,199,'DIRECTION B',12)+storyLines(417,226,128,3)+'<circle class="decision-choice" cx="543" cy="198" r="10" fill="#c6d8c2" stroke="'+storyInk+'"/><path class="decision-check" d="m538 198 4 4 8-10" fill="none" stroke="'+storyInk+'" stroke-width="2"/>')}</g>
 <g class="decision-clue" data-story-prop="clue">${storyNote(226,80,146,99,'#fffdf5',-4,storyLabel(245,108,'A CLUE',11)+storyLines(245,128,105,2))}</g>
 <g class="analysis-magnifier" data-story-prop="magnifier"><circle cx="317" cy="130" r="37" fill="#d9e9df" fill-opacity=".42" stroke="${storyInk}" stroke-width="3"/><circle cx="317" cy="130" r="29" fill="none" stroke="#7b9987"/><path d="m290 159-35 43" stroke="${storyInk}" stroke-width="12" stroke-linecap="round"/><path d="m290 159-35 43" stroke="#e7c57e" stroke-width="7" stroke-linecap="round"/><path d="m329 110 8 9" stroke="#fffef7" stroke-width="4" stroke-linecap="round"/></g>
 <path d="M254 324q44 21 91 0m-12-3 14 3-9 9" class="pencil-line" opacity=".45"/>
 ${storyPip(190,222,220,'thinking',0)}`,
 ()=>`<path d="M47 204C85 71 244 48 401 88s192 190 118 303-269 111-377 46S17 328 47 204Z" fill="#ece5d7" class="scene-cloud"/>
 <path d="M54 460q245-21 492 0" class="ground-line"/>
 <g class="message-links"><path d="M222 157Q250 174 280 209M378 157Q350 174 320 209" class="pencil-line"/><path d="M300 238v22" class="sketch-dash"/></g>
 <g class="message-original" data-message-card="meant">${storyNote(20,42,210,154,'#fffdf5',-3,storyLabel(38,74,'WHAT I MEANT',14)+storyLabel(39,117,'Let’s try it.',22)+storyLines(39,151,161,1))}</g>
 <g class="message-reply" data-message-card="heard">${storyNote(370,42,210,154,'#dce7d6',3,storyLabel(386,74,'WHAT THEY HEARD',13)+storyLabel(389,117,'Is this decided?',21)+storyLines(389,151,160,1))}</g>
 <g class="message-gap"><circle cx="300" cy="217" r="24" fill="#fffdf5" stroke="${storyInk}" stroke-width="1.5"/>${storyLabel(300,225,'?',26,'middle')}</g>
 ${storyPip(190,222,220,'curious',0)}`,
 ()=>`<path d="M73 182C130 64 315 53 449 112s144 219 40 306-278 80-373 4S22 291 73 182Z" fill="#e2e9d9" class="scene-cloud"/>
 <ellipse cx="303" cy="455" rx="241" ry="24" fill="#d5e0cc"/>
 <path d="M354 354v101m95-101v101m-126 0h155" class="pencil-line"/>
 <g class="pitch-board">
 <g class="pitch-panel pitch-panel-one"><path d="m259 141 92-12v226l-92 12Z" fill="#fffdf5" stroke="${storyInk}" stroke-width="1.7"/>${storyLabel(275,174,'PROBLEM',10)+storyLines(274,204,59,3)}<path d="m275 290 11-17 14 9 26-29" class="pencil-line"/></g>
 <g class="pitch-panel pitch-panel-two"><path d="m351 129 92 12v226l-92-12Z" fill="#e6d5aa" stroke="${storyInk}" stroke-width="1.7"/>${storyLabel(366,174,'THE IDEA',10)+storyLines(366,204,59,3)}<path d="M376 289q-5-11 8-22 18-11 24 3 6 11-6 21v14h-17v-14m-2 23h21" class="pencil-line"/></g>
 <g class="pitch-panel pitch-panel-three" data-story-prop="next-step"><path d="m443 141 92-12v226l-92 12Z" fill="#fffdf5" stroke="${storyInk}" stroke-width="1.7"/>${storyLabel(455,174,'NEXT STEP',10)+storyLines(457,204,59,2)}<path d="M461 280h49m-12-12 12 12-12 12" class="pencil-line"/></g>
 </g>
 ${storyPip(47,228,222,'confident',-3,455)}
 <g class="pitch-microphone story-scene-foreground" data-story-prop="microphone"><path d="M231 306v139m-24 10q23-19 48 0" fill="none" stroke="${storyInk}" stroke-width="3"/><path d="M215 283v10q0 17 16 17t16-17v-10" fill="none" stroke="${storyInk}" stroke-width="2.2"/><rect x="221" y="254" width="20" height="43" rx="10" fill="#8da59b" stroke="${storyInk}" stroke-width="2"/><path d="M225 267h12m-12 7h12m-12 7h12" stroke="#dfe9dc" stroke-width="1.4" stroke-linecap="round"/></g>`,
 ()=>`<path d="M61 185C117 67 284 50 433 107s155 214 59 300-279 100-378 15S15 296 61 185Z" fill="#e1e9e3" class="scene-cloud"/>
 <path d="M66 442q217-18 474 0" class="ground-line"/>
 <g class="handover-folder"><path d="m253 173 80-5 25 24 154-10 16 222-269 13Z" fill="#d6c19a" stroke="${storyInk}" stroke-width="1.8"/>
 <g class="handover-arriving-paper" data-story-prop="received-next-step" data-handover-receive>${storyNote(266,113,199,226,'#e6eee5',-7,storyLabel(286,143,'NEXT STEP',12)+storyLines(287,171,140,3)+'<path d="M288 249h103m-12-12 12 12-12 12" class="pencil-line"/>')}</g>
 <g class="handover-work">${storyNote(286,139,200,228,'#fffdf5',-3,storyLabel(306,162,'THE WORK',13)+storyLines(307,198,144,4)+'<path d="M308 282h141v55H308z" fill="#dce7d6" stroke="'+storyInk+'"/>')}</g>
 <g class="handover-why">${storyNote(312,171,155,142,'#eee0b5',6,storyLabel(329,202,'WHY WE CHOSE IT',10)+storyLines(330,225,113,3)+'<path d="m331 282 7 7 16-20" class="pencil-line"/>')}</g>
 <path class="handover-front" d="m259 282 86-5 24 20 159-9-15 125-254 4Z" fill="#e9d5ae" stroke="${storyInk}" stroke-width="1.8"/>
 ${storyLabel(288,365,'READY TO HAND OVER',12)}
 <path d="m463 318-8 36q-4 13-12 7-5-3-3-10l7-33" class="pencil-line"/>
 </g>
 ${storyPip(40,236,210,'happy',-4,442)}`
];
const storyArtLabels=[
 'Pip looks beneath a large brief before making a decision.',
 'Pip weighs Direction A and Direction B, examining the clue through a magnifying glass.',
 'Pip stands between what I meant on the left and what they heard on the right.',
 'Pip pitches at a microphone beside a folding board showing the problem, idea and next step.',
 'Pip leaves the next step, the work and the reason for the choice together in a handover folder.'
];
function storyArt(n){return `<svg class="story-scene-svg" viewBox="0 0 600 520" role="img" aria-label="${storyArtLabels[n]}"><g class="scene-ink" stroke-linecap="round" stroke-linejoin="round">${storyScenes[n]()}</g></svg>`;}
