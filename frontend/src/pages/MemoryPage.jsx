import { useEffect, useState } from 'react'
import axios from 'axios'
import ChartCard from '../components/ChartCard'

function MemoryPage() {
  const [memory, setMemory] = useState({
    percent: 0,
    used: 0,
    total: 0,
    available: 0,
  })

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadMemory() {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/memory'
      )

      const data = response.data

      setMemory(data)

      setHistory((previous) => [
        ...previous,
        {
          time: new Date().toLocaleTimeString(),
          value: data.percent,
        },
      ].slice(-20))

      setError('')
    } catch (error) {
      console.error('Failed to load memory:', error)

      setError(
        'Cannot connect to the monitoring API.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMemory()

    const interval = window.setInterval(
      loadMemory,
      5000
    )

    return () => window.clearInterval(interval)
  }, [])

  const usedGB = memory.used / (1024 ** 3)
  const totalGB = memory.total / (1024 ** 3)
  const availableGB = memory.available / (1024 ** 3)

  if (loading) {
    return (
      <main className="dashboard-shell">
        <p className="loading-message">
          Loading memory information...
        </p>
      </main>
    )
  }

  return (
    <main className="dashboard-shell">

      <section className="metrics-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MEMORY</p>
            <h2>RAM performance</h2>
          </div>

          <p>
            Updated {new Date().toLocaleTimeString()}
          </p>
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="metric-grid">

          <div className="metric-card">
            <p>Memory Usage</p>

            <h3>
              {memory.percent}%
            </h3>

            <span>
              Current RAM usage
            </span>
          </div>

          <div className="metric-card">
            <p>Used Memory</p>

            <h3>
              {usedGB.toFixed(2)} GB
            </h3>

            <span>
              Currently in use
            </span>
          </div>

          <div className="metric-card">
            <p>Total Memory</p>

            <h3>
              {totalGB.toFixed(2)} GB
            </h3>

            <span>
              Installed RAM
            </span>
          </div>

          <div className="metric-card">
            <p>Available</p>

            <h3>
              {availableGB.toFixed(2)} GB
            </h3>

            <span>
              Currently available
            </span>
          </div>

        </div>
      </section>

      <section className="chart-grid">

        <ChartCard
          title="Memory usage"
          value={memory.percent}
          unit="%"
          color="#a78bfa"
          data={history}
        />

      </section>

      <section className="system-card">

        <p className="eyebrow">
          MEMORY DETAILS
        </p>

        <h2>RAM information</h2>

        <dl>

          <div>
            <dt>Total memory</dt>
            <dd>
              {totalGB.toFixed(2)} GB
            </dd>
          </div>

          <div>
            <dt>Used memory</dt>
            <dd>
              {usedGB.toFixed(2)} GB
            </dd>
          </div>

          <div>
            <dt>Available memory</dt>
            <dd>
              {availableGB.toFixed(2)} GB
            </dd>
          </div>

          <div>
            <dt>Usage</dt>
            <dd>
              {memory.percent}%
            </dd>
          </div>

        </dl>

      </section>

    </main>
  )
}

export default MemoryPage