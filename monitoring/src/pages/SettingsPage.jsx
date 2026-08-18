import { useEffect, useState } from 'react'

const DEFAULT_SETTINGS = {
  refreshInterval: 5,
  cpuWarning: 70,
  memoryWarning: 75,
  diskWarning: 80,
  theme: 'dark',
}

function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedSettings = localStorage.getItem(
      'pc-monitor-settings'
    )

    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings))
      } catch {
        localStorage.removeItem('pc-monitor-settings')
      }
    }
  }, [])

  function updateSetting(key, value) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }))

    setSaved(false)
  }

  function saveSettings() {
    localStorage.setItem(
      'pc-monitor-settings',
      JSON.stringify(settings)
    )

    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS)

    localStorage.setItem(
      'pc-monitor-settings',
      JSON.stringify(DEFAULT_SETTINGS)
    )

    setSaved(true)
  }

  return (
    <main className="dashboard-shell">

      <section className="metrics-section">

        <div className="section-heading">

          <div>
            <p className="eyebrow">
              SETTINGS
            </p>

            <h2>
              Monitor preferences
            </h2>
          </div>

          {saved && (
            <span className="status-badge">
              <i />
              Saved
            </span>
          )}

        </div>

        <div className="settings-grid">

          <section className="settings-card">

            <p className="eyebrow">
              MONITORING
            </p>

            <h2>
              Refresh interval
            </h2>

            <p className="settings-description">
              Choose how often the dashboard requests
              new PC performance data.
            </p>

            <label className="settings-label">
              Refresh every

              <select
                value={settings.refreshInterval}
                onChange={(event) =>
                  updateSetting(
                    'refreshInterval',
                    Number(event.target.value)
                  )
                }
              >
                <option value={2}>
                  2 seconds
                </option>

                <option value={5}>
                  5 seconds
                </option>

                <option value={10}>
                  10 seconds
                </option>

                <option value={15}>
                  15 seconds
                </option>
              </select>
            </label>

          </section>

          <section className="settings-card">

            <p className="eyebrow">
              ALERTS
            </p>

            <h2>
              Warning thresholds
            </h2>

            <p className="settings-description">
              Configure when the monitor should display
              warning alerts.
            </p>

            <label className="settings-label">
              CPU warning

              <input
                type="number"
                min="1"
                max="100"
                value={settings.cpuWarning}
                onChange={(event) =>
                  updateSetting(
                    'cpuWarning',
                    Number(event.target.value)
                  )
                }
              />

              <span>
                %
              </span>
            </label>

            <label className="settings-label">
              Memory warning

              <input
                type="number"
                min="1"
                max="100"
                value={settings.memoryWarning}
                onChange={(event) =>
                  updateSetting(
                    'memoryWarning',
                    Number(event.target.value)
                  )
                }
              />

              <span>
                %
              </span>
            </label>

            <label className="settings-label">
              Disk warning

              <input
                type="number"
                min="1"
                max="100"
                value={settings.diskWarning}
                onChange={(event) =>
                  updateSetting(
                    'diskWarning',
                    Number(event.target.value)
                  )
                }
              />

              <span>
                %
              </span>
            </label>

          </section>

          <section className="settings-card">

            <p className="eyebrow">
              APPEARANCE
            </p>

            <h2>
              Dashboard theme
            </h2>

            <p className="settings-description">
              Select the preferred dashboard appearance.
            </p>

            <label className="settings-label">
              Theme

              <select
                value={settings.theme}
                onChange={(event) =>
                  updateSetting(
                    'theme',
                    event.target.value
                  )
                }
              >
                <option value="dark">
                  Dark
                </option>

                <option value="light">
                  Light
                </option>

                <option value="system">
                  System
                </option>
              </select>
            </label>

          </section>

        </div>

      </section>

      <section className="settings-actions">

        <button
          type="button"
          className="primary-button"
          onClick={saveSettings}
        >
          Save settings
        </button>

        <button
          type="button"
          className="text-button"
          onClick={resetSettings}
        >
          Reset to defaults
        </button>

      </section>

    </main>
  )
}

export default SettingsPage