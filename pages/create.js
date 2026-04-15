import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AppShell from '../components/AppShell'
import { auth, videos as videosApi, onboarding as ob, vadoo as vadooApi } from '../lib/api'

// ── Static data ───────────────────────────────────────────────────────────────

const NICHES = [
  { id: 'Motivational',        label: 'Motivation'    },
  { id: 'Fun Facts',           label: 'Did You Know'  },
  { id: 'Scary Stories',       label: 'Scary Stories' },
  { id: 'Interesting History', label: 'History'       },
  { id: 'Random AI Story',     label: 'AI Story'      },
  { id: 'Philosophy',          label: 'Philosophy'    },
  { id: 'Life Pro Tips',       label: 'Life Tips'     },
  { id: 'ELI5',                label: 'Explain It'    },
  { id: 'Long Form Jokes',     label: 'Jokes'         },
  { id: 'Bedtime Stories',     label: 'Bedtime'       },
]

const PROMPT_EXAMPLES = [
  'A short motivational video about not giving up when life gets hard — keep it intense and punchy',
  'Did you know facts about the deep ocean — things most people have never heard of',
  'A scary story about a man who keeps finding notes in his house with tomorrow\'s events written on them',
  'The untold story of how Rome actually fell — focus on the economic collapse, not just the wars',
  'Top 3 money mistakes people make in their 20s and how to avoid them',
]

const VOICES = [
  { id: 'Onyx',    label: 'Onyx',    gender: 'M', tone: 'Authoritative & Deep',  accent: 'American', color: '#4f46e5' },
  { id: 'Alloy',   label: 'Alloy',   gender: 'M', tone: 'Natural & Versatile',   accent: 'American', color: '#0891b2' },
  { id: 'Echo',    label: 'Echo',    gender: 'M', tone: 'Deep & Mature',          accent: 'American', color: '#7c3aed' },
  { id: 'Nova',    label: 'Nova',    gender: 'F', tone: 'Energetic & Young',      accent: 'American', color: '#db2777' },
  { id: 'Shimmer', label: 'Shimmer', gender: 'F', tone: 'Soft & Calm',            accent: 'American', color: '#9333ea' },
  { id: 'Sarah',   label: 'Sarah',   gender: 'F', tone: 'Professional',           accent: 'American', color: '#0d9488' },
  { id: 'Charlie', label: 'Charlie', gender: 'M', tone: 'Casual & Friendly',      accent: 'American', color: '#ea580c' },
]

const ART_STYLES = [
  { id: 'None',         label: 'No Style'   },
  { id: 'cinematic',    label: 'Cinematic'  },
  { id: 'anime',        label: 'Anime'      },
  { id: 'photographic', label: 'Photo'      },
  { id: 'digital art',  label: 'Digital'    },
  { id: 'cartoon',      label: 'Cartoon'    },
  { id: 'comic book',   label: 'Comic'      },
  { id: 'fantasy art',  label: 'Fantasy'    },
  { id: 'pixel art',    label: 'Pixel'      },
  { id: 'watercolor',   label: 'Watercolor' },
  { id: 'neon punk',    label: 'Neon Punk'  },
  { id: '3d model',     label: '3D Model'   },
]

const CAPTIONS = [
  { id: 'Hormozi_1', label: 'Hormozi',  desc: 'Classic bold' },
  { id: 'Hormozi_2', label: 'Bold',     desc: 'Heavy weight' },
  { id: 'Hormozi_3', label: 'Shadow',   desc: 'Drop shadow'  },
  { id: 'Beast',     label: 'MrBeast',  desc: 'Bright & fun' },
  { id: 'Ali',       label: 'Ali',      desc: 'Clean minimal'},
  { id: 'Celine',    label: 'Celine',   desc: 'Soft style'   },
  { id: 'Dan',       label: 'Dan',      desc: 'Impact caps'  },
  { id: 'David',     label: 'David',    desc: 'Loud & loud'  },
  { id: 'Iman',      label: 'Iman',     desc: 'Clean outline'},
]

