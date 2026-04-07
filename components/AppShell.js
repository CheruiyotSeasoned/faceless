import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../lib/api'
import { toggleTheme, getStoredTheme } from '../lib/theme'

const Icon = {
  Series: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  Videos: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M11 6.5l4-2.5v8l-4-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  Guides: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M10 2v3h3M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.3 1.3M11.3 11.3l1.3 1.3M3.4 12.6l1.3-1.3M11.3 4.7l1.3-1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Sun: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1.1 1.1M11 11l1.1 1.1M2.9 12.1l1.1-1.1M11 4l1.1-1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Moon: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M13 9.5A6 6 0 015.5 2a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M5 3l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Chevron: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const NAV = [
  { href: '/dashboard', label: 'Series',   Icon: Icon.Series   },
  { href: '/videos',    label: 'Videos',   Icon: Icon.Videos   },
  { href: '/guides',    label: 'Guides',   Icon: Icon.Guides   },
  { href: '/settings',  label: 'Settings', Icon: Icon.Settings },
]

function SidebarContent({ user, theme, router, onToggleTheme, onLogout, onNavClick }) {
  return (
    <>
      {/* Logo */}
      <Link href="/dashboard" onClick={onNavClick}
        className="flex items-center gap-2.5 px-4 py-5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--th-border-soft)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--th-accent)' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="8" cy="8" r="2.5" fill="white"/>
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold" style={{ color: 'var(--th-text-1)' }}>Faceless</div>
          <div className="text-xs font-medium" style={{ color: 'var(--th-text-3)' }}>Reels</div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, Icon: NavIcon }) => {
          const active = router.pathname === href || (href !== '/' && router.pathname.startsWith(href))
          return (
            <Link key={href} href={href} onClick={onNavClick}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={active
                ? { background: 'var(--th-accent)', color: '#fff' }
                : { color: 'var(--th-text-3)' }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--th-accent-lt)'; e.currentTarget.style.color = 'var(--th-text-1)' }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--th-text-3)' }}}>
              <NavIcon />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 space-y-1 flex-shrink-0"
        style={{ borderTop: '1px solid var(--th-border-soft)', paddingTop: '12px' }}>

        <button onClick={onToggleTheme}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium w-full transition-all duration-150"
          style={{ color: 'var(--th-text-3)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--th-accent-lt)'; e.currentTarget.style.color = 'var(--th-text-1)' }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--th-text-3)' }}>
          {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <Link href="/billing" onClick={onNavClick}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold w-full transition-all duration-150"
          style={{ color: 'var(--th-accent)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--th-accent-lt)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1l1.5 3.5H12L9.2 6.8l1.1 3.5L7 8.4l-3.3 1.9 1.1-3.5L2 4.5h3.5L7 1z" fill="var(--th-accent)"/>
          </svg>
          Upgrade
        </Link>

        {user && (
          <Link href="/settings" onClick={onNavClick}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl w-full text-left transition-all duration-150"
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--th-accent-lt)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--th-accent)' }}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-medium truncate flex-1" style={{ color: 'var(--th-text-2)' }}>
              {user.name?.split(' ')[0] || user.email}
            </span>
            <Icon.Chevron />
          </Link>
        )}
      </div>
    </>
  )
}

export default function AppShell({ children, breadcrumb = [] }) {
  const router = useRouter()
  const [user,        setUser]        = useState(null)
  const [theme,       setTheme]       = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setTheme(getStoredTheme())
    auth.me().then(setUser).catch(() => {})
  }, [])

  // Close drawer on route change
  useEffect(() => { setSidebarOpen(false) }, [router.pathname])

  const handleToggleTheme = () => { const next = toggleTheme(); setTheme(next) }
  const handleLogout = async () => { await auth.logout(); router.push('/login') }

  const sidebarProps = {
    user, theme, router,
    onToggleTheme: handleToggleTheme,
    onLogout: handleLogout,
    onNavClick: () => setSidebarOpen(false),
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--th-bg)' }}>

      {/* ── Mobile overlay ───────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar — desktop always visible, mobile drawer ─────────────── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-[168px] flex-shrink-0 flex flex-col h-full
        transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ backgroundColor: 'var(--th-surface)', borderRight: '1px solid var(--th-border-soft)' }}>
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar — breadcrumb + mobile hamburger */}
        <div className="flex items-center gap-3 px-4 sm:px-7 py-3.5 flex-shrink-0"
          style={{ backgroundColor: 'var(--th-surface)', borderBottom: '1px solid var(--th-border-soft)' }}>

          {/* Hamburger (mobile only) */}
          <button className="lg:hidden flex-shrink-0 p-1 rounded-lg transition-colors"
            style={{ color: 'var(--th-text-3)' }}
            onClick={() => setSidebarOpen(true)}>
            <Icon.Menu />
          </button>

          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5 min-w-0">
                  {i > 0 && <span className="flex-shrink-0"><Icon.Arrow /></span>}
                  {crumb.href && i < breadcrumb.length - 1 ? (
                    <Link href={crumb.href} className="hover:underline flex-shrink-0"
                      style={{ color: 'var(--th-text-3)' }}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="truncate"
                      style={{ color: i === breadcrumb.length - 1 ? 'var(--th-text-1)' : 'var(--th-text-3)', fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
