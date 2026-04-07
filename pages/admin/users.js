import { useState, useEffect, useCallback } from 'react'
import AdminShell from '../../components/AdminShell'
import { admin } from '../../lib/admin'

const PLANS  = ['free', 'starter', 'pro', 'creator']
const PLAN_COLORS = { free: 'var(--th-text-4)', starter: '#3b82f6', pro: 'var(--th-accent)', creator: '#f59e0b' }

function EditModal({ user, onSave, onClose }) {
  const [form,    setForm]    = useState({ name: user.name, plan: user.plan, credits: user.credits, is_admin: user.is_admin })
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await admin.updateUser(user.id, form)
      onSave()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="card w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: 'var(--th-text-1)' }}>Edit user</h2>
          <button onClick={onClose} style={{ color: 'var(--th-text-4)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="text-sm" style={{ color: 'var(--th-text-3)' }}>{user.email}</div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--th-text-2)' }}>Name</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--th-text-2)' }}>Plan</label>
            <select className="input" value={form.plan} onChange={e => set('plan', e.target.value)}>
              {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--th-text-2)' }}>Credits</label>
            <input className="input" type="number" min="0" value={form.credits} onChange={e => set('credits', parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_admin" checked={!!form.is_admin}
              onChange={e => set('is_admin', e.target.checked ? 1 : 0)}
              className="w-4 h-4 rounded" style={{ accentColor: '#ef4444' }} />
            <label htmlFor="is_admin" className="text-sm" style={{ color: 'var(--th-text-2)' }}>Admin access</label>
          </div>
        </div>

        {error && <div className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>{error}</div>}

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2 text-sm">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [users,   setUsers]   = useState([])
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState(1)
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [plan,    setPlan]    = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    admin.users({ search, plan, page })
      .then(d => { setUsers(d.users); setTotal(d.total); setPages(d.pages) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, plan, page])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    try { await admin.deleteUser(id); load() } catch {}
    setConfirm(null)
  }

  return (
    <AdminShell breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}>
      <div className="p-5 sm:p-8 max-w-6xl mx-auto space-y-5">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input className="input flex-1" placeholder="Search name or email…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          <select className="input sm:w-40" value={plan} onChange={e => { setPlan(e.target.value); setPage(1) }}>
            <option value="">All plans</option>
            {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>

        {/* Count */}
        <div className="text-sm" style={{ color: 'var(--th-text-4)' }}>{total} user{total !== 1 ? 's' : ''}</div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--th-border)' }}>
                  {['User','Plan','Credits','Admin','Verified','Joined',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold"
                      style={{ color: 'var(--th-text-4)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-10" style={{ color: 'var(--th-text-4)' }}>Loading…</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10" style={{ color: 'var(--th-text-4)' }}>No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--th-border-soft)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: 'var(--th-accent)' }}>
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate" style={{ color: 'var(--th-text-1)' }}>{u.name}</div>
                          <div className="text-xs truncate" style={{ color: 'var(--th-text-4)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--th-accent-lt)', color: PLAN_COLORS[u.plan] }}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--th-text-2)' }}>{u.credits}</td>
                    <td className="px-4 py-3">
                      {u.is_admin ? <span className="text-xs font-bold" style={{ color: '#ef4444' }}>Yes</span>
                        : <span style={{ color: 'var(--th-text-4)' }}>—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {u.email_verified
                        ? <span style={{ color: '#22c55e' }}>✓</span>
                        : <span style={{ color: 'var(--th-text-4)' }}>✗</span>}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--th-text-4)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(u)}
                          className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                          style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)' }}>
                          Edit
                        </button>
                        <button onClick={() => setConfirm(u.id)}
                          className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-1.5 text-sm">Prev</button>
            <span className="text-sm" style={{ color: 'var(--th-text-3)' }}>Page {page} of {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary px-3 py-1.5 text-sm">Next</button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <EditModal user={editing} onClose={() => setEditing(null)} onSave={() => { setEditing(null); load() }} />
      )}

      {/* Delete confirm */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="card w-full max-w-sm p-6 space-y-4 text-center">
            <h2 className="font-bold text-base" style={{ color: 'var(--th-text-1)' }}>Delete user?</h2>
            <p className="text-sm" style={{ color: 'var(--th-text-3)' }}>This will permanently delete the user and all their videos.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirm)}
                className="flex-1 py-2 text-sm rounded-xl font-semibold text-white transition-colors"
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
