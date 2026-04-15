import { useState, useEffect } from 'react'

export default function PWAInstall() {
  const [prompt,    setPrompt]    = useState(null)
  const [showIOS,   setShowIOS]   = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handler = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)

    const isIOS     = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari  = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (isIOS && isSafari) setShowIOS(true)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
  }

  if (installed || (!prompt && !showIOS)) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9000,
      background: 'linear-gradient(135deg, #3b0764 0%, #5b21b6 50%, #7c3aed 100%)',
      padding: '16px 20px 24px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 -4px 32px rgba(124,58,237,0.5)',
    }}>
      <style>{`@keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.5)} 50%{box-shadow:0 0 0 10px rgba(139,92,246,0)} }`}</style>

      {/* App icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: 'rgba(255,255,255,0.15)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'pulseGlow 2s ease-in-out infinite',
      }}>
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
          <path d="M5 3.5L13.5 8L5 12.5Z" fill="white"/>
          <path d="M13 1.5L13.4 2.6L14.5 3L13.4 3.4L13 4.5L12.6 3.4L11.5 3L12.6 2.6Z" fill="rgba(255,255,255,0.7)"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', marginBottom: 2 }}>
          Install ClipTok AI
        </div>
        {showIOS ? (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
            Tap{' '}
            <svg style={{ display:'inline', verticalAlign:'middle' }} width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v13M8 7l4-4 4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {' '}→ <strong style={{ color:'#fff' }}>Add to Home Screen</strong>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
            Get the full app — create videos anytime
          </div>
        )}
      </div>

      {!showIOS && (
        <button onClick={install} style={{
          background: '#fff', color: '#5b21b6',
          border: 'none', borderRadius: 12,
          padding: '9px 20px', fontSize: 13, fontWeight: 800,
          cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          Install
        </button>
      )}
    </div>
  )
}
