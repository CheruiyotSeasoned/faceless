import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { ads, auth } from '../lib/api'

const PENDING_KEY = 'pending_ad'

const STEPS = [
  { n: '1', t: 'Paste your product link', d: 'Any Shopify, WooCommerce, Etsy or Amazon product URL — we grab the image automatically.' },
  { n: '2', t: 'Pick an ad style',         d: 'Dynamic zoom, cinematic pan or 360 showcase. No editing, no prompts to write.' },
  { n: '3', t: 'Download & run it',         d: 'Get a scroll-stopping video ad in ~2 minutes. Post it or run it as a paid ad.' },
]

export default function VideoAdsPage() {
  const router = useRouter()
  const [user,       setUser]       = useState(null)
  const [url,        setUrl]        = useState('')
  const [scraping,   setScraping]   = useState(false)
  const [product,    setProduct]    = useState(null)
  const [templates,  setTemplates]  = useState([])
  const [template,   setTemplate]   = useState('')
  const [configured, setConfigured] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [job,        setJob]        = useState(null)
  const [error,      setError]      = useState('')
  const pollRef = useRef(null)

  useEffect(() => {
    auth.me().then(setUser).catch(() => setUser(null))
    ads.templates()
      .then(d => { setTemplates(d.templates || []); setConfigured(d.configured); if (d.templates?.length) setTemplate(d.templates[0].id) })
      .catch(() => {})

    // Resume a pending ad saved before the user signed up.
    try {
      const raw = localStorage.getItem(PENDING_KEY)
      if (raw) {
        const p = JSON.parse(raw)
        if (p.product) setProduct(p.product)
        if (p.url) setUrl(p.url)
        if (p.template) setTemplate(p.template)
      }
    } catch {}

    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const handleScrape = async (e) => {
    e?.preventDefault?.()
    if (!url.trim()) { setError('Paste a product URL to start.'); return }
    setError(''); setScraping(true); setProduct(null); setJob(null)
    try {
      const p = await ads.scrape(url.trim())
      setProduct(p)
    } catch (e) {
      setError(e.message)
    } finally {
      setScraping(false)
    }
  }

  const handleGenerate = async () => {
    if (!product || !template) return
    setError('')

    // Not signed in → stash the work and send them to sign up (free credits).
    if (!user) {
      try { localStorage.setItem(PENDING_KEY, JSON.stringify({ url, product, template })) } catch {}
      router.push('/onboarding?redirect=/video-ads')
      return
    }

    setGenerating(true)
    try {
      const created = await ads.create({ image_url: product.image, title: product.title, template })
      setJob(created)
      try { localStorage.removeItem(PENDING_KEY) } catch {}
      startPolling(created.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const startPolling = (id) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const j = await ads.job(id)
        setJob(j)
        if (j.status !== 'processing') clearInterval(pollRef.current)
      } catch {}
    }, 8000)
  }

  return (
    <>
      <Head>
        <title>AI Product Video Ads in 2 Minutes — ClipTok AI</title>
        <meta name="description" content="Paste your product link and get a scroll-stopping video ad in minutes. For Shopify, WooCommerce, Etsy & Amazon sellers. From $9." />
      </Head>
      <Navbar />

      <main style={{ background: 'var(--th-bg)', minHeight: '100vh', paddingTop: 64 }}>
        <section style={{ maxWidth: 960, margin: '0 auto', padding: '48px 20px 32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: 'var(--th-accent)', background: 'var(--th-accent-lt)', padding: '5px 12px', borderRadius: 99, marginBottom: 16 }}>
            For Shopify · WooCommerce · Etsy · Amazon sellers
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, color: 'var(--th-text-1)', lineHeight: 1.1, margin: 0 }}>
            Turn any product link into a<br /><span style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>scroll-stopping video ad</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--th-text-3)', maxWidth: 560, margin: '16px auto 0' }}>
            Paste your product URL, pick a style, and get a ready-to-post video ad in about 2 minutes. No editing, no agency, no $200 invoice.
          </p>

          {/* Paste URL */}
          <form onSubmit={handleScrape} style={{ display: 'flex', gap: 10, maxWidth: 560, margin: '28px auto 0', flexWrap: 'wrap' }}>
            <input className="input" type="url" placeholder="https://yourstore.com/products/best-seller"
              value={url} onChange={e => setUrl(e.target.value)}
              style={{ flex: 1, minWidth: 240, height: 48, fontSize: 15 }} />
            <button type="submit" disabled={scraping} className="btn-primary" style={{ height: 48, padding: '0 26px', fontSize: 15, fontWeight: 700 }}>
              {scraping ? 'Fetching…' : 'Make my ad →'}
            </button>
          </form>
          {!configured && (
            <p style={{ fontSize: 13, color: '#b45309', marginTop: 12 }}>Studio not configured yet — add the Higgsfield API keys in admin settings.</p>
          )}
          {error && <p style={{ fontSize: 13, color: '#ef4444', marginTop: 12 }}>{error}</p>}
        </section>

        {/* Product preview + style picker + result */}
        {product && (
          <section style={{ maxWidth: 880, margin: '0 auto', padding: '0 20px 40px' }}>
            <div className="card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '160px 1fr', gap: 20, alignItems: 'start' }}>
              <div style={{ aspectRatio: '1/1', background: '#0a0a14', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={product.image} alt={product.title || 'Product'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                {product.title && <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--th-text-1)', margin: 0 }}>{product.title}</h3>}
                <p style={{ fontSize: 12, color: 'var(--th-text-4)', margin: '4px 0 0' }}>{product.site}</p>

                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--th-text-2)', margin: '16px 0 8px' }}>Choose your ad style</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 10 }}>
                  {templates.map(t => (
                    <div key={t.id} onClick={() => setTemplate(t.id)}
                      style={{ padding: '11px 13px', borderRadius: 10, cursor: 'pointer',
                        border: template === t.id ? '1.5px solid var(--th-accent)' : '1px solid var(--th-border)',
                        background: template === t.id ? 'var(--th-accent-lt)' : 'var(--th-bg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--th-text-1)' }}>{t.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--th-accent)' }}>{t.credits} cr</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--th-text-3)', marginTop: 3 }}>{t.desc}</div>
                    </div>
                  ))}
                </div>

                <button onClick={handleGenerate} disabled={generating || !configured}
                  className="btn-primary" style={{ marginTop: 16, padding: '11px 26px', fontSize: 14, fontWeight: 700 }}>
                  {generating ? 'Starting…' : user ? '✨ Generate my video ad' : 'Create free account to generate →'}
                </button>
                {!user && <p style={{ fontSize: 12, color: 'var(--th-text-4)', marginTop: 8 }}>Free to start — new accounts include credits for your first ads.</p>}
              </div>
            </div>

            {/* Result */}
            {job && (
              <div className="card" style={{ padding: 20, marginTop: 16, textAlign: 'center' }}>
                {job.status === 'processing' && (
                  <div style={{ padding: '30px 0' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', border: '3px solid var(--th-border)', borderTopColor: 'var(--th-accent)', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--th-text-1)', marginTop: 14 }}>Creating your ad…</p>
                    <p style={{ fontSize: 12, color: 'var(--th-text-4)', marginTop: 4 }}>Usually ready in 1–3 minutes. You can leave this page — find it in your dashboard.</p>
                  </div>
                )}
                {job.status === 'completed' && job.output_url && (
                  <div>
                    <video src={job.output_url} controls autoPlay loop playsInline style={{ width: '100%', maxWidth: 360, borderRadius: 12, background: '#000' }} />
                    <div style={{ marginTop: 14 }}>
                      <a href={job.output_url} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '10px 22px', fontSize: 14, textDecoration: 'none' }}>Download video ad</a>
                    </div>
                  </div>
                )}
                {(job.status === 'failed' || job.status === 'nsfw') && (
                  <p style={{ fontSize: 14, color: '#ef4444', padding: '20px 0' }}>{job.error_message || 'Generation failed — your credits were refunded. Try another style.'}</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* How it works */}
        <section style={{ maxWidth: 960, margin: '0 auto', padding: '20px 20px 60px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--th-text-1)', textAlign: 'center', margin: '0 0 28px' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
            {STEPS.map(s => (
              <div key={s.n} className="card" style={{ padding: 22 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--th-accent)', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.n}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--th-text-1)', margin: '12px 0 6px' }}>{s.t}</h3>
                <p style={{ fontSize: 13, color: 'var(--th-text-3)', margin: 0, lineHeight: 1.5 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/onboarding" className="btn-primary" style={{ padding: '12px 30px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Get started free</Link>
            <p style={{ fontSize: 13, color: 'var(--th-text-4)', marginTop: 10 }}>
              Already have an account? <Link href="/login?redirect=/video-ads" style={{ color: 'var(--th-accent)' }}>Sign in</Link>
            </p>
          </div>
        </section>
      </main>

      <style jsx global>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
