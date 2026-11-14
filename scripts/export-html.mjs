import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';

// Export the template, never browser storage, project uploads or server secrets.
const output=resolve(process.argv[2]||'exports/PINA-toolkit.html');
let html=await readFile('dist/index.html','utf8');
for(const match of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)]){
 const css=await readFile(resolve('dist',match[1]),'utf8');
 html=html.replace(match[0],()=>`<style data-source="${match[1]}">${css.replace(/<\/style/gi,'<\\/style')}</style>`);
}
for(const match of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]){
 const js=await readFile(resolve('dist',match[1]),'utf8');
 html=html.replace(match[0],()=>`<script data-source="${match[1]}">${js.replace(/<\/script/gi,'<\\/script')}</script>`);
}
html=html.replace('<head>','<head><!-- Standalone manual toolkit. Ask Pip requires the hosted API. -->');
await mkdir(dirname(output),{recursive:true});
await writeFile(output,html);
console.log(output);
