/* A continuous thread, with opaque labels and separate completion markers. */
function v5StoryDiagram(){
 const checks=[
  {label:'Said',key:'c1',x:70,y:45,width:130},
  {label:'Seen',key:'c2',x:330,y:123,width:130},
  {label:'Picture first',key:'c4',x:250,y:242,width:215},
  {label:'Stranger test',key:'c3',x:55,y:340,width:220},
  {label:'Promise kept',key:'c5',x:245,y:423,width:220}
 ];
 const thread='M42 32C76 28 80 60 95 70C172 113 360 26 392 92C430 135 395 170 355 148C306 121 233 164 228 211C224 241 248 253 275 267C331 292 305 343 245 355C181 367 143 325 80 365C20 401 138 487 270 448C356 421 420 487 482 456';
 return `<div class="v2-story-map v5-story-thread"><svg viewBox="0 0 520 500" role="group" aria-label="Follow the thread through five checks: said, seen, picture first, stranger test and promise kept"><path class="v5-thread-shadow" d="${thread}" fill="none" stroke="#fffef8" stroke-width="8" stroke-linecap="round"/><path class="v5-thread-line" d="${thread}" fill="none" stroke="#62816a" stroke-width="3" stroke-linecap="round"/>${checks.map(({label,key,x,y,width},i)=>{const done=v2Yes(4,key);return `<g class="v5-thread-check${done?' is-complete':''}" data-v2-map-part="${i}" tabindex="0" role="button" aria-label="${label}${done?', checked':''}" aria-pressed="false"><title>${label}${done?' · checked':''}</title><rect class="v5-thread-label" x="${x}" y="${y}" width="${width}" height="50" rx="8" fill="#fffef8" stroke="#a5baa0" stroke-width="1.2"/><circle class="v5-thread-marker" cx="${x+25}" cy="${y+25}" r="14" fill="${done?'#d4e5cc':'#fffef8'}" stroke="${done?'#48674b':'#95ad90'}" stroke-width="1.5"/><text x="${x+25}" y="${y+30}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="600" fill="#171717">${done?'✓':i+1}</text><text x="${x+49}" y="${y+31}" font-family="Inter,Arial,sans-serif" font-size="16" font-weight="500" fill="#171717">${label}</text></g>`;}).join('')}</svg><p>${v2Excerpt(v2Value(4,'thread'),'Your intended message stays visible along the thread.',220)}</p></div>`;
}
