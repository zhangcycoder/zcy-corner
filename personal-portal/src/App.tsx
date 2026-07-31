import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteShell from './components/layout/SiteShell'
import HomePage from './pages/HomePage'
import LegacyProjectRedirect from './pages/LegacyProjectRedirect'
import NotFoundPage from './pages/NotFoundPage'
import ResumePage from './pages/ResumePage'
import TreasureDetailPage from './pages/TreasureDetailPage'
import VaultPage from './pages/VaultPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/vault/:slug" element={<TreasureDetailPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/projects/:id" element={<LegacyProjectRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
