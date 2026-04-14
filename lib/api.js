const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'

// ── Token storage (fallback for mobile browsers that block cross-origin cookies) ──

const TOKEN_KEY = 'fr_auth_token'

function getStoredToken() {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

function setStoredToken(token) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(TOKEN_KEY, token) } catch {}
}

function clearStoredToken() {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(TOKEN_KEY) } catch {}
}

// ── Core request ──────────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = getStoredToken()

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',          // send HttpOnly cookie when browser allows it
    headers: {
      'Content-Type': 'application/json',
      // Also send as Bearer header — mobile Safari / privacy browsers that block
      // SameSite=None cookies will use this path instead.
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  register: async (body) => {
    const data = await request('/auth/register', { method: 'POST', body: JSON.stringify(body) })
    if (data.token) setStoredToken(data.token)
    return data
  },

  login: async (body) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(body) })
    if (data.token) setStoredToken(data.token)
    return data
  },

  me:     () => request('/auth/me'),

  logout: async () => {
    clearStoredToken()
    return request('/auth/logout', { method: 'POST' })
  },

  forgot:    (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  reset:     (body) => request('/auth/reset-password',  { method: 'POST', body: JSON.stringify(body) }),
  getPrefs:  ()     => request('/auth/prefs'),
  savePrefs: (prefs) => request('/auth/prefs', { method: 'PUT', body: JSON.stringify({ prefs }) }),
}

// ── Videos ────────────────────────────────────────────────────────────────────

export const videos = {
  showcase: ()     => request('/videos/showcase'),
  create:   (body) => request('/videos/create', { method: 'POST', body: JSON.stringify(body) }),
  list:     ()     => request('/videos'),
  get:      (id)   => request(`/videos/${id}`),
  status:   (id)   => request(`/videos/${id}/status`),
  remove:   (id)   => request(`/videos/${id}`, { method: 'DELETE' }),
}

// ── Billing ───────────────────────────────────────────────────────────────────

export const billing = {
  config:     ()     => request('/billing/config'),
  initialize: (body) => request('/billing/initialize', { method: 'POST', body: JSON.stringify(body) }),
  history:    ()     => request('/billing/history'),
}

// ── Vadoo options (for dropdowns) ─────────────────────────────────────────────

export const vadoo = {
  voices:    () => request('/vadoo/voices'),
  languages: () => request('/vadoo/languages'),
  styles:    () => request('/vadoo/styles'),
  themes:    () => request('/vadoo/themes'),
  music:     () => request('/vadoo/music'),
  topics:    () => request('/vadoo/topics'),
  balance:   () => request('/vadoo/balance'),
}

// ── Templates ─────────────────────────────────────────────────────────────────

export const templates = {
  list: ()     => request('/templates'),
  get:  (slug) => request(`/templates/${slug}`),
}

// ── Onboarding preferences — localStorage cache + DB persistence ─────────────

export const onboarding = {
  save: async (prefs) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_prefs', JSON.stringify(prefs))
    }
    return auth.savePrefs(prefs).catch(() => {})
  },

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
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('onboarding_prefs')
        return raw ? JSON.parse(raw) : null
      } catch {}
    }
    return null
  },

  sync: () => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('onboarding_prefs')
        if (raw) return auth.savePrefs(JSON.parse(raw)).catch(() => {})
      } catch {}
    }
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding_prefs')
    }
  },
}
