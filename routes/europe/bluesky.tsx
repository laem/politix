import europe from "../../data/europe-data.json" with { type: "json" }
import {
  BlueskyHandle,
  PartyVignette,
} from "../../components/ResultsEurope.tsx"
import BackToHome from "../../components/BackToHome.tsx"
import { hasRecentTweets } from "../../date-utils.ts"
import europeanMembersRandomOrder from "../../députésEuropéens.ts"
import OpenBlueskyTabs from "../../islands/OpenBlueskyTabs.tsx"
const europeEntries = Object.entries(europe)

const ats = europeEntries.map(([, { bsky }]) => bsky && ("@" + bsky)).filter(
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
      <BackToHome />
      <h1>Voici la liste des députés européens présents sur Bluesky</h1>

      <h2>Ceux actifs</h2>
      <ul>
        {europeanMembersRandomOrder
          .filter(({ id }) =>
            europe[id].activité_bsky &&
            hasRecentTweets(europe[id].activité_bsky, europe[id].analyseDate)
          )
          .map(blueskyLine(true))}
      </ul>

      <h2>Ceux inactifs</h2>
      <ul>
        {europeanMembersRandomOrder
          .filter(({ id }) =>
            europe[id].bsky &&
            !(europe[id].activité_bsky &&
              hasRecentTweets(europe[id].activité_bsky, europe[id].analyseDate))
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
  const { id, nom, prenom, groupeAbrev, country } = député

  return (
    <li style={{ marginBottom: "1rem" }} key={id}>
      <div>
        {prenom} {nom} &nbsp;
        <PartyVignette party={groupeAbrev} small={true} /> &nbsp;
        {country} &nbsp;
        <BlueskyHandle député={député} invert={false} />
        &nbsp; {actif ? "Actif" : "Inactif"}
      </div>
    </li>
  )
}
