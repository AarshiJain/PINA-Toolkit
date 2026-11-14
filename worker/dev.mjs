import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {Readable} from 'node:stream';
import {localInviteDb} from './local-db.mjs';
await import('./build.mjs');
const {default:worker}=await import('../dist/server/index.js');
const env={PIP_VAULT_SECRET:process.env.PIP_VAULT_SECRET||randomBytes(32).toString('hex'),PIP_LOCAL_PREVIEW:'1',DB:localInviteDb()};
const port=Number(process.env.PORT)||4173;
createServer(async (req,res)=>{
  try{
    const method=req.method;
    const response=await worker.fetch(new Request('http://'+req.headers.host+req.url,{
      method,headers:req.headers,...(['GET','HEAD'].includes(method)?{}:{body:Readable.toWeb(req),duplex:'half'})
    }),env);
    for(const [key,value] of response.headers)if(key!=='set-cookie')res.setHeader(key,value);
    const cookies=response.headers.getSetCookie();
    if(cookies.length)res.setHeader('Set-Cookie',cookies);
    res.writeHead(response.status);
    if(response.body)Readable.fromWeb(response.body).pipe(res);else res.end();
  }catch{res.writeHead(500);res.end('Preview error');}
}).listen(port,'0.0.0.0',()=>console.log('PINA preview listening on '+port));
