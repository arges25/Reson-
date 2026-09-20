# Rêson V2 — guide de reprise

## Objectif
Application autonome de rimes et de rédaction de chansons en kurmanji latin, interface française, adaptée au smartphone et au bureau. L’utilisateur souhaite pouvoir poursuivre le développement dans Claude Code et publier sur GitHub.

## Architecture
- HTML/CSS/JavaScript ES modules, aucun framework, aucune dépendance.
- `dist/` contient les sources publiques écrites à la main : ne pas l’effacer.
- `npm start` : serveur de développement Node sans dépendance, port 3000.
- `npm run build` : contrôle syntaxique et présence des ressources.
- `npm test` : tests de recherche, voyelles kurdes, imports et combinaisons de génération.
- GitHub Pages publie `dist/` via le workflow fourni.

## Principes à préserver
- Conserver la distinction phonologique approximée par les graphies `e/ê`, `i/î`, `u/û`. Le mode de recherche tolérant peut ignorer les diacritiques ; le classement des rimes ne doit pas les supprimer.
- La V2 utilise une base lexicale finie avec sens français indicatifs. Ne pas annoncer un dictionnaire exhaustif ou certifié.
- Le générateur local assemble des vers préécrits. Ne pas le présenter comme une IA. Respecter la cohérence des thèmes, les schémas de quatre vers et l’affichage des limites.
- La traduction est le sens français des vers initiaux. Ne pas prétendre traduire automatiquement les retouches.
- Aucun appel à une API externe pour lire ou générer les paroles.
- Ne pas effacer les données lors des mises à jour. Préserver `reson-kurdi-v1` et l’import JSON version 1 ou ajouter une migration.
- Les sauvegardes restent locales : le signaler à l’utilisateur et conserver export/import.
- Échapper tout contenu utilisateur avant insertion en HTML. Contrôler les tailles et types des imports.
- Utiliser des chemins relatifs pour fonctionner sous `/nom-du-depot/` sur Pages.
- Après modification de la liste d’assets, mettre à jour le service worker ; changer son identifiant de cache lors d’une nouvelle version.
- Conserver l’accessibilité clavier, les zones tactiles, le contraste, le responsive et les confirmations de suppression.
- Les classes CSS finales règlent les tailles lisibles sur smartphone.

## Amélioration IA éventuelle
Une vraie IA ne fait pas partie de la V2 livrée. Pour l’ajouter, définir d’abord l’hébergement d’un backend et un fournisseur. Les clés restent côté serveur dans des variables d’environnement. Conserver un mode local gratuit et un état d’erreur explicite ; pas de fausse génération IA ni de clé dans le code public. GitHub Pages seul ne peut pas garder une clé secrète.

## Vérifications avant publication
1. Exécuter `npm run build` et `npm test`.
2. Vérifier les écrans à 375 px et 1440 px, ainsi que le texte agrandi.
3. Chercher `evîn`, `jiyan`, `heval`, puis `été` et `cœur` en mode Lexique.
4. Ajouter un favori et un mot, générer et retoucher un texte, sauvegarder, recharger.
5. Exporter une sauvegarde JSON et la réimporter sans doublon.
6. Vérifier l’installation et le mode hors connexion sur les téléphones réels.

Les tests métier et les ressources ont été contrôlés lors de la livraison ; aucun test visuel de navigateur n’a été effectué dans cet environnement. Faire cette vérification lors de la reprise.


## Studio V2
- `themes.js` : 12 thèmes, 15 contextes, 234 vers en comptant les lignes des situations, détection de mots-clés explicite, listes de voix et backs.
- `studio.js` : parties jusqu’à 32, presets, génération isolée/globale, protection, refrains identiques ou différents, sérialisation des voix et vocalises, migration des textes V1.
- `studio-view.js` et `studio.css` : formulaire de contexte, parties éditables, actions et aperçu.
- `app.js` relie le studio au carnet et au dictionnaire existants.
- `core.js` accepte les sauvegardes JSON V1 et V2 ; la V2 inclut sections et configuration. Ne jamais perdre ces champs à l’export ou à l’ouverture d’un texte.
- Le stockage conserve `reson-kurdi-v1` et indique `schemaVersion: 2` pour migrer sans effacer les anciennes créations.
- Les backs sont calculés dans l’aperçu à partir des paroles et des réglages. Ils ne doivent pas être réinjectés dans le texte source, sinon ils seraient doublés.
- Les voix, le tempo et les indications d’interprétation sont textuels. Aucun moteur de voix chantées ou d’audio n’est présent.
- Une modification manuelle invalide le sens français initial, mais ne l’efface pas ; l’interface prévient clairement.
- La copie d’une partie reçoit un nouvel identifiant et reste indépendante.
- Une partie protégée garde son texte lors des générations. Les refrains répétés utilisent la même longueur ; un refrain protégé peut servir de source.
- Conserver la mise à jour du cache `sw.js` avec tous les nouveaux modules.

Tests V2 ajoutés pour les structures, les refrains, les protections, le contexte, les backs et le retour export/import. Les contrôles de rendu en vrai navigateur restent à faire sur les appareils visés.
