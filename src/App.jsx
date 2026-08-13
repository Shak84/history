import EresBar from './components/EresBar'
import PeriodesBar from './components/PeriodesBar'
import ThemesSidebar from './components/ThemesSidebar'
import ContentPanel from './components/ContentPanel'
import ChronoSidebar from './components/ChronoSidebar'

function App() {
  return (
    <div className="app">
      <EresBar />
      <PeriodesBar />
      <ThemesSidebar />
      <ContentPanel />
      <ChronoSidebar />
    </div>
  )
}

export default App
