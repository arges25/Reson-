// Base éditoriale V1. Les sens sont indicatifs, les variantes régionales ne sont pas exhaustives.
const groups = {
  sentiments: `evîn|amour
dil|cœur
can|âme, vie
hezkirin|aimer
hezkirî|aimé
evîndar|amoureux
evîndarî|amour, passion
yar|bien-aimé
dildar|aimé, amoureux
şîrîn|doux, sucré
şîrînî|douceur
xem|chagrin
xemgîn|triste
xemgînî|tristesse
şîn|deuil ; bleu
kîn|rancune
brîn|blessure
birîndar|blessé
keser|peine, chagrin
êş|douleur
êşîn|douloureux
jan|douleur
derd|souffrance, souci
derdêş|souffrant
hesret|nostalgie, manque
bêrî|nostalgie
bêrîkirin|ressentir le manque
xewn|rêve
xeyal|imagination, rêverie
hêvî|espoir
aram|calme
aramî|calme, sérénité
aştî|paix
şad|joyeux
şadî|joie
kêfxweş|content
kêfxweşî|joie, plaisir
bextewar|heureux
bextewarî|bonheur
ken|rire
girî|pleurs
girîn|pleurer
kenîn|rire
azad|libre
azadî|liberté
serbest|libre, indépendant
serbestî|liberté
tenê|seul
tenêtî|solitude
heval|ami
hevaltî|amitié
soz|promesse
bawer|convaincu, croyant
bawerî|confiance, croyance
vîn|volonté
berxwedan|résistance`,
  nature: `bihar|printemps
bahar|printemps (variante)
havîn|été
payîz|automne
zivistan|hiver
baran|pluie
berf|neige
ba|vent
bahoz|tempête
roj|soleil, jour
heyv|lune
stêr|étoile
stêrk|étoile
ezman|ciel
ewr|nuage
ronahî|lumière
ronak|lumineux
tarî|sombre
tarîtî|obscurité
çiya|montagne
çem|rivière
av|eau
kanî|source
derya|mer
gol|lac
pêl|vague
ax|terre
erd|sol, terre
kevir|pierre
zinar|rocher
dar|arbre, bois
daristan|forêt
pel|feuille
gul|fleur, rose
gulistan|roseraie
sosin|lys
nêrgiz|narcisse
bax|jardin
baxçe|jardin
zevî|champ
deşt|plaine
newal|vallée
gelî|vallée, gorge
gund|village
war|lieu, pays
bajar|ville
welat|pays
welatî|habitant, citoyen
nîştiman|patrie
rê|chemin
rêwî|voyageur
rêwîtî|voyage
bilind|haut
kûr|profond
dûr|loin
nêzîk|proche
germ|chaud
sar|froid
hişk|sec
şil|mouillé
kesik|vert
kesk|vert
sor|rouge
zer|jaune
spî|blanc
reş|noir
reng|couleur
rengîn|coloré
bêhn|odeur, souffle
bêhnxweş|parfumé
agir|feu
pêt|flamme
dûman|fumée
tofan|tempête
çûk|oiseau
bilbil|rossignol
teyr|oiseau
per|aile, plume
hesp|cheval
şêr|lion
gur|loup
pez|petit bétail
masî|poisson`,
  musique: `stran|chanson
stranbêj|chanteur
deng|voix, son
dengbêj|chanteur de tradition orale
awaz|mélodie
saz|instrument à cordes
tembûr|luth à long manche
def|tambour sur cadre
erbane|tambour sur cadre
dahol|gros tambour
zurna|hautbois traditionnel
govend|danse collective
dîlan|danse, fête dansante
delîlo|danse delîlo
şahî|fête, joie
dawet|mariage, noce
aheng|harmonie, fête
şevbêrk|veillée
helbest|poème
helbestvan|poète
malik|vers de poésie
peyiv|mot
gotin|dire ; parole
gotar|discours, article
ziman|langue
çîrok|histoire, conte
çîrokbêj|conteur
çîrokvan|auteur de récits
hunermend|artiste
huner|art
hunermendî|art, pratique artistique
ritm|rythme
kilam|chant
qafîye|rime
şair|poète`,
  quotidien: `jiyan|vie
mirov|personne, être humain
mirovatî|humanité
jin|femme
mêr|homme
zarok|enfant
zaroktî|enfance
dayik|mère
bav|père
biray|frère
bira|frère
xwişk|sœur
mal|maison, foyer
derî|porte
pencere|fenêtre
dîwar|mur
ban|toit
ode|pièce
çarşî|marché
nan|pain
xwarin|manger ; nourriture
vexwarin|boire ; boisson
şîr|lait
çay|thé
şekir|sucre
xwê|sel
dest|main
çav|œil
ser|tête
rû|visage
por|cheveux
ling|jambe
pê|pied
dev|bouche
guh|oreille
lêv|lèvre
xwîn|sang
hestî|os
nêv|taille, milieu
nav|nom
navdar|célèbre
baş|bon
xweş|agréable, bon
xweşik|beau
ciwan|jeune ; beau
ciwanî|jeunesse
mezin|grand
biçûk|petit
dirêj|long
kurt|court
nû|nouveau
kevin|ancien
rast|vrai, droit
rastî|vérité
derew|mensonge
pak|propre, pur
paş|arrière
pêş|avant
rojbaş|bonjour
spas|merci
silav|salut
şev|nuit
şevbaş|bonne nuit
beyan|matin
êvar|soir
nîvro|midi
dem|temps, moment
sal|année
meh|mois
hefte|semaine
rojek|un jour
îro|aujourd’hui
sibe|demain ; matin
duh|hier
niha|maintenant
herdem|toujours
car|fois
carek|une fois
demsal|saison
salveger|anniversaire
yek|un
du|deux
sê|trois
çar|quatre
pênc|cinq
şeş|six
heft|sept
heşt|huit
neh|neuf
deh|dix
sed|cent
hezar|mille
dîyar|visible, évident
dîlan|danse
kar|travail
karvan|caravane
cotkar|agriculteur
mamoste|enseignant
xwendekar|étudiant
pirtûk|livre
defter|cahier
qelem|stylo
dibistan|école
zanîn|savoir
zanyar|savant
zanyarî|connaissance
fêr|instruit, habitué
şop|trace
bîr|mémoire, pensée
bîranîn|souvenir
bîrhatin|souvenir, réminiscence
armanc|but
encam|résultat
destpêk|début
dawî|fin
ber|devant ; fruit
dengdar|sonore, renommé
dost|ami
meriv|parent, proche
xizm|parent, proche
malbat|famille
cîran|voisin
cîhan|monde`,
  societe: `pere|argent
zêr|or
zîv|argent (métal)
xizan|pauvre
xizanî|pauvreté
hejar|pauvre
hejarî|pauvreté
dewlemend|riche
dewlemendî|richesse
rûmet|dignité, respect
bêkar|sans emploi
bêkarî|chômage
bazirgan|commerçant
bazirganî|commerce
borç|dette
kirê|loyer, location
berjewendî|intérêt, avantage
têkoşîn|lutte, effort
karker|ouvrier, travailleur
ked|effort, labeur
cudabûn|séparation
dûrbûn|éloignement
bêdeng|silencieux
bêdengî|silence
bersiv|réponse
peyam|message
xapandin|tromper
dilşikestî|au cœur brisé`,
  actions: `hatin|venir
çûn|aller
man|rester
bûn|être, devenir
kirin|faire
dîtin|voir
bihîstin|entendre
guhdarî|écoute
xwendin|lire, étudier
nivîsîn|écrire
fêmkirin|comprendre
fêrkirin|enseigner
fêrbûn|apprendre
gerîn|se promener
geriyan|circuler, se promener
bezîn|courir
revîn|s’enfuir
rabûn|se lever
rûniştin|s’asseoir
razan|être couché, dormir
raketin|se coucher
xew|sommeil
vegerîn|revenir
vekirin|ouvrir
girtin|prendre, fermer
dan|donner
stendin|recevoir, prendre
xwestin|vouloir
karîn|pouvoir
bihartin|passer
borîn|passer
jiyîn|vivre
mirin|mourir
mayîn|rester
şewitîn|brûler
şandin|envoyer
parastin|protéger
avakirin|construire
hilatin|se lever (soleil)
ketin|tomber
hilgirtin|porter, soulever
lîstin|jouer
çandin|semer
meşîn|marcher
peyivîn|parler
gotûbêj|discussion
xebat|travail, effort
alîkarî|aide
hevkar|collègue
hevkarî|collaboration`
};
const seen = new Set();
export const LEXICON = Object.entries(groups).flatMap(([category,text]) => text.split('\n').map(line=> {
  const [word,meaning]=line.split('|'); return {word,meaning,category};
})).filter(entry=>{if(seen.has(entry.word))return false;seen.add(entry.word);return true;});
export const CATEGORIES = {all:'Tous les thèmes',sentiments:'Amour & émotions',nature:'Nature & voyages',musique:'Musique & poésie',quotidien:'Vie quotidienne',societe:'Vie & société',actions:'Actions',personnel:'Mes mots'};
