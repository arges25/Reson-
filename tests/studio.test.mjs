import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanBackup, ending } from '../dist/core.js';
import { THEMES, CONTEXTS, POOLS, detectContext, poolFor } from '../dist/themes.js';
import { cleanConfig, freshDraft, makeSection, makePreset, generateSection, generateArrangement, serializeSections, sectionBody, arrangeAction, normalizeDraft, textToSections, MAX_SECTIONS } from '../dist/studio.js';
import { renderStudio } from '../dist/studio-view.js';

test('12 thèmes et contextes demandés possèdent de vraies réserves de vers',()=>{
  assert.equal(Object.keys(THEMES).length,12);
  for(const theme of Object.keys(THEMES)){
    assert.ok(POOLS[theme].length>=12,theme);
    for(const situation of [{id:'general'},...(CONTEXTS[theme]||[])])for(const scheme of ['AABB','ABAB','AAAA','libre'])for(const lineCount of [4,8,12]){
      const s=generateSection(makeSection('verse',{}, {lineCount}),{theme,situation:situation.id,scheme},()=>0.45);
      const lines=s.text.split('\n');assert.equal(lines.length,lineCount);
      assert.equal(s.translation.split('\n').length,lineCount);
      for(let i=0;i<lines.length;i+=4){
        const keys=lines.slice(i,i+4).map(ending);
        if(scheme==='AABB'){assert.equal(keys[0],keys[1]);assert.equal(keys[2],keys[3]);assert.notEqual(keys[0],keys[2]);}
        if(scheme==='ABAB'){assert.equal(keys[0],keys[2]);assert.equal(keys[1],keys[3]);assert.notEqual(keys[0],keys[1]);}
        if(scheme==='AAAA')assert.ok(keys.every(k=>k===keys[0]));
      }
    }
  }
});
test('le contexte change le contenu, y compris dans le thème déjà choisi',()=>{
  const c={theme:'manque',situation:'general',context:'Un message sans réponse sur le téléphone'};
  const hits=detectContext(c.context);assert.ok(hits.some(h=>h.theme==='manque'&&h.situation==='message'));
  const pool=poolFor(c);assert.ok(pool.some(l=>l.ku.includes('Telefon')&&l.priority===5));
  const generated=generateSection(makeSection('verse'),c,()=>0.45);
  assert.match(generated.text,/Telefon|Peyama|ekranê/);
  const extra=poolFor({theme:'amour',context:'La pauvreté et des factures en fin de mois'});
  assert.ok(extra.some(l=>l.ku.includes('hesab')||l.fr.includes('factures')));
  assert.deepEqual(detectContext('xyzqv'),[]);
});
test('plusieurs refrains identiques ou différents et une régénération isolée',()=>{
  const sections=makePreset('long');
  const same=generateArrangement(sections,{chorusMode:'same'},()=>0.42);
  const choruses=same.filter(s=>s.type==='chorus');assert.equal(choruses.length,3);assert.ok(choruses.every(s=>s.text===choruses[0].text));
  const different=generateArrangement(sections,{chorusMode:'different'},()=>0.42).filter(s=>s.type==='chorus');
  assert.ok(new Set(different.map(s=>s.text)).size>1);
  const before=structuredClone(same),at=same.findIndex(s=>s.type==='verse');
  same[at]=generateSection(same[at],{theme:'argent'});
  assert.deepEqual(same.filter((s,i)=>i!==at),before.filter((s,i)=>i!==at));
});
test('les textes protégés survivent à la génération globale',()=>{
  const sections=makePreset('standard');sections[1]={...sections[1],text:'Texte personnel à garder',locked:true};
  sections[2]={...sections[2],text:'Refrain personnel',generatedText:'Refrain personnel',locked:true};
  const result=generateArrangement(sections,{theme:'pauvrete',chorusMode:'same'});
  assert.deepEqual(result[1],sections[1]);assert.deepEqual(result[2],sections[2]);
  assert.equal(result.findLast(s=>s.type==='chorus').text,'Refrain personnel');
  assert.deepEqual(generateSection(sections[1],{theme:'argent'}),sections[1]);
});
test('ajout, déplacement, copie indépendante, suppression et limite des parties',()=>{
  const sections=makePreset('standard');const before=structuredClone(sections);
  const moved=arrangeAction(sections,'down',sections[1].id);assert.equal(moved[2].id,sections[1].id);assert.deepEqual(sections,before);
  const copied=arrangeAction(sections,'duplicate',sections[1].id);assert.equal(copied.length,sections.length+1);assert.notEqual(copied[1].id,copied[2].id);
  copied[2].text='Ma variante';assert.notEqual(copied[1].text,copied[2].text);
  assert.equal(arrangeAction(copied,'remove',copied[2].id).length,sections.length);
  const full=Array.from({length:MAX_SECTIONS},()=>makeSection());assert.throws(()=>arrangeAction(full,'duplicate',full[0].id));
});
test('les backs respectent les cases choisies, la fréquence, la cible et le mode',()=>{
  const s=makeSection('chorus',{}, {text:'Yek\nDu\nSê\nÇar',voice:'duet'});
  const c={adlibs:['hey','ho','lala'],backsFrequency:'light',backsTarget:'chorus'};
  const body=sectionBody(s,c);assert.match(body,/\[Voix A\] Yek/);assert.match(body,/\[Voix B\] Du/);assert.match(body,/Hey! Ho! La la la/);
  assert.equal((body.match(/\[Backs\]/g)||[]).length,1);
  assert.equal((sectionBody(s,{...c,backsFrequency:'regular'}).match(/\[Backs\]/g)||[]).length,2);
  assert.ok(!sectionBody({...s,type:'verse'},c).includes('[Backs]'));
  assert.ok(!sectionBody({...s,backs:'off'},c).includes('[Backs]'));
  assert.match(sectionBody(s,{...c,backMode:'echo'}),/Çar…/);
  assert.match(sectionBody(s,{...c,customBack:'Yarê min!'}),/Yarê min!/);
  assert.ok(!sectionBody(s,{...c,adlibs:[],customBack:''}).includes('[Backs]'));
  assert.equal(sectionBody(s,c,true),s.text);
});
test('la sauvegarde V2 conserve structure, voix, backs, notes et protection',()=>{
  const config=cleanConfig({theme:'pauvrete',context:'fin de mois',voice:'female',adlibs:['ho','lala'],customBack:'Lê yar!'});
  const sections=generateArrangement(makePreset('duet',config),config);sections[1].locked=true;
  const text=serializeSections(sections,config);
  const song={title:'Ma chanson',text,sections,config};
  const valid=cleanBackup(JSON.parse(JSON.stringify({app:'reson-kurdi',version:2,songs:[song],favorites:['evîn'],words:[]})));
  const reopened=normalizeDraft(valid.songs[0]);
  assert.equal(serializeSections(reopened.sections,reopened.config),text);
  assert.equal(reopened.sections[1].locked,true);assert.equal(reopened.config.context,'fin de mois');assert.equal(reopened.config.customBack,'Lê yar!');
  assert.deepEqual(reopened.config.adlibs,['ho','lala']);assert.equal(reopened.sections.length,sections.length);
});
test('migration V1 sans perte des paroles ni troncature des anciens textes',()=>{
  const old='[Bend 1]\nDengê min\nEvîna min\n\n[Refrên]\nHey lê!\nLa la la';
  const legacy=cleanBackup({app:'reson-kurdi',version:1,songs:[{title:'Ancien',text:old}],favorites:[],words:[]}).songs[0];
  const migrated=normalizeDraft(legacy);
  assert.equal(migrated.sections.length,2);assert.equal(migrated.sections[0].type,'verse');assert.equal(migrated.sections[1].type,'chorus');
  assert.equal(migrated.sections[0].text,'Dengê min\nEvîna min');
  assert.equal(migrated.sections[1].text,'Hey lê!\nLa la la');
  assert.ok(migrated.sections.every(s=>s.backs==='off'));
  const huge='a'.repeat(50000);assert.equal(textToSections(huge).map(s=>s.text).join(''),huge);
  const many=Array.from({length:100},(_,i)=>`[Partie ${i}]\nTexte ${i}`).join('\n');const migratedMany=textToSections(many);assert.ok(migratedMany.length<=32);assert.equal(migratedMany.map(s=>s.text).join(''),many);
});
test('les imports V2 invalides sont rejetés avant mutation',()=>{
  const base={app:'reson-kurdi',version:2,songs:[],favorites:[],words:[]};
  for(const sections of [[{type:'hacked',text:'x'}],[{type:'verse',text:'x'.repeat(2001)}],Array.from({length:33},()=>makeSection())])assert.throws(()=>cleanBackup({...base,songs:[{title:'X',text:'X',sections}]}));
  assert.throws(()=>cleanBackup({...base,songs:[{title:'X',text:'X',config:{context:'x'.repeat(7000)}}]}));
});
test('le rendu des parties expose les commandes et échappe les données',()=>{
  const config=cleanConfig({context:'<script>alert(1)</script>'}),draft=freshDraft(config);
  draft.title='<img src=x onerror=evil()>';draft.sections[0].text='</textarea><script>evil()</script>';
  const html=renderStudio({draft,config,reserve:[]},{},{icon:()=>'',btn:(l,a)=>`<button data-action="${a}">${l}</button>`,keyboard:()=>''});
  assert.ok(html.includes('cfg-situation')&&html.includes('cfg-voice')&&html.includes('new-section-type'));
  assert.ok(html.includes('section-duplicate')&&html.includes('section-generate'));
  assert.ok(html.includes('&lt;script&gt;')&&!html.includes('<script>'));
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
});
