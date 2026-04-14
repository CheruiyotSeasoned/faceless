import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )},
  { href: '/create', label: 'Create', icon: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 5.5v7M5.5 9h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
  { href: '/billing', label: 'Billing', icon: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="4" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 8h15" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
  { href: '/settings', label: 'Settings', icon: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 1v2M9 15v2M1 9h2M15 9h2M2.93 2.93l1.41 1.41M13.66 13.66l1.41 1.41M2.93 15.07l1.41-1.41M13.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
]

export default function Sidebar({ user }) {
  const router = useRouter()

  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen fixed left-0 top-0 bg-[#0a0a14] border-r border-white/5 z-40">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)', boxShadow: '0 2px 8px rgba(139,92,246,0.5)' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M5 3.5L13.5 8L5 12.5Z" fill="white"/>
            <path d="M13 1.5L13.4 2.6L14.5 3L13.4 3.4L13 4.5L12.6 3.4L11.5 3L12.6 2.6Z" fill="rgba(255,255,255,0.85)"/>
          </svg>
        </div>
        <span className="font-black tracking-tight text-base">
          <span style={{ color: 'white' }}>ClipTok</span><span style={{ background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(item => {
          const active = router.pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={active ? 'text-brand-400' : ''}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="px-3 pb-4 border-t border-white/5 pt-4">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-medium truncate">{user.name}</div>
              <div className="text-white/30 text-xs capitalize">{user.plan} plan</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
