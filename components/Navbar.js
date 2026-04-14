import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../lib/api'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    auth.me().then(setUser).catch(() => setUser(null))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  const handleLogout = async () => {
    await auth.logout()
    setUser(null)
    router.push('/')
    close()
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--th-surface)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--th-border)' : 'none',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--th-accent)' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--th-text-1)' }}>Faceless</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/#features"  className="px-3 py-2 text-sm rounded-lg transition-colors hover:underline" style={{ color: 'var(--th-text-3)' }}>Features</Link>
            <Link href="/#showcase"  className="px-3 py-2 text-sm rounded-lg transition-colors hover:underline" style={{ color: 'var(--th-text-3)' }}>Examples</Link>
            <Link href="/#pricing"   className="px-3 py-2 text-sm rounded-lg transition-colors hover:underline" style={{ color: 'var(--th-text-3)' }}>Pricing</Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login"      className="btn-ghost text-sm">Sign in</Link>
                <Link href="/onboarding" className="btn-primary text-sm py-2 px-5">Get started free</Link>
              </>
            )}
          </div>

          {/* ── Mobile: always-visible auth button + hamburger ── */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Link href="/dashboard" onClick={close}
                className="text-sm font-semibold px-3 py-1.5 rounded-lg"
                style={{ color: 'var(--th-accent)', background: 'var(--th-accent-lt)' }}>
                Dashboard
              </Link>
            ) : (
              <Link href="/login"
                className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={{
                  color: 'var(--th-text-1)',
                  border: '1.5px solid var(--th-border)',
                  background: 'var(--th-surface)',
                }}>
                Sign in
              </Link>
            )}

            <button
              className="p-2 rounded-lg"
              style={{ color: 'var(--th-text-3)' }}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                {menuOpen
                  ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  : <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown menu ── */}
        {menuOpen && (
          <div className="md:hidden pb-4 anim-fade" style={{ borderTop: '1px solid var(--th-border)' }}>
            <div className="pt-3 space-y-0.5">
              <Link href="/#features" onClick={close}
                className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg font-medium"
                style={{ color: 'var(--th-text-2)' }}>
                Features
              </Link>
              <Link href="/#showcase" onClick={close}
                className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg font-medium"
                style={{ color: 'var(--th-text-2)' }}>
                Examples
              </Link>
              <Link href="/#pricing" onClick={close}
                className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg font-medium"
                style={{ color: 'var(--th-text-2)' }}>
                Pricing
              </Link>
            </div>

            <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--th-border)' }}>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={close}
                    className="block btn-secondary text-sm text-center">
                    Go to dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="block w-full btn-ghost text-sm text-left px-3">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={close}
                    className="block btn-secondary text-sm text-center">
                    Sign in
                  </Link>
                  <Link href="/onboarding" onClick={close}
                    className="block btn-primary text-sm text-center">
                    Get started free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
