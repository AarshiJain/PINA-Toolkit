import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';

test('single-file export preserves every script and stylesheet without dollar substitution',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'pina-export-'));
 try{
  const output=join(directory,'toolkit.html');
  execFileSync(process.execPath,['scripts/export-html.mjs',output]);
  const html=await readFile(output,'utf8');
  assert.doesNotMatch(html,/<script src=|<link rel="stylesheet"/);
  const scripts=[...html.matchAll(/<script data-source="([^"]+)">([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length>30);
  for(const [,name,code]of scripts){
   const source=await readFile('dist/'+name,'utf8');
   assert.equal(code,source.replace(/<\/script/gi,'<\\/script'),name);
   new vm.Script(code,{filename:name});
  }
  for(const [,name,code]of html.matchAll(/<style data-source="([^"]+)">([\s\S]*?)<\/style>/g))assert.equal(code,(await readFile('dist/'+name,'utf8')).replace(/<\/style/gi,'<\\/style'),name);
 }finally{await rm(directory,{recursive:true,force:true});}
});
