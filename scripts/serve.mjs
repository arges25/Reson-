import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT||3000);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end('Method not allowed');return;}
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let target=resolve(root,'.'+path);
    if(target!==root.replace(/\/$/,'')&&!target.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(403);res.end();return;}
    if((await stat(target)).isDirectory())target=resolve(target,'index.html');
    const bytes=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:bytes);
  }catch(e){res.writeHead(e.code==='ENOENT'?404:400,{'Content-Type':'text/plain; charset=utf-8'});res.end('Page introuvable.');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Rêson est prêt : http://localhost:${port}`));
server.on('error',e=>{console.error(e.message);process.exitCode=1;});
