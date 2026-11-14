# PINA revision verification

Scope: original toolkit and the separate Pip story preview. Test material is fictional.

| Requested check | Result | Evidence |
| --- | --- | --- |
| 1. One homepage composer; no duplicate situation/clarity sections | Pass | Published browser inspection |
| 2. Announcement with automatic type produces route, reason and Start | Pass | Live Google request: Reading Check → 3E Scale → Trust Triangle |
| 3. Negotiation selected without text routes without AI | Pass | Local browser with no provider configured |
| 4. Mismatched type gets a better route | Pass | Announcement labelled negotiation still returned the announcement route |
| 5. Start carries material into the first tool and opens Pip | Pass | Local and published browser |
| 6. One floating Pip, one progress bar; eligible-field help only | Pass | Browser and fifteen-tool generation/policy tests |
| 7. Provenance, guesses and explicit acceptance | Pass | Verified quote filtering and protected fields in backend tests; map updated only after explicit confirmation in browser |
| 8. Transcript into four Decision Record parts with quotes | Pass | Live Google request with fictional meeting.txt attachment |
| 9. Anchoring explanation and matching tool | Pass | Fixed site definition routes to Brief X-Ray; tested against misleading prior chat history |
| 10. Manual tools remain available with AI off | Pass | Local AI-off browser and server-side visitor-off tests; production owner toggle was not changed during QA |
| 11. Unknown book does not produce invented research | Pass | Live refusal for a fictional book not in site content |
| 12. Three tabs, read-only Netflix view, one project CTA | Pass | Browser inspections and generated tool routes |
| 13. First-time human can complete a project without explanation | Pending | Requires a person who has never used PINA; not represented as an automated pass |

27 automated tests pass. They include provider adapter fixtures for Google, OpenAI and Anthropic, owner authorization, budgets, file limits, quote validation, reflective exclusions, revised data/backup preservation and preview isolation. Live AI requests use the existing Google connection; no new API key was entered. Browser layout checks include a 390px container, no horizontal overflow, one scrolling Pip and 15 illustrated tool cards. Five PDF/Word/image/text/transcript attachments persisted after reload in local QA.

The existing source templates and older routes remain in the repository. Project answers and attachments are browser-local. Shared AI configuration remains encrypted on the server.


## UI repair checks

- Shared geometry: diagram canvas x=32, width≈669px and height=640px at a 1363×936 viewport, unchanged across the three modes in five representative tools. Brief X-Ray itself measured the same 669×469 diagram at x=32, y≈306 in Learn, Case and Project.
- Single top-left framework group in all fifteen generated tool pages; Stakeholder source label reads Everyday Business Storytelling · Negotiation Genius.
- Empathy right panel scrolls from 0 to 1139px while its diagram remains stationary. Think has reading guidance; no extra five-lens heading over the drawing.
- Pip Close is visible at y≈89 on desktop and y=80 in the 390px mobile container. Mobile close hides the drawer. No bottom launcher covers Next.
- Story Check active point has a 3px black outline. Decision Record map boxes measure about 84–86px rather than the old 140px minimum.
- 3E Learn contains the three priorities; Project contains the two-side weights.
- Story: one Pip, 60/40 visual split, pinned reading interval, carried glass/cards, foreground microphone and received next-step document; mobile page width remains 375px inside a 390px browser frame.


## Interaction polish checks

- Related question gaps measure 4px / 6px / 6px, while separate field groups have a 32px margin.
- Reset Pip clears the local test chat while retaining the five fixture attachments and stored brief answers. Reset toolkit returns to the opening page without deleting those notes.
- New Help me topics have visible separators, Pip/user avatars and contextual actions. Named tool links replace the chat’s Start this route button.
- Mobile at 390px: Reset Pip and Close remain visible in the panel header, and there is no horizontal overflow.
- The Story Check SVG has five opaque label pills and selected-state outlines; its desktop canvas is full column width rather than an intrinsic 300px SVG.
- The three message-category cards measured 182px each in the desktop preview. Pip’s landing width is 82% of the previous size.
- Storytelling is still isolated from the original homepage until the user approves its preview.

## Revision 38

- 29 automated checks pass, including late transition timing, viewport safety bounds and shared story/tool runtime.
- Desktop browser checks: all five scenes visited; Pip stays below the header; resting transforms are unchanged while reading; message cards are large and linked above the question mark.
- Brief X-Ray Learn, Netflix and Project columns all measure 669px in the 1363px desktop browser; saved project values persist through the homepage integration and Reset toolkit.
- Ask Pip opens from the integrated homepage and tool pages; icon-only Close remains accessible.
- 390px mobile check: inputs and start actions fit; the illustration has a reserved sticky region, keeping Pip off tool descriptions as cards scroll underneath.

