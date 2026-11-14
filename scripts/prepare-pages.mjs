import {cp,mkdir,readFile,rm,writeFile} from 'node:fs/promises';
import {basename,resolve} from 'node:path';

// GitHub Pages serves only the frontend. Never publish the compiled server or hosting metadata.
const output=resolve('docs');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp('dist',output,{recursive:true,filter:source=>!['server','.openai'].includes(basename(source))});
await writeFile(output+'/.nojekyll','');
const page=await readFile(output+'/index.html','utf8');
await writeFile('index.html',page.replace(/(src|href)="([^"]+\.(?:js|css))"/g,(_,attr,path)=>attr+'="docs/'+path+'"'));
await writeFile('.nojekyll','');
for(const folder of ['originals','studio'])await cp(output+'/'+folder,folder,{recursive:true});
console.log('Static toolkit prepared at the repository root and in docs/. Ask Pip requires its hosted backend.');
