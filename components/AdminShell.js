import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../lib/api'
import { toggleTheme, getStoredTheme } from '../lib/theme'

const NAV = [
  { href: '/admin',          label: 'Dashboard', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )},
  { href: '/admin/users',    label: 'Users', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )},
  { href: '/admin/videos',   label: 'Videos', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M11 6.5l4-2.5v8l-4-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )},
  { href: '/admin/settings', label: 'Settings', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.3 1.3M11.3 11.3l1.3 1.3M3.4 12.6l1.3-1.3M11.3 4.7l1.3-1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )},
]

export default function AdminShell({ children, breadcrumb = [] }) {
  const router = useRouter()
  const [user,        setUser]        = useState(null)
  const [theme,       setTheme]       = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setTheme(getStoredTheme())
    auth.me()
      .then(u => {
        if (!u.is_admin) router.replace('/dashboard')
        else setUser(u)
      })
      .catch(() => router.replace('/admin/login'))
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [router.pathname])

  const handleToggleTheme = () => { const next = toggleTheme(); setTheme(next) }
  const handleLogout = async () => { await auth.logout(); router.push('/login') }

  const Sidebar = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--th-border-soft)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#ef4444' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="8" cy="8" r="2.5" fill="white"/>
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold" style={{ color: 'var(--th-text-1)' }}>Faceless</div>
          <div className="text-xs font-semibold" style={{ color: '#ef4444' }}>Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon }) => {
          const active = router.pathname === href
          return (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={active
                ? { background: '#ef4444', color: '#fff' }
                : { color: 'var(--th-text-3)' }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'var(--th-text-1)' }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--th-text-3)' }}}>
              {icon}
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 space-y-1 flex-shrink-0"
        style={{ borderTop: '1px solid var(--th-border-soft)', paddingTop: '12px' }}>

        <button onClick={handleToggleTheme}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium w-full transition-all"
          style={{ color: 'var(--th-text-3)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--th-accent-lt)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '' }}>
          {theme === 'dark'
            ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            : <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M13 9.5A6 6 0 015.5 2a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
          }
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <Link href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium w-full transition-all"
          style={{ color: 'var(--th-text-3)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--th-accent-lt)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 2H2v4h4V2zM12 2H8v4h4V2zM6 8H2v4h4V8zM12 8H8v4h4V8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          App dashboard
        </Link>

        {user && (
          <button onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl w-full text-left transition-all"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: '#ef4444' }}>
              {(user.name || 'A').charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-medium truncate flex-1" style={{ color: 'var(--th-text-2)' }}>
              {user.name?.split(' ')[0] || user.email}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--th-text-4)' }}>
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </>
  )

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--th-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#ef4444', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--th-bg)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-[168px] flex-shrink-0 flex flex-col h-full transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ backgroundColor: 'var(--th-surface)', borderRight: '1px solid var(--th-border-soft)' }}>
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 sm:px-7 py-3.5 flex-shrink-0"
          style={{ backgroundColor: 'var(--th-surface)', borderBottom: '1px solid var(--th-border-soft)' }}>

          <button className="lg:hidden flex-shrink-0 p-1 rounded-lg" style={{ color: 'var(--th-text-3)' }}
            onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Admin badge */}
          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
            ADMIN
          </span>

          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              {breadcrumb.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5 min-w-0">
                  {i > 0 && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                      <path d="M5 3l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--th-text-4)' }}/>
                    </svg>
                  )}
                  {c.href && i < breadcrumb.length - 1
                    ? <Link href={c.href} className="hover:underline flex-shrink-0" style={{ color: 'var(--th-text-3)' }}>{c.label}</Link>
                    : <span className="truncate" style={{ color: i === breadcrumb.length - 1 ? 'var(--th-text-1)' : 'var(--th-text-3)', fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}>{c.label}</span>
                  }
                </span>
              ))}
            </div>
          )}
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
