// Read theme from localStorage, default light
export function getStoredTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('theme') || 'light'
}

export function applyTheme(theme) {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}

export function toggleTheme() {
  const current = getStoredTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}
