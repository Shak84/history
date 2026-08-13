import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data')
const erreurs = []

function lireJson(cheminAbsolu) {
  return JSON.parse(readFileSync(cheminAbsolu, 'utf-8'))
}

function estUrlValide(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function listerDossiers(chemin) {
  if (!existsSync(chemin)) return []
  return readdirSync(chemin).filter((nom) => statSync(join(chemin, nom)).isDirectory())
}

// Extrait tous les [[type:id]] présents dans n'importe quelle valeur texte d'un objet/tableau.
function extraireLiensInternes(valeur, resultat = []) {
  if (typeof valeur === 'string') {
    for (const m of valeur.matchAll(/\[\[(figure|evenement|province):([a-z0-9-]+)\]\]/g)) {
      resultat.push({ type: m[1], id: m[2] })
    }
  } else if (Array.isArray(valeur)) {
    for (const v of valeur) extraireLiensInternes(v, resultat)
  } else if (valeur && typeof valeur === 'object') {
    for (const v of Object.values(valeur)) extraireLiensInternes(v, resultat)
  }
  return resultat
}

// Vérifie récursivement tout champ nommé "url"/"url_image"/"url_iiif"/"url_notice".
function verifierUrls(valeur, contexte) {
  if (Array.isArray(valeur)) {
    valeur.forEach((v) => verifierUrls(v, contexte))
  } else if (valeur && typeof valeur === 'object') {
    for (const [cle, v] of Object.entries(valeur)) {
      if (['url', 'url_image', 'url_iiif', 'url_notice'].includes(cle) && v && !estUrlValide(v)) {
        erreurs.push(`${contexte} : url invalide "${v}" (champ ${cle})`)
      }
      verifierUrls(v, contexte)
    }
  }
}

// --- sources.json : bibliographie centralisée, partagée par toutes les périodes ---

const cheminSources = join(dataDir, 'sources.json')
const sources = existsSync(cheminSources) ? lireJson(cheminSources) : []
const idsSources = new Set(sources.map((s) => s.id))
verifierUrls(sources, 'sources.json')

function verifierSources(idsUtilises, contexte) {
  for (const id of idsUtilises ?? []) {
    if (!idsSources.has(id)) {
      erreurs.push(`${contexte} : source "${id}" absente de sources.json`)
    }
  }
}

// --- Champs "regard_sur_les_etats" / "regard_sur_les_puissances" / "ambitions" / "craintes" ---
// Règle du champ vide : une entrée n'existe que si elle porte une citation ET des sources non vides.

const CHAMPS_A_CITATION = ['regard_sur_les_etats', 'regard_sur_les_puissances', 'ambitions', 'craintes']

function verifierFigure(figure, contexte) {
  for (const champ of CHAMPS_A_CITATION) {
    for (const entree of figure[champ] ?? []) {
      if (!entree.citation) {
        erreurs.push(`${contexte} / ${champ} : entrée sans citation`)
      }
      if (!entree.sources || entree.sources.length === 0) {
        erreurs.push(`${contexte} / ${champ} : entrée sans sources`)
      }
      verifierSources(entree.sources, `${contexte} / ${champ}`)
    }
  }
  for (const trait of figure.traits_de_caractere ?? []) {
    verifierSources(trait.sources, `${contexte} / traits_de_caractere`)
  }
  for (const realisation of figure.realisations ?? []) {
    if (!realisation.sources || realisation.sources.length === 0) {
      erreurs.push(`${contexte} / realisations "${realisation.date}" : sans sources`)
    }
    verifierSources(realisation.sources, `${contexte} / realisations`)
  }
  verifierSources(figure.genealogie?.sources, `${contexte} / genealogie`)
  verifierUrls(figure.iconographie, contexte)
}

// --- Fiches de bataille (guerres.json) ---

function verifierBataille(entree, contexte) {
  if (['siege', 'bataille'].includes(entree.categorie)) {
    if (!entree.casus_belli) erreurs.push(`${contexte} : ${entree.categorie} sans casus_belli`)
    if (!entree.issue) erreurs.push(`${contexte} : ${entree.categorie} sans issue`)
    if (!entree.sources || entree.sources.length === 0) {
      erreurs.push(`${contexte} : ${entree.categorie} sans sources`)
    }
  }
}

// --- Parcours de chaque période sous /ancien-regime (et futures ères) ---

const eresDir = dataDir
for (const ere of listerDossiers(eresDir)) {
  if (ere === 'geo') continue // fonds cartographiques partagés, pas une ère
  const ereChemin = join(eresDir, ere)
  for (const periode of listerDossiers(ereChemin)) {
    const periodeChemin = join(ereChemin, periode)
    const fichiers = readdirSync(periodeChemin).filter((f) => f.endsWith('.json'))

    const idsFigures = new Set()
    const idsEvenements = new Set()
    const idsProvinces = new Set()

    if (fichiers.includes('figures.json')) {
      for (const f of lireJson(join(periodeChemin, 'figures.json'))) idsFigures.add(f.id)
    }
    if (fichiers.includes('evenements.json')) {
      for (const e of lireJson(join(periodeChemin, 'evenements.json'))) idsEvenements.add(e.id)
    }
    if (fichiers.includes('provinces.json')) {
      for (const p of lireJson(join(periodeChemin, 'provinces.json'))) idsProvinces.add(p.id)
    }

    for (const fichier of fichiers) {
      const chemin = join(periodeChemin, fichier)
      const contenu = lireJson(chemin)
      const contexteFichier = `${ere}/${periode}/${fichier}`
      verifierUrls(contenu, contexteFichier)

      const entrees = Array.isArray(contenu) ? contenu : [contenu]
      for (const entree of entrees) {
        const contexte = `${contexteFichier} / ${entree.id ?? '?'}`

        if (entree.type === 'fait' && (!entree.sources || entree.sources.length === 0)) {
          erreurs.push(`${contexte} : type "fait" sans sources`)
        }
        verifierSources(entree.sources, contexte)

        for (const citation of entree.citations ?? []) {
          if (!citation.texte) erreurs.push(`${contexte} : citation sans texte`)
          if (citation.source && !idsSources.has(citation.source)) {
            erreurs.push(`${contexte} : source de citation "${citation.source}" absente de sources.json`)
          }
        }

        for (const id of entree.figures_liees ?? []) {
          if (!idsFigures.has(id)) {
            erreurs.push(`${contexte} : figure liée "${id}" absente de figures.json`)
          }
        }

        for (const id of entree.commandants ?? []) {
          if (!idsFigures.has(id)) {
            erreurs.push(`${contexte} : commandant "${id}" absent de figures.json`)
          }
        }
        for (const b of entree.belligerants ?? []) {
          for (const id of b.commandants ?? []) {
            if (!idsFigures.has(id)) {
              erreurs.push(`${contexte} : commandant "${id}" absent de figures.json`)
            }
          }
        }

        if (fichier === 'figures.json') verifierFigure(entree, contexte)
        if (fichier === 'guerres.json') verifierBataille(entree, contexte)

        for (const lien of extraireLiensInternes(entree)) {
          const cible = { figure: idsFigures, evenement: idsEvenements, province: idsProvinces }[lien.type]
          if (!cible.has(lien.id)) {
            erreurs.push(`${contexte} : lien interne [[${lien.type}:${lien.id}]] introuvable dans ${lien.type}s.json`)
          }
        }
      }
    }
  }
}

if (erreurs.length > 0) {
  console.error(`Validation échouée (${erreurs.length} erreur(s)) :\n`)
  for (const e of erreurs) console.error(`  - ${e}`)
  process.exit(1)
} else {
  console.log('Validation OK.')
}
