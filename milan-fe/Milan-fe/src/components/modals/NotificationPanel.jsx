export default function NotificationPanel({ alerts, onClose, onOpenAlerts }) {
  function scoreClass(severity) {
    if (severity === 'critical') return 'score-critical'
    if (severity === 'high') return 'score-high'
    if (severity === 'medium') return 'score-medium'
    return 'score-low'
  }

  return (
    <div className="overlay" onClick={event => event.target === event.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Anomaly Alerts</div>
            <div className="modal-sub">{alerts.length} anomalies need review</div>
          </div>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>

        <div className="modal-body">
          {alerts.length === 0 ? (
            <div className="notif-item">
              <div className="notif-content">
                <div className="notif-evt-title">No active anomalies</div>
                <div className="notif-evt-user">No active anomaly alerts are pending review.</div>
              </div>
            </div>
          ) : (
            alerts.slice(0, 6).map(alert => (
              <div key={alert.id} className="notif-item">
                <div className={`notif-score ${scoreClass(alert.severity)}`}>{alert.riskScore}</div>
                <div className="notif-content">
                  <div className="notif-evt-title">{alert.event}</div>
                  <div className="notif-evt-user">{alert.user}</div>
                  <div className="notif-ai-box">{alert.reason}</div>
                  <div className="notif-meta">
                    Severity: {alert.severity} / Alert ID: {alert.id}
                  </div>
                  <div className="notif-actions">
                    <button className="btn btn-outline btn-sm" onClick={onOpenAlerts}>Inspect</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11.5, color: 'var(--n4)' }}>{alerts.length} active alerts</span>
          <button className="btn btn-primary btn-sm" onClick={onOpenAlerts}>Open Alerts Page</button>
        </div>
      </div>
    </div>
  )
}
