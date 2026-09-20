import { BANK } from './lyrics.js';
import { ending, foldSearch } from './core.js';

export const THEMES={amour:'Amour & passion',separation:'Séparation & rupture',manque:'Manque & absence',nostalgie:'Souvenirs & nostalgie',trahison:'Trahison & déception',argent:'Argent & ambition',pauvrete:'Pauvreté & dignité',famille:'Famille & gratitude',exil:'Exil & distance',nature:'Nature & racines',espoir:'Espoir & liberté',fete:'Fête & amitié'};
export const STYLES={grani:'Grani',govend:'Govend / Halay',sallama:'Sallama',ballade:'Ballade',rap:'Rap',acoustique:'Acoustique'};
export const MOODS={doux:'Doux & intime',triste:'Triste & fragile',nostalgique:'Nostalgique',energique:'Énergique',colere:'Colère contenue',fier:'Fier & déterminé',festif:'Festif & joyeux'};
export const VOICES={inherit:'Voix du projet',solo:'Voix principale',male:'Voix masculine',female:'Voix féminine',duet:'Duo alterné',choir:'Chœur collectif',whisper:'Voix chuchotée',spoken:'Parlé / rap'};
export const TYPES={intro:'Intro',verse:'Couplet',prechorus:'Pré-refrain',chorus:'Refrain',bridge:'Pont',outro:'Outro',backs:'Backs seuls',instrumental:'Instrumental',free:'Texte libre'};
export const ADLIBS={hey:'Hey!',ho:'Ho!',lala:'La la la',le:'Lê lê!',lo:'Lo lo!',lawo:'Lawo!',wey:'Wey!',aha:'Ah ah!',oh:'Oh oh!'};
export const TITLES={amour:'Dengê evînê',separation:'Piştî te',manque:'Li benda te',nostalgie:'Şopa te',trahison:'Sozên şikestî',argent:'Ji bo sibê',pauvrete:'Destên vala',famille:'Mala me',exil:'Dûr ji malê',nature:'Dengê çiyan',espoir:'Ronahiya sibê',fete:'Dest bi dest'};

