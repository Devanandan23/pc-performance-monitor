import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardHeader from '../components/DashboardHeader'
import ChartCard from '../components/ChartCard'
import MetricCard from '../components/MetricCard'
import ProcessTable from '../components/ProcessTable'

function DashboardPage() {
  const [metrics, setMetrics] = useState([])
  const [history, setHistory] = useState({
    cpu: [],
    memory: [],
    download: [],
    upload: [],
  })

  const [system, setSystem] = useState({
    computer_name: '',
    operating_system: '',
    uptime_seconds: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  async function loadMetrics() {
    setIsRefreshing(true)

    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/metrics/'
      )

      const {
        cpu,
        memory,
        disk,
        network,
        system,
        uptime_seconds,
      } = response.data

      // Update metric cards
      setMetrics([
        {
          label: 'CPU',
          value: cpu.percent,
          unit: '%',
          detail: `${cpu.logical_cores} logical cores`,
          tone: 'blue',
        },
        {
          label: 'Memory',
          value: memory.percent,
          unit: '%',
          detail: `${memory.used_gb} GB of ${memory.total_gb} GB`,
          tone: 'purple',
        },
        {
          label: 'Disk',
          value: disk.percent,
          unit: '%',
          detail: `${disk.free_gb} GB free`,
          tone: 'orange',
        },
        {
          label: 'Network',
          value: network.download_speed,
          unit: ' MB/s',
          detail: `↑ ${network.upload_speed} MB/s`,
          tone: 'green',
        },
      ])

      // Update system information
      setSystem({
        computer_name: system.computer_name,
        operating_system: system.operating_system,
        uptime_seconds: uptime_seconds,
      })

      // Update performance history
      setHistory((previous) => ({
        cpu: [
          ...previous.cpu,
          {
            time: new Date().toLocaleTimeString(),
            value: cpu.percent,
          },
        ].slice(-20),

        memory: [
          ...previous.memory,
          {
            time: new Date().toLocaleTimeString(),
            value: memory.percent,
          },
        ].slice(-20),

        download: [
          ...previous.download,
          {
            time: new Date().toLocaleTimeString(),
            value: network.download_speed,
          },
        ].slice(-20),

        upload: [
          ...previous.upload,
          {
            time: new Date().toLocaleTimeString(),
            value: network.upload_speed,
          },
        ].slice(-20),
      }))

      setLastUpdated(new Date().toLocaleTimeString())
      setError('')
    } catch (error) {
      console.error(error)

      setError(
        'Cannot reach the FastAPI backend. Make sure it is running on port 8000.'
      )
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
    return (
      <main className="dashboard-shell">
        <p className="loading-message">
          Loading real PC metrics…
        </p>
      </main>
    )
  }

  return (
    <main className="dashboard-shell">

      <DashboardHeader
        isRefreshing={isRefreshing}
        onRefresh={loadMetrics}
      />

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* =================================================
          CURRENT PERFORMANCE
      ================================================= */}

      <section
        className="metrics-section"
        aria-labelledby="overview-title"
      >
        <div className="section-heading">

          <div>
            <p className="eyebrow">
              OVERVIEW
            </p>

            <h2 id="overview-title">
              Current performance
            </h2>
          </div>

          <p>
            {lastUpdated
              ? `Updated at ${lastUpdated}`
              : 'Waiting for data'}
          </p>

        </div>

        <div className="metric-grid">

          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              {...metric}
            />
          ))}

        </div>
      </section>


      {/* =================================================
          PERFORMANCE HISTORY
      ================================================= */}

      <section
        className="chart-grid"
        aria-label="Performance history"
      >

        <ChartCard
          title="CPU usage"
          value={
            history.cpu.length
              ? history.cpu[history.cpu.length - 1].value
              : 0
          }
          unit="%"
          color="#38bdf8"
          data={history.cpu}
        />

        <ChartCard
          title="Memory usage"
          value={
            history.memory.length
              ? history.memory[
                  history.memory.length - 1
                ].value
              : 0
          }
          unit="%"
          color="#a78bfa"
          data={history.memory}
        />

        <ChartCard
          title="Download speed"
          value={
            history.download.length
              ? history.download[
                  history.download.length - 1
                ].value
              : 0
          }
          unit=" MB/s"
          color="#4ade80"
          data={history.download}
        />

        <ChartCard
          title="Upload speed"
          value={
            history.upload.length
              ? history.upload[
                  history.upload.length - 1
                ].value
              : 0
          }
          unit=" MB/s"
          color="#f97316"
          data={history.upload}
        />

      </section>


      {/* =================================================
          BOTTOM SECTION
      ================================================= */}

      <div className="dashboard-bottom">

        <ProcessTable />


        {/* SYSTEM INFORMATION */}

        <section className="system-card">

          <p className="eyebrow">
            SYSTEM
          </p>

          <h2>
            Device summary
          </h2>

          <dl>

            <div>
              <dt>
                Operating system
              </dt>

              <dd>
                {system.operating_system}
              </dd>
            </div>


            <div>
              <dt>
                Computer name
              </dt>

              <dd>
                {system.computer_name}
              </dd>
            </div>


            <div>
              <dt>
                Uptime
              </dt>

              <dd>
                {Math.floor(
                  system.uptime_seconds / 86400
                )}
                d{' '}

                {Math.floor(
                  (system.uptime_seconds % 86400) / 3600
                )}
                h{' '}

                {Math.floor(
                  (system.uptime_seconds % 3600) / 60
                )}
                m
              </dd>
            </div>


            <div>
              <dt>
                Connection
              </dt>

              <dd>
                <span className="status-badge">
                  <i />
                  Online
                </span>
              </dd>
            </div>

          </dl>

        </section>

      </div>

    </main>
  )
}

export default DashboardPage