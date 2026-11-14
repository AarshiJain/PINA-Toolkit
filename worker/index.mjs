export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname.startsWith('/api/pip/owner/')||url.pathname==='/api/pip/chat/status'||url.pathname==='/api/pip/assist'&&request.headers.get('X-Pina-Client')==='3')return handleChat(request,env,url);
    if(url.pathname.startsWith('/api/pip/'))return handlePip(request,env,url);
    if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
    const path=url.pathname==='/'?'/index.html':url.pathname;
    if(!Object.hasOwn(ASSETS,path))return new Response('Not found',{status:404});
    const [type,body]=ASSETS[path];
    return new Response(request.method==='HEAD'?null:body,{headers:{
      'Content-Type':type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin',
      'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"
    }});
  }
};
