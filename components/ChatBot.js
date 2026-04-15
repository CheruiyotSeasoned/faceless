import { useState, useEffect, useRef } from 'react'

// ── Knowledge base ──────────────────────────────────────────────────────────

const FAQS = [
  {
    id: 'what',
    label: 'What is ClipTok AI?',
    keywords: ['what', 'about', 'cliptokai', 'cliptok', 'platform', 'explain'],
    answer: 'ClipTok AI is an AI-powered video generator that creates fully produced faceless videos — complete with script, voiceover, visuals, captions and background music — in under 3 minutes. No camera, no editing skills needed.',
  },
  {
    id: 'how',
    label: 'How does it work?',
    keywords: ['how', 'work', 'process', 'steps', 'generate', 'create', 'make'],
    answer: '1️⃣ Pick a niche (Motivation, Did You Know, True Crime, etc.)\n2️⃣ Choose your voice, style and caption theme\n3️⃣ Click Generate — your video is ready in ~3 minutes\n\nDownload it and post directly to TikTok, Reels or YouTube Shorts.',
  },
  {
    id: 'time',
    label: 'How long does generation take?',
    keywords: ['long', 'time', 'wait', 'minutes', 'fast', 'quick', 'slow', 'processing', 'duration'],
    answer: 'Most videos are ready in under 3 minutes. Occasionally it can take up to 5–7 minutes during busy periods. You\'ll get an email notification as soon as your video is ready.',
  },
  {
    id: 'niches',
    label: 'What niches are available?',
    keywords: ['niche', 'topic', 'category', 'type', 'kind', 'available', 'subjects'],
    answer: 'We have 10+ ready-made niches:\n• Motivation & Mindset\n• Did You Know (facts)\n• Reddit Stories\n• Scary Stories\n• History\n• Mythology\n• News Recap\n• Finance Tips\n• Bible Stories\n• True Crime\n\nYou can also write a fully custom prompt.',
  },
  {
    id: 'credits',
    label: 'How do credits work?',
    keywords: ['credit', 'credits', 'cost', 'charge', 'deduct', 'how many', 'use'],
    answer: 'Each video generation costs 50 credits. Credits are included in your subscription plan and reset monthly. If a video fails to generate, your credits are automatically refunded.',
  },
  {
    id: 'pricing',
    label: 'What are the pricing plans?',
    keywords: ['price', 'pricing', 'plan', 'plans', 'pay', 'cost', 'free', 'upgrade', 'subscription'],
    answer: 'We offer a Free plan to get you started, plus paid plans with more monthly credits. Scroll down to the Pricing section on our homepage to see the current plans and pricing in your local currency.',
  },
  {
    id: 'download',
    label: 'How do I download my video?',
    keywords: ['download', 'save', 'get', 'video', 'file', 'mp4', 'access'],
    answer: 'Once your video is ready, go to your Dashboard and click on the video. You\'ll see a Download button to save the MP4 file directly to your device.',
  },
  {
    id: 'platforms',
    label: 'Which platforms can I post to?',
    keywords: ['platform', 'tiktok', 'instagram', 'youtube', 'reels', 'shorts', 'post', 'upload', 'share'],
    answer: 'Our videos are optimised for:\n• TikTok\n• Instagram Reels\n• YouTube Shorts\n\nAll videos are exported as 9:16 vertical MP4 files — the native format for all short-form platforms.',
  },
  {
    id: 'cancel',
    label: 'Can I cancel my subscription?',
    keywords: ['cancel', 'cancellation', 'stop', 'refund', 'subscription', 'end'],
    answer: 'Yes, you can cancel anytime from your account settings. You\'ll keep access until the end of your current billing period. We don\'t offer refunds for partially used periods, but there are no hidden fees or commitments.',
  },
  {
    id: 'stuck',
    label: 'My video is stuck processing',
    keywords: ['stuck', 'processing', 'pending', 'not ready', 'failed', 'error', 'problem', 'issue'],
    answer: 'If your video has been processing for more than 10 minutes:\n• Refresh your dashboard\n• Check your email for a ready notification\n\nIf it still shows "processing" after 15 minutes, please contact our support and we\'ll investigate. Your credits will be refunded if the generation failed.',
  },
  {
    id: 'quality',
    label: 'What quality are the videos?',
    keywords: ['quality', 'resolution', 'hd', '1080', 'format', 'size', 'look'],
    answer: 'Videos are rendered in HD quality (1080×1920) at 9:16 aspect ratio. They include AI-generated visuals, professional voiceover, styled captions and background music — ready to post without any editing.',
  },
  {
    id: 'contact',
    label: 'How do I contact support?',
    keywords: ['support', 'help', 'contact', 'email', 'human', 'talk', 'reach'],
    answer: 'For support, email us at support@cliptokai.com. We typically respond within 24 hours. For urgent billing issues, include your account email in the subject line.',
  },
]

const QUICK_REPLIES = [
  { label: '⚡ How it works',       id: 'how' },
  { label: '🎬 What niches?',       id: 'niches' },
  { label: '💳 Credits & pricing',  id: 'credits' },
  { label: '⬇️ Downloading videos', id: 'download' },
  { label: '🔄 Video stuck?',       id: 'stuck' },
  { label: '📬 Contact support',    id: 'contact' },
]

function findAnswer(input) {
  const lower = input.toLowerCase()
  let best = null
  let bestScore = 0

  for (const faq of FAQS) {
    const score = faq.keywords.filter(k => lower.includes(k)).length
    if (score > bestScore) {
      bestScore = score
      best = faq
    }
  }

  if (bestScore === 0) {
    return "I'm not sure about that one. Try one of the quick options below, or email us at support@cliptokai.com and we'll get back to you within 24 hours! 😊"
  }

  return best.answer
}

