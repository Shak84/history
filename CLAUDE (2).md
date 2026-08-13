# Atlas de l'Histoire de France

Application web de référence historique. Un atlas savant, interactif et sourcé, couvrant **toute l'histoire de France** — de la Gaule romaine aux Républiques.

**Ce n'est pas un jeu.** C'est un ouvrage de consultation : contenu historique rigoureux, navigation claire, sources vérifiables partout. La qualité et la traçabilité du contenu priment sur tout le reste.

Développeur : quelques bases en code, travaille avec Claude Code dans VS Code. Explique tes choix techniques brièvement, évite les abstractions prématurées, et pose une question quand un choix historique ou structurel est ambigu plutôt que de trancher seul.

---

## Navigation — quatre niveaux imbriqués

L'architecture de navigation est le cœur du projet. Elle est **constante** quelle que soit l'époque affichée.

```
NIVEAU 1 — ÈRE                (bandeau supérieur)
  Gaule romaine · Mérovingiens · Carolingiens · Capétiens · Valois ·
  Ancien Régime · Révolution & Empire · Monarchies & 2ᵈ Empire · Républiques

NIVEAU 2 — PÉRIODE            (bandeau sous les ères, dépend de l'ère active)
  ex. dans Ancien Régime : Guerres de Religion · Henri IV · Louis XIII ·
      Louis XIV · Louis XV · Louis XVI

NIVEAU 3 — THÈME              (bandeau latéral gauche, constant partout)
  Politique & État · Strates de la société · Guerres · Culture & arts ·
  Personnages clés · [séparateur] · La carte du royaume

NIVEAU 4 — ÉVÉNEMENT          (bandeau latéral droit, chronologique)
  liste datée des événements de la période, majeurs et mineurs
```

Le **panneau central** affiche le contenu correspondant au croisement période × thème. Un fil d'Ariane rappelle en permanence : Ère · Période · Thème.

La maquette HTML de référence est fournie séparément (`atlas-maquette-v2.html`). Elle définit la disposition, la hiérarchie et l'intention visuelle. Reproduis sa structure ; tu peux améliorer le détail, pas changer l'organisation sans validation.

---

## Stratégie de construction : Louis XIV en pilote

**On ne construit pas toute l'histoire de France d'un coup.** La période **Louis XIV (1643-1715)** sert de prototype complet. Une fois qu'elle est pleinement fonctionnelle et validée — structure, composants, données, sources, carte — sa structure est répliquée sur les autres périodes, puis les autres ères.

Concrètement :
- Les ères autres qu'Ancien Régime sont visibles mais désactivées (grisées) au démarrage.
- Dans l'Ancien Régime, seule la période Louis XIV a du contenu ; les autres affichent un état « Contenu à venir ».
- **Tout code écrit pour Louis XIV doit être générique**, jamais codé en dur pour cette période. Une période n'est qu'un identifiant qui charge un jeu de données. Ajouter une période = ajouter des fichiers de données, pas du code.

---

## Règle absolue : aucune invention, traçabilité intégrale

C'est la contrainte n°1 du projet. Elle prime sur tout le reste, y compris sur le fait de « remplir » une section.

1. **Aucun fait, date, citation ou témoignage n'entre dans les données sans une source réelle et vérifiable.**
2. Tu n'écris **jamais** de citation d'époque de mémoire. Une citation vient d'un document identifié (référence + page, ou lien vers le fac-similé), ou elle n'existe pas.
3. Chaque entrée factuelle porte un champ `sources[]` **obligatoire et non vide**.
4. Si tu n'as pas de source pour un élément, **tu laisses le champ vide**. Tu ne combles ni par déduction, ni par contexte général, ni par formulation prudente. Un champ vide est un résultat valide ; une phrase plausible non sourcée est une faute.
5. **Traçabilité intégrale** : tout contenu affiché doit pouvoir être remonté jusqu'à une référence précise et consultable. Si l'utilisateur clique sur n'importe quelle affirmation, il doit pouvoir voir d'où elle vient. Ce qui n'est pas traçable n'est pas affiché.
6. L'interface distingue visuellement deux natures de contenu :
   - `type: "fait"` → documenté, sources affichables ;
   - `type: "synthese"` → mise en récit de faits sourcés (une introduction de section, un chapô), qui ne contient aucune affirmation factuelle nouvelle non couverte par les sources des faits qu'elle résume.

