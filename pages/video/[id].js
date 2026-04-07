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
    a.download = `faceless-${video.id}.mp4`
    a.click()
  }

  return (
    <>
      <Head><title>{video?.title || video?.topic || 'Video'} — Faceless Reels</title></Head>
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

                <div className="card p-4 mb-5 divide-y" style={{ '--tw-divide-opacity': 1 }}>
                  {[
                    ['Topic',    video.topic],
                    ['Duration', video.duration],
                    ['Voice',    video.voice],
                    ['Style',    video.style],
                    ['Ratio',    video.aspect_ratio],
                    ['Created',  video.created_at && new Date(video.created_at).toLocaleDateString()],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <div key={label} className="flex justify-between py-2.5 first:pt-0 last:pb-0" style={{ borderColor: 'var(--th-border)' }}>
                      <span className="text-sm" style={{ color: 'var(--th-text-4)' }}>{label}</span>
                      <span className="text-sm font-medium capitalize" style={{ color: 'var(--th-text-1)' }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {video.status === 'completed' && video.video_url && (
                    <button onClick={handleDownload} className="btn-primary flex items-center gap-2 text-sm">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1.5v8M3.5 7l3.5 4 3.5-4M1.5 12.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download MP4
                    </button>
                  )}
                  <Link href="/create" className="btn-secondary text-sm">Create another</Link>
                  {video.status === 'failed' && <Link href="/create" className="btn-primary text-sm">Retry</Link>}
                </div>
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </>
  )
}
