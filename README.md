# Rêson V2 — Studio de paroles kurdes

Une application mobile et ordinateur pour trouver des rimes en **kurmanji latin**, écrire des paroles et garder ses textes.

## Nouveautés de cette mise à jour (mobile & PWA)

Cette mise à jour améliore l’existant sans rien retirer : dictionnaire, générateur, carnet et sauvegardes fonctionnent exactement comme avant, avec en plus :

- **Installation en vraie application** sur iPhone (Safari → Partager → Sur l’écran d’accueil) et Android/Chrome/Edge (bouton d’installation natif quand il est proposé par le navigateur), avec icônes `any` + `maskable`, raccourcis rapides et lancement en plein écran (`standalone`).
- **Adaptation iPhone récents** : zones sûres (encoche/Dynamic Island, barre d’accueil) prises en compte partout (`env(safe-area-inset-*)`), hauteur d’écran dynamique (`100dvh`).
- **Clavier mobile amélioré** : le champ actif reste visible à l’ouverture du clavier, la barre de navigation se masque pendant la saisie pour laisser de la place.
- **Hors connexion plus rapide et plus fiable** : le service worker sert le cache en priorité puis se met à jour en tâche de fond, avec un bandeau discret quand une nouvelle version est prête.
- **Dictionnaire** : historique des recherches récentes, bouton pour copier un mot directement.
- **Générateur** : backs/vocalises désormais mis en évidence visuellement dans les aperçus, copie rapide d’une seule partie, nouveau back « Lawo ! », nouvelle ambiance « Festif & joyeux », nouveaux contextes précis (frère, sœur, montagne, village, mariage, govend/halay, retour au pays, solitude, voyage).
- **Partage natif** (Web Share API) sur mobile en plus des exports TXT/JSON déjà existants.
- **Confirmation de sauvegarde** : le brouillon affiche discrètement « Sauvegardé » après chaque enregistrement automatique.
- Boutons et zones tactiles agrandis (44 px minimum) sur les commandes importantes du générateur.

## Démarrer rapidement

1. Décompresse le ZIP.
2. Ouvre le dossier `reson-kurdi` dans Claude Code ou ton éditeur.
3. Avec Node.js 20 ou plus récent installé, lance :

```bash
npm start
```

4. Ouvre `http://localhost:3000` sur cet ordinateur.

**Aucun `npm install`, compte ou clé API n’est nécessaire.** Le projet n’a aucune dépendance à installer. Ne lance pas l’application en double-cliquant sur `index.html` : les modules JavaScript nécessitent un serveur HTTP.

Claude Code sert à modifier le projet. L’hébergement peut être fait avec GitHub Pages ou tout hébergeur de fichiers statiques.

## Ce que contient la V2

- Base de 374 mots kurmanji avec sens français indicatifs.
- Recherche des rimes par finale, des assonances ou du lexique en kurde et en français.
- Distinction de `e/ê`, `i/î` et `u/û` pour les rimes.
- Filtres par thème et estimation du nombre de syllabes.
- Favoris et ajout de mots personnels.
- Réserve de mots à insérer dans l’éditeur.
- Générateur local : 12 thèmes, 15 contextes précis, 6 styles et 4 schémas de rimes.
- Éditeur libre, titre, clavier kurde, compteur de vers et de mots.
- Sens français des vers générés ; il ne traduit pas les modifications.
- Retour à la proposition précédente, sauvegarde du brouillon et carnet local.
- Copie, export texte UTF-8 et sauvegarde JSON de l’ensemble des créations.
- Import contrôlé qui ajoute les données sans remplacer les données existantes.
- Interface adaptative, icônes d’application et service worker pour utilisation hors connexion après un premier chargement complet.

## Composer une chanson complète

