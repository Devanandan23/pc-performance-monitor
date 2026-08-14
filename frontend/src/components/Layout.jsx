import { NavLink, Outlet } from 'react-router-dom'

const navigationItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'CPU', path: '/cpu' },
  { label: 'Memory', path: '/memory' },
  { label: 'GPU', path: '/gpu' },
  { label: 'Storage', path: '/storage' },
  { label: 'Processes', path: '/processes' },
  { label: 'Alerts', path: '/alerts' },
  { label: 'System info', path: '/system-info' },
  { label: 'Settings', path: '/settings' },
  { label: 'Custom page', path: '/custom' },
]

function Layout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <a className="brand" href="/">
          <span className="brand-mark">P</span>
          <span>Performance</span>
        </a>

        <nav aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="page-content">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
