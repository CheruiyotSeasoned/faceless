import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../../lib/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await auth.login(form)
      if (!res.user?.is_admin) {
        await auth.logout()
        setError('This account does not have admin access.')
        return
      }
      router.push('/admin')
    } catch (e) {
      setError(e.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Admin Login — CliptoKai</title></Head>

      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--th-bg)' }}>
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)', boxShadow: '0 2px 10px rgba(139,92,246,0.45)' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M5 3.5L13.5 8L5 12.5Z" fill="white"/>
                <path d="M13 1.5L13.4 2.6L14.5 3L13.4 3.4L13 4.5L12.6 3.4L11.5 3L12.6 2.6Z" fill="rgba(255,255,255,0.85)"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-black text-base tracking-tight">
                <span style={{ color: 'var(--th-text-1)' }}>ClipTok</span><span style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
              </div>
              <div className="text-xs font-semibold" style={{ color: '#ef4444' }}>Admin Panel</div>
            </div>
          </div>

          <div className="card p-7">
            <div className="mb-6">
              <h1 className="text-xl font-bold" style={{ color: 'var(--th-text-1)' }}>Admin sign in</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--th-text-4)' }}>Access restricted to admin accounts only.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>Email</label>
                <input type="email" className="input" placeholder="admin@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>Password</label>
                <input type="password" className="input" placeholder="Your password"
                  value={form.password} onChange={e => set('password', e.target.value)} required />
              </div>

              {error && (
                <div className="rounded-xl border px-3 py-2.5 text-sm"
                  style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-opacity"
                style={{ background: '#ef4444', opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </>
                ) : 'Sign in to Admin'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm mt-5">
            <Link href="/login" className="hover:underline" style={{ color: 'var(--th-text-4)' }}>
              Back to regular login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
