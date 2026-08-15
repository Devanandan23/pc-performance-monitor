function DashboardHeader({ isRefreshing, onRefresh }) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">LOCAL MACHINE</p>
        <h1>PC Performance Monitor</h1>
      </div>

      <div className="header-actions">
        <span className="system-status">
          <span className="status-dot" />
          System online
        </span>
        <button type="button" onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Refreshing…' : 'Refresh sample data'}
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader