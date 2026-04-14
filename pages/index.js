import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { billing as billingApi, auth, videos as videosApi } from '../lib/api'

const CURRENCY_SYMBOLS = { USD: '$', KES: 'KES ', GBP: '£', EUR: '€', NGN: '₦', GHS: 'GH₵', ZAR: 'R' }

const FEATURES = [
  { icon: '⚡', title: 'Ready in under 3 minutes', desc: 'Pick a topic, click generate. Script, voice, visuals, captions and music — fully produced, no editing.' },
  { icon: '🎙️', title: 'Multiple AI voices',       desc: 'Deep, calm, warm, bright or neutral narrators. Every video sounds like a professional studio production.' },
  { icon: '🎨', title: 'Visual art styles',         desc: 'Cinematic, documentary, anime, pixel art and more. Pick the aesthetic that fits your brand.' },
  { icon: '📱', title: '9:16 built for Reels',      desc: 'Optimised for TikTok, Instagram Reels and YouTube Shorts. Perfect vertical format every time.' },
  { icon: '💬', title: 'Viral caption styles',      desc: 'Hormozi, MrBeast, Celine and more — trendy styled captions burned directly into the video.' },
  { icon: '🎵', title: 'Background music',          desc: 'Royalty-free tracks that match your content mood, automatically layered at the right volume.' },
]

const NICHES = [
  'Motivation', 'Did You Know', 'Reddit Stories', 'Scary Stories',
  'History', 'Mythology', 'News Recap', 'Finance Tips', 'Bible Stories', 'True Crime',
]

