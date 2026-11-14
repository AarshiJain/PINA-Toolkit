/* One deterministic path in document coordinates. No scroll-time layout reads. */
const PIP_MOTION=(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const smooth=p=>p*p*p*(p*(p*6-15)+10);
 function measure(){
  const parent=document.querySelector('.story-chapters');if(!parent)return null;
  const rect=parent.getBoundingClientRect(),parentTop=rect.top+scrollY;
  const floor=document.querySelector('.studio-header').getBoundingClientRect().height+document.querySelector('.story-chapter-nav').getBoundingClientRect().height+16;
  const landings=[...parent.querySelectorAll('.story-scene-svg')].map(svg=>{
   const b=svg.getBoundingClientRect(),marker=svg.querySelector('.story-pip-landing'),col=svg.closest('.story-illustration-col'),cb=col.getBoundingClientRect(),chapter=svg.closest('.story-chapter'),cr=chapter.getBoundingClientRect();
   const cs=getComputedStyle(col),style=getComputedStyle(chapter),scale=Math.min(b.width/600,b.height/520),ox=(b.width-600*scale)/2,oy=(b.height-520*scale)/2,original=Number(marker.getAttribute('width'))*scale,w=original*.82;
   const chapterTop=cr.top+scrollY,pinTop=parseFloat(cs.top)||floor;
   const normalTop=chapterTop+(parseFloat(style.paddingTop)||0)+(parseFloat(cs.marginTop)||0);
   const endTop=Math.max(normalTop,chapterTop+cr.height-(parseFloat(style.paddingBottom)||0)-cb.height);
   return {x:b.left-rect.left+ox+Number(marker.getAttribute('x'))*scale+(original-w)/2,w,angle:Number(marker.dataset.angle),mood:marker.dataset.mood,chapter,
    normalTop,endTop,pinTop,offset:b.top-cb.top+oy+Number(marker.dataset.ground)*scale-w*1.08,at:chapterTop-floor,pinStart:normalTop-pinTop,pinEnd:endTop-pinTop};
  });
  landings.forEach((a,i)=>{const b=landings[i+1];if(b)a.leaveAt=Math.max(a.at+280,Math.min(b.at-360,a.pinEnd));});
  return {parent,parentTop,floor,viewport:innerHeight,maxScroll:Math.max(1,document.documentElement.scrollHeight-innerHeight),landings};
 }
 function rest(scroll,a,g){return {x:a.x,y:clamp(scroll+a.pinTop,a.normalTop,a.endTop)+a.offset-g.parentTop,w:a.w,angle:a.angle};}
 function phase(scroll,g){let i=0;while(i<g.landings.length-1&&scroll>=g.landings[i+1].at)i++;const a=g.landings[i],b=g.landings[i+1];const progress=b?clamp((scroll-a.leaveAt)/Math.max(1,b.at-a.leaveAt),0,1):0;return {i,progress,t:smooth(progress),moving:progress>0&&progress<1};}
 function pose(scroll,g){
  const f=phase(scroll,g),a=g.landings[f.i],b=g.landings[f.i+1];if(!f.moving)return rest(scroll,a,g);
  // Blend the actual sticky poses at this scroll position, including each endpoint's velocity.
  // Blending pre-clamped viewport endpoints causes a jump when the destination has not pinned yet.
  const from=rest(scroll,a,g),to=rest(scroll,b,g);
  const w=from.w+(to.w-from.w)*f.t;
  return {x:from.x+(to.x-from.x)*f.t,y:from.y+(to.y-from.y)*f.t-Math.sin(f.progress*Math.PI)**2*30,w,angle:from.angle+(to.angle-from.angle)*f.t};
 }
 function transform(p){const scale=p.w/200;return `translate3d(${p.x+p.w*.5}px,${p.y+p.w*1.175*.55}px,0) rotate(${p.angle}deg) scale(${scale}) translate(-100px,-129.25px)`;}
 function stops(g){
  const values=[0,g.maxScroll];g.landings.forEach((a,i)=>{values.push(a.at,a.pinStart,a.pinEnd);const b=g.landings[i+1];if(b){values.push(a.leaveAt,b.at);const steps=Math.ceil((b.at-a.leaveAt)/8);for(let n=1;n<steps;n++)values.push(a.leaveAt+(b.at-a.leaveAt)*n/steps);}});
  return [...new Set(values.filter(v=>v>=0&&v<=g.maxScroll))].sort((a,b)=>a-b);
 }
 function frames(g){return stops(g).map(s=>({offset:s/g.maxScroll,transform:transform(pose(s,g))}));}
 function bounds(p){const rad=p.angle*Math.PI/180,c=Math.cos(rad),s=Math.sin(rad),cx=p.w*.5,cy=p.w*1.175*.55;const pts=[[0,0],[p.w,0],[p.w,p.w*1.175],[0,p.w*1.175]].map(([x,y])=>({x:p.x+cx+(x-cx)*c-(y-cy)*s,y:p.y+cy+(x-cx)*s+(y-cy)*c}));return {x:Math.min(...pts.map(p=>p.x)),y:Math.min(...pts.map(p=>p.y))};}
 return {measure,rest,phase,pose,transform,stops,frames,bounds};
})();
