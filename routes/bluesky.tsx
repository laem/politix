import bluesky from "../data/bluesky-data.json" with { type: "json" }
import { BlueskyHandle, PartyVignette } from "../components/Results.tsx"
import BackToHome from "../components/BackToHome.tsx"
import { hasRecentTweets } from "../date-utils.ts"
import députésRandomOrder from "../députés.ts"
import OpenBlueskyTabs from "../islands/OpenBlueskyTabs.tsx"
const blueskyEntries = Object.entries(bluesky)

const ats = blueskyEntries.map(([, { bsky }]) => bsky && ("@" + bsky)).filter(
  Boolean,
)

const atsMessages = ats.reduce((memo, next) => {
  const currentMemo = memo[0]
  const nextLength = currentMemo.length + next.length
  if (nextLength > 299) {
    return [next, ...memo]
  }
  return [currentMemo + " " + next, ...memo.slice(1)]
}, [""])

export default function Bluesky() {
  return (
    <main>
      <BackToHome linkBack="/parlement" textBack="Revenir au parlement" />
      <h1>Voici la liste des députés français présents sur Bluesky</h1>

      <h2>Ceux actifs</h2>
      <ul>
        {députésRandomOrder
          .filter(({ id }) =>
            bluesky[id].activité &&
            hasRecentTweets(bluesky[id].activité, bluesky[id].analyseDate)
          )
          .map(blueskyLine(true))}
      </ul>

      <h2>Ceux inactifs</h2>
      <ul>
        {députésRandomOrder
          .filter(({ id }) =>
            bluesky[id].bsky &&
            !(bluesky[id].activité &&
              hasRecentTweets(bluesky[id].activité, bluesky[id].analyseDate))
          )
          .map(blueskyLine(false))}
      </ul>

      <h3>Ci-dessous vous pouvez copier les comptes des députés</h3>
      {atsMessages.map((text) => (
        <div>
          <textArea
            key={text}
            style={{ width: "15rem", height: "12rem", margin: "1rem" }}
          >
            {text}
          </textArea>
          <OpenBlueskyTabs ats={text.split(" ")} />
        </div>
      ))}
    </main>
  )
}

const blueskyLine = (actif) => (député) => {
  const { id, nom, prenom, groupeAbrev } = député

  return (
    <li style={{ marginBottom: "1rem" }} key={id}>
      <div>
        {prenom} {nom} &nbsp;
        <PartyVignette party={groupeAbrev} small={true} /> &nbsp;
        <BlueskyHandle député={député} invert={false} /> &nbsp;{" "}
        {actif ? "Actif" : "Inactif"}
      </div>
    </li>
  )
}
