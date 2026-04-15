import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import ChatBot from '../components/ChatBot'

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service — ClipTok AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ background: 'var(--th-bg)', minHeight: '100vh' }}>
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 transition-colors hover:opacity-80"
            style={{ color: 'var(--th-accent)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to home
          </Link>

          <div className="card p-8 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: 'var(--th-text-1)' }}>
              Terms of Service
            </h1>
            <p className="text-sm mb-10" style={{ color: 'var(--th-text-4)' }}>Last updated: April 2025</p>

            <style>{`
              .tos-section { margin-bottom: 32px; }
              .tos-section h2 { font-size: 17px; font-weight: 700; color: var(--th-text-1); margin-bottom: 10px; }
              .tos-section p, .tos-section li { color: var(--th-text-3); font-size: 15px; line-height: 1.75; margin-bottom: 8px; }
              .tos-section ul { padding-left: 20px; margin: 8px 0; }
              .tos-section strong { color: var(--th-text-2); }
              .tos-link { color: var(--th-accent); }
            `}</style>

            <div className="tos-section">
              <h2>1. Acceptance of Terms</h2>
              <p>By creating an account or using the ClipTok AI platform at cliptokai.com, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
            </div>

            <div className="tos-section">
              <h2>2. Description of Service</h2>
              <p>ClipTok AI provides an AI-powered video generation platform that creates faceless short-form videos. You provide prompts and preferences; we generate the video via AI and deliver it to your dashboard.</p>
            </div>

            <div className="tos-section">
              <h2>3. Account Registration</h2>
              <ul>
                <li>You must provide a valid email address and verify it to activate your account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>You must be at least 13 years old to use the service.</li>
                <li>One account per person. Creating multiple accounts to exploit free credits is prohibited.</li>
              </ul>
            </div>

            <div className="tos-section">
              <h2>4. Credits & Payments</h2>
              <ul>
                <li>Video generation costs <strong>50 credits</strong> per video.</li>
                <li>Credits are non-transferable and expire at the end of each billing period.</li>
                <li>Payments are processed securely by Paystack. We do not store your payment card details.</li>
                <li>Subscriptions renew automatically. You may cancel anytime from your account settings.</li>
                <li>Credits consumed for successfully initiated video generations are generally non-refundable unless a technical failure on our side prevented generation.</li>
              </ul>
            </div>

            <div className="tos-section">
              <h2>5. Acceptable Use</h2>
              <p>You agree NOT to use ClipTok AI to create content that:</p>
              <ul>
                <li>Is defamatory, harassing, threatening or abusive.</li>
                <li>Infringes any intellectual property rights.</li>
                <li>Contains sexually explicit material involving minors.</li>
                <li>Promotes violence, terrorism or illegal activities.</li>
                <li>Is designed to deceive or mislead others (deepfakes of real people without consent).</li>
                <li>Violates the terms of service of any platform you post the content to.</li>
              </ul>
              <p>We reserve the right to suspend accounts that violate these terms without a refund.</p>
            </div>

            <div className="tos-section">
              <h2>6. Content Ownership</h2>
              <p>Videos generated through ClipTok AI are yours to use for personal or commercial purposes, subject to these terms and any underlying licences from our AI providers. We retain no ownership of your generated videos, but we may use anonymised, non-identifiable usage data to improve the service.</p>
            </div>

            <div className="tos-section">
              <h2>7. Availability & Uptime</h2>
              <p>We strive for high availability but do not guarantee uninterrupted service. Scheduled maintenance, API provider outages, or unexpected issues may temporarily affect availability. We are not liable for losses resulting from service downtime.</p>
            </div>

            <div className="tos-section">
              <h2>8. Disclaimer of Warranties</h2>
              <p>The service is provided "as is" without warranty of any kind. We do not guarantee that AI-generated content will meet any specific quality, accuracy or suitability standard for your use case.</p>
            </div>

            <div className="tos-section">
              <h2>9. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, ClipTok AI shall not be liable for any indirect, incidental, special, consequential or punitive damages, including loss of revenue or profits, arising from your use of the service.</p>
            </div>

            <div className="tos-section">
              <h2>10. Changes to Terms</h2>
              <p>We may update these Terms from time to time. Continued use of the service after changes are posted constitutes acceptance of the updated Terms.</p>
            </div>

            <div className="tos-section">
              <h2>11. Contact</h2>
              <p>Questions about these Terms? Email us at <a href="mailto:info@cliptokai.com" className="tos-link">info@cliptokai.com</a>.</p>
            </div>
          </div>
        </div>

        <Footer />
        <ChatBot />
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer className="py-10 px-4" style={{ borderTop: '1px solid var(--th-border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>© 2026 ClipTok AI</span>
        <div className="flex gap-6">
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Support', '/support']].map(([label, href]) => (
            <Link key={label} href={href} className="text-sm hover:underline" style={{ color: 'var(--th-text-4)' }}>{label}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