Il n'y a **pas de contenu de fiction** dans ce projet. C'est un atlas, pas une narration romancée.

---

## Le pouvoir de la source : ce que doit permettre l'interface

L'utilisateur veut pouvoir, à tout moment :
- cliquer sur un personnage, un événement, un lieu cité dans un texte → ouverture d'une fiche en modale, sans quitter la page ;
- déplier les sources de n'importe quel fait → voir la référence complète et, si disponible, un lien cliquable vers le document original (Gallica, Persée, Wikisource…) ouvrant dans un nouvel onglet ;
- naviguer entre fiches liées (d'un événement vers un personnage impliqué, d'un personnage vers ses réalisations).

Les modales sont **empilables** avec fil d'Ariane et retour arrière. Fermeture par croix, `Échap`, ou clic sur le fond.

---

## Modèle de données

Les données sont organisées par ère → période. Chaque période a son dossier.

```
/src/data
  /ancien-regime
    /louis-xiv
      meta.json          — bornes, titre, résumé de la période
      politique.json     — articles du thème « Politique & État »
      societe.json       — articles du thème « Strates de la société »
      guerres.json       — articles du thème « Guerres »
      culture.json       — articles du thème « Culture & arts »
      figures.json       — fiches des personnages clés
      evenements.json    — chronologie de la période
      provinces.json     — données cartographiques (rattachements, gouverneurs)
  /geo
    *.geojson            — fonds cartographiques historiques partagés
  sources.json           — bibliographie centralisée, référencée par id partout
```

**Texte enrichi cliquable** : dans tous les champs textuels, les entités se référencent par une syntaxe interne, jamais par du HTML :
`[[figure:colbert]]`, `[[evenement:revocation-edit-nantes]]`, `[[province:languedoc]]`.
Un composant `<TexteEnrichi>` les transforme en éléments cliquables au rendu.

### Article (thème politique / société / guerres / culture)

```json
{
  "id": "vauban-paysannerie",
  "type": "fait",
  "titre": "La paysannerie : neuf Français sur dix",
  "resume": "…",
  "corps": [
    "Le maréchal de [[figure:vauban]] estime qu'un dixième du peuple…"
  ],
  "citations": [
    {
      "texte": "prés de la dixiéme partie du peuple est réduite à la mandicité",
      "source": "vauban-dime-royale-1707",
      "page": 6
    }
  ],
  "figures_liees": ["vauban"],
  "sources": ["vauban-dime-royale-1707"],
  "statut": "verifie"
}
```

### Figure (personnage)

Structure complète attendue pour chaque personnage clé. Chaque sous-section porte ses propres sources.

```json
{
  "id": "colbert",
  "nom": "Jean-Baptiste Colbert",
  "wikidata": "Q184933",
  "naissance": "1619-08-29",
  "mort": "1683-09-06",
  "couche_sociale": "bourgeoisie d'office",
  "fonctions": [],
  "genealogie": { "pere": "", "mere": "", "conjoints": [], "enfants": [], "notes": "", "sources": [] },
  "traits_de_caractere": [
    { "trait": "", "evidence": "", "citation": "", "sources": [] }
  ],
  "realisations": [
    { "date": "", "realisation": "", "description": "", "sources": [] }
  ],
  "ambitions": [
    { "ambition": "", "description": "", "citation": "", "sources": [] }
  ],
  "craintes": [
    { "crainte": "", "description": "", "citation": "", "sources": [] }
  ],
  "regard_sur_les_etats": [
    { "etat": "paysannerie", "position": "", "citation": "", "sources": [] }
  ],
  "regard_sur_les_puissances": [
    { "pays": "Provinces-Unies", "position": "", "citation": "", "sources": [] }
  ],
  "iconographie": [
    { "titre": "", "artiste": "", "date": "", "conservation": "",
      "url_image": "", "url_iiif": "", "url_notice": "", "domaine_public": true, "credit": "" }
  ],
  "statut": "verifie"
}
```

