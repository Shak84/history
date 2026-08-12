import figures from '../data/figures.json'
import BlocSources from './BlocSources'
import TexteEnrichi from './TexteEnrichi'

function SectionRegard({ titre, entrees }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-stone-700 mb-1">{titre}</h3>
      {(!entrees || entrees.length === 0) ? (
        <p className="text-sm text-stone-400 italic">Aucune position documentée sur ce point.</p>
      ) : (
        <ul className="space-y-2">
          {entrees.map((e, i) => (
            <li key={i} className="text-sm text-stone-700">
              <div className="font-medium">{e.pays ?? e.etat}</div>
              <div>{e.position}</div>
              {e.citation && <div className="italic text-stone-500">« {e.citation} »</div>}
              <BlocSources ids={e.sources} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function FigureModale({ id }) {
  const figure = figures.find((f) => f.id === id)
  if (!figure) return <p className="text-stone-500">Figure introuvable.</p>

  return (
    <div className="text-left">
      <div className="flex items-start gap-4 mb-4">
        {figure.iconographie?.[0] && (
          <img
            src={figure.iconographie[0].url_image}
            alt={figure.iconographie[0].titre}
            className="w-24 h-32 object-cover rounded border border-stone-200 shrink-0"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-stone-800">{figure.nom}</h2>
          <p className="text-sm text-stone-500">{figure.couche_sociale}</p>
          <p className="text-sm text-stone-500">
            {figure.naissance} — {figure.mort}
          </p>
        </div>
      </div>

      {figure.genealogie && (
        <div className="mb-4 text-sm text-stone-700">
          <h3 className="text-sm font-semibold text-stone-700 mb-1">Généalogie</h3>
          {figure.genealogie.pere && <div>Père : {figure.genealogie.pere}</div>}
          {figure.genealogie.mere && <div>Mère : {figure.genealogie.mere}</div>}
          {figure.genealogie.conjoints?.length > 0 && (
            <div>Conjoints : {figure.genealogie.conjoints.join(' ; ')}</div>
          )}
          {figure.genealogie.enfants?.length > 0 && (
            <div>Enfants : {figure.genealogie.enfants.join(' ; ')}</div>
          )}
          {figure.genealogie.notes && (
            <p className="text-stone-500 italic mt-1">{figure.genealogie.notes}</p>
          )}
        </div>
      )}

      {figure.faits?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-stone-700 mb-1">Faits</h3>
          <ul className="space-y-1">
            {figure.faits.map((f, i) => (
              <li key={i} className="text-sm text-stone-700">
                <span className="text-stone-400">{f.date}</span> — <TexteEnrichi texte={f.fait} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <SectionRegard titre="Regard sur les puissances étrangères" entrees={figure.regard_sur_les_puissances} />
      <SectionRegard titre="Regard sur les états de la société" entrees={figure.regard_sur_les_etats} />

      <BlocSources
        ids={[...new Set(figure.faits?.flatMap((f) => f.sources ?? []) ?? [])]}
      />
    </div>
  )
}
