import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { auth } from '../lib/api'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.forgot({ email })
      setSent(true)
    } catch (e) {
      setError(e.message || 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Reset password — Faceless Reels</title></Head>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
        style={{ background: 'var(--th-bg)' }}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--th-accent)' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="8" cy="8" r="2.5" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--th-text-1)' }}>Faceless Reels</span>
        </Link>

        <div className="w-full max-w-sm animate-slide-up">
          <div className="card p-7">
            {sent ? (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--th-accent-lt)' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M2 6l9 6 9-6M2 6v10a1 1 0 001 1h16a1 1 0 001-1V6M2 6a1 1 0 011-1h16a1 1 0 011 1"
                      stroke="var(--th-accent)" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--th-text-1)' }}>Check your email</h1>
                <p className="text-sm mb-5" style={{ color: 'var(--th-text-3)' }}>
                  If <span className="font-medium" style={{ color: 'var(--th-text-1)' }}>{email}</span> has an account, you'll receive a reset link shortly.
                </p>
                <Link href="/login" className="btn-primary w-full block text-center text-sm">
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-xl font-bold" style={{ color: 'var(--th-text-1)' }}>Reset your password</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--th-text-4)' }}>Enter your email and we'll send a reset link.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>Email address</label>
                    <input type="email" className="input" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} required />
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
                        Sending...
                      </>
                    ) : 'Send reset link'}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-sm mt-5">
            <Link href="/login" className="hover:underline" style={{ color: 'var(--th-accent)' }}>Back to sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
