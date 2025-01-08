import top from "../../ministres.json" with { type: "json" }
import { Head } from "$fresh/runtime.ts"
import {
  BlueskyHandle,
  PartyVignette,
  politixGridStyle,
  politixStyle,
} from "../../components/Results.tsx"
import { analyseDate, hasRecentTweets } from "../../date-utils.ts"

const title = "Nos ministres sont-ils sur X ?"
const description =
  `Analyse de l'activité des ministres de notre gouvernement sur le réseau social d'influence X de Musk, ainsi que sur Bluesky, l'alternative ouverte à X.`

export default function Top() {
  return (
    <main style={{ maxWidth: "40rem", margin: "2rem auto" }}>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={description}
          key="description"
        />
        <meta
          property="og:image"
          content="https://politix.top/gouvernement.png"
          key="og:image"
        />
      </Head>
      <header style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "200%", marginRight: '.2rem' }}>🥇</span>
        <h1>{title}</h1>
      </header>
		  <p>{description}</p>
		  <p>Un ministre est actif quand il a publié un message dans les 7 derniers jours.</p>
      <br />
      <List />
    </main>
  )
}

const entries = Object.entries(top)
const List = () => (
  <ul
    style={politixGridStyle}
  >
    {entries.map(([nom, { "x": xAt, bsky: bskyAt, activité: {x: xActivity, bsky: bskyActivity}, deletedXAccount, notFoundXAccount }]) => {
      const isActiveOnX = xActivity && Array.isArray(xActivity) &&
        hasRecentTweets(xActivity, analyseDate)
      const isActiveOnBluesky = bskyActivity && Array.isArray(bskyActivity) &&
        hasRecentTweets(bskyActivity, analyseDate)

      return (
        <li
          key={""}
          style={politixStyle(xAt, isActiveOnX, isActiveOnBluesky)}
        >
          <div style={{ maxWidth: "100%" }}>
            <div style={{ whiteSpace: "nowrap", overflow: "scroll" }}>
              {nom}
            </div>
          </div>
          <div>
            <small style={{ color: "#f1a8b7" }}>
              X {xAt || ": non présent"}
            </small>
          </div>
          <div>
            {isActiveOnX
              ? (
                <div>
                  <details>
                    <summary>Actif sur X</summary>
                    <ol>
                      {xActivity.map((date, i) => (
                        <li key={date + i}>{date}</li>
                      ))}
                    </ol>
                  </details>
                </div>
              )
              : (
                "Non actif sur X"
              )}
          </div>
          <div>
            {isActiveOnBluesky
              ? (
                <div>
                  <small style={{ whiteSpace: "nowrap" }}>
                    <BlueskyHandle at={bskyAt} invert={false} />
                  </small>
                  <details>
                    <summary>Actif sur Bluesky</summary>
                    <ol>
                      {bskyActivity.map((date, i) => (
                        <li key={date + i}>{date}</li>
                      ))}
                    </ol>
                  </details>
                </div>
              )
              : "Non actif sur Bluesky"}
          </div>
        </li>
      )
    })}
  </ul>
)
