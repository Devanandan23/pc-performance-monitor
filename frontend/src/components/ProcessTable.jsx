const sampleProcesses = [
  { name: 'Chrome.exe', pid: 8420, cpu: '8.4%', memory: '1.12 GB', status: 'Running' },
  { name: 'Code.exe', pid: 12144, cpu: '4.1%', memory: '726 MB', status: 'Running' },
  { name: 'explorer.exe', pid: 3180, cpu: '1.2%', memory: '186 MB', status: 'Running' },
]

function ProcessTable() {
  return (
    <section className="process-card" aria-labelledby="processes-title">
      <div className="card-title-row">
        <div>
          <p className="eyebrow">ACTIVITY</p>
          <h2 id="processes-title">Top processes</h2>
        </div>
        <button className="text-button" type="button">View all</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Process</th><th>CPU</th><th>Memory</th><th>Status</th></tr></thead>
          <tbody>
            {sampleProcesses.map((process) => (
              <tr key={process.pid}>
                <td><strong>{process.name}</strong><span>PID {process.pid}</span></td>
                <td>{process.cpu}</td><td>{process.memory}</td>
                <td><span className="status-badge"><i />{process.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ProcessTable
