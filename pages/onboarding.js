import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth, onboarding as ob } from '../lib/api'

// ─── Step data ───────────────────────────────────────────────────────────────

const PRESET_NICHES = [
  { id: 'scary',      label: 'Scary Stories',      desc: 'Scary stories that give you goosebumps'                                   },
  { id: 'historical', label: 'Historical Figures',  desc: 'Life stories about the most important historical figures'                 },
  { id: 'mythology',  label: 'Greek Mythology',     desc: 'Shocking and dramatic stories from Greek mythology'                      },
  { id: 'events',     label: 'Important Events',    desc: 'Viral videos about history from ancient times to modern day'             },
  { id: 'truecrime',  label: 'True Crime',          desc: 'Viral videos about true crime stories'                                   },
  { id: 'stoic',      label: 'Stoic Motivation',    desc: 'Viral videos about stoic philosophy and life lessons'                    },
  { id: 'morals',     label: 'Good Morals',         desc: 'Viral videos that teach people good morals and life lessons'             },
  { id: 'finance',    label: 'Finance Tips',        desc: 'Build wealth knowledge and financial literacy for your audience'         },
  { id: 'facts',      label: 'Did You Know',        desc: 'Satisfy curiosity with amazing facts people never knew'                  },
  { id: 'anime',      label: 'Anime Stories',       desc: 'Dramatic storytelling for a massive anime fanbase'                       },
]

const VOICES = [
  { id: 'Adam',    label: 'Adam',    gender: 'Male',   desc: 'The well-known voice of TikTok and Instagram'              },
  { id: 'John',    label: 'John',    gender: 'Male',   desc: 'The perfect storyteller — very realistic and natural'      },
  { id: 'Alex',    label: 'Alex',    gender: 'Male',   desc: 'Upbeat and pleasant. Great for YouTube Shorts'             },
  { id: 'Archer',  label: 'Archer',  gender: 'Male',   desc: 'A conversational British male voice'                       },
  { id: 'Astro',   label: 'Astro',   gender: 'Male',   desc: 'Deep and smooth with great clarity'                        },
  { id: 'Brian',   label: 'Brian',   gender: 'Male',   desc: 'Deep, rugged male voice'                                   },
  { id: 'Liam',    label: 'Liam',    gender: 'Male',   desc: 'A warm male voice'                                         },
  { id: 'Nassim',  label: 'Nassim',  gender: 'Male',   desc: 'Deep and powerful male voice'                              },
  { id: 'Michael', label: 'Michael', gender: 'Male',   desc: 'Conversational British male voice'                         },
  { id: 'Justin',  label: 'Justin',  gender: 'Male',   desc: 'Clear and engaging male voice'                             },
  { id: 'Brittney',label: 'Brittney',gender: 'Female', desc: 'Young, vibrant female voice. Perfect for celebrity news'  },
  { id: 'Hope',    label: 'Hope',    gender: 'Female', desc: 'Upbeat and clear female voice'                             },
  { id: 'Vanessa', label: 'Vanessa', gender: 'Female', desc: 'Soft and warm female voice'                                },
]

const MUSIC_PRESETS = [
  { id: 'happy',    label: 'Happy Rhythm',       desc: 'Upbeat and energetic, perfect for positive content'         },
  { id: 'storm',    label: 'Quiet Before Storm', desc: 'Building tension and anticipation for dramatic reveals'     },
  { id: 'symphony', label: 'Brilliant Symphony', desc: 'Orchestral and majestic for epic storytelling'             },
  { id: 'shadows',  label: 'Breathing Shadows',  desc: 'Mysterious and eerie ambiance for suspenseful videos'      },
  { id: '8bit',     label: '8-Bit Slowed',       desc: 'Eerie chiptune with a haunting retro feel'                 },
  { id: 'deepbass', label: 'Deep Bass',          desc: 'Dark interstellar atmosphere with deep low-end'            },
]