// ── Component ───────────────────────────────────────────────────────────────

export default function ChatBot() {
  const [open,        setOpen]        = useState(false)
  const [messages,    setMessages]    = useState([])
  const [input,       setInput]       = useState('')
  const [typing,      setTyping]      = useState(false)
  const [bannerUp,    setBannerUp]    = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Lift above PWA install banner when it is visible
  useEffect(() => {
    const check = () => setBannerUp(document.body.classList.contains('pwa-banner-active'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'bot',
        text: "👋 Hi! I'm the ClipTok AI assistant. I can answer questions about the platform, credits, video generation and more.\n\nWhat can I help you with?",
        quick: true,
      }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function sendUserMessage(text) {
    if (!text.trim()) return
    setInput('')

    const userMsg = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    // Simulate a short typing delay
    setTimeout(() => {
      const answer = findAnswer(text)
      setTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text: answer, quick: true }])
    }, 700 + Math.random() * 400)
  }

  function handleQuickReply(id) {
    const faq = FAQS.find(f => f.id === id)
    if (!faq) return
    setMessages(prev => [...prev, { role: 'user', text: faq.label }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text: faq.answer, quick: true }])
    }, 500)
  }

  const lastBotIdx = [...messages].map((m, i) => m.role === 'bot' ? i : -1).filter(i => i >= 0).pop()

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: bannerUp ? 160 : 84, right: 20, zIndex: 9000,
          width: 340, maxHeight: '70vh',
          background: '#0e0e1a',
          border: '1px solid rgba(139,61,255,0.25)',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,61,255,0.1)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatSlideUp 0.2s ease',
        }}>
          <style>{`
            @keyframes chatSlideUp {
              from { opacity: 0; transform: translateY(16px) scale(0.97) }
              to   { opacity: 1; transform: translateY(0) scale(1) }
            }
            .chat-msg-user { background: linear-gradient(135deg,#5b21b6,#7c3aed); color:#fff; border-radius:16px 16px 4px 16px; align-self:flex-end; }
            .chat-msg-bot  { background:#1a1a2e; color:rgba(255,255,255,0.88); border-radius:16px 16px 16px 4px; align-self:flex-start; border:1px solid rgba(139,61,255,0.15); }
            .chat-quick-btn { background:rgba(92,30,255,0.12); border:1px solid rgba(139,61,255,0.3); color:rgba(255,255,255,0.75); font-size:12px; padding:5px 11px; border-radius:20px; cursor:pointer; white-space:nowrap; transition:all 0.15s; }
            .chat-quick-btn:hover { background:rgba(92,30,255,0.3); color:#fff; border-color:rgba(139,61,255,0.7); }
            .typing-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.45); animation:typingBounce 1.2s ease-in-out infinite; }
            .typing-dot:nth-child(2) { animation-delay:0.2s; }
            .typing-dot:nth-child(3) { animation-delay:0.4s; }
            @keyframes typingBounce { 0%,60%,100% { transform:translateY(0) } 30% { transform:translateY(-5px) } }
          `}</style>

          {/* Header */}
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid rgba(139,61,255,0.15)',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg,#5b21b6,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="10" height="8" rx="2" stroke="white" strokeWidth="1.3"/>
                <path d="M11 6l4-2v6l-4-2" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>ClipTok AI Support</div>
              <div style={{ fontSize: 11, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: '2px 4px',
            }}>×</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 6px',
            display: 'flex', flexDirection: 'column', gap: 10,
            scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,61,255,0.3) transparent',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className={`chat-msg-${msg.role}`} style={{
                  maxWidth: '84%', padding: '9px 13px',
                  fontSize: 13, lineHeight: 1.55,
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>

                {/* Quick replies after last bot message only */}
                {msg.role === 'bot' && msg.quick && i === lastBotIdx && (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: '92%',
                  }}>
                    {QUICK_REPLIES.map(qr => (
                      <button key={qr.id} className="chat-quick-btn"
                        onClick={() => handleQuickReply(qr.id)}>
                        {qr.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="chat-msg-bot" style={{ padding: '10px 14px', display: 'inline-flex', gap: 5, alignSelf: 'flex-start' }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px', borderTop: '1px solid rgba(139,61,255,0.15)',
            display: 'flex', gap: 8, flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendUserMessage(input)}
              placeholder="Ask a question…"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(139,61,255,0.2)',
                borderRadius: 12, padding: '8px 12px',
                color: 'white', fontSize: 13, outline: 'none',
              }}
            />
            <button
              onClick={() => sendUserMessage(input)}
              disabled={!input.trim() || typing}
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: input.trim() && !typing
                  ? 'linear-gradient(135deg,#5b21b6,#7c3aed)'
                  : 'rgba(255,255,255,0.08)',
                border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: bannerUp ? 100 : 24, right: 20, zIndex: 9001,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg,#5b21b6,#7c3aed)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(92,30,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(92,30,255,0.65)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';   e.currentTarget.style.boxShadow = '0 8px 32px rgba(92,30,255,0.5)' }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 5a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H7l-4 3V5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="7" cy="9" r="1" fill="white"/>
            <circle cx="10" cy="9" r="1" fill="white"/>
            <circle cx="13" cy="9" r="1" fill="white"/>
          </svg>
        )}

        {/* Notification dot (shown when closed) */}
        {!open && (
          <div style={{
            position: 'absolute', top: 2, right: 2,
            width: 10, height: 10, borderRadius: '50%',
            background: '#22c55e', border: '2px solid #0e0e1a',
          }} />
        )}
      </button>
    </>
  )
}
