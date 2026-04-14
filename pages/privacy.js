import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import ChatBot from '../components/ChatBot'

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — ClipTok AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ background: 'var(--th-bg)', minHeight: '100vh' }}>
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
          {/* Back */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 transition-colors hover:opacity-80"
            style={{ color: 'var(--th-accent)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to home
          </Link>

          <div className="card p-8 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: 'var(--th-text-1)' }}>
              Privacy Policy
            </h1>
            <p className="text-sm mb-10" style={{ color: 'var(--th-text-4)' }}>Last updated: April 2025</p>

            <Prose>
              <Section title="1. Who We Are">
                ClipTok AI ("we", "our", "us") operates the website and platform available at cliptokai.com. We create AI-generated faceless videos for content creators. For any privacy-related questions, contact us at{' '}
                <a href="mailto:info@cliptokai.com" style={{ color: 'var(--th-accent)' }}>info@cliptokai.com</a>.
              </Section>

              <Section title="2. Information We Collect">
                <ul>
                  <li><strong>Account data:</strong> your name, email address and password (stored as a secure hash).</li>
                  <li><strong>Payment data:</strong> billing transactions processed by Paystack. We do not store your card details — Paystack handles all payment security.</li>
                  <li><strong>Usage data:</strong> videos you generate, credit usage, and preferences you save during onboarding.</li>
                  <li><strong>Technical data:</strong> IP address, browser type, and session information for security and debugging purposes.</li>
                </ul>
              </Section>

              <Section title="3. How We Use Your Information">
                <ul>
                  <li>To create and manage your account.</li>
                  <li>To process payments and credit transactions.</li>
                  <li>To generate videos on your behalf via our AI video provider.</li>
                  <li>To send transactional emails (video ready notifications, password resets, email verification).</li>
                  <li>To improve and debug the platform.</li>
                </ul>
                We do not sell your personal data to third parties.
              </Section>

              <Section title="4. Cookies & Local Storage">
                We use an HttpOnly cookie to keep you logged in securely. We also store an authentication token in localStorage as a fallback for mobile browsers. We do not use advertising or tracking cookies.
              </Section>

              <Section title="5. Third-Party Services">
                <ul>
                  <li><strong>Paystack</strong> — payment processing.</li>
                  <li><strong>Vadoo AI</strong> — AI video generation. Your prompts and video preferences are sent to Vadoo to produce your videos.</li>
                  <li><strong>SMTP email provider</strong> — for transactional emails only.</li>
                </ul>
                Each service has its own privacy policy and data handling practices.
              </Section>

              <Section title="6. Data Retention">
                Your account data is retained for as long as your account is active. Generated videos are stored until you delete them or close your account. You may request deletion of your data at any time by emailing{' '}
                <a href="mailto:info@cliptokai.com" style={{ color: 'var(--th-accent)' }}>info@cliptokai.com</a>.
              </Section>

              <Section title="7. Security">
                We use industry-standard security measures including HTTPS, hashed passwords, and HttpOnly cookies. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </Section>

              <Section title="8. Children's Privacy">
                ClipTok AI is not directed at children under 13. We do not knowingly collect personal data from anyone under 13 years of age.
              </Section>

              <Section title="9. Changes to This Policy">
                We may update this policy occasionally. We will notify you of significant changes by email or by posting a notice on the platform.
              </Section>

              <Section title="10. Contact Us">
                For any questions about this Privacy Policy, email us at{' '}
                <a href="mailto:info@cliptokai.com" style={{ color: 'var(--th-accent)' }}>info@cliptokai.com</a>.
              </Section>
            </Prose>
          </div>
        </div>

        <Footer />
        <ChatBot />
      </div>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--th-text-1)', marginBottom: 10 }}>{title}</h2>
      <div style={{ color: 'var(--th-text-3)', fontSize: 15, lineHeight: 1.75 }}>{children}</div>
    </div>
  )
}

function Prose({ children }) {
  return (
    <div style={{ '--list-color': 'var(--th-text-3)' }}>
      <style>{`
        .prose-list ul { padding-left: 20px; margin: 8px 0; }
        .prose-list li { margin-bottom: 6px; }
        .prose-list strong { color: var(--th-text-2); }
      `}</style>
      <div className="prose-list">{children}</div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="py-10 px-4" style={{ borderTop: '1px solid var(--th-border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>© 2025 ClipTok AI</span>
        <div className="flex gap-6">
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Support', '/support']].map(([label, href]) => (
            <Link key={label} href={href} className="text-sm hover:underline" style={{ color: 'var(--th-text-4)' }}>{label}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
