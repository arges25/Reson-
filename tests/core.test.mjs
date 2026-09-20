import test from 'node:test';
import assert from 'node:assert/strict';
import { LEXICON } from '../dist/lexicon.js';
import { ending, normalize, searchRhymes, findEntry, validWord, cleanBackup, syllables, escapeHtml } from '../dist/core.js';
import { generateLyrics, THEMES, STYLES } from '../dist/lyrics.js';

test('les voyelles kurdes restent distinctes et Unicode est normalisé',()=>{
  assert.notEqual(ending('evîn'),ending('min'));
  assert.notEqual(ending('şîr'),ending('gur'));
  assert.equal(normalize('EVI\u0302N'),'evîn');
  assert.equal(ending('Hey, evîn!'),'în');
  assert.equal(syllables('bîranîn'),3);
});
test('les rimes de evîn excluent in et ne contiennent pas le mot de départ',()=>{
  const results=searchRhymes('evîn',LEXICON);
  assert.ok(results.some(r=>r.word==='şîrîn'));
  assert.ok(results.some(r=>r.word==='havîn'));
  assert.ok(results.every(r=>ending(r.word)==='în'&&r.word!=='evîn'));
  assert.ok(!results.some(r=>r.word==='xwarin'));
});
test('une saisie sans accents retrouve une orthographe de la base',()=>{
  assert.equal(findEntry('evin',LEXICON).word,'evîn');
  assert.deepEqual(searchRhymes('evin',LEXICON),searchRhymes('evîn',LEXICON));
});
test('assonances et filtres sont appliqués sans inventer de mots',()=>{
  const a=searchRhymes('evîn',LEXICON,{mode:'assonance'});
  assert.ok(a.some(w=>w.word==='şîr'));
  assert.ok(a.every(w=>ending(w.word)[0]==='î'&&ending(w.word)!=='în'));
  const filtered=searchRhymes('evîn',LEXICON,{category:'sentiments',count:'2',favorites:['şîrîn','xemgîn','havîn']});
  assert.deepEqual(new Set(filtered.map(x=>x.word)),new Set(['şîrîn','xemgîn']));
});
test('le lexique français recherche les accents et la ligature œ',()=>{
  assert.ok(searchRhymes('cœur',LEXICON,{mode:'lexicon'}).some(w=>w.word==='dil'));
  assert.ok(searchRhymes('coeur',LEXICON,{mode:'lexicon'}).some(w=>w.word==='dil'));
  const summer=searchRhymes('été',LEXICON,{mode:'lexicon'});
  assert.equal(summer[0].word,'havîn');
  assert.ok(!summer.some(w=>w.word==='hatin'));
  assert.ok(searchRhymes('liberte',LEXICON,{mode:'lexicon'}).some(w=>w.word==='azadî'));
});
test('base sans doublons, entrées et mots personnels valides',()=>{
  assert.equal(new Set(LEXICON.map(w=>w.word)).size,LEXICON.length);
  assert.ok(LEXICON.every(w=>validWord(w.word)&&w.meaning&&w.category));
  for(const bad of ['<script>','hello world','123','xxx','','x'.repeat(41)])assert.equal(validWord(bad),false);
  assert.equal(validWord('dilovan'),true);
});
test('toutes les combinaisons de génération respectent les rimes et structures',()=>{
  for(const theme of Object.keys(THEMES))for(const style of Object.keys(STYLES))for(const scheme of ['AABB','ABAB','AAAA','libre'])for(const length of ['court','standard','long']){
    const out=generateLyrics({theme,style,scheme,length});
    assert.ok(out.text&&out.translation&&out.title);
    assert.equal(out.sections.filter(s=>s.label.startsWith('Bend')).length,{court:1,standard:2,long:3}[length]);
    assert.equal(out.sections.at(-1).label==='Dawî',['grani','govend'].includes(style));
    for(const section of out.sections.filter(s=>s.lines.length===4)){
      assert.equal(new Set(section.lines.map(l=>l.ku)).size,4);
      const k=section.lines.map(l=>ending(l.ku));
      if(scheme==='AAAA')assert.ok(k.every(v=>v===k[0]));
      if(scheme==='AABB'){assert.equal(k[0],k[1]);assert.equal(k[2],k[3]);assert.notEqual(k[0],k[2]);}
      if(scheme==='ABAB'){assert.equal(k[0],k[2]);assert.equal(k[1],k[3]);assert.notEqual(k[0],k[1]);}
    }
  }
});
test('plusieurs propositions et valeurs par défaut robustes',()=>{
  assert.notEqual(generateLyrics({},()=>0.1).text,generateLyrics({},()=>0.8).text);
  assert.doesNotThrow(()=>generateLyrics({theme:'__proto__',style:'constructor',scheme:'wrong',length:'wrong'}));
});
test('sauvegardes valides, import externe contrôlé et échappement HTML',()=>{
  const b=cleanBackup({app:'reson-kurdi',version:1,songs:[{title:'Test',text:'Dengê min'}],words:[{word:'dilovan',meaning:'bienveillant'}],favorites:['evîn']});
  assert.equal(b.words[0].category,'personnel');assert.ok(b.songs[0].id);assert.equal(b.songs[0].text,'Dengê min');
  assert.throws(()=>cleanBackup({app:'autre',version:1,songs:[],words:[],favorites:[]}));
  assert.throws(()=>cleanBackup({app:'reson-kurdi',version:1,songs:[{title:'Test',text:'x'.repeat(50001)}],words:[],favorites:[]}));
  assert.throws(()=>cleanBackup({app:'reson-kurdi',version:1,songs:[],words:[{word:'<script>',meaning:'test'}],favorites:[]}));
  assert.equal(escapeHtml('<img src=x onerror="evil()">'),'&lt;img src=x onerror=&quot;evil()&quot;&gt;');
});