**Règle du champ vide, appliquée strictement à `regard_sur_les_etats`, `regard_sur_les_puissances`, `ambitions`, `craintes` :** ces sections ne sont remplies que si un écrit du personnage lui-même (correspondance, mémoire, discours rapporté, acte signé) atteste sa position. Le champ `citation` porte l'extrait exact qui la fonde. Si tu ne peux pas produire cet extrait avec sa référence, l'entrée n'existe pas. Pas de déduction depuis la fonction ou le milieu. Un tableau vide est un résultat attendu et normal, surtout pour les personnages des couches populaires : l'interface affiche « Aucune position documentée sur ce point » plutôt que de masquer ou combler.

### Source (bibliographie centralisée)

```json
{
  "id": "vauban-dime-royale-1707",
  "type": "source_primaire",
  "titre": "Projet d'une Dixme Royale",
  "auteur": "Sébastien Le Prestre de Vauban",
  "date": "1707",
  "url": "https://gallica.bnf.fr/ark:/12148/bpt6k5727570s",
  "ark": "ark:/12148/bpt6k5727570s",
  "domaine_public": true
}
```

Le champ `url` est prioritaire : chaque fois qu'un lien consultable existe (Gallica, Persée, Wikisource, notice de musée), il est renseigné. Pour un ouvrage sous droits sans version en ligne, mettre la référence complète et `url: null`.

---

## Stack technique

```
vite + react + tailwind css   — socle
zustand                       — état global (ère, période, thème, événement, pile de modales)
d3-geo                        — projection GeoJSON vers SVG pour la carte historique
d3-hierarchy                  — arbres généalogiques en SVG
minisearch                    — recherche plein texte sur tous les JSON
openseadragon                 — zoom profond sur portraits IIIF et fac-similés
```

Aucune librairie n'est à installer manuellement à l'avance. Tu les installes via `npm install` quand tu en as besoin. Pas de TypeScript au démarrage — on garde le projet lisible. Pas de back-end : tout est statique, lu depuis les JSON locaux.

### État global — Zustand

```js
{
  ereActive: "ancien-regime",
  periodeActive: "louis-xiv",
  themeActif: "politique",
  evenementActif: null,
  modaleStack: [],       // pile des fiches ouvertes
  anneeCarte: 1661,      // année courante pour l'affichage de la carte
}
```

Tous les panneaux lisent depuis ce store — pas de prop drilling. Un composant ne reçoit en props que ce qu'il affiche.

### Carte — d3-geo

Pas de Leaflet ni Mapbox (conçus pour des cartes tuilées actuelles, inadaptés). d3-geo projette du GeoJSON en SVG : les frontières restent des données versionnables. Un champ `annee` par feature permet de filtrer l'état des frontières selon l'année active. Clic sur une province vers une modale (même système que figures et événements).

Sources de fonds cartographiques historiques, dans l'ordre :
1. `github.com/aourednik/historical-basemaps` — frontières mondiales par période, GeoJSON.
2. `geohistoricaldata.github.io` — France du XVIIIᵉ.
3. `fondsdecarte.free.fr` — vectoriel France/Europe.
4. Ressources géo-historiques du LARHRA pour les découpages d'Ancien Régime.

### Iconographie — OpenSeadragon + IIIF

Si une entrée iconographie a une `url_iiif` vers un rendu OpenSeadragon avec zoom natif. Sinon vers `<img>`. Le cartel (titre, artiste, date, conservation, crédit) s'affiche toujours sous l'image. N'utiliser que des images au statut de droits libre explicite ; en cas de doute, ne mettre que le lien vers la notice. Source privilégiée : Wikimedia Commons.

---

## Validation des données — garde-fou mécanique

La règle « rien sans source » est appliquée par le code, pas par la discipline. À mettre en place **dès le début**.

Créer `/scripts/validate.js`, un script Node qui parcourt tout `/src/data` et lève une erreur sur :
- tout objet `type: "fait"` avec `sources` vide ou absent ;
- toute entrée de `regard_sur_les_etats`, `regard_sur_les_puissances`, `ambitions` ou `craintes` sans `citation` ou avec `sources` vide ;
- tout id référencé (`[[figure:x]]`, `figures_liees`, `sources`, etc.) qui n'existe pas dans le fichier cible ;
- tout `url` renseigné au format invalide.