const DURATIONS = [
  { id: '30-60',   label: '30–60s',   desc: 'Short' },
  { id: '60-90',   label: '60–90s',   desc: 'Medium' },
  { id: '90-120',  label: '90–120s',  desc: 'Long' },
  { id: '120-180', label: '120–180s', desc: 'Extra' },
]

const RATIOS = [
  { id: '9:16',  label: '9:16',  desc: 'TikTok / Reels' },
  { id: '1:1',   label: '1:1',   desc: 'Square' },
  { id: '16:9',  label: '16:9',  desc: 'Landscape' },
]

const MUSIC = [
  { id: '',          label: 'None'      },
  { id: 'Cinematic', label: 'Cinematic' },
  { id: 'Epic',      label: 'Epic'      },
  { id: 'Upbeat',    label: 'Upbeat'    },
  { id: 'Happy',     label: 'Happy'     },
  { id: 'Sad',       label: 'Sad'       },
  { id: 'Suspense',  label: 'Suspense'  },
  { id: 'Lo-Fi',     label: 'Lo-Fi'     },
  { id: 'Corporate', label: 'Corporate' },
]

const NICHE_MAP = {
  motivation: 'Motivational', facts: 'Fun Facts', scary: 'Scary Stories',
  historical: 'Interesting History', mythology: 'Random AI Story',
  truecrime: 'Random AI Story', stoic: 'Philosophy', morals: 'Life Pro Tips',
  finance: 'Life Pro Tips', anime: 'Random AI Story',
}

// ── Small primitives ──────────────────────────────────────────────────────────

function SectionHead({ step, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: 'var(--th-surface-2)', color: 'var(--th-text-4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, border: '1px solid var(--th-border)',
      }}>{step}</div>
      <div>
        <div className="text-sm font-semibold" style={{ color: 'var(--th-text-1)' }}>{title}</div>
        {subtitle && <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-4)' }}>{subtitle}</div>}
      </div>
    </div>
  )
}

function PillGroup({ options, value, onChange, cols }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: 8,
    }}>
      {options.map(o => {
        const selected = value === (o.id ?? o)
        return (
          <button key={o.id ?? o} type="button" onClick={() => onChange(o.id ?? o)}
            style={{
              padding: '7px 10px', borderRadius: 10, cursor: 'pointer',
              border: selected ? '1.5px solid var(--th-accent)' : '1px solid var(--th-border)',
              background: selected ? 'var(--th-accent-lt)' : 'var(--th-surface-2)',
              color: selected ? 'var(--th-accent)' : 'var(--th-text-3)',
              fontSize: 12, fontWeight: selected ? 700 : 500,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              transition: 'all 0.15s',
              textAlign: 'center',
            }}>
            {o.emoji && <span style={{ fontSize: 16 }}>{o.emoji}</span>}
            <span>{o.label ?? o}</span>
            {o.desc && <span style={{ fontSize: 10, opacity: 0.65, fontWeight: 400 }}>{o.desc}</span>}
          </button>
        )
      })}
    </div>
  )
}

