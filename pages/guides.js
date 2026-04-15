import { useState, useEffect } from 'react'
import Head from 'next/head'
import AppShell from '../components/AppShell'

const GUIDES = [
  { category: 'Getting started', items: [
    {
      title: 'Create your first video',
      desc: 'Step-by-step walkthrough of the video creation flow.',
      time: '3 min',
      content: [
        { heading: 'Overview', body: 'Creating a video on ClipTok AI takes under 2 minutes. The platform handles scripting, voiceover, visuals, and captions automatically — you just provide the topic.' },
        { heading: '1. Go to Create', body: 'Click "Create video" in the sidebar or the big button on your dashboard. This opens the video creation form.' },
        { heading: '2. Enter a topic or prompt', body: 'Type a topic like "5 habits of millionaires" or "scary story about a haunted hotel". The more specific your prompt, the better the script. You can also pick from pre-built templates for popular niches.' },
        { heading: '3. Choose your settings', body: 'Select a voiceover language and voice style, an art style that matches your niche (e.g. cinematic, anime, realistic), background music mood, and caption style. All settings can be saved as defaults in your preferences.' },
        { heading: '4. Hit Generate', body: 'Click "Create video" and the system queues your request. Generation usually takes 2–5 minutes depending on server load. You\'ll see real-time status updates on the video card.' },
        { heading: '5. Download or share', body: 'Once complete, open the video, preview it, and download the MP4. You can also copy the direct link to share or schedule it for posting.' },
        { heading: 'Tips', body: '• Use specific prompts — "10 dark psychology tricks" beats "psychology tips"\n• Try a few art styles to find your brand look\n• Save your favourite settings as defaults to speed up future videos' },
      ],
    },
    {
      title: 'Understanding video credits',
      desc: 'How credits work and how to get the most out of your plan.',
      time: '2 min',
      content: [
        { heading: 'What are credits?', body: 'Credits are the currency for generating videos. Each video costs 50 credits regardless of length or settings.' },
        { heading: 'How do I get credits?', body: 'Free accounts start with 50 credits (1 video). Paid plans add credits to your balance every month:\n\n• Starter — 20 credits/month\n• Pro — 60 credits/month\n• Creator — 150 credits/month\n\nCredits stack — unused credits carry over when your plan renews.' },
        { heading: 'Checking your balance', body: 'Your current credit balance is shown in the top bar and on your dashboard. The billing page shows a full history of credits granted and used.' },
        { heading: 'What happens when credits run out?', body: 'Video creation is disabled until your plan renews or you upgrade. You won\'t lose access to previously generated videos.' },
        { heading: 'Getting the most from your plan', body: '• Batch your ideas — plan a week of content then generate all at once\n• Use templates to reduce failed attempts from bad prompts\n• Upgrade mid-month — new credits are added immediately on upgrade' },
      ],
    },
    {
      title: 'Setting up a posting schedule',
      desc: 'Configure when your videos publish automatically.',
      time: '2 min',
      content: [
        { heading: 'Coming soon', body: 'Automatic scheduling and direct social publishing is currently in development. This guide will be updated when the feature launches.' },
        { heading: 'What\'s available now', body: 'You can download finished videos and manually post them to TikTok, Instagram Reels, or YouTube Shorts. The video page shows the optimal recommended dimensions and format for each platform.' },
        { heading: 'Best posting times (general)', body: '• TikTok: 7–9 am, 12–3 pm, 7–11 pm (your audience\'s timezone)\n• Instagram Reels: 9 am–12 pm, 7–9 pm\n• YouTube Shorts: 12–4 pm\n\nConsistency matters more than timing — posting daily at the same time beats sporadic posts at "peak" hours.' },
      ],
    },
  ]},
  { category: 'Content strategy', items: [
    {
      title: 'Choosing the right niche',
      desc: 'How to pick a niche that grows fast on TikTok and YouTube Shorts.',
      time: '5 min',
      content: [
        { heading: 'Why niche matters', body: 'The algorithm pushes content to users who\'ve engaged with similar videos. A focused niche builds a loyal audience faster than a general channel.' },
        { heading: 'High-performing faceless niches', body: '• Dark psychology & manipulation tactics\n• Scary / true crime stories\n• Motivational quotes & mindset\n• Finance & passive income\n• History & "you won\'t believe this" facts\n• Stoicism & philosophy\n• Space & science facts\n• Relationship advice' },
        { heading: 'How to validate a niche', body: '1. Search the niche on TikTok — if top videos have 100k+ views, demand exists\n2. Check if accounts under 3 months old are already getting views\n3. Look for niches where the top accounts have under 100k followers — easier to compete\n4. Avoid oversaturated niches like generic "motivation" without a unique angle' },
        { heading: 'Picking your angle', body: 'Niches work best with a specific angle. Instead of "finance", try "how broke people think vs rich people think". Instead of "history", try "moments that changed history in 60 seconds". The angle is what makes viewers follow you specifically.' },
        { heading: 'One channel, one niche', body: 'Don\'t mix niches on one channel. The algorithm categorises your account by your content — mixing psychology with cooking confuses it and kills reach. Run separate channels for separate niches.' },
      ],
    },
    {
      title: 'Writing better custom prompts',
      desc: 'Tips for writing prompts that produce high-quality AI scripts.',
      time: '4 min',
      content: [
        { heading: 'The anatomy of a good prompt', body: 'A strong prompt has three parts: a format, a topic, and a hook angle.\n\nFormat: "5 things", "story about", "the reason why", "what happens when"\nTopic: your niche subject\nAngle: the emotional hook — shocking, inspiring, scary, satisfying' },
        { heading: 'Good vs bad prompts', body: 'Bad: "motivation"\nGood: "5 brutal truths about success nobody tells you"\n\nBad: "psychology"\nGood: "3 dark psychology tricks manipulators use that you\'ve already experienced"\n\nBad: "history"\nGood: "The day Rome fell — what the last emperor did in his final hours"' },
        { heading: 'Formats that perform well', body: '• Lists: "7 signs you\'re smarter than you think"\n• Contrast: "Why poor people stay poor (and rich people stay rich)"\n• Revelation: "The real reason [X] happened"\n• Warning: "Stop doing this — it\'s destroying your focus"\n• Story: "A man worked for 30 years and retired with nothing. Here\'s why."' },
        { heading: 'Length & pacing', body: 'Aim for prompts that can fill 45–90 seconds of content. Too broad produces shallow scripts. Too narrow runs out of material. "5 habits" = good length. "Everything about habits" = too broad.' },
        { heading: 'Iterate fast', body: 'Generate 3–5 variations of the same topic with different angles. The first attempt is rarely the best. Use your credit balance to experiment early and find what works for your audience.' },
      ],
    },
    {
      title: 'Best art styles per niche',
      desc: 'Which visual style works best for scary stories, motivation, and more.',
      time: '3 min',
      content: [
        { heading: 'Why art style matters', body: 'The visual style signals the tone before a word is spoken. Mismatched style and content causes viewers to scroll past in the first second.' },
        { heading: 'Niche to style guide', body: '• Scary / horror stories → Dark cinematic, gothic, high-contrast\n• Motivation / mindset → Cinematic, dramatic lighting, bold\n• Finance / wealth → Clean realistic, modern city, minimal\n• History → Painterly, old film, documentary style\n• Psychology → Abstract, surreal, dark minimal\n• Space / science → Sci-fi, photorealistic, cosmic\n• Stoicism / philosophy → Ancient, stone texture, classical art\n• Relationship advice → Soft realistic, warm tones, lifestyle' },
        { heading: 'Consistency is the brand', body: 'Pick one art style and stick with it. Viewers recognise your videos in their feed before they read the title. Changing style between videos breaks brand recognition.' },
        { heading: 'Testing styles', body: 'Generate the same script with two different art styles and compare. After 10+ videos you\'ll see which style retains viewers longer in your analytics.' },
      ],
    },
  ]},
  { category: 'Publishing', items: [
    {
      title: 'Connecting TikTok',
      desc: 'How to link TikTok for automatic video publishing.',
      time: '2 min',
      content: [
        { heading: 'Coming soon', body: 'Direct TikTok publishing is in development and will be available in an upcoming release.' },
        { heading: 'Manual posting tips for TikTok', body: '• Always upload the original MP4 — re-encoding reduces quality\n• Add 3–5 hashtags: 1 broad (#motivation), 1 niche (#darkmotivation), 1 trending\n• Write a caption that ends with a question to drive comments\n• Post as "Everyone" not followers-only\n• Don\'t delete and repost — it resets the algorithm push' },
        { heading: 'TikTok video specs', body: '• Resolution: 1080 × 1920 (9:16)\n• Max length: 10 minutes (60 seconds performs best)\n• Format: MP4\n• No letterboxing or black bars' },
      ],
    },
    {
      title: 'Connecting Instagram Reels',
      desc: 'Step-by-step guide to auto-posting to Instagram.',
      time: '2 min',
      content: [
        { heading: 'Coming soon', body: 'Direct Instagram Reels publishing is in development and will be available in an upcoming release.' },
        { heading: 'Manual posting tips for Reels', body: '• Use the Instagram mobile app — desktop Reels posting has limited features\n• Add a cover image for the grid — pick a high-contrast frame\n• Keep captions short — 1–2 lines then "... more"\n• Use 5–8 hashtags max\n• Share to Stories after posting for extra reach' },
        { heading: 'Instagram Reels video specs', body: '• Resolution: 1080 × 1920 (9:16)\n• Max length: 90 seconds\n• Format: MP4\n• Keep important visuals away from the bottom 20% (covered by UI)' },
      ],
    },
    {
      title: 'Connecting YouTube Shorts',
      desc: 'Set up auto-publishing to your YouTube channel.',
      time: '2 min',
      content: [
        { heading: 'Coming soon', body: 'Direct YouTube Shorts publishing is in development and will be available in an upcoming release.' },
        { heading: 'Manual posting tips for Shorts', body: '• Upload via YouTube Studio — go to Create → Upload video\n• Add "#Shorts" to the title or description so YouTube classifies it correctly\n• Write a full description with keywords for search\n• Set visibility to Public immediately — Scheduled posts sometimes miss the Shorts feed\n• Add to a "Shorts" playlist on your channel' },
        { heading: 'YouTube Shorts video specs', body: '• Resolution: 1080 × 1920 (9:16)\n• Max length: 60 seconds\n• Format: MP4\n• Thumbnail auto-selected from the video — choose a high-energy frame' },
      ],
    },
  ]},
]

