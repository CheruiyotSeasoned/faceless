import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AppShell from '../components/AppShell'
import { auth, videos as videosApi, onboarding as ob } from '../lib/api'

function StatusBadge({ status }) {
  const map    = { completed: 'badge-green', processing: 'badge-purple', pending: 'badge-gray', failed: 'badge-red' }
  const labels = { completed: 'Ready', processing: 'Generating', pending: 'Queued', failed: 'Failed' }
  return <span className={map[status] || 'badge-gray'}>{labels[status] || status}</span>
}

function Stat({ label, value, accent }) {
  return (
    <div className="card p-5">
      <div className="text-2xl font-black" style={{ color: accent || 'var(--th-accent)' }}>{value}</div>
      <div className="text-sm mt-1" style={{ color: 'var(--th-text-2)' }}>{label}</div>
    </div>
  )
}

function VideoCard({ video, onPreview }) {
  const vidRef = useRef(null)
  const [thumbReady, setThumbReady] = useState(false)

  useEffect(() => {
    const vid = vidRef.current
    if (!vid || !video.video_url) return

    const onSeeked = () => setThumbReady(true)
    const onCanPlay = () => { vid.currentTime = 0.5 }

    vid.addEventListener('canplay', onCanPlay)
    vid.addEventListener('seeked', onSeeked)

    return () => {
      vid.removeEventListener('canplay', onCanPlay)
      vid.removeEventListener('seeked', onSeeked)
    }
  }, [video.video_url])

  return (
    <div
      onClick={() => onPreview(video)}
      className="card-hover overflow-hidden block group cursor-pointer"
    >
      <div
        className="aspect-[9/16] overflow-hidden rounded-t-xl relative"
        style={{ background: 'var(--th-surface-2)' }}
      >
        {video.video_url ? (
          <>
            <video
              ref={vidRef}
              src={video.video_url}
              className="w-full h-full object-cover"
              style={{ opacity: thumbReady ? 1 : 0, transition: 'opacity 0.4s' }}
              muted
              playsInline
              preload="auto"
            />

            {!thumbReady && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--th-surface-2) 0%, var(--th-accent-lt) 100%)' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black"
                  style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)' }}
                >
                  {(video.title || video.topic || '?')[0].toUpperCase()}
                </div>
                <div className="w-5 h-5 rounded-full border-2 animate-spin mt-1"
                  style={{ borderColor: 'var(--th-accent)', borderTopColor: 'transparent' }} />
              </div>
            )}

            {thumbReady && (
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'rgba(0,0,0,0.45)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(124,34,240,0.9)', backdropFilter: 'blur(4px)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 2l9 5-9 5V2z" fill="white"/>
                  </svg>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, var(--th-surface-2) 0%, var(--th-accent-lt) 100%)' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black"
              style={{ background: 'var(--th-accent-lt)', color: 'var(--th-accent)' }}
            >
              {(video.title || video.topic || '?')[0].toUpperCase()}
            </div>
            <span className="text-xs font-medium px-3 text-center leading-tight" style={{ color: 'var(--th-text-3)' }}>
              {video.status === 'processing' ? 'Generating…' : video.status === 'pending' ? 'Queued' : 'No preview'}
            </span>
            {video.status === 'processing' && (
              <div className="w-16 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--th-border)' }}>
                <div className="h-full rounded-full animate-pulse" style={{ width: '60%', background: 'var(--th-accent)' }} />
              </div>
            )}
          </div>
        )}

        <div className="absolute top-2 left-2">
          <StatusBadge status={video.status} />
        </div>
      </div>

      <div className="p-3">
        <div className="text-sm font-semibold truncate" style={{ color: 'var(--th-text-1)' }}>
          {video.title || video.topic || 'Untitled'}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-4)' }}>
          {new Date(video.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
function VideoPreviewModal({ video, onClose }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handlePlay = () => {
    setPlaying(true)
    videoRef.current?.play()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: '100%',
          maxWidth: '340px',
          background: 'var(--th-surface-1)',
          border: '1px solid var(--th-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--th-border)' }}>
          <div>
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--th-text-1)', maxWidth: '240px' }}>
              {video.title || video.topic || 'Untitled'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-4)' }}>
              {new Date(video.created_at).toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'var(--th-surface-2)', color: 'var(--th-text-3)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Video */}
        <div className="aspect-[9/16] relative" style={{ background: '#000' }}>
          {video.video_url ? (
            <>
              <video
                ref={videoRef}
                src={video.video_url}
                poster={video.thumbnail_url || undefined}
                controls={playing}
                className="w-full h-full object-cover"
                onEnded={() => setPlaying(false)}
              />
              {!playing && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: video.thumbnail_url
                      ? 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
                      : 'var(--th-surface-2)',
                  }}
                >
                  <button
                    onClick={handlePlay}
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ background: 'rgba(124,34,240,0.9)', backdropFilter: 'blur(8px)' }}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M6 4l13 7-13 7V4z" fill="white"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: 'var(--th-text-4)' }}>
              {video.status === 'processing' ? 'Still generating…' : 'No video available'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--th-border)' }}>
          <StatusBadge status={video.status} />
          <Link
            href={`/video/${video.id}`}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: 'var(--th-accent)' }}
          >
            Open full page
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5h7M6 2l3.5 3.5L6 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function WelcomeBanner({ user, prefs, onDismiss }) {
  return (
    <div className="card anim-up mb-6 p-5 relative overflow-hidden" style={{ borderColor: 'var(--th-accent)', borderWidth: '1px' }}>
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--th-accent-lt)' }} />
      <button onClick={onDismiss} className="absolute top-3 right-3" style={{ color: 'var(--th-text-4)' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="relative">
        <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--th-text-1)' }}>
          Welcome, {user?.name?.split(' ')[0]}! Your series is configured.
        </div>
        <div className="text-sm mb-3" style={{ color: 'var(--th-text-3)' }}>
          You have <span className="font-semibold" style={{ color: 'var(--th-accent)' }}>{user?.credits || 3} credits</span> to get started.
          {prefs?.series?.name && ` Series "${prefs.series.name}" is ready.`}
        </div>
        <Link href="/create" className="btn-primary text-sm inline-flex items-center gap-2">
          Create first video
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user,         setUser]         = useState(null)
  const [videoList,    setVideoList]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [showWelcome,  setShowWelcome]  = useState(false)
  const [previewVideo, setPreviewVideo] = useState(null)

  useEffect(() => { if (router.query.welcome === '1') setShowWelcome(true) }, [router.query])

  useEffect(() => {
    auth.me().then(setUser).catch(() => router.push('/login'))
  }, [])

  useEffect(() => {
    if (!user) return
    videosApi.list()
      .then(d => setVideoList(d.videos || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const prefs = ob.load()

  return (
    <>
      <Head><title>Series — CliptoKai</title></Head>
      <AppShell breadcrumb={[{ label: 'Series' }]}>
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--th-text-1)' }}>My Series</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-4)' }}>
                <span className="font-semibold" style={{ color: 'var(--th-accent)' }}>{user?.credits ?? '—'}</span> credits remaining
              </p>
            </div>
            <Link href="/create" className="btn-primary text-sm flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
              New Video
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Stat label="Credits remaining" value={user?.credits ?? '—'} />
            <Stat label="Total videos"      value={videoList.length}      accent="var(--th-text-2)" />
            <Stat label="Completed"         value={videoList.filter(v => v.status === 'completed').length} accent="#22c55e" />
          </div>

          {showWelcome && user && (
            <WelcomeBanner user={user} prefs={prefs} onDismiss={() => setShowWelcome(false)} />
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="aspect-[9/16]" style={{ background: 'var(--th-surface-2)' }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 rounded w-3/4" style={{ background: 'var(--th-surface-2)' }} />
                    <div className="h-2 rounded w-1/2" style={{ background: 'var(--th-surface-2)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : videoList.length === 0 ? (
            <div className="card flex flex-col items-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--th-accent-lt)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="14" height="16" rx="2" stroke="var(--th-accent)" strokeWidth="1.5"/>
                  <path d="M16 9l5.5-3v12L16 15" stroke="var(--th-accent)" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-base font-bold mb-1" style={{ color: 'var(--th-text-1)' }}>No videos yet</div>
              <div className="text-sm mb-5" style={{ color: 'var(--th-text-3)' }}>Create your first AI video to get started.</div>
              <Link href="/create" className="btn-primary text-sm">Create first video</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {videoList.map(v => (
                <VideoCard key={v.id} video={v} onPreview={setPreviewVideo} />
              ))}
            </div>
          )}
        </div>

        {/* Preview modal */}
        {previewVideo && (
          <VideoPreviewModal video={previewVideo} onClose={() => setPreviewVideo(null)} />
        )}

      </AppShell>
    </>
  )
}