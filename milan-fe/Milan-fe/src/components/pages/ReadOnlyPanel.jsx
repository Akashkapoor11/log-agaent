export default function ReadOnlyPanel({ tag, title, description, items }) {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-tag">{tag}</div>
        <div className="page-title">{title}</div>
        <div className="page-desc">{description}</div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{title} Summary</div>
            <div className="card-sub">Read-only analysis view</div>
          </div>
          <span className="analysis-chip">ANALYZED</span>
        </div>

        <div className="readonly-grid">
          {items.map(item => (
            <div key={item.label} className="readonly-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
