import { useEffect, useState } from 'react'

export default function TopBar({ currentUser, notifCount, onBellClick, onProfileClick }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="topbar-logo-mark">AE</div>
        <div>
          <div className="topbar-brand-name">aegis.ai</div>
          <div className="topbar-brand-sub">Log Analysis</div>
        </div>
      </div>

      <div className="topbar-center">
        <span className="topbar-time">{timeStr}</span>
        <span className="topbar-separator">/</span>
        <span className="topbar-date">{dateStr}</span>
      </div>

      <div className="topbar-right">
        <div className="agent-chip">
          <span className="pulse-dot" />
          Analysis Mode
        </div>

        <button className="notif-btn" onClick={onBellClick} title="Anomaly alerts">
          !
          {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
        </button>

        <button
          className="profile-btn"
          onClick={onProfileClick}
          style={{ background: 'linear-gradient(135deg, #0E2E89 0%, #5929d0 100%)' }}
          title={currentUser}
        >
          IA
        </button>
      </div>
    </div>
  )
}
