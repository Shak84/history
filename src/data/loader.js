// Charge génériquement les fichiers de données d'une période, sans jamais nommer
// une ère ou une période en dur : Vite indexe tous les JSON sous /ancien-regime
// (et toute future ère) au build, on ne fait que piocher dans cet index par chemin.
const modules = import.meta.glob('./**/*.json', { eager: true })

export function chargerFichierPeriode(ere, periode, nomFichier) {
  const chemin = `./${ere}/${periode}/${nomFichier}.json`
  return modules[chemin]?.default ?? null
}

export function chargerPeriodes(ere) {
  const chemin = `./${ere}/periodes.json`
  return modules[chemin]?.default ?? []
}