const STEPS = [
  {
    num: '01',
    title: 'Choose your niche',
    desc: 'Browse 10+ ready-made categories — motivation, facts, true crime, finance and more. Or write your own custom prompt.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="12" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="12" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="12" y="12" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Customise voice & style',
    desc: 'Pick your narrator voice, art style, caption theme and background music. Dozens of combinations, all professional.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 7h2M8 7h10M4 11h8M14 11h4M4 15h4M10 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="6.5" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="8.5" cy="15" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Download & post',
    desc: 'Your fully produced video is waiting in your dashboard. Download it and post to TikTok, Reels or Shorts in one tap.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3v10M7 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 16v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const SHOWCASE = [
  {
    niche: 'Motivation', emoji: '🔥',
    bg: 'linear-gradient(165deg, #0a0500 0%, #3d1a00 45%, #c94a00 100%)',
    caption: '"Your only competition is who you were yesterday."',
    views: '2.4M', likes: '284K', comments: '1.2K',
    username: '@mindsetshift', desc: 'Daily motivation',
    avatar: 'MS', avatarBg: '#c94a00', progress: 62,
    video_url: 'https://dfsncplzrz5f2.cloudfront.net/renders/6iy1aek66u/out.mp4?Expires=1776729600&Signature=PqglecaDDeO2eGLjEYMYJ5D-BKEq01PDtYKlWVoti6xfOyQ501tkE0gQTOrB-ezOtKnhm6v5Q7~Q6R8Zrg~HGN9tSr3zMy7Sy1fJVgH07yUFGlGWBUock6RRHmx4ZkozwLYPpwoileBA0Q93Ko9WIx1WIjEX6OL7Mli2pN3OT6ZUDW39JTDCH5BlLOhztJ~Anj5ptCBchPIt9HPehWqopcALja8zqh1tNUsLkYnkDK5sLUxAm79tKXZ8AV1uIJNN3Iac23xMqBt2j2PV2-BJzgLtY8zrzq7EVMbD0bH~UbFDoxlfbDLpGJsXG7Pp3vpY1bMpIDpAmWyvhT3ZaLT1iw__&Key-Pair-Id=K2G9P08V12PAM1',
  },
  {
    niche: 'Did You Know', emoji: '🧠',
    bg: 'linear-gradient(165deg, #020817 0%, #0f172a 55%, #1d4ed8 100%)',
    caption: 'The human brain generates 70,000 thoughts every single day 🤯',
    views: '1.8M', likes: '142K', comments: '3.4K',
    username: '@brainfiles', desc: 'Mind-blowing facts',
    avatar: 'BF', avatarBg: '#1d4ed8', progress: 45,
    video_url: 'https://dfsncplzrz5f2.cloudfront.net/renders/x160hc4jve/out.mp4?Expires=1776729600&Signature=LsdCzwo3OgzI54nZsagX2oezKWwb5Tt62fV4zbFepNHoDMaCqc2sdVcK7ZYxcLB95-n2yCUwLtTnXfTkxrf8oisCuiFb3AknDCtfokMIxtan12dJNSTJxEd2u5VHldIH1ir0lR534KX7uwkVuycvBoSAWEz0SIxZTHRRCteJDT8cyU6xLRkcyPrM5yOj9~9SqAGwSwER9cj6K5AnwrOJ9Fd0Zzlo4ZWm4oAyEnijAhQOoTe19HXorr90UJ5ZtwqoxDz3JYlCpWxLRj5~ZY99YhNEfXe4noqpLhr7IKqjRO9gukY2waAz2RMQGTjAX2i7cEMlpbeknn8W0s~dLJYOiQ__&Key-Pair-Id=K2G9P08V12PAM1',
  },
  {
    niche: 'Scary Stories', emoji: '👻',
    bg: 'linear-gradient(165deg, #000000 0%, #12001f 50%, #3b0066 100%)',
    caption: 'Nobody noticed the extra chair at the dinner table… until now.',
    views: '3.1M', likes: '445K', comments: '8.9K',
    username: '@midnighthorror', desc: 'Terrifying tales',
    avatar: 'MH', avatarBg: '#6d28d9', progress: 78,
    video_url: 'https://dfsncplzrz5f2.cloudfront.net/renders/9ehj3svp25/out.mp4?Expires=1776729600&Signature=gxWwQxxUwPE-Bz~UckV5ylmFRgbJh3-rkeb4W93U62v4wrxXC7V9O5jZ3xEaJMHQ1ddIKJZb1ZGfSZXRlfN59SPVAuqiq2BjK78E7BiPfz-FncXbnFO8CchLI0ZskYx-rQteF31eFd-hS-y4QaNl-gPAo0Rk3V4wMiGafglnWueMjPN25yt2imKlxUB-r9pojBUJx25zR3uA0Z09~SIkdm2eGSBlbPztcWBQ4uDwO11EDNNOVXnmgjFEVc6u2DpCgUPgQYl06Mv4uQTg-9ednpvE5rqFtncFxhwYMwO6gWy-~MpJ2MvVP3VvF8XolyIr2Fq4OCLyJTkc7ItTbqF6pQ__&Key-Pair-Id=K2G9P08V12PAM1',
  },
  {
    niche: 'True Crime', emoji: '🔍',
    bg: 'linear-gradient(165deg, #0d0000 0%, #3b0000 50%, #800000 100%)',
    caption: 'The detective noticed one thing everyone else had missed…',
    views: '890K', likes: '67K', comments: '2.1K',
    username: '@casefiles_ai', desc: 'Real crime cases',
    avatar: 'CF', avatarBg: '#991b1b', progress: 33,
    video_url: 'https://dfsncplzrz5f2.cloudfront.net/renders/9dpbgexlp6/out.mp4?Expires=1776729600&Signature=ND3WBeKcAxtOhD-02s22Aiaa20rLfwp8l3ZV-~IB0F7Tc3XfOA~5CN3A95jjzbSoDByhaqkczURyFHyoI8hdAtpKt8157U9XTIQ~DzPznGFy2WvpH1lGWT1XKffkX8Z~Jl3WtsQx1DoPfEMFyobQ2-cAuvxdQ~pHB~~UWx2iXeilms0iP2lX~oKK7I6FDnAbCbtZ026Yw6f0uj3ZzDIOijjlZ1JTnCcau5Cv12u8NGICqr4Ge5ypFlFBxpopZzDiP-BxyVXoiueyfwHCNbOrbgGLuYRTuH9nH~PLDVCf-PSY6mJTUPfuDkw8NmjZsK1K2aL-s6ZewfunHJgub1GqbQ__&Key-Pair-Id=K2G9P08V12PAM1',
  },
  {
    niche: 'History', emoji: '⚔️',
    bg: 'linear-gradient(165deg, #1a0f00 0%, #3d2310 50%, #8b5a2b 100%)',
    caption: 'Rome fell not because of war — but because of THIS.',
    views: '1.2M', likes: '118K', comments: '5.6K',
    username: '@historyvault', desc: 'History untold',
    avatar: 'HV', avatarBg: '#92400e', progress: 55,
    video_url: 'https://dfsncplzrz5f2.cloudfront.net/renders/wihb5rdzhv/out.mp4?Expires=1776729600&Signature=UTef3UWEr6H8tEPyxse99n9zG~abbs01lxwsjAJzopvQcHKa88HoK1VzKyp6Gjoo~wFTWuy4xahCWG0~2Tfnyx9V7yz~A9JBoUO6SjakWGiYIFb~RFpHhRS9Q09pr7jB55c2mm7UWsLq8lTj-OTEpwxFn4W7ofCJ6tX12Bqeyr~n38hAU0tCKwaOWlRkQnA0GmfdG0DljyOSabzf5MZ1jDtQ1Y8db5QmWtkp0PmMUrS0j~bgdLv9RHC4RAb~IpTuqTt7UhfTzCkEPQCJoJt80movIy5pAb~AHaZrDtdsnKczlmRQszy3pU9hhkTBK3jq5JhUL7W3awsP2efRE~CEoA__&Key-Pair-Id=K2G9P08V12PAM1',
  },
  {
    niche: 'Finance', emoji: '💰',
    bg: 'linear-gradient(165deg, #001a00 0%, #003300 50%, #1a6b1a 100%)',
    caption: 'The #1 money mistake people make in their 20s 💸',
    views: '4.7M', likes: '521K', comments: '12K',
    username: '@wealthcode', desc: 'Financial freedom',
    avatar: 'WC', avatarBg: '#166534', progress: 88,
    video_url: 'https://dfsncplzrz5f2.cloudfront.net/renders/ffgtvvl5kl/out.mp4?Expires=1776729600&Signature=J8KOmVSqB7f6CqH5olVd0~DaShE4Dp9oFg301omM~5FfXW~1h96CJLze2VqTih~AkbQnGnMSdm~j-6lr0TJ4MU2GwaUu5Gw7EyEI~qV0HlbtDFc9pef-jA-TlEoQ9cOGQYENY1xjLoNz-UCDUxv5crpeoKL-MUJovUNYwXBAdrd5ZuZ8nqpv2RBGrhMuzNHeOXWMwcYmnK1m4LyflQuJ3lGXVOR6uCQJKvy7jaCF6czguz3wFwddkya4LwsJFMlDWMH8a5uC68BBjxGivEKVJx4T9xABu-qzqTDpxM5KFvVjvLPOmOgEjPee2nLq~Q0ih9ijXkG6OrdqblLHAOrVig__&Key-Pair-Id=K2G9P08V12PAM1',
  },
]

const ROTATIONS = [-5, 2, -3, 4, -1, 3]

const TESTIMONIALS = [
  { name: 'James K.',  handle: '@motivationwithJK', avatar: 'JK', quote: 'I went from 0 to 80K followers in 3 months posting faceless motivation content. This tool saves me 5+ hours every single week.', metric: '80K followers' },
  { name: 'Amina O.',  handle: '@didyouknowfacts',  avatar: 'AO', quote: 'The did-you-know niche is insane on TikTok right now. I post 2 videos a day using this tool and my videos consistently hit 100K views.', metric: '2.1M total views' },
  { name: 'David M.',  handle: '@historyunlocked',  avatar: 'DM', quote: 'As someone with zero video editing skills, this platform is a game changer. The cinematic style looks genuinely professional.', metric: '34K subscribers' },
]

function PhoneCard({ item, rotate }) {
  return (
    <div style={{ transform: `rotate(${rotate}deg)`, transition: 'transform 0.3s ease' }}
      className="group flex-shrink-0">
      <div style={{
        width: 152, height: 272, borderRadius: 24, overflow: 'hidden', position: 'relative',
        background: item.bg,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}>

        {/* Status bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 4px', position: 'relative', zIndex: 3 }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>9:41</span>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {[3, 4, 5, 6].map(h => (
              <div key={h} style={{ width: 2, height: h, background: 'rgba(255,255,255,0.8)', borderRadius: 1 }} />
            ))}
            <div style={{ width: 14, height: 7, borderRadius: 2, border: '1px solid rgba(255,255,255,0.5)', padding: '1px', marginLeft: 3 }}>
              <div style={{ width: '75%', height: '100%', background: 'rgba(255,255,255,0.8)', borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* Background: real video or gradient */}
        {item.video_url ? (
          <video src={item.video_url} autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: item.bg, zIndex: 0 }} />
        )}

        {/* Bottom gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.1) 100%)',
        }} />

        {/* Niche tag */}
        <div style={{ position: 'absolute', top: 32, left: 10, zIndex: 4 }}>
          <span style={{
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
            color: 'white', fontSize: 7.5, fontWeight: 800,
            padding: '2px 7px', borderRadius: 20,
            border: '0.5px solid rgba(255,255,255,0.18)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {item.niche}
          </span>
        </div>

        {/* Center emoji — hidden when real video is playing */}
        {!item.video_url && (
          <div style={{
            position: 'absolute', top: '38%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2, fontSize: 38, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
          }}>
            {item.emoji}
          </div>
        )}

        {/* Caption text */}
        <div style={{ position: 'absolute', bottom: 68, left: 0, right: 22, padding: '0 11px', zIndex: 4 }}>
          <p style={{
            color: 'white', fontSize: 10, fontWeight: 800,
            lineHeight: 1.45, textShadow: '0 1px 4px rgba(0,0,0,0.95)',
            textTransform: 'uppercase', letterSpacing: '0.01em',
          }}>
            {item.caption}
          </p>
        </div>

        {/* Right side actions */}
        <div style={{
          position: 'absolute', right: 6, bottom: 78, zIndex: 4,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: 'white', lineHeight: 1 }}>❤️</div>
            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginTop: 1 }}>{item.likes}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: 'white', lineHeight: 1 }}>💬</div>
            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginTop: 1 }}>{item.comments}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
              <path d="M13.5 8L8 2.5M13.5 8l-5.5 5.5M13.5 8H2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 50, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.15)', zIndex: 4 }}>
          <div style={{ width: `${item.progress}%`, height: '100%', background: 'white', borderRadius: 1 }} />
        </div>

        {/* Bottom user bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', gap: 7, padding: '0 9px', zIndex: 4,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
            background: item.avatarBg, border: '1.5px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 7.5, color: 'white', fontWeight: 800,
          }}>
            {item.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 8, color: 'white', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.username}
            </div>
            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{item.desc}</div>
          </div>
          <div style={{
            fontSize: 7, fontWeight: 800, color: '#a78bfa',
            border: '1px solid #a78bfa', padding: '2px 7px', borderRadius: 10, flexShrink: 0,
          }}>
            Follow
          </div>
        </div>
      </div>

      {/* Views badge */}
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'var(--th-surface)', border: '1px solid var(--th-border)',
          borderRadius: 20, padding: '3px 10px',
        }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4z" stroke="var(--th-text-4)" strokeWidth="1"/>
            <circle cx="6" cy="6" r="1.5" fill="var(--th-text-4)"/>
          </svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--th-text-3)' }}>{item.views} views</span>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [plans,          setPlans]          = useState([])
  const [currency,       setCurrency]       = useState('USD')
  const [plansLoading,   setPlansLoading]   = useState(true)
  const [loggedIn,       setLoggedIn]       = useState(false)
  const [showcaseVideos, setShowcaseVideos] = useState([])

  useEffect(() => {
    billingApi.config()
      .then(cfg => { setPlans(cfg.plans || []); setCurrency(cfg.currency || 'USD') })
      .catch(() => {})
      .finally(() => setPlansLoading(false))
    auth.me().then(() => setLoggedIn(true)).catch(() => {})
    videosApi.showcase().then(d => setShowcaseVideos(d.videos || [])).catch(() => {})
  }, [])

  const displayShowcase = SHOWCASE.map((item, i) => ({
    ...item,
    video_url: showcaseVideos[i]?.video_url || item.video_url || null,
    niche:     showcaseVideos[i]?.topic     || item.niche,
  }))

  const sym      = CURRENCY_SYMBOLS[currency] || (currency + ' ')
  const fmtPrice = (price) => price === 0 ? 'Free' : `${sym}${price.toLocaleString()}`

  return (
    <>
      <Head>
        <title>ClipTok AI — AI Video Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Create viral faceless AI videos in minutes. No camera, no editor. Just your niche and one click." />
      </Head>

      <div style={{ background: 'var(--th-bg)', minHeight: '100vh' }}>
        <Navbar />

        {/* ═══════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════ */}
        <section className="relative flex items-center justify-center overflow-hidden pt-16">
          {/* Accent orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[700px] h-[700px] rounded-full top-[-20%] right-[-15%] opacity-[0.18]"
              style={{ background: 'radial-gradient(circle, var(--th-accent-md) 0%, transparent 70%)' }} />
            <div className="absolute w-[450px] h-[450px] rounded-full bottom-[-10%] left-[-10%] opacity-[0.12]"
              style={{ background: 'radial-gradient(circle, var(--th-accent-md) 0%, transparent 70%)' }} />
            {/* Grid dots */}
            <div className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: 'radial-gradient(circle, var(--th-accent) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-28">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-sm font-semibold"
              style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--th-accent)' }} />
              No camera. No editor. Just results.
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
              style={{ color: 'var(--th-text-1)' }}>
              Go viral without{' '}
              <span style={{ color: 'var(--th-accent)' }}>showing your face</span>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'var(--th-text-3)' }}>
              Pick a niche. Click generate. Get a fully produced AI video — script, voice, visuals, captions and music — ready to post in under 3 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={loggedIn ? '/create' : '/login'}
                className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Create your first video free
              </Link>
              <Link href="#showcase" className="btn-secondary text-base px-8 py-4">
                See example videos
              </Link>
            </div>

            <p className="text-sm mt-5" style={{ color: 'var(--th-text-4)' }}>
              No credit card required · 3 free videos · Cancel anytime
            </p>

            {/* ── Dashboard mockup ── */}
            <div className="mt-20 relative max-w-4xl mx-auto">
              <div className="rounded-3xl p-1 shadow-2xl"
                style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--th-surface-2)' }}>
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--th-border)' }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: '#f87171' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#fbbf24' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#4ade80' }} />
                    <div className="flex-1 rounded-md h-5 mx-4" style={{ background: 'var(--th-border)' }} />
                  </div>
                  {/* Stat cards */}
                  <div className="p-5 grid grid-cols-3 gap-4">
                    {[
                      { label: 'Credits remaining', value: '57',  sub: '+3 this week' },
                      { label: 'Videos created',    value: '142', sub: 'all time' },
                      { label: 'Ready to download', value: '138', sub: 'this month' },
                    ].map(s => (
                      <div key={s.label} className="card p-4">
                        <div className="text-2xl font-black" style={{ color: 'var(--th-accent)' }}>{s.value}</div>
                        <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--th-text-2)' }}>{s.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-4)' }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  {/* Video grid */}
                  <div className="px-5 pb-5 grid grid-cols-4 gap-3">
                    {[
                      { niche: 'Motivation', status: 'ready',      dot: '#22c55e' },
                      { niche: 'Did You Know', status: 'ready',    dot: '#22c55e' },
                      { niche: 'Scary Story', status: 'generating', dot: 'var(--th-accent)' },
                      { niche: 'History',     status: 'queued',    dot: 'var(--th-border)' },
                    ].map(v => (
                      <div key={v.niche} className="card overflow-hidden">
                        <div className="h-16 flex items-center justify-center"
                          style={{ background: 'var(--th-accent-lt)' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect x="2" y="3" width="11" height="14" rx="2" stroke="var(--th-accent)" strokeWidth="1.3"/>
                            <path d="M13 7l4-2.5v8l-4-2.5" stroke="var(--th-accent)" strokeWidth="1.3" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="p-2">
                          <div className="text-xs font-semibold truncate" style={{ color: 'var(--th-text-2)' }}>{v.niche}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: v.dot }} />
                            <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>{v.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 rounded-2xl px-4 py-2.5 hidden sm:block"
                style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', boxShadow: '0 4px 24px rgba(108,71,255,0.15)' }}>
                <div className="text-sm font-bold" style={{ color: '#22c55e' }}>✓ Video ready!</div>
                <div className="text-xs" style={{ color: 'var(--th-text-4)' }}>Your TikTok is live</div>
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl px-4 py-2.5 hidden sm:block"
                style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', boxShadow: '0 4px 24px rgba(108,71,255,0.15)' }}>
                <div className="text-sm font-bold" style={{ color: 'var(--th-accent)' }}>⚡ 2 min 14 sec</div>
                <div className="text-xs" style={{ color: 'var(--th-text-4)' }}>Generation time</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            STATS BAR
        ═══════════════════════════════════════════════════════ */}
        <section className="py-12 px-4" style={{ borderTop: '1px solid var(--th-border)', borderBottom: '1px solid var(--th-border)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: '50,000+',   label: 'Videos generated' },
                { value: '< 3 min',   label: 'Average generation' },
                { value: '10+',       label: 'Content niches' },
                { value: '4.9 ★',     label: 'Creator rating' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-black" style={{ color: 'var(--th-accent)' }}>{s.value}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--th-text-4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════════════════════ */}
        <section id="how" className="py-24 max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold"
              style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
              Simple process
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--th-text-1)' }}>
              From idea to posted video in 3 steps
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--th-text-3)' }}>
              No technical skills. No camera. No editing software. Just results.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 relative">
            {/* Connector lines (desktop only) */}
            <div className="hidden sm:block absolute top-10 left-[33%] right-[33%] h-px"
              style={{ background: 'linear-gradient(to right, var(--th-border), var(--th-accent-md), var(--th-border))', zIndex: 0 }} />

            {STEPS.map((step) => (
              <div key={step.num} className="card p-7 flex flex-col relative z-10"
                style={{ background: 'var(--th-surface)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)' }}>
                    {step.icon}
                  </div>
                  <div className="text-4xl font-black" style={{ color: 'var(--th-border)' }}>{step.num}</div>
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--th-text-1)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--th-text-3)' }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href={loggedIn ? '/create' : '/login'} className="btn-primary text-sm px-7 py-3">
              Start for free — no credit card
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            VIDEO SHOWCASE
        ═══════════════════════════════════════════════════════ */}
        <section id="showcase" className="py-24 overflow-hidden"
          style={{ background: 'var(--th-surface)', borderTop: '1px solid var(--th-border)', borderBottom: '1px solid var(--th-border)' }}>
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold"
              style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
              Real output examples
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--th-text-1)' }}>
              This is what you'll create
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--th-text-3)' }}>
              Fully AI-produced vertical videos — script, voice, visuals, captions — across every top-performing niche.
            </p>
          </div>

          {/* Desktop: all 6 in a row */}
          <div className="hidden lg:flex justify-center items-start gap-5 px-4">
            {displayShowcase.map((item, i) => (
              <PhoneCard key={item.niche} item={item} rotate={ROTATIONS[i]} />
            ))}
          </div>

          {/* Mobile / tablet: horizontal scroll */}
          <div className="lg:hidden flex gap-5 px-6 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {displayShowcase.map((item) => (
              <div key={item.niche} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                <PhoneCard item={item} rotate={0} />
              </div>
            ))}
          </div>

          <div className="text-center mt-14 px-4">
            <p className="text-sm mb-5" style={{ color: 'var(--th-text-4)' }}>
              Every video is generated fresh — unique script, unique visuals, unique voice.
            </p>
            <Link href={loggedIn ? '/create' : '/login'} className="btn-primary text-sm px-7 py-3">
              Generate your first video free
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FEATURES
        ═══════════════════════════════════════════════════════ */}
        <section id="features" className="py-24 max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold"
              style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
              Everything included
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--th-text-1)' }}>
              One tool. Complete videos.
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--th-text-3)' }}>
              AI handles the entire production pipeline — from blank page to finished video.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 group transition-all duration-200 hover:border-[var(--th-accent)]"
                style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--th-text-1)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--th-text-3)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            NICHES TICKER
        ═══════════════════════════════════════════════════════ */}
        <section className="py-16 overflow-hidden" style={{ borderTop: '1px solid var(--th-border)', borderBottom: '1px solid var(--th-border)' }}>
          <div className="text-center mb-10 px-4">
            <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: 'var(--th-text-1)' }}>
              10+ niches, ready to go
            </h2>
            <p style={{ color: 'var(--th-text-3)' }}>Pre-trained for the highest-performing categories on TikTok and YouTube Shorts.</p>
          </div>
          <div className="relative">
            <div className="flex gap-3 whitespace-nowrap w-max" style={{ animation: 'scroll 22s linear infinite' }}>
              {[...NICHES, ...NICHES].map((n, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-full flex-shrink-0 font-medium"
                  style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', color: 'var(--th-text-2)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--th-accent)' }} />
                  {n}
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--th-bg), transparent)' }} />
            <div className="absolute inset-y-0 right-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--th-bg), transparent)' }} />
          </div>
          <style jsx>{`
            @keyframes scroll { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
          `}</style>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════════════════════ */}
        <section className="py-24 max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--th-text-1)' }}>
              Real creators. Real results.
            </h2>
            <p className="text-lg" style={{ color: 'var(--th-text-3)' }}>
              Built for creators who want to grow without ever being on camera.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-6 flex flex-col"
                style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                    style={{ background: 'var(--th-accent)' }}>
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold" style={{ color: 'var(--th-text-1)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--th-text-4)' }}>{t.handle}</div>
                  </div>
                  <div className="rounded-lg px-2 py-1 text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)', border: '1px solid var(--th-accent-md)' }}>
                    {t.metric}
                  </div>
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--th-text-3)' }}>"{t.quote}"</p>
                <div className="flex gap-1 mt-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 14 14" fill="#f59e0b">
                      <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.2 3.8 11l.6-3.6L2 4.8l3.6-.5L7 1z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PRICING
        ═══════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 px-4"
          style={{ background: 'var(--th-surface)', borderTop: '1px solid var(--th-border)', borderBottom: '1px solid var(--th-border)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--th-text-1)' }}>
                Simple, honest pricing
              </h2>
              <p className="text-lg" style={{ color: 'var(--th-text-3)' }}>Start free. Scale when you're ready. No hidden fees.</p>
            </div>

            {plansLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-4 rounded mb-3 w-1/3" style={{ background: 'var(--th-border)' }} />
                    <div className="h-10 rounded mb-2 w-2/3" style={{ background: 'var(--th-border)' }} />
                    <div className="h-3 rounded mb-6 w-1/2" style={{ background: 'var(--th-border)' }} />
                    {[...Array(4)].map((_, j) => <div key={j} className="h-3 rounded mb-2" style={{ background: 'var(--th-border)' }} />)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {plans.map(plan => (
                  <div key={plan.id} className="card p-6 flex flex-col relative"
                    style={plan.popular
                      ? { borderColor: 'var(--th-accent)', boxShadow: '0 0 0 1px var(--th-accent), 0 8px 32px rgba(108,71,255,0.15)' }
                      : {}}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="badge-purple text-xs font-black px-3 py-1 rounded-full">Most popular</span>
                      </div>
                    )}
                    <div className="mb-6">
                      <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--th-text-4)' }}>{plan.name}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black" style={{ color: 'var(--th-text-1)' }}>{fmtPrice(plan.price)}</span>
                        {plan.price > 0 && <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>/mo</span>}
                      </div>
                      <div className="text-sm font-bold mt-1" style={{ color: 'var(--th-accent)' }}>
                        {plan.id === 'free' ? '3 total videos' : `${plan.credits / 50} videos/month`}
                      </div>
                    </div>
                    <ul className="space-y-2.5 flex-1 mb-6">
                      {(plan.features || []).map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--th-text-3)' }}>
                          <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="6" fill="var(--th-accent-lt)"/>
                            <path d="M4.5 7l2 2 3-3" stroke="var(--th-accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.id === 'free'
                        ? (loggedIn ? '/dashboard' : '/login')
                        : (loggedIn ? '/billing' : '/login')}
                      className={`${plan.popular ? 'btn-primary' : 'btn-secondary'} text-center text-sm`}>
                      {plan.id === 'free'
                        ? (loggedIn ? 'Go to dashboard' : 'Start free')
                        : (loggedIn ? `Upgrade to ${plan.name}` : `Get ${plan.name}`)}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════════════════════ */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
            style={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}>
            <div className="absolute inset-0 opacity-40 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center top, var(--th-accent-lt), transparent 65%)' }} />
            <div className="relative">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ color: 'var(--th-text-1)' }}>
                Your first video is{' '}
                <span style={{ color: 'var(--th-accent)' }}>one click away</span>
              </h2>
              <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: 'var(--th-text-3)' }}>
                Join thousands of creators building passive income channels without ever appearing on camera.
              </p>
              <Link href={loggedIn ? '/create' : '/login'} className="btn-primary text-lg px-10 py-4">
                {loggedIn ? 'Create a video now' : 'Get started for free'}
              </Link>
              <p className="text-sm mt-4" style={{ color: 'var(--th-text-4)' }}>
                No credit card · 3 free videos · Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════ */}
        <footer className="py-10 px-4" style={{ borderTop: '1px solid var(--th-border)' }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)', boxShadow: '0 2px 8px rgba(139,92,246,0.35)' }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path d="M5 3.5L13.5 8L5 12.5Z" fill="white"/>
                  <path d="M13 1.5L13.4 2.6L14.5 3L13.4 3.4L13 4.5L12.6 3.4L11.5 3L12.6 2.6Z" fill="rgba(255,255,255,0.85)"/>
                </svg>
              </div>
              <span className="font-black tracking-tight">
                <span style={{ color: 'var(--th-text-2)' }}>ClipTok</span><span style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
              </span>
              <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>© 2025</span>
            </div>
            <div className="flex gap-6">
              {['Terms', 'Privacy', 'Support'].map(l => (
                <a key={l} href="#" className="text-sm transition-colors hover:underline" style={{ color: 'var(--th-text-4)' }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
