import { useState } from 'react'
import { useAtlasStore } from '../stores/atlasStore'
import { obtenirIndexRecherche } from '../data/recherche'

const LIBELLES_TYPE = { figure: 'personnage', evenement: 'événement', article: 'article' }

export default function BarreRecherche() {
  const [requete, setRequete] = useState('')
  const setEre = useAtlasStore((s) => s.setEre)
  const setPeriode = useAtlasStore((s) => s.setPeriode)
  const setTheme = useAtlasStore((s) => s.setTheme)
  const ouvrirModale = useAtlasStore((s) => s.ouvrirModale)

  const resultats =
    requete.trim().length >= 2
      ? obtenirIndexRecherche().search(requete, { prefix: true, fuzzy: 0.2 }).slice(0, 8)
      : []

  function choisir(r) {
    setEre(r.ere)
    setPeriode(r.periode)
    if (r.type === 'figure') ouvrirModale({ type: 'figure', id: r.cibleId })
    else if (r.type === 'evenement') ouvrirModale({ type: 'evenement', id: r.cibleId })
    else if (r.type === 'article') setTheme(r.theme)
    setRequete('')
  }

  return (
    <div className="recherche">
      <input
        type="text"
        placeholder="Rechercher…"
        value={requete}
        onChange={(e) => setRequete(e.target.value)}
      />
      {resultats.length > 0 && (
        <ul className="recherche-resultats">
          {resultats.map((r) => (
            <li key={r.id} onClick={() => choisir(r)}>
              <span className="recherche-type">{LIBELLES_TYPE[r.type]}</span>
              {r.titre}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
