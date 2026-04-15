import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../lib/api'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [token,    setToken]    = useState('')
  const [form,     setForm]     = useState({ password: '', confirm: '' })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (router.query.token) setToken(router.query.token)
  }, [router.query.token])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await auth.reset({ token, password: form.password })
      setDone(true)
    } catch (e) {
      setError(e.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Set new password — ClipTok AI</title></Head>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
        style={{ background: 'var(--th-bg)' }}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10">
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

        <div className="w-full max-w-sm">
          <div className="card p-7">
            {done ? (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--th-accent-lt)' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11l5 5 9-9" stroke="var(--th-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--th-text-1)' }}>Password updated</h1>
                <p className="text-sm mb-5" style={{ color: 'var(--th-text-3)' }}>
                  Your password has been changed. You can now sign in.
                </p>
                <Link href="/login" className="btn-primary w-full block text-center text-sm py-3">
                  Sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-xl font-bold" style={{ color: 'var(--th-text-1)' }}>Set new password</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--th-text-4)' }}>
                    Choose a strong password for your account.
                  </p>
                </div>

                {!token && (
                  <div className="rounded-xl border p-3 text-sm mb-4"
                    style={{ background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.2)', color: '#f87171' }}>
                    Invalid or missing reset token. Please request a new reset link.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="input pr-10"
                        placeholder="At least 8 characters"
                        value={form.password}
                        onChange={e => set('password', e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--th-text-4)' }}>
                        {showPass ? (
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M3 3l14 14M8.5 8.6A3 3 0 0011.4 11.5M6.3 6.3C4.6 7.4 3.2 8.9 2 10c1.9 2.5 4.7 5 8 5a8 8 0 003.7-.9M10 5c3.3 0 6.1 2.5 8 5a14 14 0 01-2.3 2.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M2 10c1.9-2.5 4.7-5 8-5s6.1 2.5 8 5c-1.9 2.5-4.7 5-8 5s-6.1-2.5-8-5z" stroke="currentColor" strokeWidth="1.5"/>
                            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>
                      Confirm password
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input"
                      placeholder="Repeat your password"
                      value={form.confirm}
                      onChange={e => set('confirm', e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border p-3 text-sm"
                      style={{ background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.2)', color: '#f87171' }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading || !token}
                    className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Updating...
                      </>
                    ) : 'Update password'}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-sm mt-5">
            <Link href="/login" className="hover:underline" style={{ color: 'var(--th-accent)' }}>
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