const ART_STYLES = [
  { id: 'comic',        label: 'Comic'         },
  { id: 'creepy_comic', label: 'Creepy Comic'  },
  { id: 'cartoon',      label: 'Modern Cartoon'},
  { id: 'disney',       label: 'Disney'        },
  { id: 'mythology',    label: 'Mythology'     },
  { id: 'pixel',        label: 'Pixel Art'     },
  { id: 'ghibli',       label: 'Ghibli'        },
  { id: 'anime',        label: 'Anime'         },
  { id: 'painting',     label: 'Painting'      },
  { id: 'dark_fantasy', label: 'Dark Fantasy'  },
  { id: 'lego',         label: 'Lego'          },
  { id: 'polaroid',     label: 'Polaroid'      },
  { id: 'realism',      label: 'Realism'       },
  { id: 'fantastic',    label: 'Fantastic'     },
]

const CAPTION_STYLES = [
  { id: 'bold_stroke',   label: 'Bold Stroke'  },
  { id: 'red_highlight', label: 'Red Highlight'},
  { id: 'sleek',         label: 'Sleek'        },
  { id: 'karaoke',       label: 'Karaoke'      },
  { id: 'majestic',      label: 'Majestic'     },
  { id: 'beast',         label: 'Beast'        },
  { id: 'elegant',       label: 'Elegant'      },
  { id: 'pixel',         label: 'Pixel'        },
  { id: 'clarity',       label: 'Clarity'      },
]

const EFFECTS = [
  { id: 'shake', label: 'Shake Effect', badge: 'New',     desc: 'Subjects pop out with eerie motion — great for horror, thriller, and suspenseful stories' },
  { id: 'grain', label: 'Film Grain',   badge: 'New',     desc: 'Add an old film look with scanlines, dust particles, noise, and a subtle vignette'        },
  { id: 'hook',  label: 'Animated Hook',badge: 'Premium', desc: 'Generate a 5-second motion video for the first scene to hook viewers instantly'           },
]

const DURATIONS = [
  { id: '30-40',  label: '30–40 seconds' },
  { id: '50-60',  label: '50–60 seconds' },
  { id: '60-90',  label: '60–90 seconds' },
  { id: '90-120', label: '90–120 seconds'},
]

const STEP_LABELS = ['Niche', 'Voice', 'Music', 'Art Style', 'Captions', 'Effects', 'Social', 'Details', 'Account']
const TOTAL = STEP_LABELS.length

// ─── Shared primitives ────────────────────────────────────────────────────────

function ProgressBar({ step }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-1.5 rounded-full transition-all duration-500"
          style={{
            background: i < step ? '#6c47ff' : i === step ? '#b8a7ff' : '#e5e1ff',
          }}
        />
      ))}
    </div>
  )
}

