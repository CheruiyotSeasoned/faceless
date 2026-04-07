import { useState, useEffect } from 'react'
import AdminShell from '../../components/AdminShell'
import { admin } from '../../lib/admin'

function Section({ title, children }) {
  return (
    <div className="card p-5 sm:p-6 space-y-4">
      <h2 className="text-sm font-bold" style={{ color: 'var(--th-text-1)' }}>{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', hint }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--th-text-2)' }}>{label}</label>
      <input className="input" type={type} name={name} value={value || ''} onChange={onChange}
        autoComplete="off" />
      {hint && <p className="text-xs mt-1" style={{ color: 'var(--th-text-4)' }}>{hint}</p>}
    </div>
  )
}

export default function AdminSettings() {
  const [form,    setForm]    = useState({})
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    admin.getSettings()
      .then(s => setForm(s))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await admin.saveSettings(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <AdminShell breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]}>
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#ef4444', borderTopColor: 'transparent' }} />
      </div>
    </AdminShell>
  )

  return (
    <AdminShell breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]}>
      <div className="p-5 sm:p-8 max-w-2xl mx-auto space-y-6">

        {saved && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
            Settings saved successfully.
          </div>
        )}
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        {/* App */}
        <Section title="General">
          <Field label="App name" name="app_name" value={form.app_name} onChange={set} />
        </Section>

        {/* Vadoo */}
        <Section title="Vadoo API">
          <Field label="Vadoo API key" name="vadoo_api_key" value={form.vadoo_api_key} onChange={set}
            type="password"
            hint="Used to generate videos via the Vadoo AI API." />
        </Section>

        {/* Paystack */}
        <Section title="Paystack">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Public key" name="paystack_public_key" value={form.paystack_public_key} onChange={set}
              hint="Starts with pk_live_ or pk_test_" />
            <Field label="Secret key" name="paystack_secret_key" value={form.paystack_secret_key} onChange={set}
              type="password" hint="Starts with sk_live_ or sk_test_" />
          </div>
        </Section>

        {/* SMTP */}
        <Section title="Email (SMTP)">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="SMTP host"       name="smtp_host"      value={form.smtp_host}      onChange={set} />
            <Field label="SMTP port"       name="smtp_port"      value={form.smtp_port}      onChange={set} type="number" />
            <Field label="SMTP username"   name="smtp_user"      value={form.smtp_user}      onChange={set} />
            <Field label="SMTP password"   name="smtp_pass"      value={form.smtp_pass}      onChange={set} type="password" />
            <Field label="From address"    name="smtp_from"      value={form.smtp_from}      onChange={set} />
            <Field label="From name"       name="smtp_from_name" value={form.smtp_from_name} onChange={set} />
          </div>
        </Section>

        <div className="flex items-center justify-end gap-3 pb-4">
          <p className="text-xs flex-1" style={{ color: 'var(--th-text-4)' }}>
            Secrets are masked in the UI. Leave a field unchanged to keep its current value.
          </p>
          <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2.5 text-sm">
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>
    </AdminShell>
  )
}
