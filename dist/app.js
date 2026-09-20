import { LEXICON, CATEGORIES } from './lexicon.js';
import { normalize, loose, syllables, ending, findEntry, searchRhymes, escapeHtml as esc, validWord, cleanBackup } from './core.js';
import { THEMES, CONTEXTS } from './themes.js';
import { cleanConfig, freshDraft, normalizeDraft, makeSection, makePreset, generateSection, generateArrangement, serializeSections, sectionBody, arrangeAction, suggestTitle, MAX_SECTIONS } from './studio.js';
import { renderStudio, contextHints, highlightBacks } from './studio-view.js';

const KEY='reson-kurdi-v1';
const icons={
  search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  pen:'<path d="m15 4 5 5M4 20l4-1 12-12a3.5 3.5 0 0 0-5-5L3 14l-1 6Z"/>',
  book:'<path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4zM13 7a3 3 0 0 1 3-3h5v14h-4a4 4 0 0 0-4 3"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
  arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/>',
  music:'<path d="M9 18V5l12-2v13M9 9l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/>',
  check:'<path d="m5 12 4 4L20 5"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  back:'<path d="M9 5 3 11l6 6M3 11h12a6 6 0 0 1 0 12"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  share:'<circle cx="18" cy="5" r="2.7"/><circle cx="6" cy="12" r="2.7"/><circle cx="18" cy="19" r="2.7"/><path d="m8.4 10.6 7.2-4.2M8.4 13.4l7.2 4.2"/>'
};
const icon=(name)=>`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.pen}</svg>`;
const defaults=()=>({schemaVersion:2,favorites:[],songs:[],words:[],draft:freshDraft(),config:cleanConfig(),reserve:[],recent:[]});
let storageProblem=false,loadProblem=false;
const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
let deferredInstallPrompt=null,installDone=false;
function readData(){
  try{
    const raw=localStorage.getItem(KEY);if(!raw)return defaults();
    const parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object')throw new Error();
    const valid=cleanBackup({app:'reson-kurdi',version:parsed.schemaVersion===2?2:1,songs:parsed.songs,words:parsed.words,favorites:parsed.favorites});
    const songs=valid.songs.map((song,i)=>({...song,id:typeof parsed.songs[i].id==='string'?parsed.songs[i].id:song.id}));
    const config=cleanConfig(parsed.config);
    let draft=freshDraft(config);
    if(parsed.draft&&typeof parsed.draft.text==='string'){
      const checked=cleanBackup({app:'reson-kurdi',version:parsed.schemaVersion===2?2:1,songs:[{...parsed.draft,title:parsed.draft.title||''}],words:[],favorites:[]}).songs[0];
      draft=normalizeDraft({...checked,id:parsed.draft.id,config},config);
    }
    return {...defaults(),...valid,songs,draft,config,reserve:Array.isArray(parsed.reserve)?parsed.reserve.filter(w=>typeof w==='string'&&validWord(w)).slice(0,20):[],recent:Array.isArray(parsed.recent)?parsed.recent.filter(w=>typeof w==='string'&&w.trim()).slice(0,8):[]};
  }catch{loadProblem=true;return defaults();}
}
let data=readData();
const state={view:'paroles',studioMode:'sections',previewPlain:false,preset:'standard',addType:'verse',activeSection:null,voiceOpen:false,query:'evîn',mode:'rhyme',category:'all',count:'all',limit:24,showTranslation:false,previous:null};
let lastField='search-input',toastTimer;
const app=document.querySelector('#app');
const lexicon=()=>[...LEXICON,...data.words.filter(w=>!LEXICON.some(b=>b.word===w.word))];
function persist(){try{localStorage.setItem(KEY,JSON.stringify(data));storageProblem=false;}catch{if(!storageProblem)toast('Sauvegarde impossible sur cet appareil. Exporte tes textes pour les garder.');storageProblem=true;}}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3400);}
const options=(obj,value)=>Object.entries(obj).map(([v,label])=>`<option value="${esc(v)}" ${value===v?'selected':''}>${esc(label)}</option>`).join('');
const btn=(label,action,ico,cls='button',attrs='')=>`<button type="button" class="${cls}" data-action="${action}" ${attrs}>${ico?icon(ico):''}${label}</button>`;
function navigate(view){if(!['rimes','paroles','favoris','carnet','aide'].includes(view))return;state.view=view;state.limit=24;state.showTranslation=false;render();window.scrollTo({top:0,behavior:'instant'});document.querySelector('h1')?.focus({preventScroll:true});try{history.replaceState(null,'','#'+view);}catch{}}
function nav(){return [['rimes','search','Dictionnaire de rimes'],['paroles','pen','Générateur de paroles'],['favoris','star','Mes favoris'],['carnet','book','Mon carnet']].map(([id,ico,label])=>`<button class="nav-item ${state.view===id?'active':''}" data-action="navigate" data-view="${id}" ${state.view===id?'aria-current="page"':''}>${icon(ico)}<span>${label}</span>${id==='favoris'?`<b class="counter">${data.favorites.length}</b>`:id==='paroles'?'<span class="nav-dot"></span>':''}</button>`).join('');}
function render(){
  const crumbs={rimes:'Dictionnaire de rimes',paroles:'Générateur de paroles',favoris:'Mes favoris',carnet:'Mon carnet',aide:'Aide & sauvegardes'};
  app.innerHTML=`<aside class="sidebar"><a class="brand" href="#" data-action="navigate" data-view="rimes"><img src="./icon.svg" width="43" height="43" alt=""><span>rêson<span class="brand-sub">LES MOTS PRENNENT VIE</span></span></a><p class="nav-label">TON ATELIER</p><nav aria-label="Navigation principale">${nav()}</nav><div class="sidebar-bottom"><div class="sidebar-quote"><span class="quote-mark">“</span><p>Un mot suffit.<br>La suite t’appartient.</p><span>Ji dil, bi kurdî.</span></div><button class="nav-item ${state.view==='aide'?'active':''}" data-action="navigate" data-view="aide">${icon('help')}<span>Aide & sauvegardes</span></button><div class="sidebar-foot"><span>Rêson <span class="version">V2</span></span><span>Kurmancî</span></div></div></aside>
  <div class="workspace"><header class="topbar"><div class="breadcrumb"><span>L’atelier</span><span class="slash">/</span><strong>${crumbs[state.view]}</strong></div><div class="top-actions"><span class="language">${icon('globe')} Kurmancî <span class="locale">LATIN</span></span><button class="icon-button help-top" data-action="navigate" data-view="aide" aria-label="Aide">${icon('help')}</button></div></header><main id="main" class="main">${state.view==='rimes'||state.view==='favoris'?dictionaryView():state.view==='paroles'?lyricsView():state.view==='carnet'?notebookView():helpView()}</main><footer class="main-footer"><span>Des mots, du rythme, et un peu de toi.</span><span>Rêson · Kurmanji V2</span></footer></div><nav class="mobile-nav" aria-label="Navigation mobile">${[['rimes','search','Rimes'],['paroles','pen','Paroles'],['favoris','star','Favoris'],['carnet','book','Carnet'],['aide','help','Aide']].map(([v,i,l])=>`<button class="${state.view===v?'active':''}" data-action="navigate" data-view="${v}" ${state.view===v?'aria-current="page"':''}>${icon(i)}<span>${l}</span></button>`).join('')}</nav>`;
  if(state.view==='rimes'||state.view==='favoris')renderResults();
  if(state.view==='paroles')updateEditorStats();
  bindForms();
}
function keyboard(target){return `<div class="keyboard"><span>Alphabet kurde</span>${['ç','ê','î','ş','û'].map(c=>`<button type="button" data-action="letter" data-letter="${c}" data-target="${target}" aria-label="Insérer ${c}">${c}</button>`).join('')}</div>`;}
function dictionaryView(){const fav=state.view==='favoris';return `<div class="page-heading"><div><p class="eyebrow">${fav?'LES MOTS QUE TU GARDES':'UN MOT. MILLE POSSIBILITÉS.'}</p><h1 tabindex="-1">${fav?'Ta réserve d’inspiration.':'Trouve la bonne <em>rime.</em>'}</h1><p class="page-intro">${fav?'Retrouve tes mots favoris et glisse-les dans tes paroles.':'Le prochain vers commence ici. Explore les sonorités du kurmanji.'}</p></div><span class="edition-tag">${lexicon().length} mots à explorer</span></div>
  <section class="search-panel" aria-label="Recherche de mots"><form id="search-form"><label for="search-input">${fav?'Rechercher parmi mes favoris':'Quel mot as-tu en tête ?'}</label><div class="search-box">${icon('search')}<input id="search-input" type="search" maxlength="80" autocomplete="off" spellcheck="false" lang="ku" value="${fav?'':esc(state.query)}" placeholder="Un mot kurde… evîn, jiyan, heval"><button type="submit" class="button primary">Explorer ${icon('arrow')}</button></div></form><div class="search-under">${keyboard('search-input')}<div class="quick-words"><span>Essaie</span>${['evîn','jiyan','heval','baran'].map(w=>btn(w,'example',null,'word-pill',`data-word="${w}"`)).join('')}</div></div>${!fav&&data.recent.length?`<div class="recent-words"><span>Récentes</span>${data.recent.map(w=>btn(w,'example',null,'word-pill',`data-word="${esc(w)}"`)).join('')}<button type="button" class="text-button recent-clear" data-action="clear-recent">${icon('close')} Effacer</button></div>`:''}</section>
  <div class="dictionary-layout"><section class="results-area"><div class="results-toolbar"><div class="segmented" role="group" aria-label="Type de recherche">${[['rhyme','Rimes'],['assonance','Assonances'],['lexicon','Lexique']].map(([v,l])=>`<button type="button" data-action="mode" data-mode="${v}" aria-pressed="${(fav?'lexicon':state.mode)===v}" class="${(fav?'lexicon':state.mode)===v?'selected':''}">${l}</button>`).join('')}</div><div class="filters"><label class="sr-only" for="category">Filtrer par thème</label><select id="category">${options(CATEGORIES,state.category)}</select><label class="sr-only" for="syllables">Filtrer par nombre de syllabes</label><select id="syllables">${options({all:'Syllabes',1:'1 syllabe',2:'2 syllabes',3:'3 syllabes','4+':'4 et plus'},state.count)}</select></div></div><div id="results" aria-live="polite"></div></section><aside id="word-detail" class="word-detail"></aside></div>`;}
