import { useEffect, useState } from 'react'
import axios from 'axios'

function StoragePage() {
  const [disk, setDisk] = useState({
    total: 0,
    used: 0,
    free: 0,
    percent: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadDisk() {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/disk'
      )

      setDisk(response.data)
      setError('')
    } catch (error) {
      console.error('Failed to load disk information:', error)

      setError(
        'Cannot connect to the monitoring API.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDisk()

    const interval = window.setInterval(
      loadDisk,
      5000
    )

    return () => window.clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <main className="dashboard-shell">
        <p className="loading-message">
          Loading storage information...
        </p>
      </main>
    )
  }

  const totalGB = disk.total / (1024 ** 3)
  const usedGB = disk.used / (1024 ** 3)
  const freeGB = disk.free / (1024 ** 3)

  return (
    <main className="dashboard-shell">

      <section className="metrics-section">

        <div className="section-heading">
          <div>
            <p className="eyebrow">STORAGE</p>

            <h2>Disk performance</h2>
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
            <p>Disk Usage</p>

            <h3>
              {disk.percent}%
            </h3>

            <span>
              Currently used
            </span>
          </div>

          <div className="metric-card">
            <p>Used Storage</p>

            <h3>
              {usedGB.toFixed(2)} GB
            </h3>

            <span>
              Space currently used
            </span>
          </div>

          <div className="metric-card">
            <p>Free Storage</p>

            <h3>
              {freeGB.toFixed(2)} GB
            </h3>

            <span>
              Space available
            </span>
          </div>

          <div className="metric-card">
            <p>Total Storage</p>

            <h3>
              {totalGB.toFixed(2)} GB
            </h3>

            <span>
              Total disk capacity
            </span>
          </div>

        </div>
      </section>

      <section className="system-card">

        <p className="eyebrow">
          STORAGE USAGE
        </p>

        <h2>Disk capacity</h2>

        <div className="storage-progress">

          <div
            className="storage-progress-fill"
            style={{
              width: `${disk.percent}%`,
            }}
          />

        </div>

        <div className="storage-progress-info">

          <span>
            {usedGB.toFixed(2)} GB used
          </span>

          <span>
            {freeGB.toFixed(2)} GB free
          </span>

        </div>

      </section>

      <section className="system-card">

        <p className="eyebrow">
          DISK DETAILS
        </p>

        <h2>Storage information</h2>

        <dl>

          <div>
            <dt>Total capacity</dt>

            <dd>
              {totalGB.toFixed(2)} GB
            </dd>
          </div>

          <div>
            <dt>Used space</dt>

            <dd>
              {usedGB.toFixed(2)} GB
            </dd>
          </div>

          <div>
            <dt>Free space</dt>

            <dd>
              {freeGB.toFixed(2)} GB
            </dd>
          </div>

          <div>
            <dt>Usage percentage</dt>

            <dd>
              {disk.percent}%
            </dd>
          </div>

        </dl>

      </section>

    </main>
  )
}

export default StoragePage