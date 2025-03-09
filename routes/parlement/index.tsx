import { Head } from "$fresh/runtime.ts"
import BackToHome from "../../components/BackToHome.tsx"
import Results from "../../components/Results.tsx"

const title =
  "Quels députés sont toujours actifs sur X ? Lesquels sont sur Bluesky ou sur Mastodon ?"
const description =
  `Une analyse régulière de l'activité des députés de la République française sur X (Twitter) sur son alternative ouverte Bluesky et sur son alternative libre Mastodon.`

export default function Top() {
  return (
    <main>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} key="description" />
        <meta
          property="og:image"
          content="https://politix.top/parlement.png"
          key="og:image"
        />
      </Head>
      <BackToHome />
      <header
        style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}
      >
        <span style={{ fontSize: "200%" }}>&#129351;</span>
        <h1>{title}</h1>
      </header>
      <Results />
    </main>
  )
}
