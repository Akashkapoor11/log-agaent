const BASE_URL = import.meta.env.VITE_API_URL || ''

const safeFetch = (url, fallback) =>
  fetch(url)
    .then(res => { if (!res.ok) throw new Error(res.status); return res.json() })
    .catch(err => { console.error(`Fetch failed: ${url}`, err); return fallback })

export const fetchAlerts = () =>
  safeFetch(`${BASE_URL}/api/alerts`, [])

export const fetchLogs = () =>
  safeFetch(`${BASE_URL}/api/logs/normalized`, [])

export const fetchStats = () =>
  safeFetch(`${BASE_URL}/api/stats`, null)

export const fetchAudit = () =>
  safeFetch(`${BASE_URL}/api/audit`, [])

export const fetchAll = () =>
  Promise.all([fetchAlerts(), fetchLogs(), fetchStats(), fetchAudit()])
