import europe from "../../data/europe-data.json" with { type: "json" }
import {
  MastodonHandle,
  PartyVignette,
} from "../../components/ResultsEurope.tsx"
import BackToHome from "../../components/BackToHome.tsx"
import { hasRecentTweets } from "../../date-utils.ts"
import europeanMembersRandomOrder from "../../députésEuropéens.ts"

export default function Mastodon() {
  return (
    <main>
      <BackToHome />
      <h1>Voici la liste des députés européens présents sur Mastodon</h1>

      <h2>Ceux actifs</h2>
      <ul>
        {europeanMembersRandomOrder
          .filter(({ id }) =>
            europe[id].activité_masto &&
            hasRecentTweets(europe[id].activité_masto, europe[id].analyseDate)
          )
          .map(mastodonLine(true))}
      </ul>

      <h2>Ceux inactifs</h2>
      <ul>
        {europeanMembersRandomOrder
          .filter(({ id }) =>
            europe[id].masto &&
            !(europe[id].activité_masto &&
              hasRecentTweets(
                europe[id].activité_masto,
                europe[id].analyseDate,
              ))
          )
          .map(mastodonLine(false))}
      </ul>
    </main>
  )
}

const mastodonLine = (actif) => (député) => {
  const { id, nom, prenom, groupeAbrev, country } = député

  return (
    <li style={{ marginBottom: "1rem" }} key={id}>
      <div>
        {prenom} {nom} &nbsp;
        <PartyVignette party={groupeAbrev} small={true} /> &nbsp;
        {country} &nbsp;
        <MastodonHandle
          député={député}
          invert={false}
          breakline={false}
        />{" "}
        &nbsp; {actif ? "Actif" : "Inactif"}
      </div>
    </li>
  )
}
