import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AppShell from '../components/AppShell'
import { auth, billing as billingApi } from '../lib/api'

const CURRENCY_SYMBOLS = { USD: '$', KES: 'KES ', GBP: '£', EUR: '€', NGN: '₦', GHS: 'GH₵', ZAR: 'R' }

function formatPrice(price, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || (currency + ' ')
  return price === 0 ? 'Free' : `${sym}${price.toLocaleString()}`
}

function CheckoutDialog({ url, onClose, onSuccess }) {
  const iframeRef = useRef(null)

  const handleLoad = useCallback(() => {
    try {
      const loc = iframeRef.current?.contentWindow?.location?.href || ''
      // When iframe navigates back to our domain we can read the URL
      if (loc && (loc.includes('success=1') || loc.includes('/billing') || loc.includes('/dashboard'))) {
        onSuccess()
      }
    } catch {
      // Still cross-origin (on Paystack) — ignore
    }
  }, [onSuccess])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden shadow-2xl w-full"
        style={{
          maxWidth: 480,
          height: '85vh',
          background: 'var(--th-surface)',
          border: '1px solid var(--th-border)',
        }}
      >
        {/* Dialog header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--th-border)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--th-text-2)' }}>
            Complete payment
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--th-text-4)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={url}
          onLoad={handleLoad}
          className="flex-1 w-full border-0"
          title="Paystack Checkout"
          allow="payment"
        />
      </div>
    </div>
  )
}

export default function BillingPage() {
  const router = useRouter()
  const [user,        setUser]       = useState(null)
  const [plans,       setPlans]      = useState([])
  const [currency,    setCurrency]   = useState('USD')
  const [history,     setHistory]    = useState([])
  const [paying,      setPaying]     = useState('')
  const [error,       setError]      = useState('')
  const [loading,     setLoading]    = useState(true)
  const [checkoutUrl, setCheckoutUrl] = useState(null)
  const [success,     setSuccess]    = useState(false)

  useEffect(() => {
    Promise.all([
      auth.me(),
      billingApi.config(),
      billingApi.history().catch(() => ({ payments: [] })),
    ]).then(([u, cfg, hist]) => {
      setUser(u)
      setPlans(cfg.plans || [])
      setCurrency(cfg.currency || 'USD')
      setHistory(hist.payments || [])
    }).catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [])

  // Refresh user after successful payment (redirect-based fallback)
  useEffect(() => {
    if (router.query.success === '1') auth.me().then(setUser).catch(() => {})
  }, [router.query])

  const handlePaymentSuccess = useCallback(() => {
    setCheckoutUrl(null)
    setSuccess(true)
    auth.me().then(setUser).catch(() => {})
    billingApi.history().then(h => setHistory(h.payments || [])).catch(() => {})
  }, [])

  const subscribe = async (plan) => {
    if (plan.id === 'free' || plan.id === user?.plan) return
    setPaying(plan.id)
    setError('')
    setSuccess(false)
    try {
      const data = await billingApi.initialize({ plan: plan.id })
      if (data.data?.authorization_url) setCheckoutUrl(data.data.authorization_url)
    } catch (e) {
      setError(e.message || 'Payment failed. Please try again.')
    } finally {
      setPaying('')
    }
  }

  if (loading) return (
    <>
      <Head><title>Billing — Faceless Reels</title></Head>
      <AppShell breadcrumb={[{ label: 'Billing' }]}>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--th-accent)', borderTopColor: 'transparent' }} />
        </div>
      </AppShell>
    </>
  )

  return (
    <>
      <Head><title>Billing — Faceless Reels</title></Head>

      {checkoutUrl && (
        <CheckoutDialog
          url={checkoutUrl}
          onClose={() => setCheckoutUrl(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <AppShell breadcrumb={[{ label: 'Billing' }]}>
        <div className="p-7">

          <div className="mb-6">
            <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>Billing & Plans</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>
              Plan: <span className="font-semibold capitalize" style={{ color: 'var(--th-text-2)' }}>{user?.plan || '—'}</span>
              <span className="mx-1.5" style={{ color: 'var(--th-border)' }}>·</span>
              <span className="font-semibold" style={{ color: 'var(--th-accent)' }}>{user?.credits ?? '—'}</span> credits remaining
            </p>
          </div>

          {(success || router.query.success === '1') && (
            <div className="rounded-xl border p-3 text-sm mb-6 flex items-center gap-2"
              style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" fill="rgba(34,197,94,0.15)"/>
                <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Payment successful! Credits have been added to your account.
            </div>
          )}

          {error && (
            <div className="rounded-xl border p-3 text-sm mb-6"
              style={{ background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.2)', color: '#f87171' }}>
              {error}
            </div>
          )}

          {/* Plans grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {plans.map(plan => {
              const isActive = user?.plan === plan.id
              return (
                <div key={plan.id} className="card p-5 flex flex-col relative"
                  style={plan.popular ? { borderColor: 'var(--th-accent)', boxShadow: '0 0 0 1px var(--th-accent)' } : {}}>

                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="badge-purple text-xs font-bold px-3 py-1 rounded-full">Most popular</span>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <span className="badge-green">Active</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-1" style={{ color: 'var(--th-text-2)' }}>{plan.name}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black" style={{ color: 'var(--th-text-1)' }}>
                        {plan.price === 0 ? 'Free' : formatPrice(plan.price, plan.currency)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>/month</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--th-accent)' }}>
                      {plan.id === 'free' ? '3 total credits' : `${plan.credits} credits/month`}
                    </div>
                  </div>

                  <ul className="space-y-2 flex-1 mb-4">
                    {(plan.features || []).map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'var(--th-text-3)' }}>
                        <svg className="flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" fill="var(--th-accent-lt)"/>
                          <path d="M3.5 6l2 2 3-3" stroke="var(--th-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => subscribe(plan)}
                    disabled={isActive || plan.id === 'free' || paying === plan.id}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                    style={(isActive || plan.id === 'free') ? { opacity: 0.4, cursor: 'default' } : {}}
                  >
                    {isActive
                      ? 'Current plan'
                      : plan.id === 'free'
                      ? 'Free plan'
                      : paying === plan.id
                      ? 'Processing…'
                      : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Payment history */}
          <div>
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--th-text-1)' }}>Payment history</h2>
            {history.length === 0 ? (
              <div className="card p-8 text-center text-sm" style={{ color: 'var(--th-text-4)' }}>No payments yet.</div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--th-border)' }}>
                      {['Plan', 'Amount', 'Credits', 'Date', 'Status'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3"
                          style={{ color: 'var(--th-text-4)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--th-border)' }}>
                        <td className="px-5 py-3 font-medium capitalize" style={{ color: 'var(--th-text-1)' }}>{p.plan}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--th-text-2)' }}>
                          {formatPrice(p.amount / 100, currency)}
                        </td>
                        <td className="px-5 py-3 font-semibold" style={{ color: 'var(--th-accent)' }}>{p.credits_granted}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--th-text-4)' }}>
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          <span className={p.status === 'active' ? 'badge-green' : 'badge-gray'}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </AppShell>
    </>
  )
}
