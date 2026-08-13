import { useAtlasStore } from '../stores/atlasStore'
import eres from '../data/eres.json'
import themes from '../data/themes.json'
import sources from '../data/sources.json'
import { chargerFichierPeriode, chargerPeriodes } from '../data/loader'
import BlocSources from './BlocSources'
import TexteEnrichi from './TexteEnrichi'
import CarteRoyaume from './CarteRoyaume'

const sourcesParId = Object.fromEntries(sources.map((s) => [s.id, s]))

function GrilleFigures({ figures, ouvrirModale }) {
  if (figures.length === 0) {
    return <div className="placeholder">Aucune figure pour cette période pour l'instant.</div>
  }
  return (
    <div className="figures-grille">
      {figures.map((f) => (
        <div key={f.id} className="figure-carte" onClick={() => ouvrirModale({ type: 'figure', id: f.id })}>
          {f.iconographie?.[0]?.url_image && <img src={f.iconographie[0].url_image} alt="" />}
          <div className="figure-carte-nom">{f.nom}</div>
          <div className="figure-carte-meta">{f.couche_sociale}</div>
          {(f.naissance || f.mort) && (
            <div className="figure-carte-dates">
              {f.naissance?.slice(0, 4) ?? '?'}–{f.mort?.slice(0, 4) ?? '?'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ContentPanel() {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)
  const themeActif = useAtlasStore((s) => s.themeActif)
  const ouvrirModale = useAtlasStore((s) => s.ouvrirModale)

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

  if (themeActif === 'figures') {
    const figures = chargerFichierPeriode(ereActive, periodeActive, 'figures') ?? []
    return (
      <main>
        {fil}
        <h2>{theme?.nom}</h2>
        <GrilleFigures figures={figures} ouvrirModale={ouvrirModale} />
      </main>
    )
  }

  if (themeActif === 'carte') {
    return (
      <main>
        {fil}
        <h2>{theme?.nom}</h2>
        <CarteRoyaume />
      </main>
    )
  }

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
              <p key={i}>
                <TexteEnrichi texte={p} />
              </p>
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
            <BlocSources ids={a.sources} />
          </article>
        ))
      )}
    </main>
  )
}
