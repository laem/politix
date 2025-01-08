import top from "../../ministres.json" with { type: "json" }
import { Head } from "$fresh/runtime.ts"
import { BlueskyHandle, PartyVignette, politixGridStyle, politixStyle } from "../../components/Results.tsx"
import { analyseDate, hasRecentTweets } from "../../date-utils.ts"

const title = "Nos ministres sont-ils actifs sur X ?"
const description =
  `Analyse de l'activité des ministres de notre gouvernement sur le réseau social d'influence X de Musk, et de leur activité sur Bluesky, l'alternative ouverte à X.`

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
          content="https://politix.top/fr.png"
          key="og:image"
        />
      </Head>
      <header style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "200%" }}>🥇</span>
        <h1>{title}</h1>
      </header>
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
    {entries.map(([nom, { "@": at, activité , notTested, notFoundAccount}]) => {
      const result = hasRecentTweets(activité, analyseDate)
			const isActiveOnBluesky = null
      return (
        <li
          key={""}
          style={politixStyle(at, result, false)}
        >
          <div style={{ maxWidth: "100%" }}>
            <div style={{ whiteSpace: "nowrap", overflow: "scroll" }}>
			  {nom}
            </div>
          </div>
          <div>
            <small style={{ color: "#f1a8b7" }}>
              X {at || ": non présent"}
            </small>
          </div>
          <div>
            {result
              ? (
                <div>
                  <details>
                    <summary>Actif sur X</summary>
                    <ol>
                      {activité.map((date, i) => <li key={date + i}>{date}</li>)}
                    </ol>
                  </details>
                </div>
              )
              : notTested
              ? "Non testé"
              : (
                "Non actif sur X"
              )}
          </div>
          <div>
            {isActiveOnBluesky
              ? (
                <div>
                  <small style={{ whiteSpace: "nowrap" }}>
                    <BlueskyHandle député={député} />
                  </small>
                  <details>
                    <summary>Actif sur Bluesky</summary>
                    <ol>
                      {isActiveOnBluesky[1].activité.map((date, i) => (
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
