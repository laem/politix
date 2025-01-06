import { type PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'

export default function App({ Component }: PageProps) {
  return (
    <html>
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PolitiX - Quels députés sont actifs sur X et Bluesky ?</title>
        <meta
          name="description"
          content="Politix analyse automatiquement l'activité des députés sur X (Twitter) et sur Bluesky"
          key="description"
        />
        <meta
          property="og:image"
          content="https://politix.top/jaquette.png"
          key="og:image"
        />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <body>
        <Component />
      </body>
    </html>
  )
}
