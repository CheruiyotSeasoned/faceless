import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.login(form)
      router.push('/dashboard')
    } catch (e) {
      setError(e.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Sign in — Faceless Reels</title></Head>

      <div className="min-h-screen flex" style={{ background: 'var(--th-bg)' }}>

        {/* Left panel — decorative */}
        <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 relative overflow-hidden"
          style={{ background: 'var(--th-accent)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/3 -left-10 w-48 h-48 bg-white/5 rounded-full" />

          {/* Logo */}
          <div className="relative flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-white text-lg">Faceless Reels</span>
          </div>

          {/* Quote */}
          <div className="relative">
            <div className="text-white/60 text-4xl font-serif leading-none mb-4">"</div>
            <p className="text-white text-lg font-medium leading-relaxed mb-4">
              I went from 0 to 80K followers in 3 months posting faceless content. This tool changed everything.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">JK</div>
              <div>
                <div className="text-white text-sm font-semibold">James K.</div>
                <div className="text-white/50 text-xs">@motivationwithJK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--th-accent)' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--th-text-1)' }}>Faceless Reels</span>
          </Link>

          <div className="w-full max-w-sm animate-slide-up">
            <div className="mb-7">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--th-text-1)' }}>Welcome back</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--th-text-4)' }}>Sign in to your account to continue creating.</p>
            </div>

            {router.query.verified === '1' && (
              <div className="rounded-xl border p-3 text-sm mb-5 flex items-center gap-2"
                style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" fill="rgba(34,197,94,0.15)"/>
                  <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Email verified! You can now sign in.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>Email</label>
                <input type="email" className="input" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--th-text-2)' }}>Password</label>
                  <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: 'var(--th-accent)' }}>Forgot password?</Link>
                </div>
                <input type="password" className="input" placeholder="Your password"
                  value={form.password} onChange={e => set('password', e.target.value)} required />
              </div>

              {error && (
                <div className="rounded-xl border p-3 text-sm"
                  style={{ background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.2)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--th-text-4)' }}>
              Don't have an account?{' '}
              <Link href="/onboarding" className="font-medium hover:underline" style={{ color: 'var(--th-accent)' }}>Get started free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
