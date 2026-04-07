const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Request failed')
  }

  return data
}

// Auth
export const auth = {
  register:  (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:     (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:        ()     => request('/auth/me'),
  logout:    ()     => request('/auth/logout', { method: 'POST' }),
  forgot:    (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  reset:     (body) => request('/auth/reset-password',  { method: 'POST', body: JSON.stringify(body) }),
  getPrefs:  ()     => request('/auth/prefs'),
  savePrefs: (prefs) => request('/auth/prefs', { method: 'PUT', body: JSON.stringify({ prefs }) }),
}

// Videos
export const videos = {
  create: (body)   => request('/videos/create', { method: 'POST', body: JSON.stringify(body) }),
  list:   ()       => request('/videos'),
  get:    (id)     => request(`/videos/${id}`),
  status: (id)     => request(`/videos/${id}/status`),
  remove: (id)     => request(`/videos/${id}`, { method: 'DELETE' }),
}

// Billing
export const billing = {
  plans:      ()     => request('/billing/plans'),
  initialize: (body) => request('/billing/initialize', { method: 'POST', body: JSON.stringify(body) }),
  history:    ()     => request('/billing/history'),
}

// Vadoo options (for dropdowns)
export const vadoo = {
  voices:  () => request('/vadoo/voices'),
  styles:  () => request('/vadoo/styles'),
  themes:  () => request('/vadoo/themes'),
  music:   () => request('/vadoo/music'),
  topics:  () => request('/vadoo/topics'),
}

// Templates
export const templates = {
  list: ()       => request('/templates'),
  get:  (slug)   => request(`/templates/${slug}`),
}

// Onboarding preferences — localStorage cache + DB persistence
export const onboarding = {
  // Save to localStorage immediately; also push to DB if logged in
  save: (prefs) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_prefs', JSON.stringify(prefs))
    }
    return auth.savePrefs(prefs).catch(() => {}) // best-effort, don't throw
  },
  // Load from DB (authoritative); fall back to localStorage
  load: async () => {
    try {
      const { prefs } = await auth.getPrefs()
      if (prefs) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('onboarding_prefs', JSON.stringify(prefs))
        }
        return prefs
      }
    } catch {}
    // fallback: localStorage
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('onboarding_prefs')
        return raw ? JSON.parse(raw) : null
      } catch {}
    }
    return null
  },
  // Sync from localStorage to DB (call after login)
  sync: () => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('onboarding_prefs')
        if (raw) {
          const prefs = JSON.parse(raw)
          return auth.savePrefs(prefs).catch(() => {})
        }
      } catch {}
    }
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding_prefs')
    }
  },
}
