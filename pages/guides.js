import Head from 'next/head'
import AppShell from '../components/AppShell'

const GUIDES = [
  { category: 'Getting started', items: [
    { title: 'Create your first video',         desc: 'Step-by-step walkthrough of the video creation flow.',                 time: '3 min' },
    { title: 'Understanding video credits',     desc: 'How credits work and how to get the most out of your plan.',           time: '2 min' },
    { title: 'Setting up a posting schedule',   desc: 'Configure when your videos publish automatically.',                    time: '2 min' },
  ]},
  { category: 'Content strategy', items: [
    { title: 'Choosing the right niche',        desc: 'How to pick a niche that grows fast on TikTok and YouTube Shorts.',   time: '5 min' },
    { title: 'Writing better custom prompts',   desc: 'Tips for writing prompts that produce high-quality AI scripts.',       time: '4 min' },
    { title: 'Best art styles per niche',       desc: 'Which visual style works best for scary stories, motivation, and more.', time: '3 min' },
  ]},
  { category: 'Publishing', items: [
    { title: 'Connecting TikTok',               desc: 'How to link TikTok for automatic video publishing.',                  time: '2 min' },
    { title: 'Connecting Instagram Reels',      desc: 'Step-by-step guide to auto-posting to Instagram.',                    time: '2 min' },
    { title: 'Connecting YouTube Shorts',       desc: 'Set up auto-publishing to your YouTube channel.',                     time: '2 min' },
  ]},
]

export default function GuidesPage() {
  return (
    <>
      <Head><title>Guides — Faceless Reels</title></Head>
      <AppShell breadcrumb={[{ label: 'Guides' }]}>
        <div className="p-7 max-w-2xl">
          <div className="mb-7">
            <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>Guides</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>Learn how to get the most out of Faceless Reels.</p>
          </div>

          <div className="space-y-7">
            {GUIDES.map(group => (
              <div key={group.category}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--th-text-4)' }}>
                  {group.category}
                </div>
                <div className="card overflow-hidden divide-y" style={{ '--tw-divide-opacity': 1 }}>
                  {group.items.map(item => (
                    <button key={item.title} className="w-full flex items-start justify-between px-5 py-4 text-left group transition-colors"
                      style={{ borderColor: 'var(--th-border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--th-accent-lt)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm font-semibold group-hover:underline" style={{ color: 'var(--th-text-1)' }}>{item.title}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-3)' }}>{item.desc}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                        <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>{item.time} read</span>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: 'var(--th-accent)' }}>
                          <path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    </>
  )
}
