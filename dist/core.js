export const VOWELS = /[aeêiîouû]/g;
export function normalize(value) {
  return String(value ?? '').normalize('NFC').toLowerCase().replace(/ı/g,'i').replace(/[^a-zçêîşû\s'-]/g,'').trim();
}
export function loose(value) { return normalize(value).normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
export function foldSearch(value) { return String(value??'').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/œ/g,'oe').trim(); }
export function syllables(value) { return (normalize(value).match(VOWELS)||[]).length; }
export function lastWord(value) { return normalize(value).split(/[\s'-]+/).filter(Boolean).at(-1)||''; }
export function ending(value) {
  const word=lastWord(value); const matches=[...word.matchAll(/[aeêiîouû]/g)];
  return matches.length ? word.slice(matches.at(-1).index) : '';
}
export function findEntry(value,lexicon) {
  const q=normalize(value); return lexicon.find(w=>normalize(w.word)===q)||lexicon.find(w=>loose(w.word)===loose(q));
}
export function searchRhymes(query,lexicon,options={}) {
  const {mode='rhyme',category='all',count='all',favorites=null}=options;
  const entry=findEntry(query,lexicon);
  const word=entry?.word||lastWord(query), tail=ending(word);
  return lexicon.filter(item=>{
    if(category!=='all'&&item.category!==category)return false;
    if(count!=='all'&&(count==='4+'?syllables(item.word)<4:syllables(item.word)!==Number(count)))return false;
    if(favorites&&!favorites.includes(item.word))return false;
    if(!query.trim())return true;
    if(mode==='lexicon')return foldSearch(item.word).includes(foldSearch(query))||foldSearch(item.meaning).includes(foldSearch(query));
    if(normalize(item.word)===normalize(word)||!tail)return false;
    const target=ending(item.word);
    return mode==='assonance'?target[0]===tail[0]&&target!==tail:target===tail;
  }).sort((a,b)=>{
    if(mode==='lexicon'&&query.trim()){
      const q=foldSearch(query);
      const rank=item=>foldSearch(item.word)===q?0:foldSearch(item.meaning).split(/[^\p{L}]+/u).includes(q)?1:2;
      if(rank(a)!==rank(b))return rank(a)-rank(b);
    }
    return syllables(a.word)-syllables(b.word)||a.word.localeCompare(b.word,'ku');
  });
}
export function escapeHtml(value) { return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function validWord(value) { return /^[a-zçêîşû]+(?:[-'][a-zçêîşû]+)*$/i.test(value)&&value.length<=40&&syllables(value)>0; }
export function cleanBackup(data) {
  if(!data||data.app!=='reson-kurdi'||![1,2].includes(data.version)||!Array.isArray(data.songs)||!Array.isArray(data.favorites)||!Array.isArray(data.words))throw new Error('Ce fichier n’est pas une sauvegarde Rêson V1 ou V2.');
  if(data.songs.length>500||data.words.length>3000||data.favorites.length>4000)throw new Error('Sauvegarde trop volumineuse.');
  const songs=data.songs.map(s=> {
    if(!s||typeof s.text!=='string'||typeof s.title!=='string'||s.text.length>(data.version===2?100000:50000)||s.title.length>120)throw new Error('Texte invalide dans la sauvegarde.');
    const extra={};
    if(s.sections!==undefined){
      if(!Array.isArray(s.sections)||s.sections.length>32)throw new Error('Structure invalide (32 parties maximum).');
      extra.sections=s.sections.map(part=>{
        if(!part||!['intro','verse','prechorus','chorus','bridge','outro','backs','instrumental','free'].includes(part.type)||typeof part.text!=='string'||part.text.length>2000)throw new Error('Partie invalide dans la sauvegarde.');
        const out={id:crypto.randomUUID(),type:part.type,text:part.text,lineCount:[4,8,12].includes(part.lineCount)?part.lineCount:4,locked:part.locked===true};
        for(const key of ['label','translation','generatedText']){
          if(part[key]!==undefined&&(typeof part[key]!=='string'||part[key].length>(key==='label'?80:2000)))throw new Error('Contenu de partie invalide.');
          out[key]=part[key]||'';
        }
        out.voice=['inherit','solo','male','female','duet','choir','whisper','spoken'].includes(part.voice)?part.voice:'inherit';
        out.backs=['inherit','off','light','regular','dense'].includes(part.backs)?part.backs:'inherit';
        return out;
      });
    }
    if(s.config!==undefined){
      if(!s.config||typeof s.config!=='object'||Array.isArray(s.config)||JSON.stringify(s.config).length>6000)throw new Error('Réglages invalides.');
      extra.config=JSON.parse(JSON.stringify(s.config));
    }
    return {id:crypto.randomUUID(),title:s.title,text:s.text,created:typeof s.created==='string'?s.created:new Date().toISOString(),updated:typeof s.updated==='string'?s.updated:new Date().toISOString(),...extra};
  });
  const words=data.words.map(w=>{
    if(!w||typeof w.word!=='string'||!validWord(w.word)||typeof w.meaning!=='string'||w.meaning.length>200)throw new Error('Mot invalide dans la sauvegarde.');
    return {word:normalize(w.word),meaning:w.meaning,category:'personnel'};
  });
  const favorites=data.favorites.filter(w=>typeof w==='string'&&validWord(w)).map(normalize);
  return {songs,words,favorites};
}
