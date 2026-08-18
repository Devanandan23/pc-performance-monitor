import { useEffect, useState } from 'react'
import axios from 'axios'

function ProcessesPage() {
  const [processes, setProcesses] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('cpu')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProcesses() {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/processes'
      )

      setProcesses(response.data.processes)
      setError('')
    } catch (error) {
      console.error(error)
      setError('Unable to load processes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProcesses()

    const interval = setInterval(loadProcesses, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredProcesses = processes
    .filter((process) =>
      process.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'memory') {
        return b.memory_mb - a.memory_mb
      }

      return b.cpu_percent - a.cpu_percent
    })

  return (
    <main className="dashboard-shell">
      <section className="process-card">
        <div className="card-title-row">
          <div>
            <p className="eyebrow">SYSTEM ACTIVITY</p>
            <h1>Running Processes</h1>
            <p>
              Monitor applications and background processes
              running on your computer.
            </p>
          </div>

          <button
            className="text-button"
            onClick={loadProcesses}
          >
            Refresh
          </button>
        </div>

        <div className="process-controls">
          <input
            type="text"
            placeholder="Search process..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="process-search"
          />

          <button
            className="text-button"
            onClick={() => setSortBy('cpu')}
          >
            Sort by CPU
          </button>

          <button
            className="text-button"
            onClick={() => setSortBy('memory')}
          >
            Sort by Memory
          </button>
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Process</th>
                <th>PID</th>
                <th>CPU</th>
                <th>Memory</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">
                    Loading processes...
                  </td>
                </tr>
              ) : filteredProcesses.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No processes found.
                  </td>
                </tr>
              ) : (
                filteredProcesses.map((process) => (
                  <tr key={process.pid}>
                    <td>
                      <strong>{process.name}</strong>
                    </td>

                    <td>
                      {process.pid}
                    </td>

                    <td>
                      {process.cpu_percent.toFixed(1)}%
                    </td>

                    <td>
                      {process.memory_mb >= 1024
                        ? `${(
                            process.memory_mb / 1024
                          ).toFixed(2)} GB`
                        : `${process.memory_mb.toFixed(2)} MB`}
                    </td>

                    <td>
                      <span className="status-badge">
                        <i />
                        {process.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default ProcessesPage