import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import AdminShell from '../../components/AdminShell'
import { admin } from '../../lib/admin'

const AUDIENCE_LABELS = {
  all:     'All users',
  free:    'Free plan',
  starter: 'Starter plan',
  pro:     'Pro plan',
  creator: 'Creator plan',
}

const AUDIENCE_COLORS = {
  all:     { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  free:    { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8' },
  starter: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  pro:     { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  creator: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
}

function Badge({ audience }) {
  const c = AUDIENCE_COLORS[audience] || AUDIENCE_COLORS.all
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 20,
    }}>
      {AUDIENCE_LABELS[audience] || audience}
    </span>
  )
}

function StatusBadge({ status }) {
  const sent = status === 'sent'
  return (
    <span style={{
      background: sent ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
      color: sent ? '#4ade80' : '#fbbf24',
      fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 20,
    }}>
      {sent ? 'Sent' : 'Draft'}
    </span>
  )
}

// ── Rich-ish compose with basic toolbar ──────────────────────────────────────

function Composer({ initial, onClose, onSaved }) {
  const [subject,  setSubject]  = useState(initial?.subject  || '')
  const [body,     setBody]     = useState(initial?.body     || '')
  const [audience, setAudience] = useState(initial?.audience || 'all')
  const [saving,   setSaving]   = useState(false)
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState('')
  const textRef = useRef(null)

  const insert = (open, close) => {
    const el = textRef.current
    if (!el) return
    const start = el.selectionStart
    const end   = el.selectionEnd
    const sel   = body.slice(start, end)
    const next  = body.slice(0, start) + open + sel + close + body.slice(end)
    setBody(next)
    setTimeout(() => { el.focus(); el.setSelectionRange(start + open.length, start + open.length + sel.length) }, 0)
  }

  const save = async (send) => {
    setError('')
    if (!subject.trim()) { setError('Subject is required'); return }
    if (!body.trim())    { setError('Body is required');    return }
    send ? setSending(true) : setSaving(true)
    try {
      const res = await admin.createCampaign({ subject, body, audience, send })
      onSaved(res)
    } catch (e) {
      setError(e.message || 'Failed')
    } finally {
      setSaving(false)
      setSending(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: 680,
        background: 'var(--th-surface)',
        border: '1px solid var(--th-border)',
        borderRadius: 20,
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--th-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--th-text-1)' }}>
            Compose email campaign
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--th-text-4)', fontSize: 20, lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          {/* Subject */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-3)', marginBottom: 6 }}>
              Subject line
            </label>
            <input
              className="input"
              placeholder="e.g. Your monthly recap is here 🎬"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          {/* Audience */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--th-text-3)', marginBottom: 6 }}>
              Audience
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(AUDIENCE_LABELS).map(([val, lbl]) => {
                const sel = audience === val
                return (
                  <button key={val} type="button" onClick={() => setAudience(val)} style={{
                    padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    border: sel ? '1.5px solid var(--th-accent)' : '1px solid var(--th-border)',
                    background: sel ? 'var(--th-accent-lt)' : 'transparent',
                    color: sel ? 'var(--th-accent)' : 'var(--th-text-3)',
                    transition: 'all 0.15s',
                  }}>
                    {lbl}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toolbar */}
          <div style={{ marginBottom: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[
              { label: 'B',  title: 'Bold',         open: '<strong>',  close: '</strong>' },
              { label: 'I',  title: 'Italic',        open: '<em>',      close: '</em>'     },
              { label: 'H2', title: 'Heading',       open: '<h2 style="font-size:18px;font-weight:700;color:#fff;margin:16px 0 8px;">',  close: '</h2>' },
              { label: 'P',  title: 'Paragraph',     open: '<p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;margin:0 0 16px;">', close: '</p>' },
              { label: 'CTA', title: 'Call-to-action button', open: '<a href="https://www.cliptokai.com" style="display:inline-block;background:#7c22f0;color:#fff;font-weight:600;font-size:15px;padding:12px 24px;border-radius:12px;text-decoration:none;margin:8px 0;">', close: '</a>' },
              { label: 'HR', title: 'Divider',       open: '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:20px 0;">', close: '' },
            ].map(t => (
              <button key={t.label} type="button" title={t.title}
                onClick={() => insert(t.open, t.close)}
                style={{
                  padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                  background: 'var(--th-surface-2)', border: '1px solid var(--th-border)',
                  fontSize: 11, fontWeight: 700, color: 'var(--th-text-3)',
                }}>
                {t.label}
              </button>
            ))}
            <span style={{ fontSize: 11, color: 'var(--th-text-4)', alignSelf: 'center', marginLeft: 4 }}>
              HTML supported
            </span>
          </div>

          {/* Body */}
          <textarea
            ref={textRef}
            className="input"
            rows={12}
            style={{ resize: 'vertical', fontSize: 13, lineHeight: 1.65, fontFamily: 'monospace', minHeight: 200 }}
            placeholder={'<h2 style="font-size:20px;font-weight:700;color:#fff;">Hello {{name}}!</h2>\n<p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;margin:0 0 16px;">Your email body here...</p>'}
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <p style={{ fontSize: 11, color: 'var(--th-text-4)', marginTop: 6 }}>
            Use <code style={{ background: 'var(--th-surface-2)', padding: '1px 5px', borderRadius: 4 }}>{'{{name}}'}</code> to insert the recipient&apos;s first name.
          </p>

          {error && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 10,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', fontSize: 13,
            }}>{error}</div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--th-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          flexWrap: 'wrap',
        }}>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--th-border)',
            borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600,
            color: 'var(--th-text-3)', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => save(false)} disabled={saving || sending} style={{
              background: 'var(--th-surface-2)', border: '1px solid var(--th-border)',
              borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600,
              color: 'var(--th-text-2)', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1,
            }}>
              {saving ? 'Saving…' : 'Save draft'}
            </button>
            <button onClick={() => save(true)} disabled={saving || sending} style={{
              background: 'linear-gradient(135deg,#ef4444,#dc2626)',
              border: 'none', borderRadius: 10,
              padding: '8px 20px', fontSize: 13, fontWeight: 700,
              color: '#fff', cursor: sending ? 'wait' : 'pointer',
              opacity: sending ? 0.7 : 1,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {sending ? (
                <>
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Preview modal ─────────────────────────────────────────────────────────────

function PreviewModal({ campaign, onClose, onDelete, onSend }) {
  const [deleting, setDeleting] = useState(false)
  const [sending,  setSending]  = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this campaign?')) return
    setDeleting(true)
    try { await admin.deleteCampaign(campaign.id); onDelete(campaign.id) }
    catch { setDeleting(false) }
  }

  const handleSend = async () => {
    if (!confirm(`Send "${campaign.subject}" to ${AUDIENCE_LABELS[campaign.audience]}?`)) return
    setSending(true)
    try {
      const res = await admin.sendCampaign(campaign.id)
      onSend(campaign.id, res)
    } catch (e) {
      alert(e.message || 'Send failed')
      setSending(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: 640,
        background: 'var(--th-surface)',
        border: '1px solid var(--th-border)',
        borderRadius: 20,
        maxHeight: '90vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--th-border)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--th-text-1)', marginBottom: 6 }}>
              {campaign.subject}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <StatusBadge status={campaign.status} />
              <Badge audience={campaign.audience} />
              {campaign.status === 'sent' && (
                <span style={{ fontSize: 11, color: 'var(--th-text-4)' }}>
                  {campaign.sent_count} sent · {new Date(campaign.sent_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--th-text-4)', fontSize: 20, flexShrink: 0,
          }}>×</button>
        </div>

        {/* Body preview */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{
            background: '#07070f', borderRadius: 12,
            padding: '28px 24px',
            border: '1px solid rgba(139,61,255,0.15)',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              ⬡ ClipTok AI
            </div>
            <div
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: campaign.body }}
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--th-text-4)', marginTop: 10 }}>
            Created {new Date(campaign.created_at).toLocaleString()}
            {campaign.created_by_name && ` by ${campaign.created_by_name}`}
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--th-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <button onClick={handleDelete} disabled={deleting} style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10, padding: '7px 14px',
            fontSize: 13, fontWeight: 600, color: '#f87171',
            cursor: deleting ? 'wait' : 'pointer', opacity: deleting ? 0.6 : 1,
          }}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{
              background: 'none', border: '1px solid var(--th-border)',
              borderRadius: 10, padding: '7px 14px', fontSize: 13, fontWeight: 600,
              color: 'var(--th-text-3)', cursor: 'pointer',
            }}>
              Close
            </button>
            {campaign.status === 'draft' && (
              <button onClick={handleSend} disabled={sending} style={{
                background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                border: 'none', borderRadius: 10,
                padding: '7px 18px', fontSize: 13, fontWeight: 700,
                color: '#fff', cursor: sending ? 'wait' : 'pointer',
                opacity: sending ? 0.7 : 1,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {sending ? 'Sending…' : 'Send now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminMail() {
  const [campaigns, setCampaigns] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [composing, setComposing] = useState(false)
  const [preview,   setPreview]   = useState(null)

  useEffect(() => {
    admin.campaigns()
      .then(setCampaigns)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = (res) => {
    setComposing(false)
    // Re-fetch list so we get full data
    admin.campaigns().then(setCampaigns).catch(() => {})
  }

  const handleDelete = (id) => {
    setPreview(null)
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  const handleSent = (id, res) => {
    setCampaigns(prev => prev.map(c =>
      c.id === id ? { ...c, status: 'sent', sent_count: res.sent_count, sent_at: new Date().toISOString() } : c
    ))
    setPreview(prev => prev ? { ...prev, status: 'sent', sent_count: res.sent_count, sent_at: new Date().toISOString() } : null)
  }

  const drafts = campaigns.filter(c => c.status === 'draft')
  const sent   = campaigns.filter(c => c.status === 'sent')

  return (
    <>
      <Head><title>Email Campaigns — Admin</title></Head>
      <AdminShell breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Mail' }]}>
        <div style={{ padding: '24px 28px', maxWidth: 860 }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--th-text-1)', margin: 0 }}>Email Campaigns</h1>
              <p style={{ fontSize: 13, color: 'var(--th-text-4)', marginTop: 2 }}>
                Compose and send bulk emails to your users
              </p>
            </div>
            <button onClick={() => setComposing(true)} style={{
              background: 'linear-gradient(135deg,#ef4444,#dc2626)',
              border: 'none', borderRadius: 12,
              padding: '10px 20px', fontSize: 13, fontWeight: 700,
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New campaign
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
              <div className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: '#ef4444', borderTopColor: 'transparent' }} />
            </div>
          ) : campaigns.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              border: '1px dashed var(--th-border)', borderRadius: 16,
              color: 'var(--th-text-4)',
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--th-text-2)', marginBottom: 6 }}>No campaigns yet</div>
              <div style={{ fontSize: 13 }}>Click "New campaign" to compose your first email blast.</div>
            </div>
          ) : (
            <>
              {/* Drafts */}
              {drafts.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--th-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Drafts ({drafts.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {drafts.map(c => (
                      <CampaignRow key={c.id} campaign={c} onClick={() => setPreview(c)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sent */}
              {sent.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--th-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Sent ({sent.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sent.map(c => (
                      <CampaignRow key={c.id} campaign={c} onClick={() => setPreview(c)} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AdminShell>

      {composing && (
        <Composer
          onClose={() => setComposing(false)}
          onSaved={handleSaved}
        />
      )}

      {preview && (
        <PreviewModal
          campaign={preview}
          onClose={() => setPreview(null)}
          onDelete={handleDelete}
          onSend={handleSent}
        />
      )}
    </>
  )
}

function CampaignRow({ campaign: c, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      background: 'var(--th-surface)',
      border: '1px solid var(--th-border)',
      borderRadius: 12, padding: '14px 16px',
      cursor: 'pointer', transition: 'border-color 0.15s',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 12, alignItems: 'center',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--th-accent)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--th-border)'}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--th-text-1)', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {c.subject}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <StatusBadge status={c.status} />
          <Badge audience={c.audience} />
          {c.status === 'sent' && (
            <span style={{ fontSize: 11, color: 'var(--th-text-4)' }}>
              {c.sent_count} recipients
            </span>
          )}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--th-text-4)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {new Date(c.created_at).toLocaleDateString()}
      </div>
    </button>
  )
}
