import { useEffect } from 'react'
import '../styles/globals.css'
import { applyTheme, getStoredTheme } from '../lib/theme'
import { subscribeToPush } from '../lib/push'
import PWAInstall from '../components/PWAInstall'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    applyTheme(getStoredTheme())

    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js')
          .then(() => {
            // Subscribe to push only when a session token is present
            const token = localStorage.getItem('fr_auth_token')
            if (token) subscribeToPush(token)
          })
          .catch(() => {})
      } else {
        // In dev, make sure no previously-installed SW serves a stale cached
        // bundle (it caches JS cache-first and breaks env/API-URL changes).
        navigator.serviceWorker.getRegistrations()
          .then(regs => regs.forEach(r => r.unregister()))
          .catch(() => {})
        if (window.caches) caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {})
      }
    }
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <PWAInstall />
    </>
  )
}
