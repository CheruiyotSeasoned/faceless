import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#7c3aed" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* TEMP: Eruda mobile debugger — REMOVE BEFORE GOING LIVE */}
        <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
        <script dangerouslySetInnerHTML={{ __html: 'eruda.init()' }} />
      </body>
    </Html>
  )
}
