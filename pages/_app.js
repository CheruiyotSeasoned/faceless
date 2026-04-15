import { useEffect } from 'react'
import '../styles/globals.css'
import { applyTheme, getStoredTheme } from '../lib/theme'
import PWAInstall from '../components/PWAInstall'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    applyTheme(getStoredTheme())
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <PWAInstall />
    </>
  )
}
