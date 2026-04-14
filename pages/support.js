import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import ChatBot from '../components/ChatBot'

const FAQS = [
  {
    q: 'How long does video generation take?',
    a: 'Most videos are ready in under 3 minutes. During busy periods it can take up to 5–7 minutes. You\'ll receive an email notification as soon as your video is ready.',
  },
  {
    q: 'My video is stuck on "processing" — what do I do?',
    a: 'Refresh your dashboard and check your email for a ready notification. If the video has been processing for more than 15 minutes, contact us at info@cliptokai.com with your account email and video ID. Your credits will be fully refunded if generation failed.',
  },
  {
    q: 'I was charged credits but no video was generated.',
    a: 'Our system automatically refunds credits if the video generation fails. If you believe credits were deducted incorrectly, email info@cliptokai.com with your account email and we\'ll investigate within 24 hours.',
  },
  {
    q: 'How do I download my video?',
    a: 'Go to your Dashboard, click on the completed video, then click the Download button to save the MP4 file to your device.',
  },
  {
    q: 'What platforms can I post my videos to?',
    a: 'Our videos are optimised for TikTok, Instagram Reels and YouTube Shorts. All videos are exported in 9:16 vertical format (1080×1920) — the native format for all short-form platforms.',
  },
  {
    q: 'Can I use the videos commercially?',
    a: 'Yes. Videos you generate with ClipTok AI are yours to use for personal or commercial purposes, including monetised social media accounts, client work and brand content.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel at any time from Settings → Subscription in your dashboard. You\'ll keep access until the end of your current billing period. No hidden fees or cancellation charges.',
  },
  {
    q: 'I forgot my password. How do I reset it?',
    a: 'Click "Forgot password" on the login page and enter your email. You\'ll receive a reset link within a few minutes. If you don\'t see it, check your spam folder.',
  },
  {
    q: 'Why does my video sound different from what I expected?',
    a: 'Voice and style options vary across videos — AI generation has inherent variation. Try a different voice or art style on your next video. If the result is unusable, contact support and we may issue a credit.',
  },
  {
    q: 'Do unused credits roll over?',
    a: 'Credits do not roll over between billing periods. Make sure to use your credits before your renewal date.',
  },
]

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--th-border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
          padding: '18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--th-text-1)', lineHeight: 1.4 }}>{q}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
          flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none',
        }}>
          <path d="M3 6l5 5 5-5" stroke="var(--th-text-4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{
          paddingBottom: 18, fontSize: 14, lineHeight: 1.75,
          color: 'var(--th-text-3)', paddingRight: 28,
        }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function SupportPage() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // Opens the user's email client with pre-filled fields
    const body = encodeURIComponent(`Name: ${name}\n\n${message}`)
    const sub  = encodeURIComponent(subject || 'ClipTok AI Support Request')
    window.location.href = `mailto:info@cliptokai.com?subject=${sub}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <Head>
        <title>Support — ClipTok AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ background: 'var(--th-bg)', minHeight: '100vh' }}>
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 hover:opacity-80"
            style={{ color: 'var(--th-accent)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to home
          </Link>

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold"
              style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
              We're here to help
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--th-text-1)' }}>
              Support Centre
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--th-text-3)' }}>
              Find answers to common questions or get in touch with our team.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-16">
            {[
              {
                icon: '✉️',
                title: 'Email Support',
                desc: 'For account, billing and technical issues.',
                action: 'info@cliptokai.com',
                href: 'mailto:info@cliptokai.com',
              },
              {
                icon: '⚡',
                title: 'Response Time',
                desc: 'We typically reply within 24 hours on business days.',
                action: null,
              },
              {
                icon: '🤖',
                title: 'Instant Answers',
                desc: 'Use the chat widget (bottom right) for quick FAQ answers — no waiting.',
                action: null,
              },
            ].map(c => (
              <div key={c.title} className="card p-6 text-center">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-bold mb-1" style={{ color: 'var(--th-text-1)' }}>{c.title}</div>
                <div className="text-sm mb-3" style={{ color: 'var(--th-text-3)' }}>{c.desc}</div>
                {c.href && (
                  <a href={c.href} className="text-sm font-semibold"
                    style={{ color: 'var(--th-accent)' }}>{c.action}</a>
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--th-text-1)' }}>
                Frequently Asked Questions
              </h2>
              <div className="card px-6">
                {FAQS.map(faq => (
                  <Accordion key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--th-text-1)' }}>
                Send Us a Message
              </h2>
              <div className="card p-6">
                {sent ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-4">✅</div>
                    <div className="font-bold text-lg mb-2" style={{ color: 'var(--th-text-1)' }}>
                      Your email client should have opened
                    </div>
                    <p className="text-sm mb-6" style={{ color: 'var(--th-text-3)' }}>
                      If it didn't, email us directly at{' '}
                      <a href="mailto:info@cliptokai.com" style={{ color: 'var(--th-accent)' }}>
                        info@cliptokai.com
                      </a>
                    </p>
                    <button onClick={() => setSent(false)} className="btn-secondary text-sm px-6 py-2">
                      Send another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>Name</label>
                      <input
                        className="input w-full"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>Email</label>
                      <input
                        className="input w-full"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>Subject</label>
                      <input
                        className="input w-full"
                        placeholder="e.g. Video stuck processing"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>Message</label>
                      <textarea
                        className="input w-full"
                        rows={5}
                        placeholder="Describe your issue in as much detail as possible…"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        style={{ resize: 'vertical', minHeight: 120 }}
                      />
                    </div>
                    <button type="submit" className="btn-primary py-3">
                      Send Message
                    </button>
                    <p className="text-xs text-center" style={{ color: 'var(--th-text-4)' }}>
                      This opens your email client pre-filled. Alternatively email{' '}
                      <a href="mailto:info@cliptokai.com" style={{ color: 'var(--th-accent)' }}>info@cliptokai.com</a>{' '}
                      directly.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <ChatBot />
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer className="py-10 px-4" style={{ borderTop: '1px solid var(--th-border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>© 2025 ClipTok AI</span>
        <div className="flex gap-6">
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Support', '/support']].map(([label, href]) => (
            <Link key={label} href={href} className="text-sm hover:underline" style={{ color: 'var(--th-text-4)' }}>{label}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
