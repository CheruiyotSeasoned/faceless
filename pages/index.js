import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'

const FEATURES = [
  { title: 'Generate in minutes',    desc: 'Pick a topic, click generate. Your AI video is ready in under 3 minutes with script, voice, visuals and captions.' },
  { title: 'Multiple AI voices',     desc: 'Choose from deep, calm, warm, bright or neutral narrators. Every video sounds professional.' },
  { title: 'Visual styles',          desc: 'Cinematic, documentary, anime, inspirational — pick the aesthetic that fits your brand.' },
  { title: '9:16 optimized',         desc: 'Every video is built for TikTok, Instagram Reels and YouTube Shorts. Perfect vertical format.' },
  { title: 'Auto captions',          desc: 'Trendy caption styles baked directly into your video — no editing required.' },
  { title: 'Background music',       desc: 'Curated royalty-free tracks that match your content mood, chosen automatically.' },
]

const NICHES = [
  'Motivation', 'Did You Know', 'Reddit Stories', 'Scary Stories',
  'History', 'Mythology', 'News Recap', 'Finance Tips', 'Bible Stories', 'True Crime',
]

const PLANS = [
  { id:'free',    name:'Free',    price:'0',     period:'forever', videos:'3 total',   cta:'Start free',       href:'/onboarding', popular:false,
    features:['3 video credits','720p quality','Watermark included','All niches & voices'] },
  { id:'starter', name:'Starter', price:'999',   period:'/month',  videos:'20/month',  cta:'Get Starter',      href:'/onboarding', popular:false,
    features:['20 credits/month','1080p quality','No watermark','All niches & voices','Caption themes','Email support'] },
  { id:'pro',     name:'Pro',     price:'2,499', period:'/month',  videos:'60/month',  cta:'Get Pro',          href:'/onboarding', popular:true,
    features:['60 credits/month','1080p quality','No watermark','Priority generation','Blog to video','Priority support'] },
  { id:'creator', name:'Creator', price:'4,999', period:'/month',  videos:'150/month', cta:'Get Creator',      href:'/onboarding', popular:false,
    features:['150 credits/month','4K quality','No watermark','Fastest generation','API access (soon)','Dedicated support'] },
]

