import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data')

function lire(nom) {
  return JSON.parse(readFileSync(join(dataDir, nom), 'utf-8'))
}

function estUrlValide(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const erreurs = []

const evenements = lire('evenements.json')
const figures = lire('figures.json')
const sources = lire('sources.json')
const idsSources = new Set(sources.map((s) => s.id))
const idsFigures = new Set(figures.map((f) => f.id))

for (const e of evenements) {
  if (e.type === 'fait' && (!e.sources || e.sources.length === 0)) {
    erreurs.push(`evenements.json / ${e.id} : type "fait" sans sources`)
  }
  for (const id of e.sources ?? []) {
    if (!idsSources.has(id)) {
      erreurs.push(`evenements.json / ${e.id} : source "${id}" absente de sources.json`)
    }
  }
  for (const id of e.figures ?? []) {
    if (!idsFigures.has(id)) {
      erreurs.push(`evenements.json / ${e.id} : figure "${id}" absente de figures.json`)
    }
  }
  for (const [personnageId, scene] of Object.entries(e.vecu ?? {})) {
    if (scene.type === 'fiction' && !scene.texte) {
      erreurs.push(`evenements.json / ${e.id} / vecu.${personnageId} : scène fiction sans texte`)
    }
    if (scene.decision) {
      if (!scene.decision.question) {
        erreurs.push(`evenements.json / ${e.id} / vecu.${personnageId} : décision sans question`)
      }
      if (!scene.decision.options || scene.decision.options.length < 2) {
        erreurs.push(`evenements.json / ${e.id} / vecu.${personnageId} : décision avec moins de 2 options`)
      }
      for (const opt of scene.decision.options ?? []) {
        if (!opt.texte || !opt.consequence) {
          erreurs.push(`evenements.json / ${e.id} / vecu.${personnageId} : option de décision incomplète`)
        }
      }
    }
  }
}

for (const f of figures) {
  for (const fait of f.faits ?? []) {
    if (!fait.sources || fait.sources.length === 0) {
      erreurs.push(`figures.json / ${f.id} : fait "${fait.date}" sans sources`)
    }
    for (const id of fait.sources ?? []) {
      if (!idsSources.has(id)) {
        erreurs.push(`figures.json / ${f.id} : source "${id}" absente de sources.json`)
      }
    }
  }
  for (const champ of ['regard_sur_les_puissances', 'regard_sur_les_etats']) {
    for (const entree of f[champ] ?? []) {
      if (!entree.citation) {
        erreurs.push(`figures.json / ${f.id} / ${champ} : entrée sans citation`)
      }
      if (!entree.sources || entree.sources.length === 0) {
        erreurs.push(`figures.json / ${f.id} / ${champ} : entrée sans sources`)
      }
    }
  }
  for (const icone of f.iconographie ?? []) {
    if (icone.url_image && !estUrlValide(icone.url_image)) {
      erreurs.push(`figures.json / ${f.id} : url_image invalide "${icone.url_image}"`)
    }
    if (icone.url_notice && !estUrlValide(icone.url_notice)) {
      erreurs.push(`figures.json / ${f.id} : url_notice invalide "${icone.url_notice}"`)
    }
  }
}

for (const s of sources) {
  if (s.url && !estUrlValide(s.url)) {
    erreurs.push(`sources.json / ${s.id} : url invalide "${s.url}"`)
  }
}

if (erreurs.length > 0) {
  console.error(`Validation échouée (${erreurs.length} erreur(s)) :\n`)
  for (const e of erreurs) console.error(`  - ${e}`)
  process.exit(1)
} else {
  console.log('Validation OK.')
}
