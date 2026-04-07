import { useState, useEffect } from 'react'
import AdminShell from '../../components/AdminShell'
import { admin } from '../../lib/admin'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card p-5">
      <div className="text-2xl font-black mb-0.5" style={{ color: color || 'var(--th-text-1)' }}>{value ?? '—'}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--th-text-2)' }}>{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-4)' }}>{sub}</div>}
    </div>
  )
}

const PLAN_LABELS = { free: 'Free', starter: 'Starter', pro: 'Pro', creator: 'Creator' }
const PLAN_COLORS = { free: 'var(--th-text-4)', starter: '#3b82f6', pro: 'var(--th-accent)', creator: '#f59e0b' }

export default function AdminDashboard() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    admin.stats()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminShell breadcrumb={[{ label: 'Dashboard' }]}>
      <div className="p-5 sm:p-8 max-w-6xl mx-auto space-y-8">

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#ef4444', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard label="Total users"    value={data?.users}      color="var(--th-accent)" />
              <StatCard label="Total videos"   value={data?.videos}     color="var(--th-text-1)" />
              <StatCard label="Completed"      value={data?.completed}  color="#22c55e" />
              <StatCard label="Processing"     value={data?.processing} color="#f59e0b" />
              <StatCard label="Failed"         value={data?.failed}     color="#ef4444" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Plans breakdown */}
              <div className="card p-5">
                <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--th-text-1)' }}>Users by plan</h2>
                <div className="space-y-3">
                  {['free','starter','pro','creator'].map(plan => {
                    const count = data?.plan_counts?.[plan] || 0
                    const total = data?.users || 1
                    const pct   = Math.round((count / total) * 100)
                    return (
                      <div key={plan}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium" style={{ color: 'var(--th-text-2)' }}>{PLAN_LABELS[plan]}</span>
                          <span className="text-sm font-bold" style={{ color: PLAN_COLORS[plan] }}>{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'var(--th-border)' }}>
                          <div className="h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: PLAN_COLORS[plan] }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent users */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--th-text-1)' }}>Recent signups</h2>
                  <a href="/admin/users" className="text-xs hover:underline" style={{ color: 'var(--th-accent)' }}>View all</a>
                </div>
                <div className="space-y-3">
                  {(data?.recent_users || []).map(u => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--th-accent)' }}>
                        {(u.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: 'var(--th-text-1)' }}>{u.name}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--th-text-4)' }}>{u.email}</div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                        style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)' }}>
                        {u.plan}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
