import { useEffect, useState } from 'react'
import axios from 'axios'

function SystemInfoPage() {
  const [system, setSystem] = useState({
    os: '',
    os_version: '',
    machine: '',
    processor: '',
    hostname: '',
    python_version: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadSystemInfo() {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/system'
      )

      setSystem(response.data)
      setError('')
    } catch (error) {
      console.error(
        'Failed to load system information:',
        error
      )

      setError(
        'Cannot connect to the monitoring API.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSystemInfo()

    const interval = window.setInterval(
      loadSystemInfo,
      10000
    )

    return () => window.clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <main className="dashboard-shell">
        <p className="loading-message">
          Loading system information...
        </p>
      </main>
    )
  }

  return (
    <main className="dashboard-shell">

      <section className="metrics-section">

        <div className="section-heading">
          <div>
            <p className="eyebrow">SYSTEM</p>
            <h2>System information</h2>
          </div>

          <p>
            Live system details
          </p>
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="metric-grid">

          <div className="metric-card">
            <p>Operating System</p>

            <h3>
              {system.os || 'Unknown'}
            </h3>

            <span>
              Current operating system
            </span>
          </div>

          <div className="metric-card">
            <p>Architecture</p>

            <h3>
              {system.machine || 'Unknown'}
            </h3>

            <span>
              System architecture
            </span>
          </div>

          <div className="metric-card">
            <p>Computer Name</p>

            <h3>
              {system.hostname || 'Unknown'}
            </h3>

            <span>
              Device hostname
            </span>
          </div>

          <div className="metric-card">
            <p>Python Version</p>

            <h3>
              {system.python_version || 'Unknown'}
            </h3>

            <span>
              Backend Python version
            </span>
          </div>

        </div>
      </section>

      <section className="system-card">

        <p className="eyebrow">
          DEVICE DETAILS
        </p>

        <h2>Hardware & software</h2>

        <dl>

          <div>
            <dt>Operating system</dt>

            <dd>
              {system.os || 'Unknown'}
            </dd>
          </div>

          <div>
            <dt>OS version</dt>

            <dd>
              {system.os_version || 'Unknown'}
            </dd>
          </div>

          <div>
            <dt>Architecture</dt>

            <dd>
              {system.machine || 'Unknown'}
            </dd>
          </div>

          <div>
            <dt>Processor</dt>

            <dd>
              {system.processor || 'Unknown'}
            </dd>
          </div>

          <div>
            <dt>Computer name</dt>

            <dd>
              {system.hostname || 'Unknown'}
            </dd>
          </div>

          <div>
            <dt>Python version</dt>

            <dd>
              {system.python_version || 'Unknown'}
            </dd>
          </div>

        </dl>

      </section>

    </main>
  )
}

export default SystemInfoPage