function currentQuery(){return document.querySelector('#search-input')?.value??state.query;}
function recordSearch(query){
  const q=String(query||'').trim().slice(0,40);if(q.length<2)return;
  data.recent=[q,...data.recent.filter(w=>normalize(w)!==normalize(q))].slice(0,8);persist();
}
function resultsFor(query){return searchRhymes(query,lexicon(),{mode:state.view==='favoris'?'lexicon':state.mode,category:state.category,count:state.count,favorites:state.view==='favoris'?data.favorites:null});}
function renderResults(){
  const q=currentQuery(),fav=state.view==='favoris';if(!fav)state.query=q;
  const rows=resultsFor(q),entry=findEntry(q,lexicon()),tail=ending(entry?.word||q);
  const title=fav?`${rows.length} mot${rows.length>1?'s':''} dans ta réserve`:state.mode==='lexicon'?`${rows.length} mot${rows.length>1?'s':''} trouvé${rows.length>1?'s':''}`:`${rows.length} ${state.mode==='rhyme'?'rime':'assonance'}${rows.length>1?'s':''}${q?` avec <span lang="ku">${esc(entry?.word||q)}</span>`:''}`;
  document.querySelector('#results').innerHTML=`<div class="results-heading"><h2>${title}</h2><span>${state.mode==='rhyme'&&!fav&&tail?`Finale −${esc(tail)}`:'Kurde → français'}</span></div>${entry&&normalize(q)!==normalize(entry.word)&&state.mode!=='lexicon'?`<p class="spelling-note">Orthographe utilisée : <strong lang="ku">${esc(entry.word)}</strong></p>`:''}${rows.length?`<div class="word-grid">${rows.slice(0,state.limit).map(item=>wordCard(item,tail)).join('')}</div>${rows.length>state.limit?btn(`Afficher la suite (${rows.length-state.limit})`,'more',null,'button load-more'):''}`:`<div class="empty-state">${icon(fav?'star':'search')}<h3>${fav?'Tes mots t’attendent ici.':'Aucun mot avec ces critères.'}</h3><p>${fav?'Ajoute une étoile aux mots qui t’inspirent dans le dictionnaire.':'Essaie les assonances, enlève les filtres ou enrichis la base avec ton propre mot.'}</p>${btn(fav?'Explorer les rimes':'Enlever les filtres',fav?'go-rimes':'reset-filters','arrow','button secondary')}</div>`}<p class="method-note">${icon('help')} ${fav?'Favoris enregistrés sur cet appareil.':state.mode==='rhyme'?'Finales écrites identiques à partir de la dernière voyelle. À vérifier à l’oreille selon ton accent.':state.mode==='assonance'?'Même dernière voyelle, avec une fin différente. Ce sont des pistes sonores plus libres.':'Sens français indicatifs. La base reste à enrichir et à relire.'}</p>`;
  document.querySelector('#word-detail').innerHTML=`<section class="detail-card"><div class="detail-label">${icon('music')} LE MOT DE DÉPART</div><h2 lang="ku">${esc(entry?.word||q||'Ton inspiration')}</h2><p>${esc(entry?.meaning||(q?'Mot libre · hors de la base':'Choisis un mot pour explorer ses sonorités.'))}</p><div class="detail-facts"><div><span>Finale</span><strong lang="ku">${tail?'−'+esc(tail):'—'}</strong></div><div><span>Syllabes ≈</span><strong>${q?syllables(entry?.word||q):'—'}</strong></div></div><div class="detail-caption">${entry?esc(CATEGORIES[entry.category]):'Les syllabes sont estimées à partir des voyelles.'}</div>${q?`<div class="detail-actions">${btn('Copier','copy-word','copy','button secondary',`data-word="${esc(entry?.word||q)}"`)}${btn('Garder pour écrire','reserve','plus','button secondary',`data-word="${esc(entry?.word||q)}"`)}</div>`:''}</section><section class="compose-card"><div class="mini-spark">${icon('spark')}</div><h3>Et si ces mots<br>devenaient une chanson ?</h3><p>Choisis une ambiance.<br>Fais naître ton premier couplet.</p>${btn('Créer des paroles','go-lyrics','arrow','button light full')}</section><button class="add-word" data-action="add-word">${icon('plus')} Ajouter un mot au dictionnaire</button>`;
}
function wordCard(item,tail){const star=data.favorites.includes(item.word),suffix=ending(item.word),highlight=state.mode==='rhyme'&&suffix===tail&&tail;const text=highlight?`${esc(item.word.slice(0,-tail.length))}<mark>${esc(tail)}</mark>`:esc(item.word);return `<article class="word-card"><div class="word-card-top"><button class="word-title" data-action="example" data-word="${esc(item.word)}" lang="ku">${text}</button><button class="star-button ${star?'is-favorite':''}" data-action="favorite" data-word="${esc(item.word)}" aria-label="${star?'Retirer':'Ajouter'} ${esc(item.word)} ${star?'des':'aux'} favoris" aria-pressed="${star}">${icon('star')}</button></div><p>${esc(item.meaning)}</p><div class="word-card-bottom"><span>${syllables(item.word)} syll. <span class="tiny-dot">·</span> −${esc(suffix)}</span><button data-action="reserve" data-word="${esc(item.word)}" aria-label="Garder ${esc(item.word)} pour écrire">${icon('plus')}</button></div></article>`;}
function lyricsView(){return renderStudio(data,state,{icon,btn,keyboard});}
function notebookView(){return `<div class="page-heading"><div><p class="eyebrow">RIEN NE SE PERD</p><h1 tabindex="-1">Ton carnet <em>de paroles.</em></h1><p class="page-intro">Tes chansons et tes idées, conservées sur cet appareil.</p></div>${btn('Écrire un texte','go-lyrics','plus','button primary')}</div><div class="notebook-toolbar"><span>${data.songs.length} texte${data.songs.length>1?'s':''} enregistré${data.songs.length>1?'s':''}</span><div>${btn('Sauvegarde complète','backup','download','button secondary')}${btn('Importer','import','upload','button secondary')}</div></div>${data.songs.length?`<div class="notebook-grid">${[...data.songs].sort((a,b)=>b.updated.localeCompare(a.updated)).map(s=>`<article class="notebook-card"><div class="notebook-icon">${icon('book')}</div><span class="song-date">${esc(dateLabel(s.updated))}</span><h2>${esc(s.title)}</h2><p class="song-excerpt" lang="ku">${esc(s.text.replace(/\[.*?\]/g,'').trim().slice(0,180))}</p><div class="notebook-actions">${btn('Ouvrir','open-song','arrow','text-button',`data-id="${esc(s.id)}"`)}<button class="icon-button" data-action="delete-song" data-id="${esc(s.id)}" aria-label="Supprimer ${esc(s.title)}">${icon('trash')}</button></div></article>`).join('')}</div>`:`<div class="empty-state notebook-empty">${icon('book')}<h2>Chaque chanson commence quelque part.</h2><p>Crée tes premières paroles, puis appuie sur « Sauvegarder » pour les retrouver ici.</p>${btn('Commencer un texte','go-lyrics','pen','button primary')}</div>`}<p class="method-note">${icon('help')} Les données restent dans ce navigateur. Exporte une sauvegarde avant de changer d’appareil ou de vider les données du site.</p>`;}
function dateLabel(value){const d=new Date(value);return Number.isNaN(d.getTime())?'Date inconnue':d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});}
function installPanel(){
  if(isStandalone())return `<section class="panel"><div class="section-title">${icon('check')}<h2>Rêson est installée</h2></div><p>Tu utilises déjà Rêson comme une application sur cet appareil, en plein écran et sans barre d’adresse. Après un premier chargement complet, elle continue de fonctionner hors connexion.</p></section>`;
  const steps=isIOS()?`<ol class="install-steps"><li>Ouvre Rêson dans <strong>Safari</strong>.</li><li>Appuie sur le bouton <strong>Partager</strong> ${icon('upload')}.</li><li>Choisis <strong>« Sur l’écran d’accueil »</strong>.</li><li>Appuie sur <strong>« Ajouter »</strong>.</li></ol>`:`<p><strong>Android, Chrome ou Edge :</strong> appuie sur « Installer Rêson » ci-dessous si le bouton est proposé, ou ouvre le menu du navigateur puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».</p><p><strong>Autre navigateur :</strong> cherche « Ajouter à l’écran d’accueil » dans son menu.</p>`;
  return `<section class="panel"><div class="section-title">${icon('plus')}<h2>Installer Rêson</h2></div>${steps}${deferredInstallPrompt&&!isIOS()?btn('Installer Rêson','install-app','download','button primary'):''}<p class="muted">Une fois installée, l’application s’ouvre en plein écran, sans barre d’adresse du navigateur, et fonctionne hors connexion après un premier chargement complet.</p></section>`;
}
function helpView(){return `<div class="page-heading"><div><p class="eyebrow">PRENDS TES MARQUES</p><h1 tabindex="-1">Un atelier <em>tout simple.</em></h1><p class="page-intro">Tout ce qu’il faut savoir pour écrire et garder tes idées.</p></div></div><div class="help-grid"><section class="panel"><div class="section-title">${icon('download')}<h2>Garder mes créations</h2></div><p>Ton carnet, tes favoris et tes mots personnels sont enregistrés sur cet appareil. Il n’y a pas de synchronisation entre téléphones.</p><div class="help-actions">${btn('Exporter la sauvegarde','backup','download','button primary')}${btn('Importer une sauvegarde','import','upload','button secondary')}</div><p class="muted">L’import accepte les sauvegardes V1 et V2. Il ajoute les textes et les mots sans remplacer ceux qui sont déjà présents. Les sauvegardes V2 conservent la structure, les voix, les backs et les passages protégés.</p></section><section class="panel"><div class="section-title">${icon('globe')}<h2>Kurmanji, alphabet latin</h2></div><p>Cette version est dédiée au kurmanji. Le sorani et l’alphabet arabe ne sont pas pris en charge. Les caractères <strong>ç, ê, î, ş, û</strong> sont accessibles au-dessus des champs.</p><p>Le lexique comprend <strong>${LEXICON.length} mots de départ</strong>. Tu peux l’enrichir avec tes propres mots et leurs sens français.</p>${btn('Ajouter un mot','add-word','plus','button secondary')}</section><section class="panel"><div class="section-title">${icon('search')}<h2>Comment sont trouvées les rimes ?</h2></div><p>Les rimes partagent la même finale écrite, de la dernière voyelle à la fin du mot. Les assonances partagent seulement la dernière voyelle. <strong>e et ê, i et î, u et û restent distincts.</strong></p><p>Le nombre de syllabes est une estimation. L’accentuation, la prononciation régionale et la place des mots dans le vers peuvent changer le résultat à l’oreille. Cette V1 n’est pas un dictionnaire phonétique exhaustif.</p><p>La recherche « Lexique » accepte un mot kurde ou un sens français. La recherche sans accents peut retrouver une orthographe courante.</p></section><section class="panel"><div class="section-title">${icon('spark')}<h2>Comment sont créées les paroles ?</h2></div><p>Le générateur assemble une réserve de vers préécrits selon le thème et le schéma de rimes. Il fonctionne sans IA ni abonnement. Tu peux ajouter jusqu’à 32 parties : plusieurs couplets et refrains, pré-refrains, ponts, intro, outro, backs et instrumental. Les styles adaptent l’introduction. Les voix, chœurs, vocalises et le tempo sont des indications écrites ; aucun audio n’est généré.</p><p>Les résultats peuvent se répéter. Modifie-les pour raconter ton histoire et fais relire le kurmanji avant une publication. Le sens français de chaque partie correspond au texte initial ; tes modifications ne sont pas traduites automatiquement. Le contexte libre utilise une détection de mots-clés, pas une compréhension par IA.</p></section>${installPanel()}<section class="panel"><div class="section-title">${icon('book')}<h2>À propos de la base</h2></div><p>Lexique de départ et vers préparés pour cet atelier. Les traductions sont indicatives ; aucune validation institutionnelle n’est revendiquée.</p><p>Pour approfondir la langue : <a href="https://www.institutkurde.org/en/language/" target="_blank" rel="noopener noreferrer">Institut kurde de Paris</a> et <a href="https://www.institutkurde.org/en/language/werger.php" target="_blank" rel="noopener noreferrer">ses références linguistiques</a>. Aucun dictionnaire tiers n’est embarqué.</p><p class="muted">Rêson V2 · Application indépendante · Aucun suivi publicitaire.</p></section></div>`;}
function snapshot(){state.previous=structuredClone({...data.draft,config:data.config});}
function syncDraft(){data.draft.config=cleanConfig(data.config);data.draft.text=serializeSections(data.draft.sections,data.config);persist();updateEditorStats();flashSaved();}
let saveFlashTimer;
function flashSaved(){
  if(storageProblem)return;
  const status=document.querySelector('#save-status');if(!status)return;
  status.textContent='Sauvegardé';status.classList.add('is-saved');
  clearTimeout(saveFlashTimer);saveFlashTimer=setTimeout(()=>{status.textContent='Brouillon local';status.classList.remove('is-saved');},1600);
}
function refreshStudio(focusId){const groups=[...document.querySelectorAll('.setting-group')];if(groups.length)state.settingsOpen=groups.map((g,i)=>g.open?i:-1).filter(i=>i>=0);render();if(focusId)document.getElementById('part-'+focusId)?.scrollIntoView({behavior:'smooth',block:'nearest'});}
function bindForms(){
  document.querySelector('#search-form')?.addEventListener('submit',e=>{e.preventDefault();state.limit=24;recordSearch(currentQuery());render();document.querySelector('#search-input')?.focus();});
  document.querySelector('#search-input')?.addEventListener('input',()=>{state.limit=24;renderResults();});
  document.querySelector('#category')?.addEventListener('change',e=>{state.category=e.target.value;state.limit=24;renderResults();});
  document.querySelector('#syllables')?.addEventListener('change',e=>{state.count=e.target.value;state.limit=24;renderResults();});
  const form=document.querySelector('#generate-form');
  form?.addEventListener('submit',e=>{e.preventDefault();generate();});
  form?.addEventListener('input',e=>{
    readConfig();
    if(e.target.name==='theme'){
      data.config.situation='general';
      document.querySelector('#cfg-situation').innerHTML=options({general:'Vue d’ensemble',...Object.fromEntries((CONTEXTS[data.config.theme]||[]).map(c=>[c.id,c.label]))},'general');
    }
    document.querySelector('#context-hints').innerHTML=contextHints(data.config);syncDraft();
    for(const part of data.draft.sections){const out=document.getElementById('arranged-'+part.id);if(out)out.innerHTML=highlightBacks(sectionBody(part,data.config));}
    const preview=document.querySelector('#full-preview');if(preview)preview.innerHTML=highlightBacks(serializeSections(data.draft.sections,data.config,state.previewPlain));
  });
  document.querySelector('#song-title')?.addEventListener('input',e=>{data.draft.title=e.target.value;syncDraft();});
  for(const input of document.querySelectorAll('[data-section-field]')){
    const event=input.tagName==='SELECT'||input.type==='checkbox'?'change':'input';
    input.addEventListener(event,e=>{
      const part=data.draft.sections.find(s=>s.id===input.dataset.id);if(!part)return;
      const field=input.dataset.sectionField;
      part[field]=field==='locked'?input.checked:field==='lineCount'?Number(input.value):input.value;
      state.activeSection=part.id;syncDraft();
      if(field==='text'){
        const counter=document.getElementById('count-'+part.id);if(counter)counter.textContent=part.text.split('\n').filter(l=>l.trim()).length+' lignes';
        const arranged=document.getElementById('arranged-'+part.id);if(arranged)arranged.innerHTML=highlightBacks(sectionBody(part,data.config));
        const warning=document.getElementById('warning-'+part.id);if(warning)warning.hidden=part.text===part.generatedText;
      }else if(field!=='label')refreshStudio();
    });
  }
  document.querySelector('#preview-clean')?.addEventListener('change',e=>{state.previewPlain=e.target.checked;document.querySelector('#full-preview').textContent=serializeSections(data.draft.sections,data.config,state.previewPlain);});
  document.querySelector('#structure-preset')?.addEventListener('change',e=>state.preset=e.target.value);
  document.querySelector('#new-section-type')?.addEventListener('change',e=>state.addType=e.target.value);
}
function readConfig(){const form=document.querySelector('#generate-form');if(!form)return;const fields=new FormData(form);data.config=cleanConfig({...Object.fromEntries(fields),adlibs:fields.getAll('adlib')});}
function updateEditorStats(){
  const sections=data.draft.sections||[],lines=sections.filter(s=>!['instrumental','backs'].includes(s.type)).flatMap(s=>s.text.split('\n')).filter(l=>l.trim()&&!/^\[.*\]$/.test(l.trim()));
  const words=lines.join(' ').match(/[a-zçêîşû]+(?:['’-][a-zçêîşû]+)*/gi)||[];
  const el=document.querySelector('#editor-stats');if(el)el.textContent=`${lines.length} vers · ${words.length} mots`;
  const status=document.querySelector('#save-status');if(status)status.textContent=storageProblem?'Non enregistré':'Brouillon local';
}
function generate(){
  snapshot();readConfig();
  if(!data.draft.sections.length)data.draft.sections=makePreset(state.preset,data.config);
  data.draft.sections=generateArrangement(data.draft.sections,data.config);
  if(!data.draft.title.trim())data.draft.title=suggestTitle(data.config);
  state.studioMode='sections';syncDraft();refreshStudio();toast('Chanson générée. Les textes protégés sont conservés.');
}
function saveSong(){
  syncDraft();if(!data.draft.text.trim()){toast('Écris quelques mots avant de sauvegarder.');return;}
  data.draft.title=data.draft.title.trim()||'Sans titre';const field=document.querySelector('#song-title');if(field)field.value=data.draft.title;
  const now=new Date().toISOString(),existing=data.songs.find(s=>s.id===data.draft.id);
  if(!existing&&data.songs.length>=500){toast('Le carnet contient 500 textes. Exporte et libère de la place.');return;}
  const song={...structuredClone(data.draft),config:cleanConfig(data.config),id:existing?.id||crypto.randomUUID(),created:existing?.created||now,updated:now};
  if(existing)data.songs[data.songs.indexOf(existing)]=song;else data.songs.push(song);
  data.draft.id=song.id;persist();toast(storageProblem?'Texte en mémoire seulement : exporte-le.':'Chanson et structure sauvegardées dans ton carnet.');
}
function addPart(type){
  if(data.draft.sections.length>=MAX_SECTIONS){toast('32 parties maximum.');return;}
  snapshot();readConfig();const part=makeSection(type,data.config);data.draft.sections.push(part);state.activeSection=part.id;state.studioMode='sections';syncDraft();refreshStudio(part.id);document.getElementById('text-'+part.id)?.focus({preventScroll:true});
}
function sectionAction(action,partId){
  const part=data.draft.sections.find(s=>s.id===partId);if(!part)return;
  if(action==='generate'){
    if(part.locked){toast('Ce texte est protégé.');return;}
    snapshot();readConfig();const used=new Set(data.draft.sections.filter(s=>s.id!==partId).flatMap(s=>s.text.split('\n')));
    data.draft.sections[data.draft.sections.indexOf(part)]=generateSection(part,data.config,Math.random,used);syncDraft();refreshStudio(partId);toast('Une nouvelle proposition pour cette partie.');return;
  }
  snapshot();try{data.draft.sections=arrangeAction(data.draft.sections,action,partId);syncDraft();refreshStudio(action==='remove'?undefined:partId);}catch(e){toast(e.message);}
}
function exportStudio(){
  syncDraft();if(!data.draft.text.trim()){toast('Écris ou génère un texte avant de l’exporter.');return;}
  const el=dialog(`<h2>Exporter ta chanson</h2><label for="export-kind">Format</label><select id="export-kind"><option value="full">TXT · paroles, voix et backs</option><option value="plain">TXT · paroles seules</option><option value="project">JSON · chanson modifiable avec ses réglages</option></select><p>Le fichier TXT se lit partout. Le JSON conserve toutes les parties et s’importe dans Rêson.</p><div class="dialog-actions"><button class="button secondary" data-action="close-dialog">Annuler</button><button class="button primary" id="do-export">Télécharger</button></div>`);
  el.querySelector('#do-export').onclick=()=>{
    const kind=el.querySelector('#export-kind').value,filename=(data.draft.title||'mes-paroles').replace(/[^\p{L}\p{N}_-]/gu,'-').slice(0,70);
    if(kind==='project')download(filename+'.json',JSON.stringify({app:'reson-kurdi',version:2,songs:[{...data.draft,title:data.draft.title||'Sans titre'}],favorites:[],words:[]},null,2),'application/json;charset=utf-8');
    else download(filename+(kind==='plain'?'-paroles':'-voix-backs')+'.txt','\uFEFF'+[data.draft.title,serializeSections(data.draft.sections,data.config,kind==='plain')].filter(Boolean).join('\n\n'),'text/plain;charset=utf-8');
    el.close();
  };
}
async function shareSong(){
  syncDraft();if(!data.draft.text.trim()){toast('Écris ou génère un texte avant de le partager.');return;}
  if(!navigator.share){toast('Le partage n’est pas proposé par ce navigateur. Utilise Copier ou Exporter.');return;}
  const title=data.draft.title||'Mes paroles',text=[title,data.draft.text].filter(Boolean).join('\n\n');
  try{
    if(navigator.canShare&&typeof File==='function'){
      const filename=(data.draft.title||'mes-paroles').replace(/[^\p{L}\p{N}_-]/gu,'-').slice(0,70)+'.txt';
      const file=new File(['﻿'+text],filename,{type:'text/plain'});
      if(navigator.canShare({files:[file]})){await navigator.share({title,files:[file]});return;}
    }
    await navigator.share({title,text});
  }catch(e){if(e?.name!=='AbortError')toast('Le partage a été annulé ou n’a pas pu aboutir.');}
}
async function copy(text){if(!text.trim()){toast('Il n’y a pas encore de texte à copier.');return;}try{await navigator.clipboard.writeText(text);toast('Copié !');}catch{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();toast(ok?'Copié !':'La copie est bloquée. Sélectionne le texte pour le copier.');}}
function download(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function backup(){
  syncDraft();const songs=[...data.songs];
  if(data.draft.text.trim()&&!songs.some(s=>s.text===data.draft.text&&s.title===data.draft.title&&JSON.stringify(s.config)===JSON.stringify(data.config)))songs.push({...structuredClone(data.draft),title:data.draft.title||'Brouillon',config:data.config});
  download(`reson-sauvegarde-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({app:'reson-kurdi',version:2,exportedAt:new Date().toISOString(),songs,favorites:data.favorites,words:data.words},null,2),'application/json;charset=utf-8');toast('Sauvegarde exportée, avec la structure et les voix.');
}
function importBackup(){const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.addEventListener('change',async()=>{const file=input.files[0];if(!file)return;if(file.size>10000000){toast('Fichier trop volumineux (10 Mo maximum).');return;}try{const imported=cleanBackup(JSON.parse(await file.text()));const newSongs=imported.songs.filter(s=>!data.songs.some(o=>o.text===s.text&&o.title===s.title&&JSON.stringify(o.config||{})===JSON.stringify(s.config||{})&&JSON.stringify((o.sections||[]).map(({id,...rest})=>rest))===JSON.stringify((s.sections||[]).map(({id,...rest})=>rest))));const map=new Map(data.words.map(w=>[w.word,w]));for(const w of imported.words)if(!map.has(w.word)&&!LEXICON.some(l=>l.word===w.word))map.set(w.word,w);if(data.songs.length+newSongs.length>500||map.size>3000)throw new Error('La limite de textes ou de mots serait dépassée.');data.songs.push(...newSongs);data.words=[...map.values()];data.favorites=[...new Set([...data.favorites,...imported.favorites])].slice(0,4000);persist();render();toast(storageProblem?'Import en mémoire. Exporte les données pour les conserver.':`${newSongs.length} texte(s) importé(s). Tes données existantes sont conservées.`);}catch(e){toast(e instanceof SyntaxError?'Le fichier JSON est illisible.':e.message||'Import impossible.');}});input.click();}
function dialog(content){document.querySelector('dialog')?.remove();const el=document.createElement('dialog');el.className='modal';el.innerHTML=content;document.body.append(el);el.addEventListener('click',e=>{if(e.target===el)el.close();});el.addEventListener('close',()=>el.remove());el.showModal();return el;}
function confirmAction(title,message,onConfirm){const el=dialog(`<h2>${esc(title)}</h2><p>${esc(message)}</p><div class="dialog-actions"><button class="button secondary" id="cancel-dialog">Annuler</button><button class="button primary" id="confirm-dialog">Confirmer</button></div>`);el.querySelector('#cancel-dialog').onclick=()=>el.close();el.querySelector('#confirm-dialog').onclick=()=>{el.close();onConfirm();};el.querySelector('#cancel-dialog').focus();}
function addWord(){const el=dialog(`<form id="word-form"><div class="modal-heading"><h2>Un nouveau mot</h2><button type="button" class="icon-button" data-action="close-dialog" aria-label="Fermer">${icon('close')}</button></div><p>Enrichis ton dictionnaire sur cet appareil.</p><label for="new-word">Mot en kurmanji</label><input id="new-word" required maxlength="40" lang="ku" autocomplete="off" placeholder="Ex. dilovan"><label for="new-meaning">Sens en français</label><input id="new-meaning" required maxlength="200" placeholder="Ex. bienveillant"><p id="word-error" class="error" role="alert"></p><button class="button primary full" type="submit">${icon('plus')} Ajouter au dictionnaire</button></form>`);el.querySelector('#word-form').addEventListener('submit',e=>{e.preventDefault();const word=el.querySelector('#new-word').value.trim().normalize('NFC').toLowerCase(),meaning=el.querySelector('#new-meaning').value.trim(),error=el.querySelector('#word-error');if(!validWord(word)){error.textContent='Utilise un seul mot en alphabet latin kurde, avec au moins une voyelle.';return;}if(!meaning){error.textContent='Ajoute un sens en français.';return;}if(lexicon().some(w=>normalize(w.word)===word)){error.textContent='Ce mot est déjà dans le dictionnaire.';return;}if(data.words.length>=3000){error.textContent='Limite de 3 000 mots personnels atteinte.';return;}data.words.push({word,meaning,category:'personnel'});persist();el.close();state.view='rimes';state.query=word;state.mode='lexicon';state.category='all';state.count='all';render();toast('Mot ajouté à ton dictionnaire.');});}
function insertText(text,targetId='lyrics-editor'){const el=document.getElementById(targetId);if(!el)return;const start=el.selectionStart??el.value.length,end=el.selectionEnd??start;el.setRangeText(text,start,end,'end');el.focus();el.dispatchEvent(new Event('input',{bubbles:true}));}
document.addEventListener('focusin',e=>{
  if(!e.target.matches('input,textarea,select'))return;
  if(e.target.matches('input,textarea'))lastField=e.target.id;
  if(e.target.dataset.sectionField==='text')state.activeSection=e.target.dataset.id;
  if(window.innerWidth<=800){const target=e.target;setTimeout(()=>target.scrollIntoView({block:'center',behavior:'smooth'}),320);}
});
if(window.visualViewport){
  const vv=window.visualViewport;let kbOpen=false;
  const onResize=()=>{const shrink=window.innerHeight-vv.height>150;if(shrink!==kbOpen){kbOpen=shrink;document.documentElement.classList.toggle('kb-open',shrink);}};
  vv.addEventListener('resize',onResize);vv.addEventListener('scroll',onResize);
}
document.addEventListener('pointerdown',e=>{if(e.target.closest('[data-action="letter"],[data-action="insert-word"]'))e.preventDefault();});
document.addEventListener('click',async e=>{
  const el=e.target.closest('[data-action]');if(!el)return;const action=el.dataset.action;
  if(el.tagName==='A')e.preventDefault();
  if(action==='navigate')navigate(el.dataset.view);
  else if(action==='go-lyrics')navigate('paroles');
  else if(action==='go-rimes'){state.category='all';state.count='all';navigate('rimes');}
  else if(action==='example'){state.query=el.dataset.word;state.view='rimes';state.mode='rhyme';state.category='all';state.count='all';state.limit=24;recordSearch(state.query);render();}
  else if(action==='clear-recent'){data.recent=[];persist();render();}
  else if(action==='mode'){state.mode=el.dataset.mode;if(state.view==='favoris'){state.view='rimes';state.query='';}state.limit=24;render();}
  else if(action==='favorite'){const word=el.dataset.word;data.favorites=data.favorites.includes(word)?data.favorites.filter(w=>w!==word):[...data.favorites,word];persist();renderResults();document.querySelector('.counter').textContent=data.favorites.length;}
  else if(action==='copy-word')await copy(el.dataset.word);
  else if(action==='reserve'){const word=el.dataset.word;if(!validWord(word)){toast('Choisis un seul mot du dictionnaire.');return;}if(data.reserve.includes(word)){toast('Ce mot est déjà dans ta réserve.');return;}if(data.reserve.length>=20){toast('Ta réserve contient déjà 20 mots.');return;}data.reserve.push(word);persist();toast(`« ${word} » ajouté à ta réserve de mots.`);}
  else if(action==='more'){state.limit+=24;renderResults();}
  else if(action==='reset-filters'){state.category='all';state.count='all';state.mode='lexicon';state.query='';render();}
  else if(action==='letter')insertText(el.dataset.letter,el.dataset.target||lastField);
  else if(action==='insert-word'){const target=data.draft.sections.find(s=>s.id===state.activeSection)?.id||data.draft.sections.find(s=>!['instrumental','backs'].includes(s.type))?.id;if(target){state.activeSection=target;if(state.studioMode==='preview'){state.studioMode='sections';refreshStudio();}insertText(el.dataset.word+' ','text-'+target);}else toast('Ajoute une partie pour insérer un mot.');}
  else if(action==='clear-reserve'){data.reserve=[];persist();render();}
  else if(action==='save-song')saveSong();
  else if(action==='copy-song')await copy([data.draft.title,data.draft.text].filter(Boolean).join('\n\n'));
  else if(action==='export-song'){if(!data.draft.text.trim()){toast('Écris un texte avant de l’exporter.');return;}const filename=(data.draft.title||'mes-paroles').replace(/[^\p{L}\p{N}_-]/gu,'-').slice(0,70);download(filename+'.txt','\uFEFF'+[data.draft.title,data.draft.text].filter(Boolean).join('\n\n'),'text/plain;charset=utf-8');}
  else if(action==='studio-mode'){state.studioMode=el.dataset.mode;refreshStudio();}
  else if(action==='studio-export')exportStudio();
  else if(action==='share-song')await shareSong();
  else if(action==='quick-add')addPart(el.dataset.type);
  else if(action==='section-add')addPart(document.querySelector('#new-section-type').value);
  else if(action==='preset'){
    const apply=()=>{snapshot();readConfig();data.draft.sections=makePreset(state.preset,data.config);state.studioMode='sections';syncDraft();refreshStudio();toast('Structure prête. Tu peux générer les parties.');};
    if(data.draft.text.trim())confirmAction('Remplacer la structure ?','Les textes du brouillon seront remplacés par des parties vides. Tu pourras annuler.',apply);else apply();
  }
  else if(action==='section-generate')sectionAction('generate',el.dataset.id);
  else if(action==='section-copy'){const part=data.draft.sections.find(s=>s.id===el.dataset.id);if(part)await copy(part.text);}
  else if(action==='section-up')sectionAction('up',el.dataset.id);
  else if(action==='section-down')sectionAction('down',el.dataset.id);
  else if(action==='section-duplicate')sectionAction('duplicate',el.dataset.id);
  else if(action==='section-delete'){const part=data.draft.sections.find(s=>s.id===el.dataset.id);if(part?.text.trim())confirmAction('Supprimer cette partie ?','Les autres parties de la chanson seront conservées. Tu peux annuler après suppression.',()=>sectionAction('remove',el.dataset.id));else sectionAction('remove',el.dataset.id);}
  else if(action==='undo'&&state.previous){const current=structuredClone({...data.draft,config:data.config});data.draft=state.previous;data.config=cleanConfig(data.draft.config);state.previous=current;syncDraft();refreshStudio();toast('Version précédente restaurée.');}
  else if(action==='new-song'){const act=()=>{snapshot();data.draft=freshDraft(data.config);state.studioMode='sections';persist();refreshStudio();document.querySelector('#song-title')?.focus();};if(data.draft.text.trim())confirmAction('Commencer une nouvelle chanson ?','Sauvegarde ton brouillon dans le carnet pour le garder.',act);else act();}
  else if(action==='open-song'){
    const song=data.songs.find(s=>s.id===el.dataset.id);if(!song)return;
    const act=()=>{snapshot();data.config=cleanConfig(song.config);data.draft=normalizeDraft(structuredClone(song),data.config);state.studioMode='sections';persist();navigate('paroles');};
    const saved=!data.draft.text.trim()||data.songs.some(s=>s.text===data.draft.text&&s.title===data.draft.title);
    if(!saved)confirmAction('Ouvrir cette chanson ?','Ton brouillon n’est pas dans le carnet. Sauvegarde-le si tu veux le garder.',act);else act();
  }
  else if(action==='delete-song')confirmAction('Supprimer ce texte ?','Cette suppression est définitive sur cet appareil.',()=>{data.songs=data.songs.filter(s=>s.id!==el.dataset.id);if(data.draft.id===el.dataset.id)delete data.draft.id;persist();render();toast('Texte supprimé du carnet.');});
  else if(action==='backup')backup();
  else if(action==='import')importBackup();
  else if(action==='add-word')addWord();
  else if(action==='close-dialog')el.closest('dialog')?.close();
  else if(action==='install-app'){
    if(!deferredInstallPrompt)return;
    deferredInstallPrompt.prompt();
    const choice=await deferredInstallPrompt.userChoice.catch(()=>null);
    deferredInstallPrompt=null;
    if(state.view==='aide')render();
    if(choice?.outcome==='accepted')toast('Installation en cours…');
  }
  else if(action==='dismiss-install-hint')document.querySelector('#install-hint')?.remove();
  else if(action==='install-hint-help'){document.querySelector('#install-hint')?.remove();navigate('aide');}
});
{const fromHash=location.hash.slice(1);if(['rimes','paroles','favoris','carnet','aide'].includes(fromHash))state.view=fromHash;}
render();
if(loadProblem)toast('Tes données locales n’ont pas pu être lues. Tu peux importer une sauvegarde depuis l’aide.');
function installHint(){
  if(isStandalone()||localStorage.getItem('reson-install-hint-seen'))return;
  try{localStorage.setItem('reson-install-hint-seen','1');}catch{}
  const el=document.createElement('div');el.id='install-hint';el.className='install-hint';el.setAttribute('role','note');
  el.innerHTML=`<span>${icon('spark')} Installe Rêson sur ton écran d’accueil pour l’ouvrir comme une application.</span><div class="install-hint-actions"><button type="button" class="button secondary" data-action="install-hint-help">Comment faire ?</button><button type="button" class="icon-button" data-action="dismiss-install-hint" aria-label="Fermer">${icon('close')}</button></div>`;
  document.body.append(el);
}
if(!isStandalone()){
  if(isIOS())setTimeout(installHint,2500);
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;setTimeout(installHint,1200);if(state.view==='aide')render();});
  window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;document.querySelector('#install-hint')?.remove();if(state.view==='aide')render();});
}
window.addEventListener('offline',()=>toast('Hors connexion : le dictionnaire, le générateur et ton carnet restent disponibles sur cet appareil.'));
window.addEventListener('online',()=>toast('Connexion internet rétablie.'));
function updateBanner(){
  let el=document.querySelector('#update-banner');
  if(!el){el=document.createElement('div');el.id='update-banner';el.className='update-banner';el.hidden=true;el.innerHTML=`<span>${icon('spark')} Une nouvelle version de Rêson est prête.</span><button type="button" class="button primary">Actualiser</button>`;document.body.append(el);}
  return el;
}
if('serviceWorker' in navigator&&location.protocol!=='file:'){
  navigator.serviceWorker.register('./sw.js').then(reg=>{
    const promptUpdate=worker=>{const banner=updateBanner();banner.hidden=false;banner.querySelector('button').onclick=()=>worker.postMessage('skip-waiting');};
    if(reg.waiting&&navigator.serviceWorker.controller)promptUpdate(reg.waiting);
    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)promptUpdate(worker);});
    });
  }).catch(()=>{});
  let refreshing=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload();});
}

// Amélioration progressive : les navigateurs sans WebMCP gardent toutes les fonctions.
const modelContext=document.modelContext;
if(modelContext?.registerTool){
  const lifecycle=new AbortController();
  const tool={name:'search_kurmanji_rhymes',title:'Rechercher des rimes kurmanji',description:'Recherche les rimes et ouvre les résultats dans le dictionnaire. Ne modifie pas le carnet.',inputSchema:{type:'object',properties:{word:{type:'string',minLength:1,maxLength:80},mode:{type:'string',enum:['rhyme','assonance','lexicon']}},required:['word'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute(input){if(!input||typeof input.word!=='string'||!input.word.trim()||input.word.length>80||Object.keys(input).some(k=>!['word','mode'].includes(k))||input.mode&&!['rhyme','assonance','lexicon'].includes(input.mode))throw new Error('Mot ou mode invalide.');state.query=input.word.trim();state.mode=input.mode||'rhyme';state.category='all';state.count='all';navigate('rimes');return {word:state.query,results:resultsFor(state.query).slice(0,50)};}};
  try{Promise.resolve(modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
