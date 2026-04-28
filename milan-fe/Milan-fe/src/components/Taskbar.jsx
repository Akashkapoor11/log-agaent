const ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'alerts', icon: '🚨', label: 'Alerts' },
  { id: 'sources', icon: '⚙️', label: 'Sources' },
  { id: 'reports', icon: '📄', label: 'Reports' },
  { id: 'policy', icon: '✅', label: 'Policy' },
  { id: 'audit', icon: '🔐', label: 'Audit' },
  { id: 'users', icon: '👥', label: 'Users' },
]

export default function Taskbar({ activeView, onNavigate }) {
  return (
    <div className="taskbar-wrap">
      <div className="taskbar">
        {ITEMS.map((item, index) => (
          <DockItem
            key={item.id}
            item={item}
            active={activeView === item.id}
            onClick={onNavigate}
            showDivider={index === 1}
          />
        ))}
      </div>
    </div>
  )
}

function DockItem({ item, active, onClick, showDivider }) {
  return (
    <>
      {showDivider && <div className="dock-divider" />}
      <button
        className={`dock-item${active ? ' active' : ''}`}
        onClick={() => onClick(item.id)}
        title={item.label}
      >
        <span className="dock-icon">{item.icon}</span>
        <span className="dock-label">{item.label}</span>
        {active && <span className="dock-pip" />}
      </button>
    </>
  )
}
