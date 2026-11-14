import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';

export function localInviteDb(){
  const database=new DatabaseSync(':memory:');
  database.exec(readFileSync(new URL('../drizzle/0000_pip_invites.sql',import.meta.url),'utf8'));
  return {
    prepare(sql){
      const stmt=database.prepare(sql);
      return {bind:(...args)=>({first:async()=>stmt.get(...args)??null,run:async()=>stmt.run(...args)})};
    },
    close:()=>database.close()
  };
}
