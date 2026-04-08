import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AppShell from '../components/AppShell'
import { auth, videos as videosApi, onboarding as ob } from '../lib/api'

const TOPICS    = ['Random AI Story','Motivational','Scary Stories','Interesting History','Fun Facts','Bedtime Stories','Long Form Jokes','Life Pro Tips','ELI5','Philosophy','Custom']
const VOICES    = [
  { id:'Onyx',    label:'Onyx — Authoritative & Deep'   },
  { id:'Alloy',   label:'Alloy — Natural & Versatile'   },
  { id:'Echo',    label:'Echo — Deep & Mature'          },
  { id:'Nova',    label:'Nova — Energetic & Young'      },
  { id:'Shimmer', label:'Shimmer — Soft & Calm'        },
  { id:'Sarah',   label:'Sarah — Professional Female'  },
  { id:'Charlie', label:'Charlie — Casual Male'        },
]
const ART_STYLES = [
  { id:'None',          label:'No Style'       },
  { id:'cinematic',     label:'Cinematic'      },
  { id:'anime',         label:'Anime'          },
  { id:'photographic',  label:'Photographic'   },
  { id:'digital art',   label:'Digital Art'    },
  { id:'cartoon',       label:'Cartoon'        },
  { id:'comic book',    label:'Comic Book'     },
  { id:'fantasy art',   label:'Fantasy Art'    },
  { id:'pixel art',     label:'Pixel Art'      },
  { id:'watercolor',    label:'Watercolor'     },
  { id:'neon punk',     label:'Neon Punk'      },
  { id:'3d model',      label:'3D Model'       },
]
const CAPTIONS  = [
  { id:'Hormozi_1', label:'Hormozi Classic' },
  { id:'Hormozi_2', label:'Hormozi Bold'    },
  { id:'Hormozi_3', label:'Hormozi Shadow'  },
  { id:'Beast',     label:'MrBeast'         },
  { id:'Ali',       label:'Ali Abdaal'      },
  { id:'Celine',    label:'Celine — Soft'  },
  { id:'Dan',       label:'Dan — Impact'   },
  { id:'David',     label:'David — Loud'   },
  { id:'Iman',      label:'Iman — Clean'   },
]
const DURATIONS = [{ id:'30-60',label:'30–60 sec'},{ id:'60-90',label:'60–90 sec'},{ id:'90-120',label:'90–120 sec'},{ id:'120-180',label:'120–180 sec'}]
const MUSIC     = [{ id:'',label:'No music'},{ id:'Cinematic',label:'Cinematic'},{ id:'Epic',label:'Epic'},{ id:'Upbeat',label:'Upbeat'},{ id:'Happy',label:'Happy'},{ id:'Sad',label:'Sad'},{ id:'Suspense',label:'Suspense'},{ id:'Lo-Fi',label:'Lo-Fi'},{ id:'Corporate',label:'Corporate'}]
const NICHE_MAP = { motivation:'Motivational',facts:'Fun Facts',scary:'Scary Stories',historical:'Interesting History',mythology:'Random AI Story',truecrime:'Random AI Story',stoic:'Philosophy',morals:'Life Pro Tips',finance:'Life Pro Tips',anime:'Random AI Story' }

function FieldLabel({ children, optional }) {
  return (
    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>
      {children}
      {optional && <span className="ml-1 text-xs font-normal" style={{ color: 'var(--th-text-4)' }}>(optional)</span>}
    </label>
  )
}

function Select({ label, optional, value, onChange, options }) {
  return (
    <div>
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <div className="relative">
        <select className="input appearance-none pr-9 cursor-pointer" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o.id ?? o} value={o.id ?? o}>{o.label ?? o}</option>)}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--th-text-4)' }}>
          <path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="card p-5 space-y-4">
      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--th-text-4)' }}>{title}</div>
      {children}
    </div>
  )
}

