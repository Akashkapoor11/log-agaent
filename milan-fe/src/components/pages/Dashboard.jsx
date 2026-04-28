function MiniBarChart({ data, color = 'var(--primary)' }) {
  const max = Math.max(...data, 1)
  return (
    <div className="mini-chart">
      {data.map((v, i) => (
        <div
          key={i}
          className="chart-bar"
          style={{ height: `${Math.max((v / max) * 100, 6)}%`, background: color }}
          title={v}
        />
      ))}
    </div>
  )
}

function DonutChart({ segments }) {
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1
  let offset = 0
  const radius = 40
  const circumference = 2 * Math.PI * radius

  return (
    <div className="donut-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--n7)" strokeWidth="14" />
        {segments.map((segment, index) => {
          const pct = segment.value / total
          const dash = pct * circumference
          const circle = (
            <circle
              key={segment.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset * circumference}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
            />
          )
          offset += pct
          return circle
        })}
      </svg>
      <div className="donut-legend">
        {segments.map(segment => (
          <div key={segment.label}>
            <span style={{ background: segment.color }} />
            <p>{segment.label}</p>
            <strong>{segment.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function hourFromTimestamp(timestamp) {
  const match = String(timestamp).match(/\b([01]?\d|2[0-3]):\d{2}/)
  return match ? Number(match[1]) : 12
}

export default function Dashboard({ processedData, alerts, stats }) {
  const loginActivity = Array.from({ length: 24 }, (_, hour) =>
    processedData.filter(row => hourFromTimestamp(row.timestamp || row.event_timestamp) === hour).length
  )

  const riskSegments = [
    { label: 'Low', value: alerts.filter(a => a.severity === 'low').length, color: 'var(--success)' },
    { label: 'Medium', value: alerts.filter(a => a.severity === 'medium').length, color: 'var(--warning)' },
    { label: 'High', value: alerts.filter(a => a.severity === 'high').length, color: 'var(--error)' },
    { label: 'Critical', value: alerts.filter(a => a.severity === 'critical').length, color: '#7f1d1d' },
  ]

  const feed = processedData.slice(0, 10)

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-tag">Log Analysis</div>
        <div className="page-title">Dashboard</div>
        <div className="page-desc">Metrics, charts, and event feed from the analyzed security log baseline.</div>
      </div>

      <div className="dash-metrics">
        <div className="dash-metric">
          <div className="dash-metric-label">Total Events</div>
          <div className="dash-metric-value">{stats.totalEvents}</div>
          <div className="dash-metric-change change-up">Analyzed records</div>
        </div>
        <div className="dash-metric">
          <div className="dash-metric-label">Cleaned Records</div>
          <div className="dash-metric-value">{stats.cleanedRecords}</div>
          <div className="dash-metric-change change-up">Normalized schema</div>
        </div>
        <div className="dash-metric">
          <div className="dash-metric-label">Duplicates Removed</div>
          <div className="dash-metric-value">{stats.duplicatesRemoved}</div>
          <div className="dash-metric-change change-up">Exact duplicates</div>
        </div>
        <div className="dash-metric">
          <div className="dash-metric-label">Anomalies Detected</div>
          <div className="dash-metric-value">{stats.anomaliesDetected}</div>
          <div className="dash-metric-change change-down">Risk score at least 45</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Login Activity</div>
          <MiniBarChart data={loginActivity} color="var(--primary)" />
          <div className="chart-axis">
            {['0', '6', '12', '18', '23'].map(hour => <span key={hour}>{hour}:00</span>)}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Risk Distribution</div>
          <DonutChart segments={riskSegments} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Event Feed</div>
            <div className="card-sub">Latest normalized security events</div>
          </div>
          <span className="analysis-chip">ANALYZED</span>
        </div>

        <div>
          {feed.map(row => {
            const userId = row.user || row.user_email || 'Unknown User';
            const eventName = (row.event || row.event_type || 'Unknown Event').replace(/_/g, ' ');
            const statusStr = row.status || row.login_status || 'Unknown';
            const locationStr = row.location || row.geo_location || 'Unknown';
            const systemStr = row.system || row.device || (row.normalized_json && row.normalized_json.source) || 'Unknown System';
            
            let timeStr = row.timestamp;
            if (!timeStr && row.event_timestamp) {
              const d = new Date(row.event_timestamp);
              timeStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
            }

            const isError = /fail|denied|lock/i.test(row.normalizedText || row.event_type || row.login_status || '');

            return (
              <div key={row.id || row.event_id} className="event-row">
                <div className={`event-dot ${isError ? 'dot-error' : 'dot-success'}`} />
                <div style={{ flex: 1 }}>
                  <div className="event-user">{userId}</div>
                  <div className="event-detail" style={{ textTransform: 'capitalize' }}>
                    {eventName} / {statusStr} / {locationStr}
                  </div>
                </div>
                <span className="sys-chip">{systemStr}</span>
                <span className="event-time">{timeStr}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
