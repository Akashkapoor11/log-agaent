export default function ProfileModal({ currentUser, onClose }) {
  return (
    <div className="overlay" onClick={event => event.target === event.currentTarget && onClose()}>
      <div className="modal profile-modal">
        <div className="profile-banner">
          <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #0E2E89 0%, #5929d0 100%)' }}>
            IA
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-name">{currentUser}</div>
          <div className="profile-role-row">
            <span className="perm-tag">Single User</span>
            <span style={{ fontSize: 11.5, color: 'var(--n4)' }}>Analysis workspace</span>
          </div>
          <div className="profile-summary">
            This frontend runs in IT Admin mode only. It is a read-only analysis dashboard with no data entry flow.
          </div>

          <div className="profile-divider" />

          <div className="profile-info-row">
            <span className="profile-info-icon">@</span>
            <span className="profile-info-label">User</span>
            <span className="profile-info-val">{currentUser}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-icon">AN</span>
            <span className="profile-info-label">Mode</span>
            <span className="profile-info-val">Read-only analysis</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-icon">UI</span>
            <span className="profile-info-label">Access</span>
            <span className="profile-info-val">Full dashboard</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
