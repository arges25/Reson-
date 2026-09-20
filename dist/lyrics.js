import { ending } from './core.js';

// Vers créés pour cette application, et non extraits de chansons existantes.
// Le moteur assemble cette réserve limitée : il ne s'agit pas d'une IA ni d'une traduction automatique.
const raw = {
  amour: [
    ['Hey lê, evîna min a şîrîn','Ô mon doux amour'],
    ['Bi te re diçe her birîn','Avec toi, chaque blessure s’en va'],
    ['Dengê te ye dengê evîn','Ta voix est la voix de l’amour'],
    ['Bê te dimîne dil xemgîn','Sans toi, le cœur reste triste'],
    ['Bi te re xweş e her havîn','Avec toi, chaque été est beau'],
    ['Navê te ye her bîranîn','Ton nom est dans chaque souvenir'],
    ['Tu yî ronahiya şevê','Tu es la lumière de la nuit'],
    ['Ez li benda te me li ber derîyê','Je t’attends devant la porte'],
    ['Dengê te tê bi bayê êvarê','Ta voix arrive avec le vent du soir'],
    ['Destê min bigire di vê rêyê','Prends ma main sur ce chemin'],
    ['Em bi hev re ne heta sibê','Nous sommes ensemble jusqu’au matin'],
    ['Dilê min digere li evînê','Mon cœur cherche l’amour'],
    ['Bi te re vedibe dilê min','Avec toi, mon cœur s’ouvre'],
    ['Tu bûyî strana dilê min','Tu es devenu la chanson de mon cœur'],
    ['Bê te dirêj in şevên min','Sans toi, mes nuits sont longues'],
    ['Bi te re geş in rojên min','Avec toi, mes jours sont lumineux'],
    ['Navê te maye di bîra min','Ton nom est resté dans ma mémoire'],
    ['Bi kenê xwe were cem min','Viens auprès de moi avec ton sourire']
  ],
  nostalgie: [
    ['Şev diçe, ez hê li benda te me','La nuit passe, je t’attends encore'],
    ['Li dû dengê te, ez di rê de me','Je suis en route, suivant ta voix'],
    ['Bê te di nav vê bajarê de me','Sans toi, je suis dans cette ville'],
    ['Di xewnên xwe de ez li malê me','Dans mes rêves, je suis chez moi'],
    ['Dûr im, lê bi bîra te re me','Je suis loin, mais avec ton souvenir'],
    ['Di nav bêdengiyê de ez tenê me','Au milieu du silence, je suis seul'],
    ['Li ber pencereyê tê bîra min','Près de la fenêtre, je me souviens'],
    ['Dengê te hê di guhê min','Ta voix est encore à mon oreille'],
    ['Rêya malê di xewnên min','Le chemin du foyer est dans mes rêves'],
    ['Şopa te maye di dilê min','Ta trace est restée dans mon cœur'],
    ['Şevên dirêj û çavên min','Les longues nuits et mes yeux'],
    ['Bê te sar in destên min','Sans toi, mes mains sont froides'],
    ['Ez navê te dibêjim di şevê','Je dis ton nom dans la nuit'],
    ['Baran dibare li ser vê rêyê','La pluie tombe sur ce chemin'],
    ['Bîra te tê bi dengê avê','Ton souvenir arrive avec le bruit de l’eau'],
    ['Şopa te dimîne li ber derîyê','Ta trace reste devant la porte'],
    ['Çav li rê ne heta sibê','Les yeux guettent le chemin jusqu’au matin'],
    ['Xewna min vedigere ber bi malê','Mon rêve revient vers le foyer']
  ],
  nature: [
    ['Baran dibare li ser çiyan','La pluie tombe sur les montagnes'],
    ['Dengê avê ye dengê jiyan','Le bruit de l’eau est le son de la vie'],
    ['Di nav daristanê de hezar stran','Dans la forêt, mille chansons'],
    ['Ba tê û radibe dengê gulan','Le vent vient et la voix des fleurs se lève'],
    ['Bi rojê re vedibe ev cîhan','Avec le soleil, ce monde s’ouvre'],
    ['Rengê biharê li ser daran','La couleur du printemps sur les arbres'],
    ['Dengê çem tê ji bin çiyayê','Le bruit de la rivière vient du pied de la montagne'],
    ['Ba bi hêdî digere di deştê','Le vent se promène doucement dans la plaine'],
    ['Stêrk bi hev re ne di şevê','Les étoiles sont ensemble dans la nuit'],
    ['Em li ser rê ne heta sibê','Nous sommes en chemin jusqu’au matin'],
    ['Heyv ronahiyê dide vê rêyê','La lune éclaire ce chemin'],
    ['Dilê min dimîne di biharê','Mon cœur reste au printemps'],
    ['Dûr in çiya, lê nêzîkî min','Les montagnes sont loin, mais proches de moi'],
    ['Bêhna gulan di bîra min','Le parfum des fleurs dans ma mémoire'],
    ['Rengê deştê di çavên min','La couleur de la plaine dans mes yeux'],
    ['Dengê avê di xewnên min','Le bruit de l’eau dans mes rêves'],
    ['Roj û heyv in hevalên min','Le soleil et la lune sont mes amis'],
    ['Ev rê vedigere ber bi min','Ce chemin revient vers moi']
  ],
  espoir: [
    ['Em ê careke din bibin xwedî jiyan','Nous retrouverons la vie'],
    ['Bila dengê me bigihîje cîhan','Que notre voix atteigne le monde'],
    ['Hêvî vedibe di nav dilan','L’espoir s’ouvre dans les cœurs'],
    ['Sibe tê bi rengê bihar û gulan','Demain vient aux couleurs du printemps et des fleurs'],
    ['Dest bi dest, em derbas dikin zivistan','Main dans la main, nous traversons l’hiver'],
    ['Ji nû ve dest pê dike ev stran','Cette chanson recommence'],
    ['Ji tarîtiyê em diçin ber bi rojê','De l’obscurité, nous allons vers le soleil'],
    ['Hêvî bi me re ye di vê rêyê','L’espoir nous accompagne sur ce chemin'],
    ['Ronahî tê piştî her şevê','La lumière vient après chaque nuit'],
    ['Bila kenê me vegere li malê','Que notre sourire revienne au foyer'],
    ['Em ê destê hev bigirin heta sibê','Nous nous tiendrons la main jusqu’au matin'],
    ['Bila dilê me tijî bibe ji evînê','Que notre cœur se remplisse d’amour'],
    ['Hêvî hê jî dimîne di dilê min','L’espoir demeure encore dans mon cœur'],
    ['Sibe ronak in rojên min','Demain, mes jours sont lumineux'],
    ['Rê li pêş e, bihîze dengê min','Le chemin est devant, écoute ma voix'],
    ['Xewnên mezin hene di serê min','J’ai de grands rêves en tête'],
    ['Dilê min dibêje: rabin, hevalên min','Mon cœur dit : levez-vous, mes amis'],
    ['Ronahiya sibê ye hêviya min','La lumière du matin est mon espoir']
  ],
  fete: [
    ['Dest bi dest em dikevin govendê','Main dans la main, nous entrons dans la danse'],
    ['Dengê daholê tê ji nav gundê','Le son du tambour vient du village'],
    ['Bila dengê me bilind bibe vê şevê','Que notre voix s’élève cette nuit'],
    ['Bi ken û şahî em dimînin heta sibê','Dans la joie, nous restons jusqu’au matin'],
    ['Hemû heval hatine li vê derê','Tous les amis sont venus ici'],
    ['Bila dil bilivin bi vê awazê','Que les cœurs bougent avec cette mélodie'],
    ['Li nav govendê vedibe ev jiyan','Dans la danse, cette vie s’ouvre'],
    ['Bila bi hev re bilind bibe ev stran','Que cette chanson s’élève avec nous'],
    ['Dengê me digihîje serê çiyan','Notre voix atteint le sommet des montagnes'],
    ['Şahî belav dibe di nav dilan','La fête se répand dans les cœurs'],
    ['Em bi kenê xwe xweş dikin cîhan','Avec nos sourires, nous embellissons le monde'],
    ['Bila şahî biçe ji gund heta bajaran','Que la fête aille du village aux villes'],
    ['Were nêzîk, bigire destê min','Approche, prends ma main'],
    ['Îşev li vir in hemû hevalên min','Ce soir, tous mes amis sont ici'],
    ['Bi vê awazê geş e dilê min','Cette mélodie illumine mon cœur'],
    ['Govendê bigire bi min re, yarê min','Danse avec moi, mon amour'],
    ['Bila vê şevê bifirin xewnên min','Que mes rêves s’envolent cette nuit'],
    ['Îşev bi şahiyê tijî ye dilê min','Ce soir, mon cœur est rempli de joie']
  ]
};
export const THEMES={amour:'Amour',nostalgie:'Manque & souvenirs',nature:'Nature & racines',espoir:'Espoir & liberté',fete:'Fête & amitié'};
export const STYLES={grani:'Grani',govend:'Govend / Halay',ballade:'Ballade',rap:'Rap'};
export const BANK=Object.fromEntries(Object.entries(raw).map(([theme,lines])=>[theme,lines.map(([ku,fr])=>({ku,fr,key:ending(ku)}))]));
function shuffle(list,rng) { const a=[...list]; for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
function block(pool,scheme,rng,used) {
  const groups={};for(const line of pool)(groups[line.key]??=[]).push(line);
  const keys=shuffle(Object.keys(groups).filter(k=>groups[k].length>=4),rng);
  if(keys.length<2)throw new Error('Réserve de rimes insuffisante.');
  const selected=scheme==='AAAA'?[keys[0],keys[0],keys[0],keys[0]]:scheme==='ABAB'?[keys[0],keys[1],keys[0],keys[1]]:[keys[0],keys[0],keys[1],keys[1]];
  const here=new Set();
  return Array.from({length:4},(_,i)=>{
    const available=(scheme==='libre'?pool:groups[selected[i]]).filter(l=>!here.has(l.ku));
    const fresh=available.filter(l=>!used.has(l.ku));
    const line=shuffle(fresh.length?fresh:available,rng)[0];
    here.add(line.ku);used.add(line.ku);return line;
  });
}
const intros={grani:['Hey lê, dengê dilê min!','Ô voix de mon cœur !'],govend:['Dest bi dest, hevalno!','Main dans la main, les amis !'],ballade:['Di bêdengiyê de, ez dibêjim…','Dans le silence, je dis…'],rap:['Bihîze, ev dengê min e.','Écoute, c’est ma voix.']};
const titles={amour:'Dengê evînê',nostalgie:'Şopa te',nature:'Dengê çiyan',espoir:'Ronahiya sibê',fete:'Dest bi dest'};
export function generateLyrics(config={},rng=Math.random) {
  const theme=Object.hasOwn(THEMES,config.theme)?config.theme:'amour';
  const style=Object.hasOwn(STYLES,config.style)?config.style:'grani';
  const scheme=['AABB','ABAB','AAAA','libre'].includes(config.scheme)?config.scheme:'AABB';
  const length=['court','standard','long'].includes(config.length)?config.length:'standard';
  const pool=BANK[theme], used=new Set();
  const verse1=block(pool,scheme,rng,used),chorus=block(pool,scheme,rng,used);
  const sections=[{label:'Destpêk',lines:[{ku:intros[style][0],fr:intros[style][1]}]},{label:'Bend 1',lines:verse1},{label:'Refrên',lines:chorus}];
  if(length!=='court')sections.push({label:'Bend 2',lines:block(pool,scheme,rng,used)},{label:'Refrên',lines:chorus});
  if(length==='long')sections.push({label:'Bend 3',lines:block(pool,scheme,rng,used)},{label:'Refrên',lines:chorus});
  if(style==='govend'||style==='grani')sections.push({label:'Dawî',lines:[chorus[0],chorus[0]]});
  const text=sections.map(s=>`[${s.label}]\n${s.lines.map(l=>l.ku).join('\n')}`).join('\n\n');
  const translation=sections.map(s=>`[${s.label}]\n${s.lines.map(l=>l.fr).join('\n')}`).join('\n\n');
  return {title:config.title?.trim().slice(0,120)||titles[theme],text,translation,sections,config:{theme,style,scheme,length},generatedText:text};
}
