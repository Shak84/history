import MiniSearch from 'minisearch'
import eres from './eres.json'
import { chargerFichierPeriode, chargerPeriodes } from './loader'

const FICHIERS_ARTICLES = ['politique', 'societe', 'guerres', 'culture']

// Construit la liste de documents indexables à partir de toutes les ères/périodes
// qui possèdent effectivement des données — générique, sans nommer une période en dur.
function construireDocuments() {
  const documents = []
  for (const ere of eres) {
    for (const periode of chargerPeriodes(ere.id)) {
      const figures = chargerFichierPeriode(ere.id, periode.id, 'figures') ?? []
      for (const f of figures) {
        documents.push({
          id: `figure:${ere.id}:${periode.id}:${f.id}`,
          type: 'figure',
          ere: ere.id,
          periode: periode.id,
          cibleId: f.id,
          titre: f.nom,
          texte: [f.nom, f.couche_sociale].filter(Boolean).join(' '),
        })
      }

      const evenements = chargerFichierPeriode(ere.id, periode.id, 'evenements') ?? []
      for (const e of evenements) {
        documents.push({
          id: `evenement:${ere.id}:${periode.id}:${e.id}`,
          type: 'evenement',
          ere: ere.id,
          periode: periode.id,
          cibleId: e.id,
          titre: e.titre,
          texte: [e.titre, ...(e.corps ?? [])].join(' '),
        })
      }

      for (const themeId of FICHIERS_ARTICLES) {
        const articles = chargerFichierPeriode(ere.id, periode.id, themeId) ?? []
        for (const a of articles) {
          documents.push({
            id: `article:${ere.id}:${periode.id}:${themeId}:${a.id}`,
            type: 'article',
            ere: ere.id,
            periode: periode.id,
            theme: themeId,
            cibleId: a.id,
            titre: a.titre,
            texte: [a.titre, a.resume, ...(a.corps ?? [])].filter(Boolean).join(' '),
          })
        }
      }
    }
  }
  return documents
}

let indexMemo = null

export function obtenirIndexRecherche() {
  if (indexMemo) return indexMemo
  const mini = new MiniSearch({
    fields: ['titre', 'texte'],
    storeFields: ['type', 'ere', 'periode', 'theme', 'cibleId', 'titre'],
  })
  mini.addAll(construireDocuments())
  indexMemo = mini
  return mini
}
