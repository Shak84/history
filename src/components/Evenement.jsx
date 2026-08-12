import Decision from './Decision'
import BlocSources from './BlocSources'
import TexteEnrichi from './TexteEnrichi'

export default function Evenement({ evenement, personnageId }) {
  const scene = evenement.vecu?.[personnageId]

  return (
    <div className="border border-stone-300 rounded-lg p-6 max-w-2xl mx-auto text-left">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs uppercase tracking-wide text-stone-400">
          {evenement.date}
        </span>
        {evenement.statut === 'a_verifier' && (
          <span className="text-xs text-amber-600 border border-amber-300 bg-amber-50 rounded px-2 py-0.5">
            sources à vérifier
          </span>
        )}
      </div>
      <h2 className="text-xl font-semibold text-stone-800 mb-3">{evenement.titre}</h2>

      <p className="text-stone-700 mb-4">
        <TexteEnrichi texte={evenement.resume} />
      </p>

      {scene && (
        <div className="border-l-2 border-stone-300 pl-4 mb-2">
          <div className="text-xs text-stone-400 italic mb-1">scène reconstituée</div>
          <p className="text-stone-600 italic">{scene.texte}</p>
          {scene.decision && (
            <Decision key={`${evenement.id}-${personnageId}`} decision={scene.decision} />
          )}
        </div>
      )}

      <BlocSources ids={evenement.sources} />
    </div>
  )
}
