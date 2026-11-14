import {mkdir,readdir,readFile,writeFile} from 'node:fs/promises';
const assets={};
const types={html:'text/html',js:'text/javascript',css:'text/css'};
async function collect(dir=''){
  for(const item of await readdir('dist'+dir,{withFileTypes:true})){
    const name=dir+'/'+item.name;
    if(item.name.startsWith('.')||name==='/server')continue;
    if(item.isDirectory())await collect(name);
    else if(types[item.name.split('.').pop()])assets[name]=[types[item.name.split('.').pop()]+'; charset=utf-8',await readFile('dist'+name,'utf8')];
  }
}
await collect();
const code=await Promise.all(['dist/pip-catalog.js','dist/toolkit-v2-core.js','dist/toolkit-v2-lessons.js','dist/pip-policy.js','worker/pip-share.mjs','worker/pip-site.mjs','worker/pip-v2.mjs','worker/pip.mjs','worker/pip-chat.mjs','worker/index.mjs'].map(f=>readFile(f,'utf8')));
await mkdir('dist/server',{recursive:true});
await mkdir('dist/.openai',{recursive:true});
const stageCases=JSON.parse((await readFile('dist/source-content.js','utf8')).replace('window.SOURCE_CONTENT=','').trim().replace(/;$/,''));
const anyCases=JSON.parse((await readFile('dist/anytime-source.js','utf8')).replace('const ANYTIME_SOURCE =','').trim().replace(/;$/,''));
const cases=Object.fromEntries(Object.entries(stageCases).map(([id,c])=>[id,c.lesson]));for(const[id,c]of Object.entries(anyCases))cases[id]=c.case;
await writeFile('dist/server/index.js','const ASSETS='+JSON.stringify(assets)+';\nconst PIP_CHAT_CASES='+JSON.stringify(cases)+';\nconst PIP_CHAT_CONCEPTS='+JSON.stringify({anchoring:'An early solution or number can shape later judgement. Consider another direction and check the need before committing.',framing:'How a problem is described highlights some aspects. Compare another reasonable view and what would change your mind.'})+';\n'+code.join('\n'));
await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json'));
