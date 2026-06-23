import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import AppShell from '../components/AppShell'
import { opusClip } from '../lib/api'

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
  { id: 'de', label: 'German' },
  { id: 'pt', label: 'Portuguese' },
  { id: 'it', label: 'Italian' },
  { id: 'ja', label: 'Japanese' },
  { id: 'ko', label: 'Korean' },
  { id: 'zh', label: 'Chinese' },
  { id: 'ar', label: 'Arabic' },
  { id: 'hi', label: 'Hindi' },
]

const DURATIONS = [
  { id: '15-30',   label: '15 – 30 seconds' },
  { id: '30-60',   label: '30 – 60 seconds' },
  { id: '60-90',   label: '60 – 90 seconds' },
  { id: '90-120',  label: '90 – 120 seconds' },
]

const MODELS = [
  { id: 'ClipBasic',    label: 'Auto Select', desc: 'AI picks the best moments automatically' },
  { id: 'ClipAnything', label: 'Custom Prompt', desc: 'Guide the AI with your own instructions' },
]

function StatusBadge({ status }) {
  const map = {
    processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Processing' },
    completed:  { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  label: 'Completed'  },
    failed:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  label: 'Failed'     },
    pending:    { color: '#6b7280', bg: 'rgba(107,114,128,0.1)','label': 'Pending'  },
  }
  const s = map[status] || map.pending
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`, borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
      {status === 'processing' && (
        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: s.color, marginRight: 5, animation: 'pulse 1.5s infinite' }} />
      )}
      {s.label}
    </span>
  )
}

function ClipCard({ clip }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)
  const durationSec = clip.duration_ms ? Math.round(clip.duration_ms / 1000) : null
  const score = clip.virality_score ? Math.round(clip.virality_score * 100) : null

  const handleToggle = () => {
    if (!videoRef.current) return
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else { videoRef.current.play(); setPlaying(true) }
  }

  return (
    <div className="card overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Video thumbnail / player */}
      <div style={{ position: 'relative', background: '#0a0a14', aspectRatio: '9/16', maxHeight: 300, overflow: 'hidden', cursor: 'pointer' }}
        onClick={handleToggle}>
        {clip.preview_url ? (
          <video
            ref={videoRef}
            src={clip.preview_url}
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--th-text-4)', fontSize: 13 }}>
            No preview
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: playing ? 'transparent' : 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          {!playing && (
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#1a0a2e"><path d="M4 2.5l10 5.5-10 5.5z"/></svg>
            </div>
          )}
        </div>
        {score !== null && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 99, padding: '3px 9px', fontSize: 11, fontWeight: 800, color: score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444' }}>
            {score}% viral
          </div>
        )}
        {durationSec && (
          <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', borderRadius: 99, padding: '2px 8px', fontSize: 11, color: 'white', fontWeight: 600 }}>
            {durationSec}s
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {clip.title && (
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--th-text-1)', lineHeight: 1.4, margin: 0 }}>
            {clip.title}
          </p>
        )}
        {Array.isArray(clip.hashtags) && clip.hashtags.length > 0 && (
          <p style={{ fontSize: 11, color: 'var(--th-accent)', margin: 0, lineHeight: 1.5 }}>
            {clip.hashtags.slice(0, 4).join(' ')}
          </p>
        )}
      </div>

      {/* Download */}
      {clip.export_url && (
        <div style={{ padding: '0 14px 14px' }}>
          <a
            href={clip.export_url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, padding: '8px 0', textDecoration: 'none' }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download clip
          </a>
        </div>
      )}
    </div>
  )
}

function ProjectRow({ project, onSelect, selected }) {
  const isSelected = selected?.id === project.id
  return (
    <div
      onClick={() => onSelect(project)}
      style={{
        padding: '14px 16px',
        cursor: 'pointer',
        borderLeft: isSelected ? '3px solid var(--th-accent)' : '3px solid transparent',
        background: isSelected ? 'var(--th-accent-lt)' : 'transparent',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--th-bg-2)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--th-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.title || new URL(project.video_url.startsWith('http') ? project.video_url : 'https://' + project.video_url).hostname}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--th-text-4)' }}>
            {new Date(project.created_at).toLocaleDateString()} · {project.clips_count || 0} clips
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>
    </div>
  )
}

export default function ClipsPage() {
  const [form, setForm] = useState({
    videoUrl:     '',
    model:        'ClipBasic',
    language:     'en',
    clipDuration: '30-60',
    customPrompt: '',
    title:        '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [projects,   setProjects]   = useState([])
  const [selected,   setSelected]   = useState(null)
  const [clips,      setClips]      = useState([])
  const [loadingClips, setLoadingClips] = useState(false)
  const pollRef = useRef(null)

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const loadProjects = async () => {
    try {
      const { projects: list } = await opusClip.projects()
      setProjects(list || [])
      // Auto-select first
      if (list?.length && !selected) selectProject(list[0])
    } catch {}
  }

  const selectProject = async (project) => {
    setSelected(project)
    setClips([])
    if (project.status === 'completed') {
      setLoadingClips(true)
      try {
        const { clips: list } = await opusClip.get(project.id)
        setClips(list || [])
      } catch {}
      setLoadingClips(false)
    } else if (project.status === 'processing') {
      startPolling(project.id)
    }
  }

  const startPolling = (id) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const { status, clips_count } = await opusClip.status(id)
        if (status === 'completed') {
          clearInterval(pollRef.current)
          const { clips: list, project: updated } = await opusClip.get(id)
          setClips(list || [])
          setSelected(prev => prev?.id === id ? { ...prev, status: 'completed', clips_count } : prev)
          setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'completed', clips_count } : p))
        } else if (status === 'failed') {
          clearInterval(pollRef.current)
          setSelected(prev => prev?.id === id ? { ...prev, status: 'failed' } : prev)
          setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'failed' } : p))
        }
      } catch {}
    }, 12000)
  }

  const handleSubmit = async () => {
    if (!form.videoUrl.trim()) { setError('Please enter a video URL.'); return }
    setError('')
    setSubmitting(true)
    try {
      const body = {
        videoUrl:      form.videoUrl.trim(),
        model:         form.model,
        language:      form.language,
        clipDurations: [form.clipDuration],
        customPrompt:  form.customPrompt,
        title:         form.title,
      }
      const res = await opusClip.create(body)
      const newProject = { id: res.id, opus_project_id: res.opus_project_id, video_url: form.videoUrl.trim(), title: form.title, status: 'processing', clips_count: 0, model: form.model, language: form.language, created_at: new Date().toISOString() }
      setProjects(prev => [newProject, ...prev])
      setSelected(newProject)
      setClips([])
      setForm(f => ({ ...f, videoUrl: '', title: '', customPrompt: '' }))
      startPolling(res.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (project) => {
    try {
      await opusClip.remove(project.id)
      setProjects(prev => prev.filter(p => p.id !== project.id))
      if (selected?.id === project.id) { setSelected(null); setClips([]) }
    } catch (e) {
      setError(e.message)
    }
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <AppShell>
      <Head>
        <title>AI Short Clips</title>
      </Head>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        .clip-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:14px; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--th-text-1)', margin: 0 }}>
            AI Short Clips
          </h1>
          <p style={{ marginTop: 6, fontSize: 14, color: 'var(--th-text-3)', margin: '6px 0 0' }}>
            Paste a long video URL — Opus Clip AI extracts the best short-form moments for TikTok, Reels &amp; Shorts.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>

          {/* Form */}
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--th-text-1)', margin: '0 0 16px' }}>New clip project</h2>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* URL */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>
                  Video URL <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  className="input"
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or direct MP4 link"
                  value={form.videoUrl}
                  onChange={e => set('videoUrl', e.target.value)}
                />
                <p style={{ fontSize: 11, color: 'var(--th-text-4)', marginTop: 5 }}>
                  Supports YouTube, Google Drive, Vimeo, Zoom, MP4, and more.
                </p>
              </div>

              {/* Title (optional) */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>
                  Project title <span style={{ color: 'var(--th-text-4)', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. My podcast ep. 42"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Clip duration */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>Clip duration</label>
                  <select className="input" value={form.clipDuration} onChange={e => set('clipDuration', e.target.value)}>
                    {DURATIONS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>Video language</label>
                  <select className="input" value={form.language} onChange={e => set('language', e.target.value)}>
                    {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Model */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 8 }}>Curation mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {MODELS.map(m => (
                    <div
                      key={m.id}
                      onClick={() => set('model', m.id)}
                      style={{
                        padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                        border: form.model === m.id ? '1.5px solid var(--th-accent)' : '1px solid var(--th-border)',
                        background: form.model === m.id ? 'var(--th-accent-lt)' : 'var(--th-bg)',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--th-text-1)' }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--th-text-3)', marginTop: 3 }}>{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom prompt (only for ClipAnything) */}
              {form.model === 'ClipAnything' && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>Custom prompt</label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="e.g. Find moments where the speaker shares surprising statistics or quotes."
                    value={form.customPrompt}
                    onChange={e => set('customPrompt', e.target.value)}
                    style={{ resize: 'vertical', minHeight: 80 }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                <p style={{ fontSize: 12, color: 'var(--th-text-4)', margin: 0 }}>
                  Costs <strong>10 credits</strong> per project · clips ready in 5–20 minutes
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !form.videoUrl.trim()}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {submitting ? (
                    <>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Generate clips
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Projects + Clips */}
          {projects.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, alignItems: 'start' }}>
              {/* Project list */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--th-border)' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--th-text-1)' }}>My projects</span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--th-text-4)' }}>{projects.length}</span>
                </div>
                <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                  {projects.map(p => (
                    <div key={p.id} style={{ borderBottom: '1px solid var(--th-border)', position: 'relative' }}>
                      <ProjectRow project={p} onSelect={selectProject} selected={selected} />
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(p) }}
                        title="Delete project"
                        style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--th-text-4)', padding: 4, borderRadius: 6 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--th-text-4)'}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clips panel */}
              <div className="card" style={{ padding: 20, minHeight: 300 }}>
                {!selected && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--th-text-4)', fontSize: 13 }}>
                    Select a project to view clips
                  </div>
                )}

                {selected && selected.status === 'processing' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '40px 0' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--th-border)', borderTopColor: 'var(--th-accent)', animation: 'spin 0.8s linear infinite' }} />
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--th-text-1)', margin: 0 }}>Analysing your video…</p>
                      <p style={{ fontSize: 12, color: 'var(--th-text-4)', marginTop: 4 }}>Opus Clip AI is finding the best moments. This takes 5–20 minutes depending on video length.</p>
                    </div>
                  </div>
                )}

                {selected && selected.status === 'failed' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '40px 0', color: '#ef4444' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="14" stroke="#ef4444" strokeWidth="1.5"/>
                      <path d="M16 9v9M16 21v1" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Project failed</p>
                    <p style={{ fontSize: 12, color: 'var(--th-text-4)', margin: 0 }}>Please try submitting the video again.</p>
                  </div>
                )}

                {selected && selected.status === 'completed' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--th-text-1)', margin: 0 }}>
                        {clips.length} clip{clips.length !== 1 ? 's' : ''} generated
                      </h3>
                      <span style={{ fontSize: 12, color: 'var(--th-text-4)' }}>Sorted by virality score</span>
                    </div>
                    {loadingClips ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--th-border)', borderTopColor: 'var(--th-accent)', animation: 'spin 0.8s linear infinite' }} />
                      </div>
                    ) : clips.length === 0 ? (
                      <p style={{ fontSize: 13, color: 'var(--th-text-4)', textAlign: 'center', padding: 40 }}>No clips found for this project.</p>
                    ) : (
                      <div className="clip-grid">
                        {clips.map(clip => <ClipCard key={clip.id} clip={clip} />)}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {projects.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✂️</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--th-text-1)', margin: 0 }}>No clip projects yet</p>
              <p style={{ fontSize: 13, color: 'var(--th-text-3)', marginTop: 6 }}>Paste any long video URL above and let AI clip it into viral shorts.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </AppShell>
  )
}
