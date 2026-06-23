import { useState, useEffect, useCallback } from 'react'
import AdminShell from '../../components/AdminShell'
import { admin } from '../../lib/admin'

const PLANS = ['starter', 'pro', 'creator']
const PLAN_COLORS = { starter: '#3b82f6', pro: 'var(--th-accent)', creator: '#f59e0b' }
const STATUS_COLORS = {
  active:    { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
  pending:   { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  failed:    { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
  cancelled: { bg: 'var(--th-bg-2)',        color: 'var(--th-text-4)' },
  expired:   { bg: 'var(--th-bg-2)',        color: 'var(--th-text-4)' },
}

function fmt(amount) {
  // amount is stored in minor units (e.g. 12900 = 129.00)
  return (amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminTransactions() {
  const [rows,    setRows]    = useState([])
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState(1)
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [plan,    setPlan]    = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const q = { page: p }
      if (search) q.search = search
      if (plan)   q.plan   = plan
      const data = await admin.transactions(q)
      setRows(data.transactions)
      setTotal(data.total)
      setPages(data.pages)
      setPage(p)
    } catch {}
    finally { setLoading(false) }
  }, [page, search, plan])

  useEffect(() => { load(1) }, [search, plan])
  useEffect(() => { load(page) }, [page])

  return (
    <AdminShell breadcrumb={[{ label: 'Transactions' }]}>
      <div className="p-5 sm:p-8 max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>Transactions</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>{total} payment{total !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <input
              className="input text-sm"
              placeholder="Search user or reference…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 220 }}
            />
            <select className="input text-sm" value={plan} onChange={e => setPlan(e.target.value)}>
              <option value="">All plans</option>
              {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--th-accent)', borderTopColor: 'transparent' }} />
            </div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center text-sm" style={{ color: 'var(--th-text-4)' }}>No transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--th-border)' }}>
                    {['Date', 'User', 'Plan', 'Status', 'Amount', 'Credits', 'Gateway', 'Reference', 'Renews'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--th-text-3)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(tx => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--th-border)' }}>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--th-text-3)' }}>
                        {fmtDate(tx.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium" style={{ color: 'var(--th-text-1)' }}>{tx.user_name}</div>
                        <div className="text-xs" style={{ color: 'var(--th-text-4)' }}>{tx.user_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                          style={{ background: `${PLAN_COLORS[tx.plan]}18`, color: PLAN_COLORS[tx.plan] || 'var(--th-text-3)' }}>
                          {tx.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const sc = STATUS_COLORS[tx.status] || STATUS_COLORS.pending
                          return (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                              style={{ background: sc.bg, color: sc.color }}>
                              {tx.status}
                            </span>
                          )
                        })()}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--th-text-1)' }}>
                        {fmt(tx.amount)}
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--th-text-2)' }}>
                        +{tx.credits_granted}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                          style={{ background: 'var(--th-bg-2)', color: 'var(--th-text-3)' }}>
                          {tx.gateway || 'paystack'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs" style={{ color: 'var(--th-text-4)' }}>{tx.paystack_reference}</code>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--th-text-3)' }}>
                        {fmtDate(tx.renews_at)}
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
            <button className="btn-secondary text-sm px-3 py-1.5" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span className="text-sm" style={{ color: 'var(--th-text-3)' }}>Page {page} of {pages}</span>
            <button className="btn-secondary text-sm px-3 py-1.5" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}

      </div>
    </AdminShell>
  )
}
