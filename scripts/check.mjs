import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=fileURLToPath(new URL('..',import.meta.url));
const publicDir=resolve(root,'dist');
for(const file of await readdir(publicDir)){
  if(file.endsWith('.js')){const r=spawnSync(process.execPath,['--check',resolve(publicDir,file)],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr);}
}
const html=await readFile(resolve(publicDir,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))await stat(resolve(publicDir,match[1]));
const manifest=JSON.parse(await readFile(resolve(publicDir,'manifest.webmanifest'),'utf8'));
for(const icon of manifest.icons)await stat(resolve(publicDir,icon.src));
for(const size of [192,512]){
  const png=await readFile(resolve(publicDir,`icon-${size}.png`));
  if(png.readUInt32BE(16)!==size||png.readUInt32BE(20)!==size)throw new Error('Taille PNG invalide');
}
const worker=await readFile(resolve(publicDir,'sw.js'),'utf8');
for(const match of worker.matchAll(/'\.\/([^']+)'/g))await stat(resolve(publicDir,match[1]));
console.log('Entrée HTML, scripts, icônes, manifest et cache hors connexion : OK.');
console.log('Projet statique prêt. Le dossier dist est le dossier à publier.');
