import { ending } from './core.js';
import { THEMES, STYLES, MOODS, VOICES, TYPES, ADLIBS, TITLES, poolFor } from './themes.js';

export const MAX_SECTIONS=32;
export const DEFAULT_CONFIG={theme:'amour',situation:'general',context:'',style:'grani',scheme:'AABB',mood:'doux',voice:'solo',chorusMode:'same',verseLines:4,chorusLines:4,backsFrequency:'light',backsTarget:'chorus',backMode:'response',adlibs:['hey','le'],customBack:'',bpm:100};
const id=()=>crypto.randomUUID();
const enumOr=(value,list,fallback)=>list.includes(value)?value:fallback;
export function cleanConfig(value={}){
  const c=value&&typeof value==='object'?value:{};
  return {...DEFAULT_CONFIG,theme:enumOr(c.theme,Object.keys(THEMES),'amour'),situation:typeof c.situation==='string'?c.situation.slice(0,40):'general',context:typeof c.context==='string'?c.context.slice(0,1000):'',style:enumOr(c.style,Object.keys(STYLES),'grani'),scheme:enumOr(c.scheme,['AABB','ABAB','AAAA','libre'],'AABB'),mood:enumOr(c.mood,Object.keys(MOODS),'doux'),voice:enumOr(c.voice,Object.keys(VOICES).filter(v=>v!=='inherit'),'solo'),chorusMode:enumOr(c.chorusMode,['same','different'],'same'),verseLines:[4,8,12].includes(Number(c.verseLines))?Number(c.verseLines):4,chorusLines:[4,8,12].includes(Number(c.chorusLines))?Number(c.chorusLines):4,backsFrequency:enumOr(c.backsFrequency,['off','light','regular','dense'],'light'),backsTarget:enumOr(c.backsTarget,['all','chorus','ends'],'chorus'),backMode:enumOr(c.backMode,['response','echo','inline'],'response'),adlibs:Array.isArray(c.adlibs)?[...new Set(c.adlibs.filter(a=>Object.hasOwn(ADLIBS,a)))]:['hey','le'],customBack:typeof c.customBack==='string'?c.customBack.replace(/[\r\n]/g,' ').slice(0,80):'',bpm:Math.max(40,Math.min(220,Number(c.bpm)||100))};
}
export function makeSection(type='verse',config={},patch={}){
  const c=cleanConfig(config);
  return {id:id(),type:Object.hasOwn(TYPES,type)?type:'verse',label:'',text:'',translation:'',generatedText:'',lineCount:type==='chorus'?c.chorusLines:c.verseLines,voice:'inherit',backs:'inherit',locked:false,...patch};
}
export const PRESETS={simple:'Court · 1 couplet, 1 refrain',standard:'Classique · 2 couplets, 2 refrains',long:'Complet · 3 couplets, 3 refrains',duet:'Duo · deux voix et chœurs',rap:'Rap · couplets, refrain et pont'};
export function makePreset(preset='standard',config={}){
  const types={simple:['intro','verse','chorus','outro'],standard:['intro','verse','chorus','verse','chorus','outro'],long:['intro','verse','prechorus','chorus','verse','chorus','verse','bridge','chorus','outro'],duet:['intro','verse','verse','prechorus','chorus','bridge','chorus','outro'],rap:['intro','verse','chorus','verse','bridge','chorus','outro']}[preset]||['verse','chorus'];
  let v=0;
  return types.map(t=>makeSection(t,config,preset==='duet'?{voice:t==='verse'?(v++%2?'female':'male'):t==='chorus'?'choir':'inherit'}:preset==='rap'&&t==='verse'?{voice:'spoken',lineCount:8}:{}));
}
const shuffle=(rows,rng)=>{const a=[...rows];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function selectBlock(pool,scheme,rng,used){
  const groups={};for(const line of pool)(groups[line.key]??=[]).push(line);
  let keys=shuffle(Object.keys(groups).filter(k=>groups[k].length>=4),rng);
  keys.sort((a,b)=>Math.max(...groups[b].map(l=>l.priority))-Math.max(...groups[a].map(l=>l.priority)));
  if(keys.length<2)throw new Error('Pas assez de finales pour ce thème.');
  const [a,b]=keys;
  const desired=scheme==='AAAA'?[a,a,a,a]:scheme==='ABAB'?[a,b,a,b]:[a,a,b,b];
  const seen=new Set();
  return desired.map(key=>{
    const available=(scheme==='libre'?pool:groups[key]).filter(l=>!seen.has(l.ku));
    const fresh=available.filter(l=>!used.has(l.ku));
    const ranked=shuffle(fresh.length?fresh:available,rng).sort((x,y)=>y.priority-x.priority);
    const chosen=ranked[0];seen.add(chosen.ku);used.add(chosen.ku);return chosen;
  });
}
const INTRO={grani:['Hey lê, bihîze dengê dil!','Ô, écoute la voix du cœur !'],govend:['Dest bi dest, hevalno!','Main dans la main, les amis !'],sallama:['Were nêzîk, em bi hev re ne!','Approche, nous sommes ensemble !'],rap:['Bihîze, ev çîroka min e.','Écoute, voici mon histoire.'],ballade:['Di bêdengiyê de dengê dil tê.','Dans le silence, on entend le cœur.'],acoustique:['Bi sazekê ez çîroka xwe dibêjim.','Avec un saz, je raconte mon histoire.']};
export function generateSection(section,config={},rng=Math.random,used=new Set()){
  if(section.locked)return {...section};
  const c=cleanConfig(config),s={...section};
  if(s.type==='instrumental'){s.text=`[Saz · ${c.bpm} BPM · ${MOODS[c.mood]}]`;s.translation='Passage instrumental, sans paroles.';}
  else if(s.type==='backs'){s.text=backPhrases(c).join(' — ')||'Hey! Ho! La la la';s.translation='Vocalises et interjections, sans sens lexical à traduire.';}
  else if(s.type==='intro'){[s.text,s.translation]=INTRO[c.style];}
  else{
    const pool=poolFor(c),blocks=Math.max(1,Math.min(3,Math.ceil((Number(s.lineCount)||4)/4)));
    const lines=Array.from({length:blocks},()=>selectBlock(pool,c.scheme,rng,used)).flat();
    s.text=lines.map(l=>l.ku).join('\n');s.translation=lines.map(l=>l.fr).join('\n');
  }
  s.generatedText=s.text;return s;
}
export function generateArrangement(sections,config={},rng=Math.random){
  const c=cleanConfig(config),used=new Set(),choruses=new Map();
  if(c.chorusMode==='same')for(const s of sections)if(s.type==='chorus'&&s.locked&&s.text.trim()&&!choruses.has(s.lineCount))choruses.set(s.lineCount,s);
  return sections.map(s=>{
    if(s.locked)return {...s};
    if(s.type==='chorus'&&c.chorusMode==='same'&&choruses.has(s.lineCount)){
      const source=choruses.get(s.lineCount);return {...s,text:source.text,translation:source.translation,generatedText:source.generatedText};
    }
    const generated=generateSection(s,c,rng,used);
    if(s.type==='chorus'&&c.chorusMode==='same')choruses.set(s.lineCount,generated);
    return generated;
  });
}
export function backPhrases(config){return [...config.adlibs.map(a=>ADLIBS[a]).filter(Boolean),...(config.customBack.trim()?[config.customBack.trim()]:[])];}
export function displayLabel(s,sections){
  if(s.label.trim())return s.label.trim();
  const number=sections.slice(0,sections.findIndex(x=>x.id===s.id)+1).filter(x=>x.type===s.type).length;
  return TYPES[s.type]+(['verse','chorus','prechorus','bridge','backs'].includes(s.type)?' '+number:'');
}
export function sectionBody(section,config={},plain=false){
  if(plain||['instrumental','backs'].includes(section.type))return section.text;
  const c=cleanConfig(config),voice=section.voice==='inherit'?c.voice:section.voice;
  const frequency=section.backs==='inherit'?c.backsFrequency:section.backs;
  const phrases=backPhrases(c);
  const target=section.backs!=='inherit'||c.backsTarget==='all'||c.backsTarget==='chorus'&&['chorus','prechorus','outro'].includes(section.type)||c.backsTarget==='ends'&&['intro','outro'].includes(section.type);
  const period={light:4,regular:2,dense:1}[frequency]||Infinity;
  let count=0,backCount=0;
  return section.text.split('\n').flatMap(line=>{
    if(!line.trim()||/^\[.*\]$/.test(line.trim()))return [line];
    count++;
    const lead=voice==='duet'?`[Voix ${count%2?'A':'B'}] ${line}`:line;
    if(!target||frequency==='off'||!phrases.length||count%period!==0)return [lead];
    const phrase=frequency==='light'?phrases.join(' '):phrases[backCount++%phrases.length];
    const back=c.backMode==='echo'?`${line.trim().split(/\s+/).slice(-2).join(' ')}… ${phrase}`:phrase;
    return c.backMode==='inline'?[`${lead} (${back})`]:[lead,`[Backs] ${back}`];
  }).join('\n');
}
export function serializeSections(sections,config={},plain=false){
  const c=cleanConfig(config);
  return sections.filter(s=>s.text.trim()).map(s=>{
    const voice=s.voice==='inherit'?c.voice:s.voice;
    const metadata=plain||s.type==='instrumental'?'':` · ${VOICES[voice]} · ${MOODS[c.mood]}`;
    return `[${displayLabel(s,sections)}${metadata}]\n${sectionBody(s,c,plain)}`;
  }).join('\n\n');
}
export function textToSections(text='',config={}){
  const result=[];let label='',lines=[];
  const flush=()=>{
    const content=lines.join('\n').replace(/^\n+|\n+$/g,'');if(!content&&!label)return;
    const type=/^(bend|couplet|verse)/i.test(label)?'verse':/^(refrên|refrain|chorus)/i.test(label)?'chorus':/^(destpêk|intro)/i.test(label)?'intro':/^(dawî|outro)/i.test(label)?'outro':/^(pont|bridge)/i.test(label)?'bridge':'free';
    // Ne jamais couper silencieusement un ancien texte long.
    const parts=content.match(/[\s\S]{1,2000}/g)||[''];
    for(const part of parts)result.push(makeSection(type,config,{label:label.slice(0,80),text:part,backs:'off'}));
  };
  for(const line of String(text).split('\n')){const h=line.match(/^\[([^\]]+)\]\s*$/);if(h){flush();label=h[1];lines=[];}else lines.push(line);}
  flush();
  if(result.length>MAX_SECTIONS)return (String(text).match(/[\s\S]{1,2000}/g)||[]).map(part=>makeSection('free',config,{text:part,backs:'off'}));
  return result;
}
export function normalizeDraft(draft={},config={}){
  const c=cleanConfig(draft.config||config),text=typeof draft.text==='string'?draft.text.slice(0,100000):'';
  const sections=Array.isArray(draft.sections)&&draft.sections.length?draft.sections.map(s=>makeSection(s.type,c,{...s,id:typeof s.id==='string'?s.id:id()})):text?textToSections(text,c):makePreset('standard',c);
  return {id:typeof draft.id==='string'?draft.id:undefined,title:typeof draft.title==='string'?draft.title.slice(0,120):'',text,sections,config:c};
}
export function freshDraft(config={}){return {title:'',text:'',config:cleanConfig(config),sections:makePreset('standard',config)};}
export function arrangeAction(sections,action,sectionId){
  const at=sections.findIndex(s=>s.id===sectionId);if(at<0)return sections;
  const out=sections.map(s=>({...s}));
  if(action==='up'&&at>0)[out[at-1],out[at]]=[out[at],out[at-1]];
  else if(action==='down'&&at<out.length-1)[out[at+1],out[at]]=[out[at],out[at+1]];
  else if(action==='duplicate'){if(out.length>=MAX_SECTIONS)throw new Error('32 parties maximum par chanson.');out.splice(at+1,0,{...out[at],id:id(),locked:false});}
  else if(action==='remove')out.splice(at,1);
  else if(action==='lock')out[at].locked=!out[at].locked;
  return out;
}
export function projectText(draft,plain=false){return serializeSections(draft.sections||[],draft.config||{},plain);}
export function suggestTitle(config){return TITLES[config.theme]||'Strana min';}
