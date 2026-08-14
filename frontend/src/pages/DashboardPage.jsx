import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardHeader from '../components/DashboardHeader'
import ChartCard from '../components/ChartCard'
import MetricCard from '../components/MetricCard'
import ProcessTable from '../components/ProcessTable'

const chartData = {
  cpu: [32, 41, 38, 48, 36, 51, 42],
  memory: [55, 58, 57, 60, 61, 59, 61],
  network: [12, 24, 18, 38, 26, 16, 31],
}

function createChartPoints(values) {
  return values.map((value, index) => ({ time: index, value }))
}

function DashboardPage() {
  const [metrics, setMetrics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  async function loadMetrics() {
    setIsRefreshing(true)
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/metrics/')
      const { cpu, memory, disk } = response.data
      setMetrics([
        { label: 'CPU', value: cpu.percent, unit: '%', detail: `${cpu.logical_cores} logical cores`, tone: 'blue' },
        { label: 'Memory', value: memory.percent, unit: '%', detail: `${memory.used_gb} GB of ${memory.total_gb} GB`, tone: 'purple' },
        { label: 'GPU', value: 'N/A', unit: '', detail: 'Not available yet', tone: 'pink' },
        { label: 'Disk', value: disk.percent, unit: '%', detail: `${disk.free_gb} GB free`, tone: 'orange' },
      ])
      setLastUpdated(new Date().toLocaleTimeString())
      setError('')
    } catch {
      setError('Cannot reach the Django API. Make sure it is running on port 8000.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadMetrics()
    const pollId = window.setInterval(loadMetrics, 5000)
    return () => window.clearInterval(pollId)
  }, [])

  if (isLoading) {
    return <main className="dashboard-shell"><p className="loading-message">Loading real PC metrics…</p></main>
  }

  return (
    <main className="dashboard-shell">
      <DashboardHeader isRefreshing={isRefreshing} onRefresh={loadMetrics} />
      {error && <p className="error-message">{error}</p>}
      <section className="metrics-section" aria-labelledby="overview-title">
        <div className="section-heading">
          <div><p className="eyebrow">OVERVIEW</p><h2 id="overview-title">Current performance</h2></div>
          <p>{lastUpdated ? `Updated at ${lastUpdated}` : 'Waiting for data'}</p>
        </div>
        <div className="metric-grid">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </div>
      </section>
      <section className="chart-grid" aria-label="Performance history">
        <ChartCard title="CPU usage" value="42" unit="%" color="#38bdf8" data={createChartPoints(chartData.cpu)} />
        <ChartCard title="Memory usage" value="61" unit="%" color="#a78bfa" data={createChartPoints(chartData.memory)} />
        <ChartCard title="Network download" value="31" unit=" Mbps" color="#4ade80" data={createChartPoints(chartData.network)} />
      </section>
      <div className="dashboard-bottom">
        <ProcessTable />
        <section className="system-card">
          <p className="eyebrow">SYSTEM</p><h2>Device summary</h2>
          <dl><div><dt>Operating system</dt><dd>Available from API</dd></div><div><dt>Uptime</dt><dd>Available from API</dd></div><div><dt>Connection</dt><dd><span className="status-badge"><i />Online</span></dd></div></dl>
        </section>
      </div>
    </main>
  )
}

export default DashboardPage
