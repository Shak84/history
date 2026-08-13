import { useAtlasStore } from '../stores/atlasStore'
import themes from '../data/themes.json'

export default function ThemesSidebar() {
  const themeActif = useAtlasStore((s) => s.themeActif)
  const setTheme = useAtlasStore((s) => s.setTheme)

  return (
    <nav className="themes">
      <div className="themes-titre">Thèmes</div>
      {themes.map((t) => (
        <div key={t.id}>
          {t.separateurAvant && <div className="themes-sep" />}
          <div
            className={`theme ${t.id === themeActif ? 'actif' : ''}`}
            onClick={() => setTheme(t.id)}
          >
            <span className="glyphe">{t.glyphe}</span>
            <span className="lib">{t.nom}</span>
          </div>
        </div>
      ))}
    </nav>
  )
}
