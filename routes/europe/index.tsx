import { Head } from "$fresh/runtime.ts"
import BackToHome from "../../components/BackToHome.tsx"
import ResultsEurope from "../../components/ResultsEurope.tsx"

const title =
  "Quels députés européens sont actifs sur sur Bluesky ou sur Mastodon ?"
const description =
  `Une analyse régulière de l'activité des députés du Parlement Européen sur l'alternative ouverte Bluesky et sur l'alternative libre Mastodon.`

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
        style={{ display: "flex", alignItems: "center", margin: "1rem" }}
      >
        <span style={{ fontSize: "200%" }}>&#129351;</span>
        <h1>{title}</h1>
      </header>
      <p style={{ "text-align": "center" }}>
        La commission européenne a un compte Bluesky
        <a
          href="https://bsky.app/profile/ec.europa.eu"
          style={{
            marginRight: "0.5rem",
            marginLeft: "0.5rem",
            "text-decoration": "none",
          }}
        >
          @ec.europa.eu &nbsp;
          <img
            src="/bluesky.svg"
            style={{
              width: "1rem",
              height: "auto",
              display: "inline",
              marginRight: ".2rem",
              verticalAlign: "middle",
            }}
            width="10"
            height="10"
            alt="Logo Bluesky"
          />
        </a>
        et un compte Mastodon
        <a
          href="https://ec.social-network.europa.eu/@EUCommission/"
          style={{
            marginRight: "0.5rem",
            marginLeft: "0.5rem",
            "text-decoration": "none",
          }}
        >
          @EUCommission@ec.social-network.europa.eu &nbsp;
          <img
            src="/mastodon.svg"
            style={{
              width: "1rem",
              height: "auto",
              display: "inline",
              marginRight: ".2rem",
              verticalAlign: "middle",
            }}
            width="10"
            height="10"
            alt="Logo Mastodon"
          />
        </a>
        .
      </p>
      <ResultsEurope />
    </main>
  )
}
