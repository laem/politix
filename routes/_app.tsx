import { type PageProps } from '$fresh/server.ts'
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PolitiX - Quels députés sont actifs sur X et Bluesky ?</title>
        <meta
          name="description"
          content="Politix analyse automatiquement l'activité des députés sur X (Twitter) et sur Bluesky"
        />
        <meta property="og:image" content="https://politix.top/jaquette.png" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  )
}