Dans `package.json` :
```json
"scripts": {
  "validate": "node scripts/validate.js",
  "predev": "npm run validate",
  "prebuild": "npm run validate"
}
```

Le serveur de dev et le build ne démarrent pas si la validation échoue. Ajouter un hook git pre-commit qui lance `npm run validate`. Toujours signaler explicitement les entrées incomplètes plutôt que de les laisser passer silencieusement.

---

## Les sources : où et comment

Les documents bruts (PDF Gallica) vivent dans un dossier `/knowledge` **à la racine, hors de `/src`**, et sont exclus de Git via `.gitignore` (ils sont lourds et n'ont pas leur place sur GitHub). L'app ne les sert jamais : elle stocke uniquement les métadonnées et les liens dans `sources.json`, et pointe vers Gallica pour la consultation.

Pour peupler les données, ordre de priorité des sources sur la période Louis XIV :
- **Vauban**, *Projet d'une dîme royale* (1707) — misère paysanne, fiscalité, démographie.
- **La Bruyère**, *Les Caractères* (1688) — portrait de toutes les couches sociales.
- **Saint-Simon**, *Mémoires* — la Cour de l'intérieur.
- **Madame de Sévigné**, *Lettres* — noblesse de province et de Cour.
- **Wikidata** (SPARQL, `https://query.wikidata.org/sparql`) — dates, fonctions, parentés des personnages.

---

## Feuille de route

Chaque étape doit être **terminée et validée** avant la suivante.

**v0 — Coquille de navigation**
Les quatre niveaux de navigation fonctionnent (ères, périodes, thèmes, événements) avec le store Zustand. Ères non-Ancien-Régime grisées. Contenu de Louis XIV chargé depuis les JSON, autres périodes en « à venir ». Pas encore de modales ni de carte. Script de validation en place.

**v1 — Contenu et fiches**
Composant `<TexteEnrichi>`, modales empilables. Fiches personnages complètes (généalogie, traits, réalisations, ambitions, craintes, regards, iconographie) avec blocs sources dépliables et liens Gallica. Fiches événements. Recherche MiniSearch.

**v2 — La carte**
Carte SVG des provinces d'Ancien Régime via d3-geo. Mise à jour selon l'année. Provinces cliquables.

**v3 — Réplication**
Généraliser à une deuxième période (ex. Louis XIII), vérifier que l'ajout ne demande que des données. Puis étendre aux autres ères.

---

## Conventions de travail

- Commit après chaque fonctionnalité qui marche, message en français.
- Un composant = un fichier dans `/src/components`.
- Tous les textes affichés vivent dans les JSON, jamais en dur dans les composants.
- Ne jamais coder en dur une période, une ère ou un thème : tout passe par les données et le store.
- Lancer `npm run validate` avant de proposer un commit qui touche aux données.
- Ne pas committer le dossier `/knowledge`.
- Quand un choix historique ou structurel est ambigu, poser la question.

---

## Wikipédia & Wikidata — complétude sans perte de traçabilité

Wikipédia et Wikidata servent à **rendre l'atlas complet et à repérer les sources**, jamais à remplacer les sources primaires.

**Hiérarchie de confiance des sources (du plus fort au plus faible) :**
1. Source primaire d'époque (Vauban, Saint-Simon, actes, correspondances) → citable telle quelle, avec lien Gallica/Wikisource.
2. Ouvrage universitaire de référence (Goubert, Petitfils…) → citable, avec référence page.
3. Wikipédia → **jamais enregistré comme source finale d'un fait**. Sert à repérer un fait et à remonter à sa source réelle via les notes de bas de page. C'est cette source réelle qui va dans `sources.json`.
4. Wikidata → utilisable directement pour les **données structurées neutres** (dates de naissance/mort, liens de parenté, fonctions occupées), avec le QID stocké comme référence.

**Règle concrète :** quand un fait n'est trouvé que sur Wikipédia sans source primaire ou universitaire identifiable, il est marqué `statut: "a_sourcer"` et n'est pas affiché comme fait vérifié. On ne cite pas Wikipédia comme autorité finale.

**Endpoints :**
- Wikidata SPARQL : `https://query.wikidata.org/sparql`
- Wikipédia (fr) API : `https://fr.wikipedia.org/w/api.php` (l'URL de base est bien `fr.wikipedia.org`, avec `action=query` et `format=json`). Ajouter un en-tête `User-Agent` identifiant l'application, comme demandé par Wikimedia.

Ces appels se font dans des **scripts Node lancés une fois** (`/scripts/import/`), dont on commit le résultat JSON. L'application elle-même n'appelle aucune API à l'exécution : tout est statique.

---

## Généalogies — représentation visuelle

Chaque personnage clé et chaque dynastie peuvent porter un arbre généalogique affiché **visuellement**, pas en simple liste.

**Modèle de données** — un fichier `genealogies.json` par période (ou un `genealogie.json` transverse pour les grandes dynasties, à décider selon les cas) :

```json
{
  "id": "bourbons-louis-xiv",
  "titre": "La descendance de Louis XIV",
  "noeuds": [
    {
      "id": "louis-xiv",
      "figure": "louis-xiv",
      "nom": "Louis XIV",
      "naissance": "1638",
      "mort": "1715",
      "sources": ["wikidata:Q7742"]
    }
  ],
  "liens": [
    { "de": "louis-xiii", "vers": "louis-xiv", "type": "parent" },
    { "de": "louis-xiv", "vers": "marie-therese", "type": "conjoint" }
  ],
  "sources": ["wikidata:Q7742"]
}
```

**Rendu :** arbre généalogique en SVG via **d3-hierarchy** (déjà dans l'écosystème d3 qu'on utilise pour la carte). Chaque nœud est cliquable : s'il correspond à une figure existante (`figure: "louis-xiv"`), le clic ouvre la fiche en modale. Types de liens gérés : `parent`, `conjoint`, `enfant-naturel` (distingué visuellement, ligne pointillée).

Les dates et liens de parenté proviennent de Wikidata (données neutres, QID stocké). Un lien de filiation contesté par les historiens porte un champ `note` et `statut: "conteste"`.

Section accessible depuis la fiche d'un personnage (« Voir dans l'arbre ») et depuis le thème « Personnages clés ».

---

## Fiches de bataille — structure détaillée

Le thème « Guerres » ne se limite pas à des dates : chaque bataille ou conflit majeur porte une fiche structurée, sur le modèle d'une notice d'atlas militaire.

**Modèle de données** — dans `guerres.json` :

```json
{
  "id": "siege-de-lille-1667",
  "type": "fait",
  "categorie": "siege",
  "nom": "Siège de Lille",
  "date_debut": "1667-08-10",
  "date_fin": "1667-08-27",
  "conflit_parent": "guerre-de-devolution",
  "lieu": { "nom": "Lille", "province": "flandre", "lat": 50.63, "lng": 3.06 },
  "belligerants": [
    { "camp": "Royaume de France", "commandants": ["louis-xiv", "vauban", "turenne"] },
    { "camp": "Pays-Bas espagnols", "commandants": [] }
  ],
  "casus_belli": "…",
  "causes": ["…"],
  "deroulement": "…",
  "issue": "victoire française",
  "consequences": ["…"],
  "pertes": { "france": "", "adversaire": "", "sources": [] },
  "citations": [],
  "figures_liees": ["louis-xiv", "vauban", "turenne"],
  "sources": [],
  "statut": "verifie"
}
```

**Champs obligatoires et sourcés** : `casus_belli`, `causes`, `deroulement`, `issue`, `consequences` portent chacun leurs sources. La règle du champ vide s'applique : un chiffre de pertes non sourcé reste vide plutôt qu'estimé. Les commandants référencés en `commandants` et `figures_liees` doivent exister dans `figures.json` (vérifié par le script de validation).

**Rendu de la fiche** : en modale, structurée en sections claires — Contexte / Casus belli / Forces en présence (avec commandants cliquables) / Déroulement / Issue / Conséquences / Sources. Si le lieu a des coordonnées, un lien vers la carte à la bonne localisation.

**Ajout au script de validation :** toute entrée `categorie: "siege"` ou `"bataille"` doit avoir `casus_belli`, `issue` et au moins une source non vide.

---

## Direction visuelle & immersion

Principe directeur, sans exception : **l'immersion ne falsifie jamais la source.** On sublime des documents réels, on ne fabrique aucun visage, aucune scène, aucun objet qui n'existe dans une source identifiable. Un portrait généré ou une reconstitution inventée casserait la traçabilité de l'atlas au même titre qu'une citation fabriquée.

**Interdit :** générer par IA le visage ou le portrait d'un personnage historique. Les visages affichés sont toujours des œuvres réelles (peintures, gravures, sculptures, médailles) créditées et datées.

Quatre chantiers visuels, par ordre de priorité.

### 1. Galerie de portraits réels (priorité haute)

Cœur de l'expérience visuelle des personnages. S'appuie sur le champ `iconographie` déjà défini dans les fiches et sur OpenSeadragon + IIIF.

- **Zoom profond** dans le portrait authentique via OpenSeadragon : examiner un détail de galon, le grain d'une gravure. C'est le principal effet « waouh », et il est 100 % sourcé.
- **Mise en scène de galerie** : cadre doré d'époque en CSS, fond sombre type cimaise de musée, éclairage doux. L'image reste la peinture réelle ; seule la présentation est travaillée.
- **Léger effet de profondeur** : parallaxe discrète au survol (le portrait avance légèrement sur son cadre). Pas de 3D reconstruite — un simple décalage de plans CSS.
- **Portraits multiples d'un même personnage** : quand plusieurs œuvres existent (à différents âges, par différents artistes), transition douce entre elles, avec cartel individuel. Montre l'évolution d'une image publique dans le temps.
- Chaque portrait porte toujours son cartel : titre, artiste, date, lieu de conservation, crédit. Source privilégiée : Wikimedia Commons (statut de droits explicite).

### 2. Cartes et frises animées (priorité haute)

Le mouvement fondé sur les données réelles, souvent le plus spectaculaire d'un atlas.

- **Frontières animées** : quand l'utilisateur déplace l'année (frise / chronologie), les frontières de la carte se redessinent par transition animée (d3 gère l'interpolation des tracés SVG). Chaque état de frontière reste daté et sourcé.
- **Campagnes militaires** : sur la fiche d'une guerre, tracé animé du déplacement des armées, des sièges dans l'ordre chronologique, à partir des lieux et dates réels des batailles (données de `guerres.json`).
- **Frise chronologique animée** : défilement fluide, événements qui apparaissent à leur date, densité visuelle des périodes agitées.
- Toute animation s'appuie sur des dates et lieux présents dans les données. Aucune trajectoire inventée : si le tracé exact d'une campagne n'est pas documenté, on relie les points connus (villes, batailles datées) sans prétendre au détail.

### 3. Généalogies animées (priorité moyenne)

Sur la base du modèle nœuds/liens déjà défini (d3-hierarchy).

- L'arbre se **déploie progressivement** à l'ouverture (les branches se dessinent) plutôt que d'apparaître d'un bloc.
- **Navigation animée** : cliquer un nœud recentre l'arbre en douceur sur ce personnage et sa descendance.
- Les liens contestés ou naturels sont visuellement distincts (pointillés, couleur), avec note au survol.
- Chaque nœud reste cliquable vers la fiche du personnage.

### 4. Reconstitutions 3D de lieux (priorité basse, bonus)

**Uniquement des lieux et objets documentés par des plans, gravures ou relevés — jamais des visages ni des scènes vivantes inventées.**

- Candidats légitimes : Versailles à une date donnée (plans conservés), une place forte de Vauban (ses propres traités et relevés), l'agencement d'une salle du Conseil.
- Approche technique légère à privilégier : **three.js** pour un modèle simple navigable, ou, plus économique, une reconstitution en plan isométrique animé à partir de gravures d'époque.
- Chaque reconstitution cite les plans/gravures qui la fondent et signale explicitement sa nature de reconstitution (« d'après les plans de … »).
- À n'aborder qu'une fois les priorités 1 à 3 solides. Ne pas installer three.js avant d'en arriver là.

**Ajout à la stack le moment venu :** `three` (uniquement pour le chantier 4, pas avant). Les chantiers 1 à 3 n'utilisent que ce qui est déjà prévu (OpenSeadragon, d3-geo, d3-hierarchy, CSS).
