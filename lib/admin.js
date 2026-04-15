const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
const TOKEN_KEY = 'fr_auth_token'

function getToken() {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

async function req(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const admin = {
  stats:        ()         => req('/admin/stats'),
  users:        (q)        => req(`/admin/users?${new URLSearchParams(q)}`),
  getUser:      (id)       => req(`/admin/users/${id}`),
  updateUser:   (id, body) => req(`/admin/users/${id}`, { method: 'PUT',    body: JSON.stringify(body) }),
  deleteUser:   (id)       => req(`/admin/users/${id}`, { method: 'DELETE' }),
  videos:       (q)        => req(`/admin/videos?${new URLSearchParams(q)}`),
  deleteVideo:  (id)       => req(`/admin/videos/${id}`, { method: 'DELETE' }),
  getSettings:    ()         => req('/admin/settings'),
  saveSettings:   (body)     => req('/admin/settings', { method: 'PUT', body: JSON.stringify(body) }),

  campaigns:      ()         => req('/admin/campaigns'),
  getCampaign:    (id)       => req(`/admin/campaigns/${id}`),
  createCampaign: (body)     => req('/admin/campaigns',        { method: 'POST',   body: JSON.stringify(body) }),
  sendCampaign:   (id)       => req(`/admin/campaigns/${id}/send`, { method: 'POST' }),
  deleteCampaign: (id)       => req(`/admin/campaigns/${id}`,  { method: 'DELETE' }),
}
