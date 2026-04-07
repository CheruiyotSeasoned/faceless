import { useEffect } from 'react'
import '../styles/globals.css'
import { applyTheme, getStoredTheme } from '../lib/theme'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Apply stored theme immediately on mount (default: light)
    applyTheme(getStoredTheme())
  }, [])

  return <Component {...pageProps} />
}
