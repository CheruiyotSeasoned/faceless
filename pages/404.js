import Head from 'next/head'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <>
      <Head><title>Page not found — ClipTok AI</title></Head>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: 'var(--th-bg)' }}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-16">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)', boxShadow: '0 2px 8px rgba(139,92,246,0.4)' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M5 3.5L13.5 8L5 12.5Z" fill="white"/>
              <path d="M13 1.5L13.4 2.6L14.5 3L13.4 3.4L13 4.5L12.6 3.4L11.5 3L12.6 2.6Z" fill="rgba(255,255,255,0.85)"/>
            </svg>
          </div>
          <span className="font-black text-lg tracking-tight">
            <span style={{ color: 'var(--th-text-1)' }}>ClipTok</span>
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
          </span>
        </Link>

        {/* 404 graphic */}
        <div className="relative mb-8">
          <div className="text-[120px] font-black leading-none select-none"
            style={{ color: 'var(--th-accent-lt)', letterSpacing: '-0.04em' }}>
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--th-accent-lt)', border: '1px solid var(--th-accent-md)' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 5v10M14 19v2" stroke="var(--th-accent)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--th-text-1)' }}>
          Page not found
        </h1>
        <p className="text-base mb-8 max-w-sm" style={{ color: 'var(--th-text-3)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center gap-3">
          <Link href="/" className="btn-primary px-6 py-2.5 text-sm">
            Go home
          </Link>
          <Link href="/login" className="text-sm px-6 py-2.5 rounded-xl font-medium"
            style={{ background: 'var(--th-surface-2)', color: 'var(--th-text-2)', border: '1px solid var(--th-border)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </>
  )
}