const TESTIMONIALS = [
  { name:'James K.',  handle:'@motivationwithJK', avatar:'JK', quote:'I went from 0 to 80K followers in 3 months posting faceless motivation content. This tool saves me 5+ hours every single week.', metric:'80K followers' },
  { name:'Amina O.',  handle:'@didyouknowfacts',  avatar:'AO', quote:'The did-you-know niche is insane on TikTok right now. I post 2 videos a day using this tool and my videos consistently hit 100K views.', metric:'2.1M total views' },
  { name:'David M.',  handle:'@historyunlocked',  avatar:'DM', quote:'As someone with zero video editing skills, this platform is a game changer. The cinematic style looks genuinely professional.', metric:'34K subscribers' },
]

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Faceless — AI Video Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Create viral faceless AI videos in minutes. No camera, no editor. Just your niche and one click." />
      </Head>

      <div style={{ background: 'var(--th-bg)', minHeight: '100vh' }}>
        <Navbar />

        {/* ── Hero ── */}
        <section className="relative flex items-center justify-center overflow-hidden pt-16">
          {/* Subtle accent orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[600px] h-[600px] rounded-full top-[-20%] right-[-15%] opacity-20"
              style={{ background: 'radial-gradient(circle, var(--th-accent-md) 0%, transparent 70%)' }} />
            <div className="absolute w-[400px] h-[400px] rounded-full bottom-[-10%] left-[-10%] opacity-15"
              style={{ background: 'radial-gradient(circle, var(--th-accent-md) 0%, transparent 70%)' }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-28">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-sm font-medium"
              style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--th-accent)' }} />
              No camera. No editor. Just results.
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
              style={{ color: 'var(--th-text-1)' }}>
              Go viral without{' '}
              <span style={{ color: 'var(--th-accent)' }}>showing your face</span>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'var(--th-text-3)' }}>
              Pick a niche. Click generate. Get a fully produced AI video — script, voice, visuals, captions and music — ready to post in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/onboarding" className="btn-primary text-base px-8 py-4">
                Create your first video free
              </Link>
              <Link href="#features" className="btn-secondary text-base px-8 py-4">
                See how it works
              </Link>
            </div>

            <p className="text-sm mt-6" style={{ color: 'var(--th-text-4)' }}>
              No credit card required · 3 free videos · Cancel anytime
            </p>

            {/* Hero visual — dashboard mockup */}
            <div className="mt-20 relative max-w-4xl mx-auto">
              <div className="rounded-3xl p-1 shadow-2xl" style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--th-surface-2)' }}>
                  {/* Fake browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--th-border)' }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--th-border)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--th-border)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--th-border)' }} />
                    <div className="flex-1 rounded-md h-5 mx-4" style={{ background: 'var(--th-border)' }} />
                  </div>
                  {/* Stat cards */}
                  <div className="p-5 grid grid-cols-3 gap-4">
                    {[
                      { label:'Credits',  value:'57',   sub:'+3 today' },
                      { label:'Videos',   value:'142',  sub:'all time' },
                      { label:'Completed',value:'138',  sub:'this month' },
                    ].map(s => (
                      <div key={s.label} className="card p-4">
                        <div className="text-2xl font-bold" style={{ color: 'var(--th-accent)' }}>{s.value}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-4)' }}>{s.label}</div>
                        <div className="text-xs" style={{ color: 'var(--th-text-4)' }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  {/* Video grid */}
                  <div className="px-5 pb-5 grid grid-cols-4 gap-3">
                    {['Motivation','Did You Know','Reddit','History'].map((niche, i) => (
                      <div key={niche} className="card overflow-hidden">
                        <div className="h-16 flex items-center justify-center" style={{ background: 'var(--th-accent-lt)' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect x="2" y="3" width="11" height="14" rx="2" stroke="var(--th-accent)" strokeWidth="1.3"/>
                            <path d="M13 7l4-2.5v8l-4-2.5" stroke="var(--th-accent)" strokeWidth="1.3" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="p-2">
                          <div className="text-xs font-medium truncate" style={{ color: 'var(--th-text-2)' }}>{niche}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: i < 2 ? '#22c55e' : i === 2 ? 'var(--th-accent)' : 'var(--th-border)' }} />
                            <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>
                              {i < 2 ? 'ready' : i === 2 ? 'generating' : 'queued'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 rounded-2xl px-4 py-2.5 hidden sm:block"
                style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', boxShadow: '0 4px 20px rgba(108,71,255,0.12)' }}>
                <div className="text-sm font-semibold" style={{ color: '#22c55e' }}>Video ready!</div>
                <div className="text-xs" style={{ color: 'var(--th-text-4)' }}>Your TikTok is live</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-24 max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm"
              style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
              Everything you need
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--th-text-1)' }}>
              One tool. Complete videos.
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--th-text-3)' }}>
              From script to final cut, AI handles the entire production pipeline.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--th-accent-lt)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="var(--th-accent)" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-base mb-1.5" style={{ color: 'var(--th-text-1)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--th-text-3)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Niches ── */}
        <section className="py-16 overflow-hidden">
          <div className="text-center mb-10 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--th-text-1)' }}>
              10+ niches ready to go
            </h2>
            <p style={{ color: 'var(--th-text-3)' }}>Pre-trained for the highest-performing categories on TikTok and YouTube.</p>
          </div>
          <div className="relative">
            <div className="flex gap-3 whitespace-nowrap w-max" style={{ animation: 'scroll 20s linear infinite' }}>
              {[...NICHES, ...NICHES].map((n, i) => (
                <div key={i} className="inline-flex items-center px-5 py-2.5 text-sm rounded-full flex-shrink-0"
                  style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', color: 'var(--th-text-2)' }}>
                  {n}
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-16 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--th-bg), transparent)' }} />
            <div className="absolute inset-y-0 right-0 w-16 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--th-bg), transparent)' }} />
          </div>
          <style jsx>{`
            @keyframes scroll { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
          `}</style>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24 max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--th-text-1)' }}>
              Real creators. Real results.
            </h2>
            <p className="text-lg" style={{ color: 'var(--th-text-3)' }}>Built for creators who want to grow without being on camera.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'var(--th-accent)' }}>
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--th-text-1)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--th-text-4)' }}>{t.handle}</div>
                  </div>
                  <div className="rounded-lg px-2 py-1 text-xs font-semibold flex-shrink-0"
                    style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
                    {t.metric}
                  </div>
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--th-text-3)' }}>"{t.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 14 14" fill="#f59e0b">
                      <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.2 3.8 11l.6-3.6L2 4.8l3.6-.5L7 1z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-24 max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--th-text-1)' }}>
              Simple, honest pricing
            </h2>
            <p className="text-lg" style={{ color: 'var(--th-text-3)' }}>Start free. Scale when you're ready.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map(plan => (
              <div key={plan.id} className="card p-6 flex flex-col relative"
                style={plan.popular ? { borderColor: 'var(--th-accent)', boxShadow: '0 0 0 1px var(--th-accent)' } : {}}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-purple text-xs font-bold px-3 py-1 rounded-full">Most popular</span>
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--th-text-2)' }}>{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>KES</span>
                    <span className="text-4xl font-black" style={{ color: 'var(--th-text-1)' }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>{plan.period}</span>
                  </div>
                  <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--th-accent)' }}>{plan.videos}</div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--th-text-3)' }}>
                      <svg className="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="5.5" fill="var(--th-accent-lt)"/>
                        <path d="M4 6.5l2 2 3-3" stroke="var(--th-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`${plan.popular ? 'btn-primary' : 'btn-secondary'} text-center text-sm`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
            style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
            <div className="absolute inset-0 opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center top, var(--th-accent-lt), transparent 60%)' }} />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ color: 'var(--th-text-1)' }}>
                Your first video is{' '}
                <span style={{ color: 'var(--th-accent)' }}>waiting</span>
              </h2>
              <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: 'var(--th-text-3)' }}>
                Join thousands of creators building passive income channels without ever appearing on camera.
              </p>
              <Link href="/onboarding" className="btn-primary text-lg px-10 py-4">
                Get started for free
              </Link>
              <p className="text-sm mt-4" style={{ color: 'var(--th-text-4)' }}>No credit card · 3 free videos</p>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="py-10 px-4" style={{ borderTop: '1px solid var(--th-border)' }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--th-accent)' }}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <circle cx="8" cy="8" r="2.5" fill="white"/>
                </svg>
              </div>
              <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>2025 Faceless Reels</span>
            </div>
            <div className="flex gap-6">
              {['Terms', 'Privacy', 'Support'].map(l => (
                <a key={l} href="#" className="text-sm transition-colors hover:underline" style={{ color: 'var(--th-text-4)' }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
