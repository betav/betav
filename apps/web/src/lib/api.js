const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

function getToken() {
  return localStorage.getItem('admin_token') || null
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Request failed: ${res.status}`)
  }

  return res.json()
}

// Auth
export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// Articles (public)
export function getArticles(params = {}) {
  const query = new URLSearchParams()
  if (params.lang) query.set('lang', params.lang)
  if (params.category) query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  return request(`/api/articles?${query.toString()}`)
}

export function getArticle(slug) {
  return request(`/api/articles/${slug}`)
}

// Articles (admin)
export function getAdminArticles(params = {}) {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  return request(`/api/articles/admin/list?${query.toString()}`)
}

export function createArticle(formData) {
  return request('/api/articles', {
    method: 'POST',
    body: formData,
  })
}

export function updateArticle(id, data) {
  return request(`/api/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function approveArticle(id) {
  return request(`/api/articles/${id}/approve`, { method: 'POST' })
}

export function rejectArticle(id) {
  return request(`/api/articles/${id}/reject`, { method: 'POST' })
}

// Insights draft (cowork agent)
export function createDraft(data) {
  return request('/api/insights/draft', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Leads
export function submitLead(data) {
  return request('/api/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Analytics
export function trackAnalytics(data) {
  return request('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(data),
  }).catch(() => {}) // silent fail for analytics
}
