import { useState, useEffect, useCallback } from 'react'
import AdminShell from '../../components/AdminShell'
import { admin } from '../../lib/admin'

const STATUSES = ['pending', 'processing', 'completed', 'failed']
const STATUS_COLORS = {
  pending:    { bg: 'var(--th-border)',              color: 'var(--th-text-4)' },
  processing: { bg: 'rgba(245,158,11,0.1)',          color: '#f59e0b'          },
  completed:  { bg: 'rgba(34,197,94,0.1)',           color: '#22c55e'          },
  failed:     { bg: 'rgba(239,68,68,0.1)',           color: '#ef4444'          },
}

export default function AdminVideos() {
  const [videos,  setVideos]  = useState([])
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState(1)
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('')
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    admin.videos({ search, status, page })
      .then(d => { setVideos(d.videos); setTotal(d.total); setPages(d.pages) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    try { await admin.deleteVideo(id); load() } catch {}
    setConfirm(null)
  }

  return (
    <AdminShell breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Videos' }]}>
      <div className="p-5 sm:p-8 max-w-6xl mx-auto space-y-5">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input className="input flex-1" placeholder="Search title, topic, user…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          <select className="input sm:w-44" value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        <div className="text-sm" style={{ color: 'var(--th-text-4)' }}>{total} video{total !== 1 ? 's' : ''}</div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--th-border)' }}>
                  {['Title / Topic','User','Status','Duration','Created',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--th-text-4)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-10" style={{ color: 'var(--th-text-4)' }}>Loading…</td></tr>
                ) : videos.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10" style={{ color: 'var(--th-text-4)' }}>No videos found</td></tr>
                ) : videos.map(v => {
                  const sc = STATUS_COLORS[v.status] || STATUS_COLORS.pending
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--th-border-soft)' }}>
                      <td className="px-4 py-3 max-w-[200px]">
                        <div className="font-medium truncate" style={{ color: 'var(--th-text-1)' }}>{v.title || '—'}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--th-text-4)' }}>{v.topic}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium truncate max-w-[140px]" style={{ color: 'var(--th-text-2)' }}>{v.user_name}</div>
                        <div className="text-xs truncate max-w-[140px]" style={{ color: 'var(--th-text-4)' }}>{v.user_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: sc.bg, color: sc.color }}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--th-text-3)' }}>{v.duration || '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--th-text-4)' }}>
                        {new Date(v.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setConfirm(v.id)}
                          className="text-xs px-2.5 py-1 rounded-lg"
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-1.5 text-sm">Prev</button>
            <span className="text-sm" style={{ color: 'var(--th-text-3)' }}>Page {page} of {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary px-3 py-1.5 text-sm">Next</button>
          </div>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="card w-full max-w-sm p-6 space-y-4 text-center">
            <h2 className="font-bold text-base" style={{ color: 'var(--th-text-1)' }}>Delete video?</h2>
            <p className="text-sm" style={{ color: 'var(--th-text-3)' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirm)}
                className="flex-1 py-2 text-sm rounded-xl font-semibold text-white"
                style={{ background: '#ef4444' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