export default function CreatePage() {
  const router = useRouter()
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [form, setForm] = useState({
    topic:               'Motivational',
    prompt:              '',
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

  useEffect(() => {
    auth.me().then(setUser).catch(() => router.push('/login'))
    // Load prefs from DB (falls back to localStorage)
    ob.load().then(p => {
      if (!p) return
      setForm(f => ({
        ...f,
        topic:    NICHE_MAP[p.niche?.id] || f.topic,
        prompt:   p.niche?.description   || f.prompt,
        duration: DURATIONS.find(d => d.id === p.series?.duration)?.id || f.duration,
        voice:    VOICES.find(v => v.id === p.voice)?.id               || f.voice,
        style:    ART_STYLES.find(s => s.id === p.artStyle)?.id        || f.style,
        theme:    CAPTIONS.find(c => c.id === p.captions)?.id           || f.theme,
        bg_music: MUSIC.find(m => m.id === p.music?.presets?.[0])?.id  ?? f.bg_music,
      }))
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!user?.credits || user.credits < 1) { setError('No credits remaining. Please upgrade your plan.'); return }
    setLoading(true)
    try {
      const payload = { ...form }
      if (form.topic !== 'Custom') delete payload.prompt
      if (!payload.url) delete payload.url
      if (!payload.bg_music) delete payload.bg_music
      if (!payload.custom_instructions) delete payload.custom_instructions
      const result = await videosApi.create(payload)
      router.push(`/video/${result.id}`)
    } catch (e) {
      setError(e.message || 'Failed to create video.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Create Video — Faceless Reels</title></Head>
      <AppShell breadcrumb={[{ label: 'Series', href: '/dashboard' }, { label: 'Create Video' }]}>
        <div className="p-7 max-w-2xl">
          <div className="mb-6">
            <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>Create a video</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>
              {user
                ? <><span className="font-semibold" style={{ color: 'var(--th-accent)' }}>{user.credits}</span> credits remaining</>
                : 'Loading…'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Section title="Content">
              <Select label="Topic" value={form.topic} onChange={v => set('topic', v)} options={TOPICS} />
              {form.topic === 'Custom' && (
                <div className="anim-fade">
                  <FieldLabel>Custom prompt <span style={{ color: 'var(--th-accent)' }}>*</span></FieldLabel>
                  <textarea className="input resize-none" rows={3}
                    placeholder="Describe the video content…"
                    value={form.prompt} onChange={e => set('prompt', e.target.value)} required />
                </div>
              )}
              <div>
                <FieldLabel optional>Blog URL — converts article to video</FieldLabel>
                <input type="url" className="input" placeholder="https://yourblog.com/post"
                  value={form.url} onChange={e => set('url', e.target.value)} />
              </div>
            </Section>

            <Section title="Format">
              <div className="grid grid-cols-2 gap-3">
                <Select label="Duration"     value={form.duration}     onChange={v => set('duration', v)}     options={DURATIONS} />
                <Select label="Aspect ratio" value={form.aspect_ratio} onChange={v => set('aspect_ratio', v)} options={['9:16','1:1','16:9']} />
              </div>
            </Section>

            <Section title="Style">
              <div className="grid grid-cols-2 gap-3">
                <Select label="Voice"   value={form.voice} onChange={v => set('voice', v)} options={VOICES} />
                <Select label="Art style" value={form.style} onChange={v => set('style', v)} options={ART_STYLES} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select label="Captions" value={form.theme}    onChange={v => set('theme', v)}    options={CAPTIONS} />
                <Select label="Music"    value={form.bg_music} onChange={v => set('bg_music', v)} options={MUSIC} />
              </div>
            </Section>

            <Section title="Advanced">
              <div>
                <FieldLabel optional>Custom AI instructions</FieldLabel>
                <textarea className="input resize-none" rows={2}
                  placeholder="Extra tone, audience, or style notes…"
                  value={form.custom_instructions} onChange={e => set('custom_instructions', e.target.value)} />
              </div>
            </Section>

            {error && (
              <div className="rounded-xl p-3 text-sm flex items-start gap-2"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
                <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span>
                  {error}
                  {error.includes('credits') && <a href="/billing" className="ml-1 underline font-medium">Upgrade plan</a>}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" disabled={loading || !user} className="btn-primary flex items-center gap-2">
                {loading
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating…</>
                  : <>Generate video <span className="badge-purple text-xs">1 credit</span></>
                }
              </button>
              <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>Failed generations are auto-refunded.</span>
            </div>
          </form>
        </div>
      </AppShell>
    </>
  )
}
