import { useEffect } from 'react'
import '../styles/globals.css'
import { applyTheme, getStoredTheme } from '../lib/theme'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    applyTheme(getStoredTheme())

    // Register service worker for PWA / offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  return <Component {...pageProps} />
}
