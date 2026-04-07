import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AppShell from '../components/AppShell'
import { auth } from '../lib/api'

function Section({ title, desc, children }) {
  return (
    <div className="card p-6">
      <div className="mb-5" style={{ borderBottom: '1px solid var(--th-border)', paddingBottom: '12px' }}>
        <div className="text-sm font-bold" style={{ color: 'var(--th-text-1)' }}>{title}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-4)' }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

function Alert({ type, msg }) {
  if (!msg) return null
  const s = {
    success: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', color: '#4ade80' },
    error:   { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)', color: '#f87171' },
  }[type]
  return <div className="rounded-xl border p-3 text-sm" style={{ background: s.bg, borderColor: s.border, color: s.color }}>{msg}</div>
}

export default function SettingsPage() {
  const router = useRouter()
  const [user,    setUser]    = useState(null)
  const [name,    setName]    = useState('')
  const [pw,      setPw]      = useState({ password: '', confirm: '' })
  const [nameMsg, setNameMsg] = useState({ type:'', msg:'' })
  const [pwMsg,   setPwMsg]   = useState({ type:'', msg:'' })
  const [busy,    setBusy]    = useState({ name: false, pw: false })

  useEffect(() => {
    auth.me().then(u => { setUser(u); setName(u.name || '') }).catch(() => router.push('/login'))
  }, [])

  const saveName = async (e) => {
    e.preventDefault()
    setBusy(b => ({ ...b, name: true })); setNameMsg({ type:'', msg:'' })
    try { setNameMsg({ type: 'success', msg: 'Name updated.' }) }
    catch (e) { setNameMsg({ type: 'error', msg: e.message }) }
    finally { setBusy(b => ({ ...b, name: false })) }
  }

  const savePw = async (e) => {
    e.preventDefault()
    if (pw.password !== pw.confirm) { setPwMsg({ type: 'error', msg: 'Passwords do not match.' }); return }
    setBusy(b => ({ ...b, pw: true })); setPwMsg({ type:'', msg:'' })
    try {
      await auth.reset({ password: pw.password })
      setPwMsg({ type: 'success', msg: 'Password updated.' })
      setPw({ password: '', confirm: '' })
    } catch (e) { setPwMsg({ type: 'error', msg: e.message || 'Failed.' }) }
    finally { setBusy(b => ({ ...b, pw: false })) }
  }

  const label = (text) => <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>{text}</label>

  return (
    <>
      <Head><title>Settings — Faceless Reels</title></Head>
      <AppShell breadcrumb={[{ label: 'Settings' }]}>
        <div className="p-7 max-w-xl space-y-4">
          <div className="mb-2">
            <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>Account settings</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>{user?.email}</p>
          </div>

          <Section title="Profile" desc="Update your display name">
            <form onSubmit={saveName} className="space-y-4">
              <div>{label('Full name')}<input type="text" className="input" value={name} onChange={e => setName(e.target.value)} /></div>
              <div>{label('Email')}<input type="email" className="input opacity-50 cursor-not-allowed" value={user?.email || ''} disabled /></div>
              <Alert {...nameMsg} />
              <button type="submit" disabled={busy.name} className="btn-primary text-sm">{busy.name ? 'Saving…' : 'Save changes'}</button>
            </form>
          </Section>

          <Section title="Change password" desc="Choose a strong password of at least 8 characters">
            <form onSubmit={savePw} className="space-y-4">
              <div>{label('New password')}<input type="password" className="input" placeholder="Min. 8 characters" value={pw.password} onChange={e => setPw(p => ({ ...p, password: e.target.value }))} minLength={8} required /></div>
              <div>{label('Confirm password')}<input type="password" className="input" placeholder="Repeat new password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} minLength={8} required /></div>
              <Alert {...pwMsg} />
              <button type="submit" disabled={busy.pw} className="btn-primary text-sm">{busy.pw ? 'Updating…' : 'Update password'}</button>
            </form>
          </Section>

          <Section title="Plan">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold capitalize" style={{ color: 'var(--th-text-1)' }}>{user?.plan || '—'} plan</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-4)' }}>{user?.credits ?? '—'} credits remaining</div>
              </div>
              <a href="/billing" className="btn-secondary text-sm">Manage plan</a>
            </div>
          </Section>

          <Section title="Sign out" desc="Sign out of this device">
            <button onClick={async () => { await auth.logout(); router.push('/') }}
              className="btn-secondary text-sm"
              style={{ color: '#f87171', borderColor: 'rgba(220,38,38,0.3)' }}>
              Sign out
            </button>
          </Section>
        </div>
      </AppShell>
    </>
  )
}
