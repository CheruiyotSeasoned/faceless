const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function req(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
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
  getSettings:  ()         => req('/admin/settings'),
  saveSettings: (body)     => req('/admin/settings', { method: 'PUT', body: JSON.stringify(body) }),
}
