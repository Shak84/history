import { useAtlasStore } from '../stores/atlasStore'
import { chargerFichierPeriode } from '../data/loader'
import BlocSources from './BlocSources'
import TexteEnrichi from './TexteEnrichi'

function Section({ titre, vide, children }) {
  return (
    <div className="modale-section">
      <div className="modale-section-titre">{titre}</div>
      {vide ? <div className="modale-vide">{vide}</div> : children}
    </div>
  )
}

export default function FigureModale({ id }) {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)
  const figures = chargerFichierPeriode(ereActive, periodeActive, 'figures') ?? []
  const figure = figures.find((f) => f.id === id)

  if (!figure) return <p className="modale-vide">Figure introuvable.</p>

  const g = figure.genealogie ?? {}
  const aGenealogie = g.pere || g.mere || g.conjoints?.length || g.enfants?.length || g.notes

  return (
    <div>
      {figure.iconographie?.[0]?.url_image && (
        <img
          src={figure.iconographie[0].url_image}
          alt={figure.iconographie[0].titre}
          className="modale-portrait"
        />
      )}
      <h2>{figure.nom}</h2>
      <div className="modale-souscription">
        {figure.couche_sociale}
        {(figure.naissance || figure.mort) && ` · ${figure.naissance ?? '?'} — ${figure.mort ?? '?'}`}
      </div>

      <Section titre="Fonctions" vide={!figure.fonctions?.length && 'Aucune fonction documentée.'}>
        {figure.fonctions?.map((f, i) => (
          <div key={i} className="modale-entree">
            <div className="modale-entree-meta">
              {f.debut}
              {f.fin ? ` – ${f.fin}` : ''}
            </div>
            <div className="modale-entree-titre">{f.titre}</div>
            <BlocSources ids={f.sources} />
          </div>
        ))}
      </Section>

      <Section titre="Généalogie" vide={!aGenealogie && 'Aucune donnée généalogique documentée.'}>
        {g.pere && <div>Père : {g.pere}</div>}
        {g.mere && <div>Mère : {g.mere}</div>}
        {g.conjoints?.length > 0 && <div>Conjoints : {g.conjoints.join(' ; ')}</div>}
        {g.enfants?.length > 0 && <div>Enfants : {g.enfants.join(' ; ')}</div>}
        {g.notes && <p className="modale-note">{g.notes}</p>}
        <BlocSources ids={g.sources} />
      </Section>

      <Section
        titre="Traits de caractère"
        vide={
          !figure.traits_de_caractere?.length &&
          'Aucun trait de caractère documenté par un écrit du personnage ou de ses contemporains.'
        }
      >
        {figure.traits_de_caractere?.map((t, i) => (
          <div key={i} className="modale-entree">
            <div className="modale-entree-titre">{t.trait}</div>
            {t.evidence && <p>{t.evidence}</p>}
            {t.citation && <div className="citation">« {t.citation} »</div>}
            <BlocSources ids={t.sources} />
          </div>
        ))}
      </Section>

      <Section titre="Réalisations" vide={!figure.realisations?.length && 'Aucune réalisation documentée.'}>
        {figure.realisations?.map((r, i) => (
          <div key={i} className="modale-entree">
            <div className="modale-entree-meta">{r.date}</div>
            <div className="modale-entree-titre">{r.realisation}</div>
            {r.description && (
              <p>
                <TexteEnrichi texte={r.description} />
              </p>
            )}
            <BlocSources ids={r.sources} />
          </div>
        ))}
      </Section>

      <Section
        titre="Ambitions"
        vide={!figure.ambitions?.length && 'Aucune ambition documentée par un écrit du personnage lui-même.'}
      >
        {figure.ambitions?.map((a, i) => (
          <div key={i} className="modale-entree">
            <div className="modale-entree-titre">{a.ambition}</div>
            {a.description && <p>{a.description}</p>}
            {a.citation && <div className="citation">« {a.citation} »</div>}
            <BlocSources ids={a.sources} />
          </div>
        ))}
      </Section>

      <Section
        titre="Craintes"
        vide={!figure.craintes?.length && 'Aucune crainte documentée par un écrit du personnage lui-même.'}
      >
        {figure.craintes?.map((c, i) => (
          <div key={i} className="modale-entree">
            <div className="modale-entree-titre">{c.crainte}</div>
            {c.description && <p>{c.description}</p>}
            {c.citation && <div className="citation">« {c.citation} »</div>}
            <BlocSources ids={c.sources} />
          </div>
        ))}
      </Section>

      <Section
        titre="Regard sur les puissances étrangères"
        vide={!figure.regard_sur_les_puissances?.length && 'Aucune position documentée sur ce point.'}
      >
        {figure.regard_sur_les_puissances?.map((r, i) => (
          <div key={i} className="modale-entree">
            <div className="modale-entree-titre">{r.pays}</div>
            <p>{r.position}</p>
            {r.citation && <div className="citation">« {r.citation} »</div>}
            <BlocSources ids={r.sources} />
          </div>
        ))}
      </Section>

      <Section
        titre="Regard sur les états de la société"
        vide={!figure.regard_sur_les_etats?.length && 'Aucune position documentée sur ce point.'}
      >
        {figure.regard_sur_les_etats?.map((r, i) => (
          <div key={i} className="modale-entree">
            <div className="modale-entree-titre">{r.etat}</div>
            <p>{r.position}</p>
            {r.citation && <div className="citation">« {r.citation} »</div>}
            <BlocSources ids={r.sources} />
          </div>
        ))}
      </Section>
    </div>
  )
}
