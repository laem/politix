import { Head } from "$fresh/runtime.ts"
import BackToHome from "../../components/BackToHome.tsx"
import { blueskyBlue } from "../../components/PerParty.tsx"
import { BlueskyHandle, politixStyle } from "../../components/Results.tsx"
import { hasRecentTweets } from "../../date-utils.ts"
import top from "../../data/ministres.json" with { type: "json" }
import Bar from "../../Bar.tsx"

const title = "Nos ministres sont-ils sur X ?"
const description =
  `Analyse de l'activité des ministres de notre gouvernement sur le réseau social d'influence X de Musk, ainsi que sur Bluesky, l'alternative ouverte à X.`

const entries = Object.entries(top)
const total = entries.length
const isActive = (activity, analyseDate) =>
  activity && Array.isArray(activity) &&
  hasRecentTweets(activity, analyseDate)

const xIsActive = entries.filter((
  [, { activité: { x: xActivity }, analyseDate }],
) => isActive(xActivity, analyseDate)).length
const xPercentActive = (xIsActive / total * 100).toFixed(1)

const blueskyIsActive = entries.filter((
  [, { activité: { bsky: bskyActivity }, analyseDate }],
) => isActive(bskyActivity, analyseDate)).length
const blueskyPercentActive = (blueskyIsActive / total * 100).toFixed(1)

export default function Top() {
  return (
    <main>
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
      <BackToHome />
      <header
        style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}
      >
        <span class="emoji">🥇</span>
        <h1>{title}</h1>
      </header>
      <p>{description}</p>
      <p>
        Un ministre est actif quand il a publié un message dans les 7 derniers
        jours.
      </p>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "40rem",
          gap: ".4rem",
          margin: "auto",
        }}
      >
        <Bar
          {...{
            percentActive: xPercentActive,
            total,
            background: "black",
            suffix: "",
            logo: "x.png",
          }}
        />
        <Bar
          {...{
            percentActive: blueskyPercentActive,
            total,
            background: blueskyBlue,
            suffix: "",
            logo: "bluesky.svg",
          }}
        />
      </div>
      <List />
    </main>
  )
}

const priorityFilter = ([nom]) =>
  nom.includes("Macron") || nom.includes("Gouvernement")
const priorityEntries = entries.filter(priorityFilter)
const rest = entries.filter((e) => !priorityFilter(e))
const List = () => (
  <div id="ContainerGrid">
    <div id="PoliticianGrid">
      {[...priorityEntries, ...rest].map(
        (
          [
            nom,
            {
              "x": xAt,
              bsky: bskyAt,
              avatar,
              activité: { x: xActivity, bsky: bskyActivity },
              analyseDate,
              deletedXAccount,
              notFoundXAccount,
            },
          ],
        ) => {
          const isActiveOnX = xActivity && Array.isArray(xActivity) &&
            hasRecentTweets(xActivity, analyseDate)
          // console.log("hasRecentTweets", xActivity, analyseDate)
          const isActiveOnBluesky = bskyActivity &&
            Array.isArray(bskyActivity) &&
            hasRecentTweets(bskyActivity, analyseDate)

          return (
            <div
              key={nom}
              class="politicianBox"
              style={politixStyle(
                isActiveOnX,
                isActiveOnBluesky,
                false,
              )}
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
                {bskyAt != null &&
                  (
                    <div>
                      <small style={{ whiteSpace: "nowrap" }}>
                        <BlueskyHandle
                          at={bskyAt}
                          invert={false}
                          avatar={avatar}
                          isActive={isActiveOnX || isActiveOnBluesky}
                        />
                      </small>
                      {isActiveOnBluesky
                        ? (
                          <details>
                            <summary
                              style={{
                                background: blueskyBlue,
                                padding: "0 .4rem 0 .2rem",
                                borderRadius: ".2rem",
                                marginTop: ".2rem",
                                lineHeight: "1.1rem",
                                width: "fit-content",
                              }}
                            >
                              Actif sur Bluesky
                            </summary>
                            <ol>
                              {bskyActivity.map((date, i) => (
                                <li key={date + i}>{date}</li>
                              ))}
                            </ol>
                          </details>
                        )
                        : "Non actif sur Bluesky"}
                    </div>
                  )}
              </div>
            </div>
          )
        },
      )}
    </div>
  </div>
)
