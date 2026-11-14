/* Small shared controls keep the story entrance and the tool workspace consistent. */
const home6=home;home=function(){
 const attach=`<button type="button" class="v6-attach" data-chat-attach aria-label="Attach material" title="Attach material">${chatAttachIcon3()}</button>`;
 return home6().replace('<button type="button" data-chat-attach>＋ Attach material</button>','')
  .replace('</select></label></div><button class="ink-button primary" type="submit">Find a starting point →</button>',`</select></label>${attach}</div><button class="ink-button primary v6-start-button" type="submit">Find a starting point ${ic('arrow')}</button>`);
};
const bind6=bind;bind=function(){bind6();document.querySelectorAll('.chat3-panel [data-chat-close]').forEach(b=>{b.innerHTML=ic('close');});};
route();
