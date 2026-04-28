export default function AlertDetailModal({ alert, onClose }) {
  return (
    <div className="overlay" onClick={event => event.target === event.currentTarget && onClose()}>
      <div className="modal alert-modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Alert Detail</div>
            <div className="modal-sub">Source log row {alert.rowNumber} / {alert.id}</div>
          </div>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>

        <div className="modal-body" style={{ padding: '20px 24px' }}>
          <div className="alert-detail-row">
            <span className="alert-detail-label">User</span>
            <span>{alert.user}</span>
          </div>
          <div className="alert-detail-row">
            <span className="alert-detail-label">System</span>
            <span className="sys-chip">{alert.system}</span>
          </div>
          <div className="alert-detail-row">
            <span className="alert-detail-label">Event</span>
            <span>{alert.event}</span>
          </div>
          <div className="alert-detail-row">
            <span className="alert-detail-label">Risk Score</span>
            <strong style={{ color: alert.riskScore >= 70 ? 'var(--error)' : 'inherit', fontSize: 15 }}>
              {alert.riskScore}
            </strong>
          </div>
          <div className="alert-detail-row">
            <span className="alert-detail-label">Status</span>
            <span className={`badge badge-${alert.status}`}>{alert.status}</span>
          </div>

          <div className="alert-reason">
            <strong>Plain-language explanation:</strong> This event was flagged because it contains {alert.reason}. The score reflects the number and strength of those markers in the analyzed log row.
          </div>

          <div className="log-row-box">
            <div className="log-row-title">Source Log Row</div>
            {Object.entries(alert.original).filter(([key]) => !key.startsWith('__')).map(([key, value]) => (
              <div key={key} className="log-row-item">
                <span>{key}</span>
                <strong>{String(value || '-')}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