function SelectDropdown({ label, optional, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--th-text-3)' }}>
        {label}{optional && <span className="ml-1 font-normal" style={{ color: 'var(--th-text-4)' }}>(optional)</span>}
      </label>
      <div className="relative">
        <select className="input appearance-none pr-8 cursor-pointer text-sm" value={value}
          onChange={e => onChange(e.target.value)} style={{ fontSize: 13 }}>
          {options.map(o => <option key={o.id ?? o} value={o.id ?? o}>{o.label ?? o}</option>)}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12"
          viewBox="0 0 12 12" fill="none" style={{ color: 'var(--th-text-4)' }}>
          <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function CreatePage() {
  const router   = useRouter()
  const [user,       setUser]       = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [languages,  setLanguages]  = useState([{ id: 'English', label: 'English' }])
  const [showAdv,    setShowAdv]    = useState(false)
  const [exampleIdx, setExampleIdx] = useState(0)

  const [form, setForm] = useState({
    topic:               'Custom',
    prompt:              '',
    language:            'English',
    duration:            '30-60',
    voice:               'Onyx',
    aspect_ratio:        '9:16',
    style:               'cinematic',
    theme:               'Hormozi_1',
    bg_music:            '',
    custom_instructions: '',
    url:                 '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Cycle placeholder example
  useEffect(() => {
    const t = setInterval(() => setExampleIdx(i => (i + 1) % PROMPT_EXAMPLES.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    auth.me().then(setUser).catch(() => router.push('/login'))
    vadooApi.languages().then(d => setLanguages(d.languages || [])).catch(() => {})
    ob.load().then(p => {
      if (!p) return
      setForm(f => ({
        ...f,
        topic:    NICHE_MAP[p.niche?.id] || f.topic,
        prompt:   p.niche?.description   || f.prompt,
        language: p.language             || f.language,
        duration: DURATIONS.find(d => d.id === p.series?.duration)?.id || f.duration,
        voice:    p.voice                || f.voice,
        style:    ART_STYLES.find(s => s.id === p.artStyle)?.id        || f.style,
        theme:    CAPTIONS.find(c => c.id === p.captions)?.id          || f.theme,
        bg_music: MUSIC.find(m => m.id === p.music?.presets?.[0])?.id  ?? f.bg_music,
      }))
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!user?.credits || user.credits < 50) {
      setError('Insufficient credits. Please upgrade your plan.')
      return
    }
    setLoading(true)
    try {
      const payload = { ...form }
      // Only send prompt when topic is Custom or when user typed one
      if (form.topic !== 'Custom' && !form.prompt) delete payload.prompt
      if (!payload.url)                 delete payload.url
      if (!payload.bg_music)            delete payload.bg_music
      if (!payload.custom_instructions) delete payload.custom_instructions
      const result = await videosApi.create(payload)
      router.push(`/video/${result.id}`)
    } catch (e) {
      setError(e.message || 'Failed to create video.')
    } finally {
      setLoading(false)
    }
  }

  const credits = user?.credits ?? 0
  const canGenerate = credits >= 50

  return (
    <>
      <Head><title>Create Video — ClipTok AI</title></Head>
      <AppShell breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Create Video' }]}>

        <style>{`
          .create-wrap { max-width: 760px; padding: 28px 20px 60px; }
          @media (min-width: 640px) { .create-wrap { padding: 36px 32px 80px; } }
          .voice-card { border-radius: 12px; padding: 10px 12px; cursor: pointer; transition: all 0.15s; border: 1.5px solid var(--th-border); background: var(--th-surface-2); display: flex; flex-direction: column; gap: 4px; }
          .voice-card:hover { border-color: var(--th-accent); }
          .voice-card.selected { border-color: var(--th-accent); background: var(--th-accent-lt); }
          .create-card { background: var(--th-surface); border: 1px solid var(--th-border); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
          @media (min-width: 640px) { .create-card { padding: 24px; } }
          .prompt-area { width: 100%; resize: vertical; min-height: 110px; font-size: 14px; line-height: 1.65; }
          .adv-toggle { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--th-text-4); padding: 0; }
          .adv-toggle:hover { color: var(--th-text-2); }
        `}</style>

        <div className="create-wrap">

          {/* ── Credits banner ── */}
          {user && !canGenerate && (
            <div className="rounded-xl p-4 mb-5 flex items-start gap-3"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex-1">
                <div className="text-sm mb-0.5" style={{ color: 'var(--th-text-1)' }}>
                  {credits === 0 ? 'No credits remaining' : `${credits} credits available — 50 needed to generate a video`}
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--th-text-3)' }}>
                  Upgrade your plan to continue creating videos.
                </p>
                <a href="/billing" className="btn-primary text-xs px-4 py-1.5 inline-block">Upgrade plan</a>
              </div>
            </div>
          )}

          {/* ── Page header ── */}
          <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--th-text-1)' }}>Create a video</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>
                Fill in the form below. Your video will be ready in about 3 minutes.
              </p>
            </div>
            {user && (
              <div className="rounded-lg px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0"
                style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
                <span className="text-sm" style={{ color: 'var(--th-accent)' }}>{credits}</span>
                <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>credits remaining</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>

            {/* ══ STEP 1 — Describe your video ══ */}
            <div className="create-card">
              <SectionHead step="1" title="What should the video be about?"
                subtitle="Write a description, or just pick a topic below and leave this blank" />

              <textarea
                className="input prompt-area"
                placeholder={`e.g. ${PROMPT_EXAMPLES[exampleIdx]}`}
                value={form.prompt}
                onChange={e => {
                  set('prompt', e.target.value)
                  // Deselect niche when user types a custom prompt
                  if (e.target.value && form.topic !== 'Custom') set('topic', 'Custom')
                }}
              />
              <p className="text-xs mt-1.5 mb-4" style={{ color: 'var(--th-text-4)' }}>
                Tip: mention the tone, audience, or key points you want covered. The more specific, the better the script.
              </p>

              {/* Niche quick-pick */}
              <div className="text-xs mb-2" style={{ color: 'var(--th-text-4)' }}>
                Pick a topic category (optional):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {NICHES.map(n => {
                  const selected = form.topic === n.id
                  return (
                    <button key={n.id} type="button"
                      onClick={() => {
                        set('topic', selected ? 'Custom' : n.id)
                        // Clear prompt when picking a niche
                        if (!selected) set('prompt', '')
                      }}
                      style={{
                        padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12,
                        border: selected ? '1.5px solid var(--th-accent)' : '1px solid var(--th-border)',
                        background: selected ? 'var(--th-accent-lt)' : 'transparent',
                        color: selected ? 'var(--th-accent)' : 'var(--th-text-3)',
                        fontWeight: selected ? 600 : 400,
                        transition: 'all 0.15s',
                      }}>
                      {n.label}
                    </button>
                  )
                })}
              </div>
              {form.topic !== 'Custom' && (
                <p className="text-xs mt-3 rounded-lg px-3 py-2"
                  style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
                  Topic: {form.topic}. You can also add a prompt above to guide the specific angle.
                </p>
              )}
            </div>

            {/* ══ STEP 2 — Voice ══ */}
            <div className="create-card">
              <SectionHead step="2" title="Narrator voice"
                subtitle="The AI voice that will read the script" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                {VOICES.map(v => (
                  <button key={v.id} type="button"
                    onClick={() => set('voice', v.id)}
                    className={`voice-card${form.voice === v.id ? ' selected' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: form.voice === v.id ? v.color : 'var(--th-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: 'white',
                        transition: 'background 0.15s',
                      }}>{v.gender}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: form.voice === v.id ? 'var(--th-accent)' : 'var(--th-text-1)' }}>
                          {v.label}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--th-text-4)' }}>{v.accent}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: form.voice === v.id ? 'var(--th-accent)' : 'var(--th-text-4)', marginTop: 2 }}>
                      {v.tone}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ══ STEP 3 — Style ══ */}
            <div className="create-card">
              <SectionHead step="3" title="Visual style"
                subtitle="Background visuals generated for each scene" />
              <PillGroup options={ART_STYLES} value={form.style} onChange={v => set('style', v)} />
            </div>

            {/* ══ STEP 4 — Captions ══ */}
            <div className="create-card">
              <SectionHead step="4" title="Caption style"
                subtitle="On-screen text style. Hormozi is popular on TikTok." />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
                {CAPTIONS.map(c => {
                  const sel = form.theme === c.id
                  return (
                    <button key={c.id} type="button" onClick={() => set('theme', c.id)} style={{
                      padding: '8px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                      border: sel ? '1.5px solid var(--th-accent)' : '1px solid var(--th-border)',
                      background: sel ? 'var(--th-accent-lt)' : 'var(--th-surface-2)',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: sel ? 'var(--th-accent)' : 'var(--th-text-1)' }}>
                        {c.label}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--th-text-4)', marginTop: 2 }}>{c.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ══ STEP 5 — Format ══ */}
            <div className="create-card">
              <SectionHead step="5" title="Format & music"
                subtitle="Use 9:16 for TikTok and Reels. 30–60s performs best on short-form." />
              <div className="grid gap-5">
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--th-text-3)' }}>Duration</div>
                  <PillGroup options={DURATIONS} value={form.duration} onChange={v => set('duration', v)} cols={4} />
                </div>
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--th-text-3)' }}>Aspect ratio</div>
                  <PillGroup options={RATIOS} value={form.aspect_ratio} onChange={v => set('aspect_ratio', v)} cols={3} />
                </div>
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--th-text-3)' }}>Background music</div>
                  <PillGroup options={MUSIC} value={form.bg_music} onChange={v => set('bg_music', v)} />
                </div>
              </div>
            </div>

            {/* ══ Advanced (collapsible) ══ */}
            <div className="create-card">
              <button type="button" className="adv-toggle w-full justify-between"
                onClick={() => setShowAdv(o => !o)}>
                <span>More options (language, article URL, extra instructions)</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{ transition: 'transform 0.2s', transform: showAdv ? 'rotate(180deg)' : 'none' }}>
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {showAdv && (
                <div className="space-y-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--th-border)' }}>
                  <SelectDropdown label="Language" optional
                    value={form.language} onChange={v => set('language', v)}
                    options={languages.length ? languages : [{ id: 'English', label: 'English' }]} />
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--th-text-3)' }}>
                      Blog / article URL <span className="font-normal" style={{ color: 'var(--th-text-4)' }}>(optional — converts article to video)</span>
                    </label>
                    <input type="url" className="input text-sm" placeholder="https://yourblog.com/post"
                      value={form.url} onChange={e => set('url', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--th-text-3)' }}>
                      Extra instructions <span className="font-normal" style={{ color: 'var(--th-text-4)' }}>(optional)</span>
                    </label>
                    <textarea className="input resize-none text-sm" rows={3}
                      placeholder="e.g. Keep it under 60 words per scene. Target audience: college students. Use a serious, no-fluff tone."
                      value={form.custom_instructions} onChange={e => set('custom_instructions', e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="rounded-xl p-3 mb-4 text-sm flex items-start gap-2"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
                <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span>
                  {error}
                  {error.toLowerCase().includes('credit') && (
                    <a href="/billing" className="ml-1 underline font-medium">Upgrade plan →</a>
                  )}
                </span>
              </div>
            )}

            {/* ── Submit ── */}
            <div className="rounded-xl p-4"
              style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
              <div className="flex items-center gap-4 flex-wrap justify-between">
                <p className="text-xs" style={{ color: 'var(--th-text-4)' }}>
                  Ready in ~3 min &nbsp;·&nbsp; Email notification when done &nbsp;·&nbsp; Credits refunded if generation fails
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Upgrade button — shown when not enough credits */}
                  {user && !canGenerate && (
                    <a href="/billing" className="flex items-center gap-1.5 flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
                        color: '#fff', borderRadius: 10,
                        padding: '9px 16px', fontSize: 13, fontWeight: 700,
                        textDecoration: 'none', whiteSpace: 'nowrap',
                      }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M6.5 1L8.2 4.5H12L9 7l1 3.5L6.5 8.5 3.5 10.5l1-3.5L1.5 4.5H5Z" fill="white"/>
                      </svg>
                      Upgrade plan
                    </a>
                  )}
                  <button type="submit" disabled={loading || !user || !canGenerate}
                    className="btn-primary flex items-center gap-2"
                    style={{ opacity: canGenerate ? 1 : 0.4, cursor: canGenerate ? 'pointer' : 'not-allowed' }}>
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Generating…
                      </>
                    ) : (
                      <>
                        Generate video
                        <span style={{
                          background: 'rgba(255,255,255,0.18)', padding: '1px 7px', borderRadius: 5,
                          fontSize: 11,
                        }}>50 credits</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </AppShell>
    </>
  )
}
