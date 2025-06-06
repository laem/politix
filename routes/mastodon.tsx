import mastodon from "../data/mastodon-data.json" with { type: "json" }
import { MastodonHandle, PartyVignette } from "../components/Results.tsx"
import BackToHome from "../components/BackToHome.tsx"
import { hasRecentTweets } from "../date-utils.ts"
import députésRandomOrder from "../députés.ts"

export default function Mastodon() {
  return (
    <main>
      <BackToHome linkBack="/parlement" textBack="Revenir au parlement" />
      <h1>Voici la liste des députés français présents sur Mastodon</h1>

      <h2>Ceux actifs</h2>
      <ul>
        {députésRandomOrder
          .filter(({ id }) =>
            mastodon[id].activité &&
            hasRecentTweets(mastodon[id].activité, mastodon[id].analyseDate)
          )
          .map(mastodonLine(true))}
      </ul>

      <h2>Ceux inactifs</h2>
      <ul>
        {députésRandomOrder
          .filter(({ id }) =>
            mastodon[id].masto &&
            !(mastodon[id].activité &&
              hasRecentTweets(mastodon[id].activité, mastodon[id].analyseDate))
          )
          .map(mastodonLine(false))}
      </ul>
    </main>
  )
}

const mastodonLine = (actif) => (député) => {
  const { id, nom, prenom, groupeAbrev } = député

  return (
    <li style={{ marginBottom: "1rem" }} key={id}>
      <div>
        {prenom} {nom} &nbsp;
        <PartyVignette party={groupeAbrev} small={true} /> &nbsp;
        <MastodonHandle
          député={député}
          invert={false}
          breakline={false}
        />{" "}
        &nbsp;
        {actif ? "Actif" : "Inactif"}
      </div>
    </li>
  )
}
