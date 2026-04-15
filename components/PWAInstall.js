import { useState, useEffect } from 'react'

export default function PWAInstall() {
  const [prompt,    setPrompt]    = useState(null)   // Android beforeinstallprompt
  const [showIOS,   setShowIOS]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }
    // Don't show if dismissed in the last 7 days
    const ts = localStorage.getItem('pwa_dismissed')
    if (ts && Date.now() - Number(ts) < 7 * 24 * 60 * 60 * 1000) return

    // Android Chrome — capture the install prompt
    const handler = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS Safari detection
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (isIOS && isSafari) setShowIOS(true)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    localStorage.setItem('pwa_dismissed', String(Date.now()))
    setPrompt(null)
    setShowIOS(false)
    setDismissed(true)
  }

  const install = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setPrompt(null)
  }

  if (installed || dismissed || (!prompt && !showIOS)) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 16, right: 16, zIndex: 9000,
      background: 'var(--th-surface)',
      border: '1px solid var(--th-accent-md)',
      borderRadius: 18,
      boxShadow: '0 8px 40px rgba(124,58,237,0.25)',
      padding: '16px 18px',
      display: 'flex', alignItems: 'flex-start', gap: 14,
      animation: 'slideUp 0.3s ease',
    }}>
      <style>{`@keyframes slideUp { from { transform: translateY(80px); opacity:0 } to { transform: translateY(0); opacity:1 } }`}</style>

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, #5b21b6, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M5 3.5L13.5 8L5 12.5Z" fill="white"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--th-text-1)', marginBottom: 3 }}>
          Install ClipTok AI
        </div>

        {showIOS ? (
          <div style={{ fontSize: 12, color: 'var(--th-text-3)', lineHeight: 1.5 }}>
            Tap
            {' '}
            <svg style={{ display: 'inline', verticalAlign: 'middle' }} width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v13M8 7l4-4 4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {' '}then <strong>Add to Home Screen</strong>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--th-text-3)' }}>
            Add to your home screen for the full app experience
          </div>
        )}

        {!showIOS && (
          <button onClick={install} style={{
            marginTop: 10,
            background: 'var(--th-accent)', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '7px 18px', fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
          }}>
            Install
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button onClick={dismiss} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--th-text-4)', padding: 4, flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
