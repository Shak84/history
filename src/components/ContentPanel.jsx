import { useState } from 'react'
import { useAtlasStore } from '../stores/atlasStore'
import eres from '../data/eres.json'
import themes from '../data/themes.json'
import sources from '../data/sources.json'
import { chargerFichierPeriode, chargerPeriodes } from '../data/loader'

const sourcesParId = Object.fromEntries(sources.map((s) => [s.id, s]))

function texteAvecLiens(texte, figuresParId) {
  const regex = /\[\[figure:([a-z0-9-]+)\]\]/g
  const parties = []
  let dernierIndex = 0
  let m
  while ((m = regex.exec(texte)) !== null) {
    if (m.index > dernierIndex) parties.push(texte.slice(dernierIndex, m.index))
    const fig = figuresParId[m[1]]
    parties.push(
      <span key={m.index} className="personne">
        {fig?.nom ?? m[1]}
      </span>
    )
    dernierIndex = m.index + m[0].length
  }
  if (dernierIndex < texte.length) parties.push(texte.slice(dernierIndex))
  return parties
}

function BlocSourcesArticle({ ids }) {
  const [ouvert, setOuvert] = useState(false)
  if (!ids || ids.length === 0) return null

  return (
    <>
      <span className="sources-toggle" onClick={() => setOuvert((o) => !o)}>
        ◈ {ouvert ? 'Masquer les sources' : 'Voir les sources'}
      </span>
      {ouvert && (
        <ul className="sources-liste">
          {ids.map((id) => {
            const s = sourcesParId[id]
            if (!s) return null
            return (
              <li key={id}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.reference}
                  </a>
                ) : (
                  s.reference
                )}
                {s.page ? `, p. ${s.page}` : ''}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default function ContentPanel() {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)
  const themeActif = useAtlasStore((s) => s.themeActif)

  const ere = eres.find((e) => e.id === ereActive)
  const periode = chargerPeriodes(ereActive).find((p) => p.id === periodeActive)
  const theme = themes.find((t) => t.id === themeActif)

  const fil = (
    <div className="fil">
      {ere?.nom}
      <span className="sep">·</span>
      {periode?.nom}
      <span className="sep">·</span>
      {theme?.nom}
    </div>
  )

  if (!periode?.disponible) {
    return (
      <main>
        {fil}
        <h2>{periode?.nom}</h2>
        <div className="placeholder">
          Contenu à venir.
          <br />
          Louis XIV sert de période pilote : une fois sa structure complète et validée, elle sera
          répliquée sur toutes les autres périodes et ères.
        </div>
      </main>
    )
  }

  const figures = chargerFichierPeriode(ereActive, periodeActive, 'figures') ?? []
  const figuresParId = Object.fromEntries(figures.map((f) => [f.id, f]))
  const articles = chargerFichierPeriode(ereActive, periodeActive, themeActif) ?? []

  return (
    <main>
      {fil}
      <h2>{theme?.nom}</h2>
      {articles.length === 0 ? (
        <div className="placeholder">Aucun article pour ce thème pour l'instant.</div>
      ) : (
        articles.map((a) => (
          <article key={a.id} className="article-card">
            <h3>{a.titre}</h3>
            {a.resume && <div className="article-meta">{a.resume}</div>}
            {(a.corps ?? []).map((p, i) => (
              <p key={i}>{texteAvecLiens(p, figuresParId)}</p>
            ))}
            {(a.citations ?? []).map((c, i) => (
              <div key={i} className="citation">
                « {c.texte} »
                <cite>
                  {sourcesParId[c.source]?.reference ?? c.source}
                  {c.page ? `, p. ${c.page}` : ''}
                </cite>
              </div>
            ))}
            <BlocSourcesArticle ids={a.sources} />
          </article>
        ))
      )}
    </main>
  )
}
