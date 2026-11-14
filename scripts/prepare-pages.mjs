import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import {basename,resolve} from 'node:path';

// GitHub Pages serves only the frontend. Never publish the compiled server or hosting metadata.
const output=resolve('docs');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp('dist',output,{recursive:true,filter:source=>!['server','.openai'].includes(basename(source))});
await writeFile(output+'/.nojekyll','');
console.log('Static toolkit prepared in docs/. Ask Pip requires its hosted backend.');
