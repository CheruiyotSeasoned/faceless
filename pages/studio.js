import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import AppShell from '../components/AppShell'
import { higgsfield } from '../lib/api'

const ASPECTS     = ['1:1', '16:9', '9:16', '4:3', '3:4']
const RESOLUTIONS = ['720p', '1080p', '2K']
const DURATIONS   = [3, 5, 10]

function StatusBadge({ status }) {
  const map = {
    processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Generating' },
    completed:  { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  label: 'Done'        },
    failed:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  label: 'Failed'      },
    nsfw:       { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  label: 'Blocked'     },
  }
  const s = map[status] || map.processing
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`, borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
      {status === 'processing' && (
        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: s.color, marginRight: 5, animation: 'pulse 1.5s infinite' }} />
      )}
      {s.label}
    </span>
  )
}

function JobCard({ job, onDelete }) {
  return (
    <div className="card overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', background: '#0a0a14', aspectRatio: '1/1', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {job.status === 'completed' && job.output_url ? (
          job.type === 'video' ? (
            <video src={job.output_url} controls loop playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
          ) : (
            <img src={job.output_url} alt={job.prompt || 'Generated'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )
        ) : job.status === 'processing' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--th-text-4)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--th-border)', borderTopColor: 'var(--th-accent)', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 12 }}>Generating…</span>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: 16, fontSize: 12 }}>
            {job.error_message || 'Generation failed — credits refunded.'}
          </div>
        )}
        <div style={{ position: 'absolute', top: 8, left: 8 }}><StatusBadge status={job.status} /></div>
        <button
          onClick={() => onDelete(job)}
          title="Delete"
          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer', color: '#fff', padding: 5, borderRadius: 6, lineHeight: 0 }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div style={{ padding: '10px 12px', flex: 1 }}>
        {job.prompt && (
          <p style={{ fontSize: 12, color: 'var(--th-text-2)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.prompt}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--th-text-4)' }}>{job.type === 'video' ? '🎬 Video' : '🖼️ Image'}</span>
          {job.status === 'completed' && job.output_url && (
            <a href={job.output_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--th-accent)', fontWeight: 600 }}>Download</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StudioPage() {
  const [models,     setModels]     = useState([])
  const [configured, setConfigured] = useState(true)
  const [form, setForm] = useState({
    model: '', prompt: '', image_url: '',
    aspect_ratio: '1:1', resolution: '1080p', duration: 5,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [jobs,       setJobs]       = useState([])
  const pollRef = useRef(null)

  const selected = models.find(m => m.id === form.model) || null

  useEffect(() => {
    higgsfield.models()
      .then(d => {
        setModels(d.models || [])
        setConfigured(d.configured)
        if (d.models?.length) setForm(f => ({ ...f, model: d.models[0].id }))
      })
      .catch(() => {})
    loadJobs()
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const loadJobs = useCallback(async () => {
    try {
      const { jobs: list } = await higgsfield.jobs()
      setJobs(list || [])
      if ((list || []).some(j => j.status === 'processing')) startPolling()
    } catch {}
  }, [])

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      setJobs(curr => {
        const pending = curr.filter(j => j.status === 'processing')
        if (pending.length === 0) { clearInterval(pollRef.current); return curr }
        pending.forEach(async (j) => {
          try {
            const updated = await higgsfield.get(j.id)
            setJobs(prev => prev.map(p => p.id === updated.id ? updated : p))
          } catch {}
        })
        return curr
      })
    }, 8000)
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    setError('')
    if (selected?.type === 'image' && !form.prompt.trim()) { setError('Please enter a prompt.'); return }
    if (selected?.needs_image && !form.image_url.trim())   { setError('This model needs a source image URL.'); return }
    setSubmitting(true)
    try {
      const body = { model: form.model, prompt: form.prompt.trim() }
      if (selected?.type === 'image') {
        body.aspect_ratio = form.aspect_ratio
        body.resolution   = form.resolution
      } else {
        body.image_url = form.image_url.trim()
        body.duration  = form.duration
      }
      const job = await higgsfield.generate(body)
      setJobs(prev => [job, ...prev])
      setForm(f => ({ ...f, prompt: '', image_url: '' }))
      startPolling()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (job) => {
    try {
      await higgsfield.remove(job.id)
      setJobs(prev => prev.filter(j => j.id !== job.id))
    } catch (e) { setError(e.message) }
  }

  const imageModels = models.filter(m => m.type === 'image')
  const videoModels = models.filter(m => m.type === 'video')

  return (
    <AppShell breadcrumb={[{ label: 'Studio' }]}>
      <Head><title>AI Studio</title></Head>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} @keyframes spin{to{transform:rotate(360deg)}}
        .studio-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}`}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--th-text-1)', margin: 0 }}>AI Studio</h1>
          <p style={{ marginTop: 6, fontSize: 14, color: 'var(--th-text-3)', margin: '6px 0 0' }}>
            Generate images and videos across multiple state-of-the-art models — pick a model, describe what you want, and create.
          </p>
        </div>

        {!configured && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#b45309', marginBottom: 18 }}>
            The studio isn’t configured yet — an admin needs to add the Higgsfield API keys in Settings.
          </div>
        )}

        {/* Form */}
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 14 }}>
              {error}
            </div>
          )}

          {/* Model picker */}
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 8 }}>Model</label>
          {['image', 'video'].map(group => {
            const list = group === 'image' ? imageModels : videoModels
            if (!list.length) return null
            return (
              <div key={group} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--th-text-4)', marginBottom: 6 }}>
                  {group === 'image' ? 'Text → Image' : 'Image → Video'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
                  {list.map(m => (
                    <div key={m.id} onClick={() => set('model', m.id)}
                      style={{
                        padding: '11px 13px', borderRadius: 10, cursor: 'pointer',
                        border: form.model === m.id ? '1.5px solid var(--th-accent)' : '1px solid var(--th-border)',
                        background: form.model === m.id ? 'var(--th-accent-lt)' : 'var(--th-bg)',
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--th-text-1)' }}>{m.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--th-accent)' }}>{m.credits} cr</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--th-text-3)', marginTop: 3 }}>{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Source image (video models) */}
          {selected?.needs_image && (
            <div style={{ marginTop: 6, marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>
                Source image URL <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input className="input" type="url" placeholder="https://example.com/your-image.jpg"
                value={form.image_url} onChange={e => set('image_url', e.target.value)} />
            </div>
          )}

          {/* Prompt */}
          <div style={{ marginTop: 6 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>
              Prompt {selected?.type === 'image' && <span style={{ color: '#ef4444' }}>*</span>}
              {selected?.type === 'video' && <span style={{ color: 'var(--th-text-4)', fontWeight: 400 }}> (motion description, optional)</span>}
            </label>
            <textarea className="input" rows={3}
              placeholder={selected?.type === 'video' ? 'e.g. Smooth cinematic camera pan, gentle wind, golden hour lighting' : 'e.g. A professional product photo of a sneaker on a marble surface, studio lighting, 8k'}
              value={form.prompt} onChange={e => set('prompt', e.target.value)}
              style={{ resize: 'vertical', minHeight: 76 }} />
          </div>

          {/* Type-specific options */}
          {selected?.type === 'image' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>Aspect ratio</label>
                <select className="input" value={form.aspect_ratio} onChange={e => set('aspect_ratio', e.target.value)}>
                  {ASPECTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>Resolution</label>
                <select className="input" value={form.resolution} onChange={e => set('resolution', e.target.value)}>
                  {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          ) : selected ? (
            <div style={{ marginTop: 14, maxWidth: 200 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>Duration (seconds)</label>
              <select className="input" value={form.duration} onChange={e => set('duration', Number(e.target.value))}>
                {DURATIONS.map(d => <option key={d} value={d}>{d}s</option>)}
              </select>
            </div>
          ) : null}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <p style={{ fontSize: 12, color: 'var(--th-text-4)', margin: 0 }}>
              {selected ? <>Costs <strong>{selected.credits} credits</strong></> : 'Select a model'}
            </p>
            <button onClick={handleSubmit} disabled={submitting || !selected || !configured}
              className="btn-primary" style={{ padding: '10px 24px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              {submitting ? (
                <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />Generating…</>
              ) : (
                <>✨ Generate</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {jobs.length > 0 ? (
          <div className="studio-grid">
            {jobs.map(j => <JobCard key={j.id} job={j} onDelete={handleDelete} />)}
          </div>
        ) : (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎨</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--th-text-1)', margin: 0 }}>Nothing generated yet</p>
            <p style={{ fontSize: 13, color: 'var(--th-text-3)', marginTop: 6 }}>Pick a model above, describe what you want, and hit Generate.</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
