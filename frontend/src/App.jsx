import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import CPUPage from './pages/CPUPage'
import MemoryPage from './pages/MemoryPage'
import StoragePage from './pages/StoragePage'
import AlertsPage from './pages/AlertsPage'
import SettingsPage from './pages/SettingsPage'
import SystemInfoPage from './pages/SystemInfoPage'
import ProcessesPage from './pages/ProcessesPage'
import PlaceholderPage from './pages/PlaceholderPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cpu" element={<CPUPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/gpu" element={<PlaceholderPage title="GPU" description="GPU data will be shown only when your hardware provides it." />} />
          <Route path="/storage"element={<StoragePage />}/>
          <Route path="/processes" element={<ProcessesPage />}/>
          <Route path="/alerts"element={<AlertsPage />}/>
          <Route path="/system-info" element={<SystemInfoPage />}/>
          <Route path="/settings" element={<SettingsPage />}/>
          <Route path="/custom" element={<PlaceholderPage title="Custom page" description="This is reserved for the feature you choose later." />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
