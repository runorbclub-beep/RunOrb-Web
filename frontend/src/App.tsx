// 主 App 组件
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FreeStylePage from './pages/FreeStylePage'
import CompetePage from './pages/CompetePage'
import PKPage from './pages/PKPage'
import MyDataPage from './pages/MyDataPage'
import RankingPage from './pages/RankingPage'
import DownloadPage from './pages/DownloadPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/freestyle" element={<FreeStylePage />} />
        <Route path="/compete" element={<CompetePage />} />
        <Route path="/pk" element={<PKPage />} />
        <Route path="/mydata" element={<MyDataPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </Router>
  )
}

export default App
