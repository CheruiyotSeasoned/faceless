import Head from 'next/head'
import Navbar from './Navbar'

export default function Layout({ children, title = 'Faceless', hideNav = false, minimal = false }) {
  return (
    <>
      <Head>
        <title>{title === 'Faceless' ? 'Faceless — AI Video Generator' : `${title} — Faceless`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Create viral faceless AI videos in minutes. No camera, no editor. Just your niche and one click." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!hideNav && <Navbar minimal={minimal} />}

      <main className={hideNav ? '' : minimal ? 'pt-16' : 'pt-16'}>
        {children}
      </main>
    </>
  )
}