function GuideModal({ guide, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div className="relative w-full sm:max-w-xl max-h-[90vh] sm:max-h-[80vh] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ background: 'var(--th-card)', border: '1px solid var(--th-border)' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--th-border)' }}>
          <div className="flex-1 min-w-0 pr-4">
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--th-accent)' }}>{guide.time} read</div>
            <h2 className="text-base font-bold leading-snug" style={{ color: 'var(--th-text-1)' }}>{guide.title}</h2>
          </div>
          <button onClick={onClose} className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--th-text-4)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--th-border)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {guide.content.map((section, i) => (
            <div key={i}>
              <div className="text-sm font-bold mb-1.5" style={{ color: 'var(--th-text-1)' }}>{section.heading}</div>
              <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--th-text-3)' }}>{section.body}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: '1px solid var(--th-border)' }}>
          <button onClick={onClose} className="btn-secondary w-full text-sm py-2">Close</button>
        </div>
      </div>
    </div>
  )
}

export default function GuidesPage() {
  const [open, setOpen] = useState(null)

  return (
    <>
      <Head><title>Guides — ClipTok AI</title></Head>
      <AppShell breadcrumb={[{ label: 'Guides' }]}>
        <div className="p-7 max-w-2xl">
          <div className="mb-7">
            <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>Guides</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>Learn how to get the most out of ClipTok AI.</p>
          </div>

          <div className="space-y-7">
            {GUIDES.map(group => (
              <div key={group.category}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--th-text-4)' }}>
                  {group.category}
                </div>
                <div className="card overflow-hidden divide-y" style={{ '--tw-divide-opacity': 1 }}>
                  {group.items.map(item => (
                    <button key={item.title}
                      className="w-full flex items-start justify-between px-5 py-4 text-left group transition-colors"
                      style={{ borderColor: 'var(--th-border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--th-accent-lt)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                      onClick={() => setOpen(item)}>
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm font-semibold" style={{ color: 'var(--th-text-1)' }}>{item.title}</div>
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

        {open && <GuideModal guide={open} onClose={() => setOpen(null)} />}
      </AppShell>
    </>
  )
}
