import { useEffect, useState } from 'react'
import axios from 'axios'

function AlertsPage() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
  })

  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const CPU_WARNING = 70
  const CPU_CRITICAL = 90

  const MEMORY_WARNING = 75
  const MEMORY_CRITICAL = 90

  const DISK_WARNING = 80
  const DISK_CRITICAL = 90

  function createAlerts(data) {
    const newAlerts = []

    if (data.cpu >= CPU_CRITICAL) {
      newAlerts.push({
        id: 'cpu-critical',
        type: 'critical',
        title: 'High CPU usage',
        message: `CPU usage is ${data.cpu}%`,
        value: data.cpu,
      })
    } else if (data.cpu >= CPU_WARNING) {
      newAlerts.push({
        id: 'cpu-warning',
        type: 'warning',
        title: 'CPU usage is high',
        message: `CPU usage is ${data.cpu}%`,
        value: data.cpu,
      })
    }

    if (data.memory >= MEMORY_CRITICAL) {
      newAlerts.push({
        id: 'memory-critical',
        type: 'critical',
        title: 'High memory usage',
        message: `Memory usage is ${data.memory}%`,
        value: data.memory,
      })
    } else if (data.memory >= MEMORY_WARNING) {
      newAlerts.push({
        id: 'memory-warning',
        type: 'warning',
        title: 'Memory usage is high',
        message: `Memory usage is ${data.memory}%`,
        value: data.memory,
      })
    }

    if (data.disk >= DISK_CRITICAL) {
      newAlerts.push({
        id: 'disk-critical',
        type: 'critical',
        title: 'Disk space is low',
        message: `Disk usage is ${data.disk}%`,
        value: data.disk,
      })
    } else if (data.disk >= DISK_WARNING) {
      newAlerts.push({
        id: 'disk-warning',
        type: 'warning',
        title: 'Disk usage is high',
        message: `Disk usage is ${data.disk}%`,
        value: data.disk,
      })
    }

    return newAlerts
  }

  async function loadAlerts() {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/metrics/'
      )

      const data = response.data

      const currentMetrics = {
        cpu: data.cpu.percent,
        memory: data.memory.percent,
        disk: data.disk.percent,
      }

      setMetrics(currentMetrics)
      setAlerts(createAlerts(currentMetrics))
    } catch (error) {
      console.error(
        'Failed to load monitoring data:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()

    const interval = window.setInterval(
      loadAlerts,
      5000
    )

    return () => window.clearInterval(interval)
  }, [])

  function getStatus() {
    if (
      metrics.cpu >= CPU_CRITICAL ||
      metrics.memory >= MEMORY_CRITICAL ||
      metrics.disk >= DISK_CRITICAL
    ) {
      return 'Critical'
    }

    if (
      metrics.cpu >= CPU_WARNING ||
      metrics.memory >= MEMORY_WARNING ||
      metrics.disk >= DISK_WARNING
    ) {
      return 'Warning'
    }

    return 'Healthy'
  }

  if (loading) {
    return (
      <main className="dashboard-shell">
        <p className="loading-message">
          Checking system alerts...
        </p>
      </main>
    )
  }

  const status = getStatus()

  return (
    <main className="dashboard-shell">

      <section className="metrics-section">

        <div className="section-heading">

          <div>
            <p className="eyebrow">
              ALERTS
            </p>

            <h2>
              System health
            </h2>
          </div>

          <span
            className={`alert-status ${status.toLowerCase()}`}
          >
            {status}
          </span>

        </div>

        <div className="metric-grid">

          <div className="metric-card">
            <p>CPU</p>

            <h3>
              {metrics.cpu}%
            </h3>

            <span>
              Warning: {CPU_WARNING}%
            </span>
          </div>

          <div className="metric-card">
            <p>Memory</p>

            <h3>
              {metrics.memory}%
            </h3>

            <span>
              Warning: {MEMORY_WARNING}%
            </span>
          </div>

          <div className="metric-card">
            <p>Disk</p>

            <h3>
              {metrics.disk}%
            </h3>

            <span>
              Warning: {DISK_WARNING}%
            </span>
          </div>

          <div className="metric-card">
            <p>Active Alerts</p>

            <h3>
              {alerts.length}
            </h3>

            <span>
              Automatically monitored
            </span>
          </div>

        </div>

      </section>

      <section className="system-card">

        <p className="eyebrow">
          CURRENT ALERTS
        </p>

        <h2>
          Monitoring status
        </h2>

        {alerts.length === 0 ? (
          <div className="no-alerts">
            <span className="alert-check">
              ✓
            </span>

            <div>
              <strong>
                System is healthy
              </strong>

              <p>
                CPU, memory, and disk usage are
                within normal limits.
              </p>
            </div>
          </div>
        ) : (
          <div className="alert-list">

            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-item ${alert.type}`}
              >

                <div>
                  <strong>
                    {alert.title}
                  </strong>

                  <p>
                    {alert.message}
                  </p>
                </div>

                <span>
                  {alert.type === 'critical'
                    ? 'CRITICAL'
                    : 'WARNING'}
                </span>

              </div>
            ))}

          </div>
        )}

      </section>

      <section className="system-card">

        <p className="eyebrow">
          ALERT THRESHOLDS
        </p>

        <h2>
          Monitoring rules
        </h2>

        <dl>

          <div>
            <dt>CPU warning</dt>
            <dd>{CPU_WARNING}%</dd>
          </div>

          <div>
            <dt>CPU critical</dt>
            <dd>{CPU_CRITICAL}%</dd>
          </div>

          <div>
            <dt>Memory warning</dt>
            <dd>{MEMORY_WARNING}%</dd>
          </div>

          <div>
            <dt>Memory critical</dt>
            <dd>{MEMORY_CRITICAL}%</dd>
          </div>

          <div>
            <dt>Disk warning</dt>
            <dd>{DISK_WARNING}%</dd>
          </div>

          <div>
            <dt>Disk critical</dt>
            <dd>{DISK_CRITICAL}%</dd>
          </div>

        </dl>

      </section>

    </main>
  )
}

export default AlertsPage