## Revision 39: scene dwell

Short chapters have a longer scroll hold; the pitch and handover copy stay with the scene while it rests. Scene poses use a stable anchor rather than sliding during the start of the chapter. Evidence chapter timing is unchanged. The last Pip docks to the handover illustration as it leaves the viewport, rather than disappearing separately or following the closing text.

Validation: 30 automated checks pass; browser sampling confirms the pitch pose stays unchanged through multiple scrolls and the handover docks to the final artwork.

## Revision 40: anchored travel and collection polish

Pip now uses one absolute coordinate space throughout the journey. His feet align to each illustration's ground marker, including the initial brief and final handover, with no fixed/absolute mode switch. Travel starts when a scene releases its sticky position; quintic easing plus a short frame-based settle smooths wheel increments. Resting positions stay anchored. The magnifier stays with Pip through the first/second scenes; the next-step paper stays in his hand through the pitch and transfers into the final folder. Reduced-motion mode keeps static props.

Research, notebook and casebook use a common introduction rhythm (12px title-to-description, 28px description-to-actions on desktop). Casebook cards have more label/title/link spacing. The homepage dropdown text is centered. The planning matrix section is removed. Nine real book covers are embedded locally with source links and image provenance in book-covers.js; all source records remain available.

Validation: 32 automated checks pass; desktop browser checks show the first Pip off-screen with the first illustration before entry, continuous first-to-second travel with magnifier, a persistent next-step paper, and the final Pip's position relative to his illustration remaining constant within 0.05px across scroll samples. All nine covers load. Mobile 390px pages have no horizontal overflow, and the first Pip stands inside the reserved illustration area.

## Revision 41: remove residual shaking

All Pip body bob/think/bounce animations are disabled, including the Ask Pip launcher. Clicking the traveler no longer rotates his whole body. Resting Pip is a positioned child of the current illustration, carried by native sticky layout. Only travel uses the shared overlay and smoothing. The extra in-flight rotation wobble is removed; small smoothing residuals snap to the exact target and stop scheduling frames.

Validation: 33 automated checks pass. Browser checks show both story and launcher bodies have no transform or body animation. The resting scene's local transform is identical across scroll samples; flight and subsequent scene docking still work.


## Revision 42: scroll-synchronous Pip

The scroll shake was caused by competing coordinate updates: time-based viewport smoothing, document scroll compensation and reparenting into sticky containers. The destination could also be 76px below its pinned location when a flight ended. `story-motion.js` now calculates one deterministic document-space path. Pip stays in one permanent layer, at a constant base size, while a native `ScrollTimeline` animation owns his transform. JavaScript scroll events only update props and labels. Geometry is measured on binding, resize, layout-size change and font readiness. Browsers without ScrollTimeline use the same path directly, with no temporal damping. Reduced motion remains available.

The path blends the actual sticky poses, including an arrival before the next scene pins, so departure and arrival meet their resting positions without a container switch. The first and final poses remain on their own artwork. Short desktop viewports constrain the illustration height to keep the full resting scene below navigation. Body bobbing stays disabled; carried props and all toolkit data are unchanged.

Validation: 32 automated tests pass. Frame scans across all five scenes measured 76.51px maximum path error and a 72.17px unexpected frame displacement in the prior live implementation. The replacement measured 0.064px maximum path error scrolling down and 0.075px scrolling up (496 samples each). Additional native-frame scans measured 0.137px at 390×844 and 0.132px at 1100×600. The temporary scan pages are removed from the deployed build.


## Revision 43: spacing and portable export

- Desktop tool tabs measure 44px, with about 31px from the rule to the heading and 12px between heading and framework tags. The 600px-high window retains a 288px diagram area without page overflow.
- The homepage picker and clip are grouped on the left; the starting-point action is at the right edge. All three controls measure 46px high. The paste field has no visible outline, border or box shadow while focused.
- A 390px mobile frame has no horizontal overflow. The homepage action wraps to a full-width row. Chat attachment, type selector and Send all measure 40px high, and the close control stays in view.
- The owner-only settings control retains its existing authorization and now has a 38px boxed target with a 21px gear glyph.
- The standalone export contains 39 inline scripts, no external local script/stylesheet references, and passes script syntax and exact-source preservation checks. Cloud Browser blocks file:// navigation, so direct local-file opening was not browser-tested in this session.
- No AI keys, server records, user projects or uploads are part of the HTML/source exports.
