import { useState, useEffect } from 'react'
import AdminShell from '../../components/AdminShell'
import { admin } from '../../lib/admin'

const STATUS_COLORS = {
  processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  completed:  { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
  failed:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
  pending:    { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
}

function Badge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30`, borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
      {status}
    </span>
  )
}

export default function AdminClips() {
  const [projects, setProjects] = useState([])
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => { load() }, [page, status])

  const load = async () => {
    setLoading(true)
    try {
      const q = { page, ...(search && { search }), ...(status && { status }) }
      const data = await admin.opusProjects(q)
      setProjects(data.projects || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {}
    setLoading(false)
  }

  const handleSearch = e => { e.preventDefault(); setPage(1); load() }

  const handleDelete = async (id) => {
    if (!confirm('Delete this clip project and all its clips?')) return
    try {
      await admin.deleteOpusProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
      setTotal(t => t - 1)
    } catch (e) {
      alert(e.message)
    }
  }

  const shortUrl = url => {
    try { return new URL(url).hostname + new URL(url).pathname.slice(0, 30) } catch { return url?.slice(0, 40) }
  }

  return (
    <AdminShell breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Clip Projects' }]}>
      <div className="p-5 sm:p-8 max-w-6xl mx-auto space-y-5">

        {/* Header + filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>Clip Projects</h1>
            <p className="text-sm" style={{ color: 'var(--th-text-4)' }}>{total} total Opus Clip projects</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              className="input text-sm"
              style={{ width: 200 }}
              placeholder="Search user, title, URL…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="input text-sm" style={{ width: 130 }} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
              <option value="">All statuses</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <button type="submit" className="btn-primary px-4 py-2 text-sm">Search</button>
          </form>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: '#ef4444', borderTopColor: 'transparent' }} />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'var(--th-text-4)' }}>No clip projects found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--th-border)' }}>
                    {['ID', 'User', 'Video URL', 'Model', 'Status', 'Clips', 'Credits', 'Created', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--th-text-4)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--th-border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--th-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '12px 14px', color: 'var(--th-text-4)', fontWeight: 600 }}>#{p.id}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--th-text-1)' }}>{p.user_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--th-text-4)' }}>{p.user_email}</div>
                      </td>
                      <td style={{ padding: '12px 14px', maxWidth: 200 }}>
                        <div style={{ fontSize: 12, color: 'var(--th-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title || shortUrl(p.video_url)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--th-text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {shortUrl(p.video_url)}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--th-text-3)', fontWeight: 500 }}>{p.model}</td>
                      <td style={{ padding: '12px 14px' }}><Badge status={p.status} /></td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--th-text-1)' }}>{p.clips_count || 0}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--th-text-3)' }}>{p.credits_used}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--th-text-4)', whiteSpace: 'nowrap' }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => handleDelete(p.id)}
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="btn-secondary px-4 py-1.5 text-sm disabled:opacity-40">← Prev</button>
            <span style={{ fontSize: 13, color: 'var(--th-text-3)' }}>Page {page} of {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
              className="btn-secondary px-4 py-1.5 text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
