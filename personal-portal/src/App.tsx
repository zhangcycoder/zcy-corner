import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import ScanLine from './components/ScanLine'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <ScanLine />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
