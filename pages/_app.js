import { useEffect } from 'react'
import '../styles/globals.css'
import { applyTheme, getStoredTheme } from '../lib/theme'
import { subscribeToPush } from '../lib/push'
import PWAInstall from '../components/PWAInstall'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    applyTheme(getStoredTheme())

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          // Subscribe to push only when a session token is present
          const token = localStorage.getItem('token')
          if (token) subscribeToPush(token)
        })
        .catch(() => {})
    }
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <PWAInstall />
    </>
  )
}
