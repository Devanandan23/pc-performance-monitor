import { useState } from 'react'
import DashboardHeader from '../components/DashboardHeader'
import ChartCard from '../components/ChartCard'
import MetricCard from '../components/MetricCard'
import ProcessTable from '../components/ProcessTable'

const initialMetrics = [
  { label: 'CPU', value: 42, unit: '%', detail: 'Normal workload', tone: 'blue' },
  { label: 'Memory', value: 61, unit: '%', detail: '9.8 GB of 16 GB', tone: 'purple' },
  { label: 'GPU', value: 37, unit: '%', detail: 'Available in a later stage', tone: 'pink' },
  { label: 'Disk', value: 73, unit: '%', detail: '348 GB of 476 GB', tone: 'orange' },
]

const chartData = {
  cpu: [32, 41, 38, 48, 36, 51, 42],
  memory: [55, 58, 57, 60, 61, 59, 61],
  network: [12, 24, 18, 38, 26, 16, 31],
}

function createChartPoints(values) {
  return values.map((value, index) => ({ time: index, value }))
}

function DashboardPage() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [isRefreshing, setIsRefreshing] = useState(false)

  function refreshSampleData() {
    setIsRefreshing(true)

    window.setTimeout(() => {
      setMetrics((currentMetrics) =>
        currentMetrics.map((metric) => ({
          ...metric,
          value: Math.floor(Math.random() * 61) + 20,
        })),
      )
      setIsRefreshing(false)
    }, 500)
  }

  return (
    <main className="dashboard-shell">
      <DashboardHeader isRefreshing={isRefreshing} onRefresh={refreshSampleData} />
      <section className="metrics-section" aria-labelledby="overview-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h2 id="overview-title">Current performance</h2>
          </div>
          <p>Sample values for learning React</p>
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
          <dl><div><dt>Operating system</dt><dd>Windows 11</dd></div><div><dt>Uptime</dt><dd>3 days, 6 hours</dd></div><div><dt>Connection</dt><dd><span className="status-badge"><i />Online</span></dd></div></dl>
        </section>
      </div>
    </main>
  )
}

export default DashboardPage