1. Choisis le thème et, lorsqu’il est proposé, un contexte précis : dernier au revoir, message sans réponse, travail et sacrifices, fins de mois, enfance modeste…
2. Tu peux ajouter un contexte libre. Les mots-clés reconnus apparaissent sous le champ et orientent la sélection de vers. Le texte libre n’est pas compris comme par une IA.
3. Dans **Voix & backs**, choisis une voix principale ou un duo, coche les vocalises et définis leur fréquence et leur placement.
4. Applique une structure prête (court, classique, complet, duo ou rap), ou ajoute tes parties à la main.
5. Appuie sur **Générer toute la chanson**, puis retravaille chaque partie.
6. Utilise **Aperçu complet** pour voir les indications de chant et les backs insérés. Sauvegarde dans le carnet ou exporte le résultat.

### Plusieurs couplets et refrains

Jusqu’à **32 parties** par chanson : intro, couplet, pré-refrain, refrain, pont, outro, backs seuls, instrumental et texte libre. Chaque partie peut être ajoutée, renommée, déplacée, dupliquée, supprimée ou régénérée isolément. Une copie peut être modifiée sans changer l’original.

Les blocs générés peuvent contenir **4, 8 ou 12 vers**. Les introductions, backs et instrumentaux ont leur propre format. Les parties sont éditables, avec une limite de 2 000 caractères chacune. Les anciens textes plus longs sont répartis en parties lors de leur reprise, sans suppression du contenu.

Le réglage **Répéter le même refrain** réutilise les paroles du premier refrain de même longueur lors d’une génération globale. Les copies restent ensuite indépendantes. **Créer des refrains différents** demande de nouvelles sélections de vers. Une réserve finie peut néanmoins produire des répétitions.

**Protéger le texte** empêche la régénération de cette partie. Les changements de voix ou de backs restent possibles. Le bouton **Annuler** revient à la dernière opération de génération ou de structure ; il ne constitue pas un historique illimité de frappe.

### Voix et backs

- Voix principale, masculine, féminine, duo alterné A/B, chœur collectif, chuchotée ou parlée/rap.
- Voix du projet ou choix spécifique par partie.
- Backs : **Hey!, Ho!, La la la, Lê lê!, Lo lo!, Wey!, Ah ah!, Oh oh!**, plus un texte personnalisé.
- Backs légers (tous les 4 vers), réguliers (tous les 2 vers), intenses (chaque vers), ou désactivés.
- Placement dans les refrains, dans toutes les parties chantées ou dans l’intro et l’outro ; un réglage local peut remplacer cette cible.
- Réponse des chœurs, écho des derniers mots ou parenthèses en fin de ligne.

Ce sont des **indications écrites de chant**, visibles dans l’aperçu et dans l’export complet. L’application ne produit ni voix chantée, ni fichier sonore, ni arrangement instrumental audio. Le tempo et l’interprétation sont des repères pour l’interprète.

### Thèmes et contextes

Amour, séparation, manque, nostalgie, trahison, argent, pauvreté, famille, exil, nature, espoir et fête. Les 15 situations plus précises enrichissent les thèmes appropriés. La réserve totale contient 234 vers avec leur sens français, en comptant les lignes de contexte.

## Comprendre le générateur

Il s’agit d’un **assemblage local de vers préécrits**, pas d’une IA générative ni d’un outil de traduction automatique. Il fonctionne sans coût d’API. Les résultats peuvent se ressembler. Le style adapte l’introduction ; les autres indications aident à préparer le chant.

Les schémas AABB, ABAB et AAAA sont respectés au niveau des finales écrites dans chaque bloc de quatre vers. Les backs sont ajoutés à part. Certaines rimes sont grammaticales et simples (par exemple « min »), à enrichir dans l’éditeur. La protection, l’édition manuelle et le choix de répétition de refrains ont priorité sur une nouvelle génération.

Le sens français appartient à la proposition initiale de chaque partie. Un avertissement apparaît après une retouche ; les nouvelles phrases ne sont pas traduites automatiquement.

Le lexique et les vers restent une base éditoriale **à faire relire par un locuteur compétent avant publication**. Les accents régionaux, la métrique et la prononciation ne sont pas modélisés. Le sorani n’est pas pris en charge. Aucun dictionnaire tiers n’a été copié ou embarqué.

## Mettre sur GitHub et publier

