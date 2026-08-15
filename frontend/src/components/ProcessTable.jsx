import { useEffect, useState } from 'react'
import axios from 'axios'

function ProcessTable() {
  const [processes, setProcesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('cpu')
  const [processCount, setProcessCount] = useState(0)

  async function loadProcesses() {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/processes/'
      )

      setProcesses(response.data.processes)
      setProcessCount(response.data.process_count)
    } catch (error) {
      console.error('Failed to load processes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProcesses()

    const interval = window.setInterval(loadProcesses, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const filteredProcesses = processes
    .filter((process) =>
      process.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'memory') {
        return b.memory_percent - a.memory_percent
      }

      return b.cpu_percent - a.cpu_percent
    })

  return (
    <section className="process-card" aria-labelledby="processes-title">
      <div className="card-title-row">
        <div>
          <p className="eyebrow">ACTIVITY</p>
          <h2 id="processes-title">Top processes ({processCount})</h2>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search process..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="process-search"
          />

          <button className="text-button" type="button">
            Live
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Process</th>

              <th>
                <button
                  className="table-sort-button"
                  type="button"
                  onClick={() => setSortBy('cpu')}
                >
                  CPU
                </button>
              </th>

              <th>
                <button
                  className="table-sort-button"
                  type="button"
                  onClick={() => setSortBy('memory')}
                >
                  Memory
                </button>
              </th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading processes...</td>
              </tr>
            ) : (
              filteredProcesses.map((process) => (
                <tr key={process.pid}>
                  <td>
                    <strong>{process.name}</strong>
                    <span>PID {process.pid}</span>
                  </td>

                  <td>{process.cpu_percent}%</td>

                  <td>
                    {process.memory_mb >= 1024
                      ? `${(process.memory_mb / 1024).toFixed(2)} GB`
                      : `${process.memory_mb} MB`}
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
  )
}

export default ProcessTable