import { useEffect, useState } from 'react'
import axios from 'axios'

function CPUPage() {
  const [cpu, setCpu] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  async function loadCPU() {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/cpu'
      )

      const data = response.data

      setCpu(data)

      setHistory((previous) => [
        ...previous,
        {
          time: new Date().toLocaleTimeString(),
          usage: data.usage,
        },
      ].slice(-20))

      setLastUpdated(
        new Date().toLocaleTimeString()
      )

      setError('')
    } catch (error) {
      console.error(
        'Failed to load CPU information:',
        error
      )

      setError(
        'Unable to load CPU information. Make sure the FastAPI backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCPU()

    const interval = window.setInterval(
      loadCPU,
      5000
    )

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <main className="dashboard-shell">
        <p className="loading-message">
          Loading CPU information...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="dashboard-shell">
        <p className="error-message">
          {error}
        </p>
      </main>
    )
  }

  return (
    <main className="dashboard-shell">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="metrics-section">

        <div className="section-heading">

          <div>
            <p className="eyebrow">
              CPU MONITOR
            </p>

            <h2>
              Processor performance
            </h2>
          </div>

          <p>
            {lastUpdated
              ? `Updated at ${lastUpdated}`
              : 'Waiting for data'}
          </p>

        </div>

        {/* =================================================
            CPU METRICS
        ================================================= */}

        <div className="metric-grid">

          <div className="metric-card">
            <p>
              CPU Usage
            </p>

            <h2>
              {cpu.usage}%
            </h2>

            <span>
              Current processor load
            </span>
          </div>


          <div className="metric-card">
            <p>
              Physical Cores
            </p>

            <h2>
              {cpu.cores}
            </h2>

            <span>
              Physical CPU cores
            </span>
          </div>


          <div className="metric-card">
            <p>
              Logical Threads
            </p>

            <h2>
              {cpu.threads}
            </h2>

            <span>
              Available logical processors
            </span>
          </div>


          <div className="metric-card">
            <p>
              Frequency
            </p>

            <h2>
              {(cpu.frequency / 1000).toFixed(2)} GHz
            </h2>

            <span>
              Current CPU frequency
            </span>
          </div>

        </div>

      </section>


      {/* =================================================
          CPU HISTORY
      ================================================= */}

      <section className="system-card">

        <p className="eyebrow">
          LIVE HISTORY
        </p>

        <h2>
          CPU usage history
        </h2>

        <div className="cpu-history">

          {history.length === 0 ? (
            <p>
              Waiting for CPU data...
            </p>
          ) : (
            history.map((item, index) => (
              <div
                className="cpu-history-row"
                key={`${item.time}-${index}`}
              >

                <span>
                  {item.time}
                </span>

                <div className="cpu-history-bar">

                  <div
                    className="cpu-history-fill"
                    style={{
                      width: `${Math.min(
                        item.usage,
                        100
                      )}%`,
                    }}
                  />

                </div>

                <strong>
                  {item.usage}%
                </strong>

              </div>
            ))
          )}

        </div>

      </section>


      {/* =================================================
          PER CORE USAGE
      ================================================= */}

      {cpu.per_core && (
        <section className="system-card">

          <p className="eyebrow">
            PROCESSOR DETAILS
          </p>

          <h2>
            Per-core usage
          </h2>

          <div className="core-grid">

            {cpu.per_core.map(
              (usage, index) => (
                <div
                  className="core-card"
                  key={index}
                >

                  <div className="core-header">

                    <span>
                      Core {index + 1}
                    </span>

                    <strong>
                      {usage}%
                    </strong>

                  </div>

                  <div className="core-bar">

                    <div
                      className="core-bar-fill"
                      style={{
                        width: `${Math.min(
                          usage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </section>
      )}

    </main>
  )
}

export default CPUPage