1. Crée un dépôt GitHub vide, par exemple `reson-kurdi`.
2. Place **le contenu du dossier du projet** à la racine du dépôt : `dist`, `scripts`, `tests`, `package.json`, etc. Le dossier `.github` doit aussi être envoyé. N’imbrique pas le tout dans un deuxième sous-dossier.
3. Envoie le code sur la branche `main` depuis Claude Code ou un client Git.
4. Dans GitHub : **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. Ouvre **Actions → Publier Rêson sur GitHub Pages → Run workflow** si le premier envoi a eu lieu avant l’activation de Pages.
6. Quand le déploiement réussit, GitHub affiche l’adresse du site. Les mises à jour envoyées sur `main` sont ensuite publiées automatiquement.

Sur un compte GitHub Free, la publication Pages est disponible pour un dépôt public. Un dépôt public rend le code lisible ; il ne donne pas aux visiteurs l’accès en écriture à ton dépôt. [Documentation officielle GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Le workflow `.github/workflows/pages.yml` vérifie les fichiers et exécute les tests avant de publier **uniquement `dist`**. Il utilise les actions officielles indiquées par GitHub. Si ta branche principale porte un autre nom, adapte `branches: [main]`.

## Autre hébergeur, dont Hostinger

Copie **le contenu de `dist`** à la racine du dossier web, souvent `public_html`. Le fichier `index.html` doit être directement dans ce dossier web. Il n’y a ni serveur Node à faire tourner en production, ni base de données, ni configuration secrète.

Tous les liens sont relatifs : l’application fonctionne aussi dans un sous-dossier comme `https://exemple.fr/reson/` ou un site GitHub Pages de projet. Active HTTPS pour l’installation et le cache hors connexion.

## Sauvegardes et confidentialité

Les données sont conservées dans le `localStorage` de ce navigateur, sous la clé `reson-kurdi-v1`. Le carnet n’est **pas synchronisé dans le cloud**. Exporte un fichier JSON depuis « Aide & sauvegardes » avant de changer d’appareil, de navigateur ou d’adresse de site. Le brouillon courant est inclus dans l’export s’il n’est pas déjà dans le carnet. Les sauvegardes JSON V2 contiennent la structure, les réglages, les voix, les backs et les protections. Les fichiers V1 restent importables. Le stockage utilise toujours la même clé pour retrouver les créations après la mise à jour. Un JSON de chanson seule peut aussi être importé depuis Aide & sauvegardes. Limite de taille : 10 Mo par fichier importé.

Un changement de domaine ou de sous-dossier d’hébergement peut demander un nouvel import. La navigation privée et le nettoyage des données du navigateur peuvent supprimer les créations. Aucun texte n’est envoyé à une API. Pas de police externe, de suivi publicitaire ou d’analytique.

## Continuer avec Claude Code

Le fichier `CLAUDE.md` résume l’architecture et les points à préserver. Tu peux commencer avec cette demande :

> Lis README.md et CLAUDE.md. Il s’agit de Rêson V2, mon dictionnaire de rimes et atelier de paroles en kurmanji. Lance le projet avec npm start. Conserve son apparence et ses fonctions actuelles. Je vais te donner les améliorations souhaitées. Garde le fonctionnement sur GitHub Pages sans dépendance obligatoire à un service payant. Avant toute modification du stockage, préserve la compatibilité de mes sauvegardes.

Pistes pour une prochaine version : relecture linguistique, davantage de mots et de vers, recherche phonétique fondée sur des données vérifiées, puis vraie IA en option. Une IA externe nécessite un serveur sécurisé pour la clé API ; **ne jamais mettre de clé dans le navigateur, dans `dist` ou dans GitHub**.

## Organisation des fichiers

| Fichier | Rôle |
|---|---|
| `dist/index.html` | Entrée et métadonnées |
| `dist/styles.css` | Interface et adaptation mobile |
| `dist/app.js` | Écrans, éditeur, stockage et exports |
| `dist/core.js` | Recherche, rimes, validation des imports |
| `dist/lexicon.js` | Mots et sens français |
| `dist/lyrics.js` | Réserve historique et moteur V1 conservé |
| `dist/themes.js` | Nouveaux thèmes, contextes et voix |
| `dist/studio.js` | Structure, génération par partie, backs et exports |
| `dist/studio-view.js` | Interface de composition |
| `dist/studio.css` | Présentation du studio |
| `dist/sw.js` | Cache hors connexion |
| `dist/manifest.webmanifest` | Installation comme application |
| `scripts/serve.mjs` | Serveur local sans dépendance |
| `scripts/check.mjs` | Vérification des fichiers statiques |
| `tests/core.test.mjs` | Recherche et compatibilité V1 |
| `tests/studio.test.mjs` | Parties, voix, backs et sauvegardes V2 |
| `.github/workflows/pages.yml` | Publication sur GitHub Pages |

```bash
npm run build
npm test
```

`build` vérifie les scripts et les ressources : les fichiers de `dist` sont directement les sources du site, aucun framework n’a besoin de compilation. Il ne faut pas supprimer ce dossier comme on le ferait avec un dossier de build généré.

## Modifier le dictionnaire de rimes

Le lexique de base vit dans `dist/lexicon.js`. Chaque catégorie est un bloc de texte avec une entrée `mot|sens` par ligne :

```js
const groups = {
  sentiments: `evîn|amour
dil|cœur
...`,
  nature: `...`,
  ...
};
```

Pour ajouter un mot au dictionnaire :

1. Ouvre `dist/lexicon.js`.
2. Ajoute une ligne `motKurmanji|sens en français` dans le bloc de catégorie qui correspond (ou crée un nouveau bloc et ajoute son libellé dans `CATEGORIES`).
3. Garde l’orthographe kurmanji latine (`ç ê î ş û`) : c’est elle qui détermine la finale utilisée pour les rimes (`ending()` dans `core.js`).
4. Relance `npm test` : le test « base sans doublons, entrées et mots personnels valides » vérifie qu’il n’y a pas de doublon et que chaque mot est valide.

Les visiteurs peuvent aussi ajouter leurs propres mots depuis l’application (bouton « Ajouter un mot ») : ces mots sont enregistrés dans leur navigateur, jamais dans le dépôt.

La réserve de vers du **générateur de paroles** est séparée du dictionnaire : elle vit dans `dist/themes.js` (thèmes, contextes précis, styles, voix, backs) et dans `dist/lyrics.js` (réserve historique + moteur V1 conservé pour compatibilité). Pour ajouter un nouveau contexte précis (par exemple un nouveau sujet de chanson), ajoute un bloc `context('id', 'Libellé', ['mots-clés'], [['vers en kurmanji', 'traduction française'], ...])` dans le thème concerné de `CONTEXTS` (`dist/themes.js`), avec au moins 4 vers. Fais toujours relire tes ajouts en kurmanji par une personne qui maîtrise la langue avant publication : la base reste éditoriale, comme le rappellent `README.md` et `CLAUDE.md`.

## Modifier les icônes

Les icônes sources sont dans `dist/` :

| Fichier | Rôle |
|---|---|
| `dist/icon.svg` | Icône vectorielle (favicon et source du design) |
| `dist/icon-192.png` | Icône d’application 192×192, utilisée aussi comme `apple-touch-icon` |
| `dist/icon-512.png` | Icône d’application 512×512 |

Le `manifest.webmanifest` déclare ces deux PNG deux fois chacun : une fois en `purpose: "any"` (icône classique) et une fois en `purpose: "maskable"` (icône recadrable en cercle/carré arrondi par Android). Le motif actuel remplit déjà tout le carré avec la couleur de fond et garde le symbole dans la zone centrale sûre : il fonctionne tel quel en maskable.

Pour changer le design :

1. Modifie `dist/icon.svg` (c’est la source la plus simple à éditer, en 64×64).
2. Exporte-le en PNG à 192×192 et 512×512 (fond opaque jusqu’aux bords, motif principal dans les 80 % centraux pour rester compatible « maskable »), et remplace `dist/icon-192.png` et `dist/icon-512.png` en gardant exactement ces noms de fichiers.
3. Cet environnement n’a pas d’outil d’image installé (pas d’ImageMagick/PIL) : exporte les PNG depuis un éditeur (Figma, Inkscape, Aperçu/Photos, un site d’export SVG→PNG) sur ta machine, puis remplace les fichiers dans `dist/`.
4. Relance `npm run build` : il vérifie que les PNG font bien 192×192 et 512×512 pixels.
5. Augmente le numéro de version du service worker (voir section suivante) pour que les appareils déjà installés téléchargent les nouvelles icônes.

## Fonctionnement de la PWA

Rêson est une Progressive Web App installable, sans dépendance ni compte :

- **`dist/manifest.webmanifest`** déclare le nom, les icônes (dont les variantes `maskable`), les couleurs (`theme_color`/`background_color`, cohérentes avec le violet et le papier de l’interface), `display: "standalone"` et des raccourcis (`shortcuts`) vers le dictionnaire, le générateur et le carnet.
- **`dist/index.html`** contient les balises Apple (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`) et un `viewport` avec `viewport-fit=cover` (encoche/Dynamic Island) et `interactive-widget=resizes-content` (clavier mobile).
- **`dist/sw.js`** met en cache les fichiers essentiels (HTML, CSS, JS, icônes, manifest) dès la première visite, puis sert le cache en priorité (rapide, fonctionne hors connexion) tout en revalidant en tâche de fond à chaque visite en ligne. Toutes les fonctions (dictionnaire, générateur, carnet) sont locales : il n’y a aucun appel réseau à une API externe, donc rien ne peut jamais afficher une erreur réseau bloquante.
- Quand une nouvelle version du site est publiée, le service worker installé la télécharge en arrière-plan puis affiche un petit bandeau « Nouvelle version de Rêson disponible » avec un bouton **Actualiser** ; rien n’est appliqué sans action de la personne qui utilise l’app.
- **Mettre à jour le cache après une modification de `dist/`** : ouvre `dist/sw.js` et change la constante `VERSION` (par exemple la date du jour). Cela crée un nouveau nom de cache et déclenche le bandeau de mise à jour chez les personnes qui ont déjà installé l’application. Si tu ajoutes un nouveau fichier dans `dist/`, ajoute-le aussi à la liste `ASSETS` du même fichier.
- **Installation** : sur Android/Chrome/Edge, un bouton « Installer Rêson » apparaît (page Aide, et une bannière discrète à la première visite) grâce à l’évènement `beforeinstallprompt`. Sur iPhone/iPad (Safari ne propose pas cet évènement), la page Aide affiche les 4 étapes manuelles (Partager → Sur l’écran d’accueil → Ajouter). Aucun faux bouton n’est jamais affiché sur iOS.
- **Hors connexion** : après un premier chargement complet, dictionnaire, générateur, carnet et bloc-notes continuent de fonctionner sans réseau (tout est local). Un petit message apparaît si la connexion se coupe ou revient, uniquement pour information.

## Vérifications de livraison

19 tests automatisés couvrent les recherches, la génération, la migration V1, les sauvegardes V2, les protections, les duplications et les backs. Ils comprennent 240 combinaisons du moteur historique et 324 combinaisons de thèmes/contextes, schémas et longueurs du studio. La syntaxe, les ressources, les icônes et le rendu HTML des commandes sont également contrôlés. Une vérification visuelle en navigateur et l’installation réelle sur iPhone/Android n’ont pas pu être réalisées dans l’environnement de livraison. Elles restent à faire sur les appareils visés. L’outil WebMCP de recherche est une amélioration progressive ; aucun contexte navigateur WebMCP compatible n’était disponible pour le valider.

L’éventuel dossier `.openai` dans le projet d’origine ne concerne que son premier hébergement ; il est exclu du ZIP portable. Le projet exporté n’en dépend pas.

Références de langue pour poursuivre la relecture : [Institut kurde de Paris](https://www.institutkurde.org/en/language/) et [références linguistiques](https://www.institutkurde.org/en/language/werger.php). Ces liens ne constituent pas une validation du contenu de l’application.
