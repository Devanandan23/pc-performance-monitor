import { useState } from 'react'
import DashboardHeader from '../components/DashboardHeader'
import MetricCard from '../components/MetricCard'

const initialMetrics = [
  { label: 'CPU', value: 42, unit: '%', detail: 'Normal workload', tone: 'blue' },
  { label: 'Memory', value: 61, unit: '%', detail: '9.8 GB of 16 GB', tone: 'purple' },
  { label: 'GPU', value: 37, unit: '%', detail: 'Available in a later stage', tone: 'pink' },
  { label: 'Disk', value: 73, unit: '%', detail: '348 GB of 476 GB', tone: 'orange' },
]

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
      <section className="learning-note">
        <p className="eyebrow">STAGE 3</p>
        <h2>Navigation is ready</h2>
        <p>Use the sidebar to visit each future page. We will build their content one stage at a time.</p>
      </section>
    </main>
  )
}

export default DashboardPage
