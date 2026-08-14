import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import PlaceholderPage from './pages/PlaceholderPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cpu" element={<PlaceholderPage title="CPU" description="CPU usage, per-core details, and history will appear here." />} />
          <Route path="/memory" element={<PlaceholderPage title="Memory" description="RAM usage and memory-heavy processes will appear here." />} />
          <Route path="/gpu" element={<PlaceholderPage title="GPU" description="GPU data will be shown only when your hardware provides it." />} />
          <Route path="/storage" element={<PlaceholderPage title="Storage" description="Disk partitions and storage usage will appear here." />} />
          <Route path="/processes" element={<PlaceholderPage title="Processes" description="A searchable list of running processes will appear here." />} />
          <Route path="/alerts" element={<PlaceholderPage title="Alerts" description="Configured warning and critical alerts will appear here." />} />
          <Route path="/system-info" element={<PlaceholderPage title="System information" description="Your operating system and hardware details will appear here." />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" description="Refresh, theme, and alert preferences will appear here." />} />
          <Route path="/custom" element={<PlaceholderPage title="Custom page" description="This is reserved for the feature you choose later." />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