function PageTitle({ step, title, subtitle, optional }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-xl font-bold text-[#1a1a2e]">{title}</h1>
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: '#ede9ff', color: '#6c47ff' }}
        >
          Step {step + 1} of {TOTAL}
        </span>
        {optional && (
          <span className="text-xs text-[#9ca3af] border border-[#e5e7eb] px-2 py-0.5 rounded-full">
            Optional
          </span>
        )}
      </div>
      {subtitle && (
        <p
          className="text-sm font-medium"
          style={{ color: '#6c47ff', textDecoration: 'underline', textDecorationColor: 'rgba(108,71,255,0.3)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

function SelectCard({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-lg border transition-all duration-150 cursor-pointer ${className}`}
      style={{
        borderColor:      selected ? '#6c47ff' : '#e5e1ff',
        backgroundColor:  selected ? '#f3f0ff' : '#fff',
        boxShadow:        selected ? '0 0 0 1px #6c47ff' : 'none',
      }}
    >
      {selected && (
        <div
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#6c47ff' }}
        >
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      {children}
    </button>
  )
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
      )}
      <input
        className="w-full border border-[#e5e1ff] rounded-lg px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#9ca3af] outline-none transition-all"
        style={{ background: '#fff' }}
        onFocus={e => e.target.style.borderColor = '#6c47ff'}
        onBlur={e => e.target.style.borderColor = '#e5e1ff'}
        {...props}
      />
    </div>
  )
}

function Textarea({ label, hint, maxLen, value, onChange, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>}
      <textarea
        className="w-full border border-[#e5e1ff] rounded-lg px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#9ca3af] outline-none resize-none transition-all"
        style={{ background: '#fff' }}
        maxLength={maxLen}
        value={value}
        onChange={onChange}
        onFocus={e => e.target.style.borderColor = '#6c47ff'}
        onBlur={e => e.target.style.borderColor = '#e5e1ff'}
        {...props}
      />
      <div className="flex items-center justify-between mt-1">
        {hint && <span className="text-[#9ca3af] text-xs">{hint}</span>}
        {maxLen && <span className="text-[#c4b5fd] text-xs ml-auto">{(value || '').length}/{maxLen}</span>}
      </div>
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function StepNiche({ value, onChange }) {
  const [tab, setTab] = useState(value.type === 'custom' ? 'custom' : 'preset')

  const selectPreset = (id) => onChange({ type: 'preset', id, description: '', exampleScript: '' })
  const updateCustom = (field, val) => onChange({ ...value, type: 'custom', id: 'custom', [field]: val })

  return (
    <>
      <PageTitle step={0} title="Choose your niche" subtitle="Select a preset or describe your own niche" />

      {/* Tabs */}
      <div className="flex gap-1 border border-[#e5e1ff] rounded-lg p-1 w-fit mb-5" style={{ background: '#f7f6ff' }}>
        {['Presets', 'Custom'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t.toLowerCase())}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={tab === t.toLowerCase()
              ? { background: '#6c47ff', color: '#fff' }
              : { color: '#6b7280' }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'preset' ? (
        <div className="space-y-2">
          {PRESET_NICHES.map(n => (
            <SelectCard
              key={n.id}
              selected={value.type === 'preset' && value.id === n.id}
              onClick={() => selectPreset(n.id)}
              className="w-full flex items-start gap-3 p-3.5"
            >
              <div>
                <div className="text-[#1a1a2e] font-semibold text-sm">{n.label}</div>
                <div className="text-[#6b7280] text-xs mt-0.5">{n.desc}</div>
              </div>
            </SelectCard>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            label="Describe your topic"
            placeholder="Describe your content focus, e.g.: 'Weird historical facts that sound fake but are real, delivered in a casual conversational tone with humor'"
            rows={4}
            maxLen={5000}
            value={value.description || ''}
            onChange={e => updateCustom('description', e.target.value)}
          />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label className="text-sm font-medium text-[#374151]">Example script</label>
              <span className="text-xs text-[#9ca3af] border border-[#e5e7eb] px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <Textarea
              placeholder={`Paste an example of how you want your videos to sound, e.g.:\n\n"Okay so get this — in 1932, Australia literally declared war on emus. Like, actual birds..."`}
              rows={5}
              maxLen={2000}
              hint="AI will match this style and tone"
              value={value.exampleScript || ''}
              onChange={e => updateCustom('exampleScript', e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  )
}

function StepVoice({ value, onChange }) {
  const groups = [
    { label: 'Male',   voices: VOICES.filter(v => v.gender === 'Male')   },
    { label: 'Female', voices: VOICES.filter(v => v.gender === 'Female') },
  ]

  return (
    <>
      <PageTitle step={1} title="Language & Voice" subtitle="Choose the language and voice style for your video" />

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#374151] mb-1.5">Language</label>
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#e5e1ff] text-sm text-[#374151]"
          style={{ background: '#fff' }}
        >
          <span className="text-base">GB</span>
          <span>English</span>
        </div>
      </div>

      <div className="text-sm font-semibold text-[#374151] mb-3">Voice Style</div>
      {groups.map(g => (
        <div key={g.label} className="mb-4">
          <div className="text-xs text-[#9ca3af] font-semibold uppercase tracking-wider mb-2">{g.label}</div>
          <div className="space-y-1.5">
            {g.voices.map(v => (
              <SelectCard
                key={v.id}
                selected={value === v.id}
                onClick={() => onChange(v.id)}
                className="w-full flex items-center gap-3 px-4 py-3"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: value === v.id ? '#6c47ff' : (g.label === 'Male' ? '#eff6ff' : '#fdf2f8'),
                    color:      value === v.id ? '#fff'    : (g.label === 'Male' ? '#3b82f6' : '#ec4899'),
                  }}
                >
                  {v.label.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1a1a2e]">{v.label}</div>
                  <div className="text-xs text-[#6b7280] mt-0.5">{v.desc}</div>
                </div>
                {value === v.id && (
                  <div className="flex items-end gap-0.5 h-4 mr-6">
                    {[3, 5, 4, 6, 3].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 rounded-full animate-pulse"
                        style={{ height: `${h * 2}px`, background: '#6c47ff', animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                )}
              </SelectCard>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

function StepMusic({ value, onChange }) {
  const [tab, setTab] = useState('preset')
  const toggle = (id) => {
    const next = value.presets.includes(id) ? value.presets.filter(x => x !== id) : [...value.presets, id]
    onChange({ ...value, presets: next })
  }

  return (
    <>
      <PageTitle step={2} title="Background Music" subtitle="Choose as many songs as you want, we'll pick a random one for each video" optional />

      <div className="flex gap-1 border border-[#e5e1ff] rounded-lg p-1 w-fit mb-5" style={{ background: '#f7f6ff' }}>
        {['Preset music', 'Custom'].map(t => (
          <button key={t} onClick={() => setTab(t === 'Preset music' ? 'preset' : 'custom')}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={tab === (t === 'Preset music' ? 'preset' : 'custom')
              ? { background: '#6c47ff', color: '#fff' }
              : { color: '#6b7280' }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'preset' ? (
        <div className="space-y-2">
          {MUSIC_PRESETS.map(m => {
            const on = value.presets.includes(m.id)
            return (
              <button key={m.id} onClick={() => toggle(m.id)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg border transition-all text-left"
                style={{
                  borderColor:     on ? '#6c47ff' : '#e5e1ff',
                  backgroundColor: on ? '#f3f0ff' : '#fff',
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1a1a2e]">{m.label}</div>
                  <div className="text-xs text-[#6b7280] mt-0.5">{m.desc}</div>
                </div>
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ borderColor: on ? '#6c47ff' : '#d1d5db', background: on ? '#6c47ff' : '#fff' }}
                >
                  {on && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            label="TikTok Sound URLs (copy + paste link to TikTok sound)"
            placeholder="Enter TikTok sound URLs, one per line"
            rows={4}
            value={value.tiktokUrls || ''}
            onChange={e => onChange({ ...value, tiktokUrls: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Upload Sound Files</label>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
              style={{ borderColor: '#e5e1ff', background: '#fafafe' }}
            >
              <div className="text-sm font-medium text-[#6b7280]">Click to upload sound files or drag and drop</div>
              <div className="text-xs text-[#9ca3af] mt-1">MP3, WAV up to 10MB</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function StepArtStyle({ value, onChange }) {
  // Style preview gradient map
  const gradients = {
    comic:        'from-yellow-200 to-orange-200',
    creepy_comic: 'from-gray-700 to-gray-900',
    cartoon:      'from-blue-200 to-purple-200',
    disney:       'from-blue-300 to-pink-200',
    mythology:    'from-amber-600 to-amber-800',
    pixel:        'from-indigo-900 to-purple-900',
    ghibli:       'from-green-200 to-emerald-300',
    anime:        'from-pink-200 to-purple-300',
    painting:     'from-amber-100 to-orange-200',
    dark_fantasy: 'from-gray-800 to-slate-900',
    lego:         'from-yellow-300 to-red-300',
    polaroid:     'from-gray-100 to-gray-300',
    realism:      'from-stone-300 to-stone-500',
    fantastic:    'from-violet-400 to-fuchsia-500',
  }

  return (
    <>
      <PageTitle step={3} title="Art Style" subtitle="Choose the visual style for your video" />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {ART_STYLES.map(s => (
          <SelectCard
            key={s.id}
            selected={value === s.id}
            onClick={() => onChange(s.id)}
            className="overflow-hidden"
          >
            <div className={`h-14 bg-gradient-to-br ${gradients[s.id]} rounded-t-lg`} />
            <div className="px-2 py-2 text-center">
              <div className="text-xs font-semibold text-[#1a1a2e] leading-tight">{s.label}</div>
            </div>
          </SelectCard>
        ))}
      </div>
    </>
  )
}

function StepCaptions({ value, onChange }) {
  const previewStyles = {
    bold_stroke:   { bg: '#111',    text: '#fff',    fw: '900' },
    red_highlight: { bg: '#111',    text: '#ef4444', fw: '800' },
    sleek:         { bg: '#111',    text: '#a78bfa', fw: '600' },
    karaoke:       { bg: '#111',    text: '#fbbf24', fw: '700' },
    majestic:      { bg: '#0f072a', text: '#e9d5ff', fw: '700' },
    beast:         { bg: '#0a0a0a', text: '#ff6b35', fw: '900' },
    elegant:       { bg: '#111',    text: '#f9fafb', fw: '500' },
    pixel:         { bg: '#0d1117', text: '#39ff14', fw: '700' },
    clarity:       { bg: '#111',    text: '#60a5fa', fw: '600' },
  }

  return (
    <>
      <PageTitle step={4} title="Caption Style" subtitle="Choose how captions will appear in your video" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {CAPTION_STYLES.map(c => {
          const ps = previewStyles[c.id]
          return (
            <SelectCard key={c.id} selected={value === c.id} onClick={() => onChange(c.id)} className="overflow-hidden">
              <div className="h-14 flex items-center justify-center rounded-t-lg" style={{ background: ps.bg }}>
                <span className="text-sm tracking-wide" style={{ color: ps.text, fontWeight: ps.fw, fontFamily: c.id === 'pixel' ? 'monospace' : 'inherit' }}>
                  PAGE
                </span>
              </div>
              <div className="px-2 py-2 text-center">
                <div className="text-xs font-semibold text-[#1a1a2e]">{c.label}</div>
              </div>
            </SelectCard>
          )
        })}
      </div>
    </>
  )
}

function StepEffects({ value, onChange }) {
  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter(x => x !== id) : [...value, id])
  }

  return (
    <>
      <PageTitle step={5} title="Effects" subtitle="Add visual effects to make your videos more engaging and eye-catching" optional />
      <div className="space-y-3">
        {EFFECTS.map(e => {
          const on = value.includes(e.id)
          return (
            <button key={e.id} type="button" onClick={() => toggle(e.id)}
              className="w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-all"
              style={{ borderColor: on ? '#6c47ff' : '#e5e1ff', background: on ? '#f3f0ff' : '#fff' }}
            >
              {/* Toggle */}
              <div className="relative w-10 h-6 rounded-full flex-shrink-0 mt-0.5 transition-colors"
                style={{ background: on ? '#6c47ff' : '#e5e7eb' }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                  style={{ left: on ? '22px' : '4px' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-[#1a1a2e]">{e.label}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={e.badge === 'New'
                      ? { background: '#dcfce7', color: '#16a34a' }
                      : { background: '#fef3c7', color: '#d97706' }
                    }
                  >
                    {e.badge}
                  </span>
                </div>
                <div className="text-xs text-[#6b7280] leading-relaxed">{e.desc}</div>
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

function StepSocial({ value, onChange }) {
  const PLATFORMS = [
    { id: 'tiktok',    label: 'TikTok',          color: '#000',    textColor: '#fff' },
    { id: 'instagram', label: 'Instagram',        color: '#e1306c', textColor: '#fff' },
    { id: 'youtube',   label: 'YouTube Shorts',   color: '#ff0000', textColor: '#fff' },
  ]

  return (
    <>
      <PageTitle step={6} title="Connect social media" subtitle="Select the social media accounts where you want to publish" optional />
      <div
        className="rounded-xl border border-[#e5e1ff] p-6 text-center mb-4"
        style={{ background: '#fafafe' }}
      >
        <p className="text-sm text-[#6b7280] mb-4">You haven't connected any social media accounts yet.</p>
        <div className="space-y-2">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => {
                const next = value.includes(p.id) ? value.filter(x => x !== p.id) : [...value, p.id]
                onChange(next)
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
              style={value.includes(p.id)
                ? { background: '#f3f0ff', borderColor: '#6c47ff', color: '#6c47ff' }
                : { background: '#fff', borderColor: '#e5e1ff', color: '#374151' }
              }
            >
              <span>{p.label}</span>
              <span>{value.includes(p.id) ? 'Connected' : 'Connect account'}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-[#9ca3af] text-center">You can connect your social media accounts later.</p>
    </>
  )
}

function StepSeriesDetails({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v })

  return (
    <>
      <PageTitle step={7} title="Series Details" subtitle="Finalize your series details and posting schedule" />
      <div className="space-y-5">
        <Input
          label="Series Name"
          placeholder="Enter a name for your series"
          value={value.name}
          onChange={e => set('name', e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">
            Video Duration
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none border border-[#e5e1ff] rounded-lg px-3.5 py-2.5 text-sm text-[#374151] outline-none bg-white pr-9"
              value={value.duration}
              onChange={e => set('duration', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#6c47ff'}
              onBlur={e => e.target.style.borderColor = '#e5e1ff'}
            >
              {DURATIONS.map(d => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-[#374151] mb-3">Schedule</div>
          <p className="text-sm text-[#6b7280] mb-3">Set when you want your videos to be published.</p>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Publish time:</label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                className="border border-[#e5e1ff] rounded-lg px-3.5 py-2.5 text-sm text-[#374151] outline-none bg-white"
                value={value.publishTime}
                onChange={e => set('publishTime', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#6c47ff'}
                onBlur={e => e.target.style.borderColor = '#e5e1ff'}
              />
              <span className="text-xs text-[#9ca3af]">(Your local time)</span>
            </div>
          </div>
          <div
            className="mt-3 rounded-lg p-3 border text-xs text-[#6b7280] leading-relaxed"
            style={{ background: '#fafafe', borderColor: '#e5e1ff' }}
          >
            <strong className="text-[#374151]">Note:</strong> Videos will be generated 6 hours before the scheduled publish time so you have time to review them.
          </div>
        </div>
      </div>
    </>
  )
}

function StepAccount({ prefs, loading, error, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const niche = PRESET_NICHES.find(n => n.id === prefs.niche?.id)
  const voice = VOICES.find(v => v.id === prefs.voice)
  const style = ART_STYLES.find(s => s.id === prefs.artStyle)

  return (
    <>
      <PageTitle step={8} title="Create your account" subtitle="Your series is ready. Set up your account to launch it." />

      {/* Setup summary */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ background: '#fafafe', borderColor: '#e5e1ff' }}
      >
        <div className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Your series setup</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-[#9ca3af] text-xs mb-0.5">Niche</div>
            <div className="text-[#1a1a2e] font-medium">{niche?.label || (prefs.niche?.type === 'custom' ? 'Custom' : '—')}</div>
          </div>
          <div>
            <div className="text-[#9ca3af] text-xs mb-0.5">Voice</div>
            <div className="text-[#1a1a2e] font-medium">{voice?.label || '—'}</div>
          </div>
          <div>
            <div className="text-[#9ca3af] text-xs mb-0.5">Art style</div>
            <div className="text-[#1a1a2e] font-medium">{style?.label || '—'}</div>
          </div>
          <div>
            <div className="text-[#9ca3af] text-xs mb-0.5">Series name</div>
            <div className="text-[#1a1a2e] font-medium">{prefs.series?.name || '—'}</div>
          </div>
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <Input label="Full name"      type="text"     placeholder="Alex Johnson"     value={form.name}     onChange={e => set('name', e.target.value)}     required />
        <Input label="Email address"  type="email"    placeholder="alex@example.com" value={form.email}    onChange={e => set('email', e.target.value)}    required />
        <Input label="Password"       type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} minLength={8} required />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
          style={{ background: loading ? '#a78bfa' : '#6c47ff' }}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Creating your series...
            </>
          ) : (
            <>
              Create Series
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-[#9ca3af] text-xs">
          By continuing you agree to our{' '}
          <a href="#" className="text-[#6c47ff] hover:underline">Terms</a> and{' '}
          <a href="#" className="text-[#6c47ff] hover:underline">Privacy Policy</a>.
          No credit card required.
        </p>
      </form>
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const [prefs, setPrefs] = useState({
    niche:    { type: 'preset', id: '', description: '', exampleScript: '' },
    voice:    'Adam',
    music:    { presets: [], tiktokUrls: '' },
    artStyle: '',
    captions: 'bold_stroke',
    effects:  [],
    social:   [],
    series:   { name: '', duration: '50-60', publishTime: '12:00' },
  })

  const update = (key) => (val) => setPrefs(p => ({ ...p, [key]: val }))

  const canAdvance = () => {
    if (step === 0) return prefs.niche.id !== '' || (prefs.niche.type === 'custom' && (prefs.niche.description || '').trim().length > 10)
    if (step === 1) return prefs.voice !== ''
    if (step === 3) return prefs.artStyle !== ''
    if (step === 4) return prefs.captions !== ''
    if (step === 7) return prefs.series.name.trim() !== ''
    return true
  }

  const OPTIONAL = new Set([2, 5, 6]) // music, effects, social

  const next = () => step < TOTAL - 1 && setStep(s => s + 1)
  const back = () => step > 0 && setStep(s => s - 1)

  const handleRegister = async (form) => {
    setError('')
    setLoading(true)
    try {
      ob.save(prefs)
      await auth.register({ ...form, prefs })
      router.push('/dashboard?welcome=1')
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const stepContent = [
    <StepNiche         key={0} value={prefs.niche}    onChange={update('niche')}    />,
    <StepVoice         key={1} value={prefs.voice}    onChange={update('voice')}    />,
    <StepMusic         key={2} value={prefs.music}    onChange={update('music')}    />,
    <StepArtStyle      key={3} value={prefs.artStyle} onChange={update('artStyle')} />,
    <StepCaptions      key={4} value={prefs.captions} onChange={update('captions')} />,
    <StepEffects       key={5} value={prefs.effects}  onChange={update('effects')}  />,
    <StepSocial        key={6} value={prefs.social}   onChange={update('social')}   />,
    <StepSeriesDetails key={7} value={prefs.series}   onChange={update('series')}   />,
    <StepAccount       key={8} prefs={prefs} loading={loading} error={error} onSubmit={handleRegister} />,
  ]

  const isLast = step === TOTAL - 1

  return (
    <>
      <Head><title>Create New Series — Faceless Reels</title></Head>

      <div className="min-h-screen" style={{ background: 'var(--th-bg)' }}>
        {/* Minimal top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--th-border)', background: 'var(--th-surface)' }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--th-accent)' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14.5 5V11L8 15L1.5 11V5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--th-text-1)' }}>Faceless Reels</span>
          </Link>
          <Link href="/login" className="text-sm hover:underline" style={{ color: 'var(--th-text-4)' }}>
            Already have an account? Sign in
          </Link>
        </div>

        <div className="flex items-start justify-center py-10 px-6">
          <div className="w-full max-w-lg">

            <ProgressBar step={step} />

            {/* Step content */}
            <div className="max-h-[65vh] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c4b5fd transparent' }}>
              {stepContent[step]}
            </div>

            {/* Nav buttons */}
            {!isLast && (
              <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--th-border)' }}>
                <button
                  onClick={back}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${step === 0 ? 'invisible' : ''}`}
                  style={{ borderColor: 'var(--th-border)', color: 'var(--th-text-3)', background: 'var(--th-surface)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--th-accent-md)'; e.currentTarget.style.color = 'var(--th-text-1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--th-border)'; e.currentTarget.style.color = 'var(--th-text-3)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M8.5 3L5 7l3.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back
                </button>

                <div className="flex items-center gap-2">
                  {OPTIONAL.has(step) && (
                    <button onClick={next} className="text-sm px-3 py-2 transition-colors" style={{ color: 'var(--th-text-4)' }}>
                      Skip
                    </button>
                  )}
                  <button
                    onClick={next}
                    disabled={!canAdvance()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                    style={{ background: canAdvance() ? 'var(--th-accent)' : 'var(--th-accent-md)', cursor: canAdvance() ? 'pointer' : 'not-allowed' }}
                  >
                    Continue
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5.5 3L9 7l-3.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
