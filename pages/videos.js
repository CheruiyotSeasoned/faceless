import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AppShell from '../components/AppShell'
import { auth, videos as videosApi } from '../lib/api'

const FILTERS = ['All', 'Completed', 'Processing', 'Failed']

function StatusBadge({ status }) {
  const map    = { completed:'badge-green', processing:'badge-purple', pending:'badge-gray', failed:'badge-red' }
  const labels = { completed:'Ready', processing:'Generating', pending:'Queued', failed:'Failed' }
  return <span className={map[status] || 'badge-gray'}>{labels[status] || status}</span>
}

export default function VideosPage() {
  const router = useRouter()
  const [list,    setList]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('All')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    auth.me().catch(() => router.push('/login'))
    videosApi.list().then(d => setList(d.videos || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = list.filter(v => {
    const okStatus = filter === 'All' || v.status === filter.toLowerCase()
    const okSearch = !search || (v.title || v.topic || '').toLowerCase().includes(search.toLowerCase())
    return okStatus && okSearch
  })

  return (
    <>
      <Head><title>Videos — Faceless Reels</title></Head>
      <AppShell breadcrumb={[{ label: 'Videos' }]}>
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>All Videos</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>{list.length} videos total</p>
            </div>
            <Link href="/create" className="btn-primary text-sm flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
              New Video
            </Link>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative max-w-xs flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: 'var(--th-text-4)' }}>
                <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input type="text" className="input pl-8 text-sm" placeholder="Search videos…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={filter === f ? { background: 'var(--th-accent)', color: '#fff' } : { color: 'var(--th-text-3)' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="card overflow-hidden divide-y" style={{ '--tw-divide-opacity':1 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse" style={{ borderColor: 'var(--th-border)' }}>
                  <div className="w-9 h-14 rounded-lg" style={{ background: 'var(--th-surface-2)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 rounded w-1/3" style={{ background: 'var(--th-surface-2)' }} />
                    <div className="h-2 rounded w-1/5" style={{ background: 'var(--th-surface-2)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card flex flex-col items-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--th-accent-lt)' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="3" width="12" height="14" rx="2" stroke="var(--th-accent)" strokeWidth="1.4"/>
                  <path d="M14 7.5l4-2.5v10l-4-2.5" stroke="var(--th-accent)" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--th-text-1)' }}>
                {search || filter !== 'All' ? 'No videos match' : 'No videos yet'}
              </div>
              {!search && filter === 'All' && <Link href="/create" className="btn-primary text-sm mt-3">Create first video</Link>}
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--th-border)' }}>
                    {['Video','Topic','Duration','Status','Created',''].map((h, i) => (
                      <th key={i} className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3"
                        style={{ color: 'var(--th-text-4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--th-border)' }}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-12 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                            style={{ background: 'var(--th-surface-2)' }}>
                            {v.thumbnail_url
                              ? <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover"/>
                              : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1.5" width="7" height="9" rx="1.2" stroke="var(--th-accent)" strokeWidth="1.1"/><path d="M8 4.5l2.5-1.5v6L8 7.5" stroke="var(--th-accent)" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                            }
                          </div>
                          <div>
                            <Link href={`/video/${v.id}`} className="text-sm font-semibold truncate max-w-[140px] block hover:underline"
                              style={{ color: 'var(--th-text-1)' }}>{v.title || v.topic || 'Untitled'}</Link>
                            <div className="text-xs" style={{ color: 'var(--th-text-4)' }}>#{v.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--th-text-2)' }}>{v.topic || '—'}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--th-text-2)' }}>{v.duration || '—'}</td>
                      <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                      <td className="px-5 py-3" style={{ color: 'var(--th-text-4)' }}>{new Date(v.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <Link href={`/video/${v.id}`} className="text-xs font-medium hover:underline" style={{ color: 'var(--th-accent)' }}>View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AppShell>
    </>
  )
}
