import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AppShell from '../../components/AppShell'
import { auth, videos as videosApi } from '../../lib/api'

function ProgressRing({ progress = 0 }) {
  const r = 52, circ = 2 * Math.PI * r
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="rotate-[-90deg]" width="128" height="128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--th-border)" strokeWidth="8"/>
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--th-accent)" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ - (progress / 100) * circ}
          strokeLinecap="round" className="transition-all duration-700"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color: 'var(--th-text-1)' }}>{Math.round(progress)}%</span>
        <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>processing</span>
      </div>
    </div>
  )
}

export default function VideoPage() {
  const router = useRouter()
  const { id } = router.query
  const [video,    setVideo]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [progress, setProgress] = useState(20)
  const intervalRef = useRef(null)

  useEffect(() => { auth.me().catch(() => router.push('/login')) }, [])

  useEffect(() => {
    if (!id) return
    const fetchVideo = async () => {
      try {
        const data = await videosApi.get(id)
        setVideo(data)
        setLoading(false)
        if (data.status === 'processing') setProgress(p => Math.min(p + 5, 90))
        return data.status
      } catch { setLoading(false); return 'error' }
    }
    fetchVideo().then(status => {
      if (status === 'processing' || status === 'pending') {
        intervalRef.current = setInterval(async () => {
          const st = await fetchVideo()
          if (st === 'completed' || st === 'failed') clearInterval(intervalRef.current)
        }, 10000)
      }
    })
    return () => clearInterval(intervalRef.current)
  }, [id])

  const STATUS = {
    completed:  { label: 'Ready',      cls: 'badge-green'  },
    processing: { label: 'Generating', cls: 'badge-purple' },
    pending:    { label: 'Queued',     cls: 'badge-gray'   },
    failed:     { label: 'Failed',     cls: 'badge-red'    },
  }

  const handleDownload = () => {
    if (!video?.video_url) return
    const a = document.createElement('a')
    a.href = video.video_url
    a.download = `cliptokai-${video.id}.mp4`
    a.click()
  }

  const handleShare = async (platform) => {
    // Download first
    handleDownload()
    // Then deep-link into the platform app (mobile) or open upload page (desktop)
    await new Promise(r => setTimeout(r, 800))
    const urls = {
      tiktok:    'https://www.tiktok.com/upload',
      instagram: 'https://www.instagram.com/reels/camera',
      youtube:   'https://studio.youtube.com/channel/upload',
    }
    window.open(urls[platform], '_blank')
  }

  const handleNativeShare = async () => {
    if (!video?.video_url) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title || video.topic || 'ClipTok AI Video',
          text: 'Check out this AI video I created with ClipTok AI!',
          url: video.video_url,
        })
      } catch {}
    } else {
      navigator.clipboard?.writeText(video.video_url)
      alert('Video URL copied to clipboard!')
    }
  }

  return (
    <>
      <Head><title>{video?.title || video?.topic || 'Video'} — ClipTok AI</title></Head>
      <AppShell breadcrumb={[
        { label: 'Videos', href: '/videos' },
        { label: video?.title || video?.topic || `#${id}` },
      ]}>
        <div className="p-7">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--th-accent)', borderTopColor: 'transparent' }} />
            </div>
          ) : !video ? (
            <div className="card flex flex-col items-center py-20 text-center">
              <p className="text-sm mb-3" style={{ color: 'var(--th-text-3)' }}>Video not found.</p>
              <Link href="/videos" className="btn-primary text-sm">Back to videos</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-[200px_1fr] gap-7 items-start max-w-4xl">
              {/* Preview */}
              <div>
                {video.status === 'completed' && video.video_url ? (
                  <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--th-border)' }}>
                    <video src={video.video_url} controls poster={video.thumbnail_url} className="w-full" />
                  </div>
                ) : video.status === 'processing' ? (
                  <div className="card p-5 text-center">
                    <ProgressRing progress={progress} />
                    <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--th-text-3)' }}>
                      Generating your video. Usually 2–3 minutes.
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--th-accent)' }} />
                      <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>Auto-updates every 10s</span>
                    </div>
                  </div>
                ) : video.status === 'failed' ? (
                  <div className="card p-5 text-center" style={{ borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.04)' }}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)' }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="7.5" stroke="#f87171" strokeWidth="1.4"/>
                        <path d="M6 6l6 6M12 6l-6 6" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#f87171' }}>Generation failed</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--th-text-4)' }}>Credit refunded automatically.</p>
                  </div>
                ) : (
                  <div className="card p-5 text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse" style={{ background: 'var(--th-accent-lt)' }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="7.5" stroke="var(--th-accent)" strokeWidth="1.4"/>
                        <path d="M9 5.5v4l2.5 2.5" stroke="var(--th-accent)" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--th-text-3)' }}>Queued for generation…</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  {video.status && <span className={STATUS[video.status]?.cls || 'badge-gray'}>{STATUS[video.status]?.label}</span>}
                  <span className="text-xs" style={{ color: 'var(--th-text-4)' }}>ID #{video.id}</span>
                </div>
                <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--th-text-1)' }}>
                  {video.title || video.topic || 'Untitled'}
                </h1>

                {video.prompt && (
                  <div className="card p-4 mb-4">
                    <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--th-text-4)' }}>PROMPT</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--th-text-2)' }}>{video.prompt}</p>
                  </div>
                )}

                {video.error_message && (
                  <div className="rounded-xl p-3 mb-4 text-sm" style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171' }}>
                    <span className="font-semibold">Error: </span>{video.error_message}
                  </div>
                )}

                <div className="card p-4 mb-5 divide-y" style={{ '--tw-divide-opacity': 1 }}>
                  {[
                    ['Topic',     video.topic],
                    ['Duration',  video.duration ? `${video.duration}s` : null],
                    ['Voice',     video.voice],
                    ['Style',     video.style],
                    ['Theme',     video.theme],
                    ['Music',     video.bg_music],
                    ['Language',  video.language],
                    ['Ratio',     video.aspect_ratio],
                    ['Credits',   video.credits_used ? `${video.credits_used} credit${video.credits_used === '1' ? '' : 's'}` : null],
                    ['Created',   video.created_at && new Date(video.created_at).toLocaleString()],
                    ['Updated',   video.updated_at && video.updated_at !== video.created_at ? new Date(video.updated_at).toLocaleString() : null],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <div key={label} className="flex justify-between py-2.5 first:pt-0 last:pb-0" style={{ borderColor: 'var(--th-border)' }}>
                      <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>{label}</span>
                      <span className="text-sm font-medium capitalize" style={{ color: 'var(--th-text-1)' }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-5">
                  {video.status === 'completed' && video.video_url && (
                    <button onClick={handleDownload} className="btn-primary flex items-center gap-2 text-sm">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1.5v8M3.5 7l3.5 4 3.5-4M1.5 12.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download MP4
                    </button>
                  )}
                  {video.status === 'completed' && video.video_url && (
                    <button onClick={handleNativeShare} className="btn-secondary flex items-center gap-2 text-sm">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L12 5M12 5L9 8M12 5H5a3 3 0 000 6h1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Share
                    </button>
                  )}
                  <Link href="/create" className="btn-secondary text-sm">Create another</Link>
                  {video.status === 'failed' && <Link href="/create" className="btn-primary text-sm">Retry</Link>}
                </div>

                {/* Post to platforms */}
                {video.status === 'completed' && video.video_url && (
                  <div className="card p-4">
                    <p className="text-xs font-semibold mb-3" style={{ color: 'var(--th-text-3)' }}>
                      POST TO PLATFORM
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'var(--th-text-4)' }}>
                      Downloads your video then opens the platform — paste &amp; upload directly.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'tiktok',    label: 'TikTok',          bg: '#000',     icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg> },
                        { id: 'instagram', label: 'Instagram Reels',  bg: '#e1306c',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                        { id: 'youtube',   label: 'YouTube Shorts',   bg: '#ff0000',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
                      ].map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleShare(p.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                          style={{ background: p.bg, color: '#fff' }}
                        >
                          {p.icon}
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </>
  )
}