const newLines={
  separation:[
    ['Tu çûyî, bêdeng ma dilê min','Tu es parti, mon cœur est resté silencieux'],
    ['Li pişt te man gotinên min','Mes mots sont restés derrière toi'],
    ['Li ser vê rêyê tenê ne gavên min','Sur ce chemin, mes pas sont seuls'],
    ['Êdî vala ne destên min','Désormais mes mains sont vides'],
    ['Ev dawî nîne, dibêje dilê min','Ce n’est pas la fin, dit mon cœur'],
    ['Ji nû ve dest pê dikin rojên min','Mes jours recommencent'],
    ['Gotinên dawî man li ber derîyê','Les dernières paroles sont restées devant la porte'],
    ['Tu çûyî bê veger di nav şevê','Tu es parti sans retour dans la nuit'],
    ['Ez li dû te nameşîm di vê rêyê','Je ne te suivrai pas sur ce chemin'],
    ['Ev dil hê fêr dibe ji evînê','Ce cœur apprend encore de l’amour'],
    ['Bila jan kêm bibe heta sibê','Que la douleur diminue jusqu’au matin'],
    ['Ez xwe dibînim di ronahiya rojê','Je me retrouve dans la lumière du jour']
  ],
  manque:[
    ['Cihê te vala ye li cem min','Ta place est vide auprès de moi'],
    ['Her şev navê te li ser lêvên min','Chaque nuit, ton nom est sur mes lèvres'],
    ['Dengê te winda ye ji rojên min','Ta voix manque à mes journées'],
    ['Tiştek ji te maye di dilê min','Quelque chose de toi reste dans mon cœur'],
    ['Li benda te ne her du çavên min','Mes deux yeux t’attendent'],
    ['Bê te bêdeng e mala min','Sans toi, ma maison est silencieuse'],
    ['Ez li benda dengê te me di şevê','J’attends ta voix dans la nuit'],
    ['Bê te dem dirêj dibe li malê','Sans toi, le temps s’allonge à la maison'],
    ['Bîra te tê bi her dengê derîyê','Je pense à toi à chaque bruit de la porte'],
    ['Li dû navê te digerim di stranê','Je cherche ton nom dans la chanson'],
    ['Hêvîya vegera te ye di vê rêyê','L’espoir de ton retour est sur ce chemin'],
    ['Dengê min bigihîje te heta sibê','Que ma voix t’atteigne avant le matin']
  ],
  trahison:[
    ['Sozên te şikestin li ber çavên min','Tes promesses se sont brisées sous mes yeux'],
    ['Derewên te giran in li ser dilê min','Tes mensonges pèsent sur mon cœur'],
    ['Bi rastiyê sax dibe dilê min','Avec la vérité, mon cœur guérit'],
    ['Êdî naxapînin min gotinên te yên şîrîn','Tes paroles douces ne me trompent plus'],
    ['Rastî bibe hevala min','Que la vérité soit mon amie'],
    ['Ez ê ji nû ve ava bikim jiyana min','Je reconstruirai ma vie'],
    ['Bawerî ma li pişt derîyê','La confiance est restée derrière la porte'],
    ['Ez rastiyê dibînim piştî vê şevê','Je vois la vérité après cette nuit'],
    ['Sozek vala winda dibe di bayê êvarê','Une promesse vide se perd dans le vent du soir'],
    ['Ez ê bê te berdewam bikim di vê rêyê','Je continuerai sans toi sur ce chemin'],
    ['Rastî ronahiyê dide vê çîrokê','La vérité éclaire cette histoire'],
    ['Bila dilê min sax bibe bi demê','Que mon cœur guérisse avec le temps']
  ],
  argent:[
    ['Ji bo sibê dixebitin destên min','Mes mains travaillent pour demain'],
    ['Xewnên mezin hene di serê min','J’ai de grands rêves en tête'],
    ['Dixwazim aram bin rojên min','Je veux des journées paisibles'],
    ['Perê zêde nabîne nirxê dilê min','L’argent en plus ne mesure pas la valeur de mon cœur'],
    ['Nav û nîşan naguhêzin koka min','Le nom et le rang ne changent pas mes racines'],
    ['Bila nan hebe li ser maseya min','Qu’il y ait du pain sur ma table'],
    ['Her sibeh ez radibim ji bo xebatê','Chaque matin, je me lève pour travailler'],
    ['Xewnên mezin bi min re ne di vê rêyê','De grands rêves m’accompagnent sur ce chemin'],
    ['Perê cîhanê nagire cihê evînê','Tout l’argent du monde ne remplace pas l’amour'],
    ['Ji bo malbata xwe ez diçim ber bi rojê','Pour ma famille, je vais vers le jour'],
    ['Nanê helal xweş e li malê','Le pain gagné honnêtement est bon au foyer'],
    ['Ez koka xwe ji bîr nakim di vê rêyê','Je n’oublie pas mes racines sur ce chemin']
  ],
  pauvrete:[
    ['Perê min kêm e, lê mezin e dilê min','J’ai peu d’argent, mais mon cœur est grand'],
    ['Ji xebatê westiyayî ne destên min','Mes mains sont fatiguées du travail'],
    ['Li ser sifreyê kêm e nanê min','Sur la table, mon pain est rare'],
    ['Bi rûmetê derbas dibin rojên min','Mes jours passent dans la dignité'],
    ['Tu nikarî bi pere bipîvî nirxê min','Tu ne peux pas mesurer ma valeur en argent'],
    ['Hêvî her dimîne di dilê min','L’espoir reste toujours dans mon cœur'],
    ['Agir kêm e di vê zivistanê','Le feu est faible dans cet hiver'],
    ['Em nanê xwe parve dikin li malê','Nous partageons notre pain à la maison'],
    ['Destên me vala ne, em li ser vê rêyê','Nos mains sont vides, nous sommes sur ce chemin'],
    ['Bila zarok nebin birçî heta sibê','Que les enfants n’aient pas faim jusqu’au matin'],
    ['Rûmeta mirovan nayê firotin bi pereyê','La dignité humaine ne se vend pas pour de l’argent'],
    ['Em hêviyê diparêzin di vê şevê','Nous protégeons l’espoir dans cette nuit']
  ],
  famille:[
    ['Destên dayika min di bîra min','Les mains de ma mère sont dans ma mémoire'],
    ['Dengê bavê min dimîne di dilê min','La voix de mon père reste dans mon cœur'],
    ['Malbata min e hêza min','Ma famille est ma force'],
    ['Bi we re geş in rojên min','Avec vous, mes jours sont lumineux'],
    ['Ji bo we ne hemû stranên min','Toutes mes chansons sont pour vous'],
    ['Spasiya we ye di her gotina min','Ma gratitude pour vous est dans chacun de mes mots'],
    ['Dengê zarokan tijî dike vê malê','La voix des enfants remplit cette maison'],
    ['Dayê, destê te ye ronahiya vê rêyê','Maman, ta main éclaire ce chemin'],
    ['Bavê, gotina te bi min re ye heta sibê','Papa, tes paroles m’accompagnent jusqu’au matin'],
    ['Em li dora hev in vê êvarê','Nous sommes réunis ce soir'],
    ['Dil bi dil em dimînin li malê','Cœur contre cœur, nous restons au foyer'],
    ['Ev sofra tijî ye ji evînê','Cette table est pleine d’amour']
  ],
  exil:[
    ['Dûr ji welêt derbas dibin rojên min','Mes jours passent loin du pays'],
    ['Di çenteyê de mane bîranînên min','Mes souvenirs restent dans la valise'],
    ['Zimanê dayikê ye dengê min','La langue maternelle est ma voix'],
    ['Her xewn vedigere ber bi gundê min','Chaque rêve retourne vers mon village'],
    ['Du cîhan hene di dilê min','Il y a deux mondes dans mon cœur'],
    ['Li rêya vegerê ne çavên min','Mes yeux guettent le chemin du retour'],
    ['Li vî bajarî ez dibêjim çîroka xwe','Dans cette ville, je raconte mon histoire'],
    ['Welatê min di xewnên min de ye her şevê','Mon pays est dans mes rêves chaque nuit'],
    ['Bêhna nanê dayikê tê bi bîra malê','Le parfum du pain de ma mère accompagne le souvenir du foyer'],
    ['Ez navê gundê xwe dinivîsim di stranê','J’écris le nom de mon village dans la chanson'],
    ['Bila sînor rê nedin vê dûrbûnê','Que les frontières ne nourrissent pas cet éloignement'],
    ['Rêya me dirêj e, em diçin ber bi sibê','Notre chemin est long, nous avançons vers le matin']
  ]
};
const rows=lines=>lines.map(([ku,fr])=>({ku,fr,key:ending(ku)}));
export const POOLS={...BANK,...Object.fromEntries(Object.entries(newLines).map(([k,v])=>[k,rows(v)]))};

// Contextes finis et transparents, pas de compréhension générative d'un prompt libre.
const context=(id,label,keywords,lines)=>({id,label,keywords,lines:rows(lines)});
export const CONTEXTS={
  amour:[context('debut','Premier amour',['rencontre','premier amour'],[
    ['Di wê rojê de dest pê kir evîn','Ce jour-là, l’amour a commencé'],['Kenê te bû bîranîneke şîrîn','Ton sourire est devenu un doux souvenir'],['Cara yekem dengê te ket dilê min','La première fois, ta voix est entrée dans mon cœur'],['Ji wê rojê guherîn rojên min','Depuis ce jour, mes journées ont changé']
  ])],
  separation:[
    context('adieu','Le dernier au revoir',['adieu','quitte','rupture','separe'],[
      ['Te got xatirê te li ber derîyê','Tu as dit au revoir devant la porte'],['Sozên me man di nav wê şevê','Nos promesses sont restées dans cette nuit'],['Nameya dawî di destê min','La dernière lettre est dans ma main'],['Piştî xatirê te şikest dilê min','Après ton au revoir, mon cœur s’est brisé']
    ]),context('reconstruire','Se reconstruire après la rupture',['reconstruire','tourner la page','repartir'],[
      ['Ez ji nû ve fêr dibim rêya jiyanê','Je réapprends le chemin de la vie'],['Ez careke din dikarim bikenim li ber rojê','Je peux de nouveau sourire au soleil'],['Êdî ji bo xwe ne gavên min','Désormais mes pas sont pour moi'],['Hêdî hêdî sax dibe dilê min','Peu à peu, mon cœur guérit']
    ]),context('distance','Deux chemins qui se séparent',['distance','chemins','differents'],[
      ['Rêya te cuda bû ji rêya min','Ton chemin s’est séparé du mien'],['Êdî te nabînin çavên min','Mes yeux ne te voient plus'],['Her yek ji me dimeşe di rêyekê','Chacun de nous marche sur un chemin'],['Em bûn du deng di nav vê şevê','Nous sommes devenus deux voix dans cette nuit']
    ])
  ],
  manque:[
    context('message','Un message sans réponse',['message','telephone','reponse','appel'],[
      ['Peyama min ma bê bersiv di şevê','Mon message est resté sans réponse dans la nuit'],['Ez li benda dengê te me heta sibê','J’attends ta voix jusqu’au matin'],['Telefon bêdeng e li cem min','Le téléphone est silencieux à côté de moi'],['Li ser ekranê mane çavên min','Mes yeux restent fixés sur l’écran']
    ]),context('nuits','Les nuits sans toi',['nuit','seul','insomnie'],[
      ['Xew ji çavên min dûr e vê şevê','Le sommeil est loin de mes yeux cette nuit'],['Cihê te vala dimîne heta sibê','Ta place reste vide jusqu’au matin'],['Bê te tarî ne şevên min','Sans toi, mes nuits sont sombres'],['Xewna vegera te ye xewna min','Le rêve de ton retour est mon rêve']
    ]),context('retour','Attendre son retour',['retour','attendre','revenir'],[
      ['Her deng min radike li ber derîyê','Chaque bruit me fait me lever vers la porte'],['Dibêjim belkî tu vegerî vê êvarê','Je me dis que tu reviendras peut-être ce soir'],['Li ser rêya te ne çavên min','Mes yeux sont sur ton chemin'],['Ji bo te vekirî ne destên min','Mes bras sont ouverts pour toi']
    ]),context('tenêtî','La solitude au quotidien',['solitude','seul','tenê'],[
      ['Li malê an li derve, ez tenê me','Chez moi ou dehors, je suis seul'],['Tenêtî bûye hevala min a her rojê','La solitude est devenue mon amie de chaque jour'],['Dilê min diaxive, lê kes namîne','Mon cœur parle, mais personne ne reste'],['Ez li benda dengekî me di vê bêdengiyê de','J’attends une voix dans ce silence']
    ])
  ],
  argent:[
    context('travail','Travail et sacrifices',['travail','sacrifice','salaire','boulot'],[
      ['Berî rojê ez radibim ji bo xebatê','Je me lève avant le soleil pour travailler'],['Tiştek ji hêzê dimîne heta sibê','Il reste un peu de force jusqu’au matin'],['Ji her rojê westiyayîtir in destên min','Mes mains sont chaque jour plus fatiguées'],['Ji bo malbatê ne hemû hewlên min','Tous mes efforts sont pour ma famille']
    ]),context('amour','L’argent ne remplace pas l’amour',['argent ou amour','acheter','or','bonheur'],[
      ['Zêr nagire cihê destê te di destê min','L’or ne remplace pas ta main dans la mienne'],['Bi pere nayê kirîn dilê min','Mon cœur ne s’achète pas avec de l’argent'],['Perê dinyayê nagire cihê evînê','L’argent du monde ne remplace pas l’amour'],['Kenê te bêtir hêja ye ji zêrê','Ton sourire est plus précieux que l’or']
    ]),context('reussite','Réussir sans oublier ses racines',['reussir','reussite','riche','ambition'],[
      ['Bilind bibim jî, koka min li wê axê','Même si je m’élève, mes racines restent dans cette terre'],['Ez nanê xwe parve dikim li malê','Je partage mon pain au foyer'],['Rojên teng hê di bîra min','Les jours difficiles sont encore dans ma mémoire'],['Ji bo xewnên xwe dimeşin gavên min','Mes pas avancent pour mes rêves']
    ])
  ],
  pauvrete:[
    context('finmois','Des fins de mois difficiles',['fin de mois','facture','loyer','dette'],[
      ['Bê pere em digihîjin dawiya mehê','Sans argent, nous arrivons à la fin du mois'],['Nan kêm e, lê evîn heye li malê','Le pain est rare, mais il y a de l’amour au foyer'],['Hesabên me giran in li ser milên min','Nos factures pèsent sur mes épaules'],['Ji bo nanê sibe dixebitin destên min','Mes mains travaillent pour le pain de demain']
    ]),context('dignite','Peu d’argent, beaucoup de dignité',['dignite','respect','fierte','valeur'],[
      ['Rûmeta min nayê pîvan bi pereyê','Ma dignité ne se mesure pas à l’argent'],['Ez serê xwe bilind digirim di vê rêyê','Je garde la tête haute sur ce chemin'],['Dest vala ne, lê pak e dilê min','Les mains sont vides, mais mon cœur est pur'],['Pere nîne pîvana nirxê min','L’argent n’est pas la mesure de ma valeur']
    ]),context('enfance','Une enfance modeste',['enfance','enfant','modeste','grandir'],[
      ['Di maleke biçûk de me parve dikir jiyan','Dans une petite maison, nous partagions la vie'],['Li şûna pere me hebûn xewn û stran','À la place de l’argent, nous avions des rêves et des chansons'],['Rojên zaroktiyê ne di bîra min','Les jours d’enfance sont dans ma mémoire'],['Nanê dayikê hê germ e di dilê min','Le pain de ma mère est encore chaud dans mon cœur']
    ])
  ],
  famille:[context('dayik','Merci à ma mère',['mere','maman','dayik'],[
    ['Dayê, bi destên te geş bû jiyana min','Maman, tes mains ont illuminé ma vie'],['Dengê te hê aram dike dilê min','Ta voix apaise encore mon cœur'],['Spas ji te re, dayê, ji bo her rojê','Merci maman pour chaque journée'],['Destê te ye ronahiya vê malê','Ta main est la lumière de ce foyer']
  ]),context('bira','Un frère précieux',['frere','frère','bira'],[
    ['Bira, tu yî destê min ê rast','Frère, tu es ma main droite'],['Em mezin bûn bi hev re li vî warî','Nous avons grandi ensemble en ce lieu'],['Tu li kêleka min î di her rojê de','Tu es à mes côtés chaque jour'],['Du bira ne em, heta dawiya rê','Nous sommes deux frères, jusqu’au bout du chemin']
  ]),context('xwişk','Une sœur précieuse',['soeur','sœur','xwişk'],[
    ['Xwişka min, tu yî ronahiya malê','Ma sœur, tu es la lumière de la maison'],['Bi kenê te geş dibin rojên min','Avec ton sourire, mes jours s’illuminent'],['Tu bûyî hevala dilê min','Tu es devenue l’amie de mon cœur'],['Her tim di bîra min de ye rûyê te','Ton visage reste toujours dans ma mémoire']
  ])],
  exil:[context('welat','Loin de son pays',['pays','exil','welat','immigration'],[
    ['Welatê min her dijî di dilê min','Mon pays vit toujours dans mon cœur'],['Dûr im, lê bi min re ye zimanê min','Je suis loin, mais ma langue est avec moi'],['Ez di xewnê de vedigerim ber bi malê','En rêve, je retourne vers le foyer'],['Rêya vegerê dibînim di ronahiya heyvê','Je vois le chemin du retour à la lumière de la lune']
  ]),context('retour','Le retour au pays natal',['retour au pays','revenir au pays','rentrer au pays'],[
    ['Ez vedigerim ber bi welatê xwe','Je retourne vers mon pays'],['Piştî salan, dibînim gundê xwe','Après des années, je revois mon village'],['Deriyê malê vedibe ji bo min','La porte de la maison s’ouvre pour moi'],['Welat li benda min bû her dem','Le pays m’a attendu tout ce temps']
  ]),context('diaspora','Grandir loin du pays natal',['diaspora','deuxieme generation','loin de la maison'],[
    ['Ez li vir hatim dinê, dûr ji welêt','Je suis né ici, loin du pays'],['Zimanê dayikê hîn dijî di min de','La langue maternelle vit encore en moi'],['Du cîhan hene di jiyana min','Il y a deux mondes dans ma vie'],['Kok li wir in, dil li vir e','Les racines sont là-bas, le cœur est ici']
  ])],
  trahison:[],
  nostalgie:[context('rêwîtî','Le voyage et la route',['voyage','route','chemin'],[
    ['Ez di rê de me, bê armanc, bê deng','Je suis en chemin, sans but, sans bruit'],['Her bajarek li pey xwe dihêle bîranînek','Chaque ville laisse derrière elle un souvenir'],['Çenteyek li ser milê min, dinya li ber min e','Un sac sur mon épaule, le monde devant moi'],['Rêwîtiya jiyanê hîn berdewam e','Le voyage de la vie continue encore']
  ])],
  nature:[context('çiya','Le sommet de la montagne',['montagne','çiya','sommet'],[
    ['Li serê çiya, dinya ye vekirî','Au sommet de la montagne, le monde est ouvert'],['Berf spî ye li ser wan zinaran','La neige est blanche sur ces rochers'],['Dengê min diçe heta gelî','Ma voix va jusqu’à la vallée'],['Çiya bilind in, mîna xewnên min','Les montagnes sont hautes, comme mes rêves']
  ]),context('gund','Le village natal',['village','gund'],[
    ['Gundê me biçûk e, lê dil mezin e','Notre village est petit, mais le cœur est grand'],['Kolanên gund tijî ne bi bîranînan','Les ruelles du village sont pleines de souvenirs'],['Dengê çûkan tê ji ser banan','Le chant des oiseaux vient des toits'],['Ez ê venegerim, gund li dilê min e','Même sans y retourner, le village est dans mon cœur']
  ])],
  espoir:[],
  fete:[context('dawet','Le jour du mariage',['mariage','dawet','noce'],[
    ['Îro roja dawetê ye, bila şahî be','Aujourd’hui c’est le jour du mariage, que la joie soit'],['Bûk û zava li ber çavên me ne','La mariée et le marié sont devant nos yeux'],['Dahol lê dixe, govend dest pê dike','Le tambour résonne, la danse commence'],['Bila vê malê her şahî be','Que cette maison soit toujours dans la joie']
  ]),context('govend','La danse, govend et halay',['danse','govend','halay'],[
    ['Dest bi dest, em digirin govendê','Main dans la main, nous tenons la danse'],['Lingên me li erdê, dilê me li ezmanan','Nos pieds sur terre, notre cœur au ciel'],['Her gav bi pêş ve diçe vê rêzê','La ligne avance toujours en cadence'],['Dengê zurnê digihîje her gund û bajaran','Le son de la zurna atteint chaque village et chaque ville']
  ])]
};
const keywords={amour:['amour','aimer','evin','passion'],separation:['separation','rupture','quitte','adieu'],manque:['manque','absence','absent','attente'],nostalgie:['souvenir','nostalgie','passe'],trahison:['trahison','mensonge','trompe','deception'],argent:['argent','richesse','riche','ambition','salaire'],pauvrete:['pauvrete','pauvre','misere','dette','fin de mois'],famille:['famille','mere','maman','bav','dayik','pere de famille'],exil:['exil','pays','immigration','loin de chez moi'],nature:['nature','montagne','ciya','baran','pluie'],espoir:['espoir','liberte','avenir','hevi'],fete:['fete','danse','mariage','govend','amitie']};
function contains(text,word){return (' '+text.replace(/[^a-z0-9]+/g,' ')+' ').includes(' '+foldSearch(word).replace(/[^a-z0-9]+/g,' ')+' ');}
export function detectContext(text=''){
  const q=foldSearch(text).slice(0,1000),hits=[];
  for(const [theme,words] of Object.entries(keywords)){
    let score=words.filter(w=>contains(q,w)).length;
    const situations=(CONTEXTS[theme]||[]).map(c=>({c,score:c.keywords.filter(w=>contains(q,w)).length})).filter(x=>x.score).sort((a,b)=>b.score-a.score);
    score+=situations.reduce((n,s)=>n+s.score,0);
    if(score)hits.push({theme,label:THEMES[theme],score,situation:situations[0]?.c.id||'general'});
  }
  return hits.sort((a,b)=>b.score-a.score).slice(0,3);
}
export function poolFor(config){
  const theme=Object.hasOwn(THEMES,config.theme)?config.theme:'amour';
  const detected=detectContext(config.context);
  const situation=CONTEXTS[theme]?.find(c=>c.id===config.situation)||CONTEXTS[theme]?.find(c=>c.id===detected.find(h=>h.theme===theme)?.situation);
  const primary=POOLS[theme].map(l=>({...l,priority:1}));
  const focused=(situation?.lines||[]).map(l=>({...l,priority:5}));
  const context=detected.filter(h=>h.theme!==theme).slice(0,2);
  const secondary=context.flatMap(h=>(CONTEXTS[h.theme]?.find(c=>c.id===h.situation)?.lines||POOLS[h.theme]).map(l=>({...l,priority:2})));
  const map=new Map();for(const line of [...primary,...secondary,...focused])map.set(line.ku,line);
  return [...map.values()];
}
