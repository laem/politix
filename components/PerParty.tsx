import Bar from "../Bar.tsx"
import { hasRecentTweets } from "../date-utils.ts"
import députésRandomOrder from "../députés.ts"
import {
  centerStyle,
  findDéputé,
  getPartyName,
  PartyVignette,
} from "./Results.tsx"

const partiesCount = députésRandomOrder.reduce((memo, next) => {
  const { groupeAbrev } = next

  return { ...memo, [groupeAbrev]: (memo[groupeAbrev] || 0) + 1 }
}, {})

const topPartiesEntries = Object.entries(partiesCount).sort(
  ([, a], [, b]) => b - a,
)

const totalCount = topPartiesEntries.length,
  firstPartyCount = topPartiesEntries[0][1]

export default function PerParty({ entries, blueskyEntries }) {
  const perParty = entries.reduce((memo, [id, { analyseDate, activité }]) => {
    const active = activité &&
      Array.isArray(activité) &&
      hasRecentTweets(activité, analyseDate)
    const député = findDéputé(id)
    const { prenom, nom, groupe, groupeAbrev, twitter } = député
    return { ...memo, [groupeAbrev]: [...(memo[groupeAbrev] || []), active] }
  }, {})

  const stats = Object.entries(perParty)
    .map(([party, results]) => [
      party,
      results.length,
      Math.round((results.filter(Boolean).length / results.length) * 100),
    ])
    .sort(([, , a], [, , b]) => -a + b)

  const blueskyPerParty = blueskyEntries.reduce((memo, [id, next]) => {
    const { groupeAbrev, activité, analyseDate } = next

    const isActive = activité && hasRecentTweets(activité, analyseDate)

    return { ...memo, [groupeAbrev]: [...(memo[groupeAbrev] || []), isActive] }
  }, {})

  const blueskyStats = Object.entries(blueskyPerParty)
    .map(([party, results]) => [
      party,
      results.length,
      Math.round((results.filter(Boolean).length / results.length) * 100),
    ])
    .sort(([, , a], [, , b]) => -a + b)

  //console.log({ blueskyStats, blueskyPerParty })

  return (
    <div>
      <p style={{ textAlign: "center", color: "#980c0c" }}>
        La dernière analyse X est en cours au 20 janvier 2025 : nous avons testé{" "}
        {entries.length} députés grâce aux données{" "}
        <a href="https://datan.fr">datan</a> améliorées.
      </p>
      <p style={{ textAlign: "center", color: "darkBlue" }}>
        Concernant Bluesky, nous prenons le premier compte trouvé avec la
        recherche "prénom nom".
      </p>
      <h3 style={{ margin: "2rem 0 1rem", ...centerStyle }}>
        Décompte par groupe parlementaire
      </h3>
      <ul
        style={{ listStyleType: "none", maxWidth: "50rem", margin: "0 auto" }}
      >
        {topPartiesEntries.map(([groupeAbrev, count]) => {
          const twitterParty = stats.find(([party]) => party === groupeAbrev)
          if (!twitterParty) return null

          const [party, total, percentActive] = twitterParty

          const blueskyStatsLine = blueskyStats.find(
            ([party2]) => party === party2,
          )
          const [, blueskyTotal, blueskyPercentActive] = blueskyStatsLine || [
            null,
            0,
            députésRandomOrder.filter(
              ({ groupeAbrev }) => groupeAbrev === party,
            ).length,
          ]

          console.log(party, blueskyTotal, blueskyPercentActive)
          return (
            <li
              key={party}
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: ".6rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: ".4rem",
                }}
              >
                <div style={{ width: "5rem", marginRight: "0rem" }}>
                  <PartyVignette party={party} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    gap: ".4rem",
                  }}
                >
                  <Bar
                    {...{
                      percentActive,
                      total,
                      background: "black",
                      logo: "x.png",
                    }}
                  />
                  <Bar
                    {...{
                      percentActive: blueskyPercentActive,
                      total: blueskyTotal,
                      background: blueskyBlue,
                      suffix: "",
                      logo: "bluesky.svg",
                    }}
                  />
                  <Bar
                    {...{
                      percentActive: (count / firstPartyCount) * 100,
                      text: `${count} députés`,
                      background: "#eee",
                      color: "#333",
                    }}
                  />
                </div>
              </div>
              <small
                style={{
                  color: "#bbb",
                  lineHeight: ".8rem",
                  textAlign: "right",
                  fontStyle: "italic",
                }}
              >
                {
                  getPartyName(party).replace("- Nouveau Front Populaire", "") // cf commentaire dans le composant PartyVignette
                }
              </small>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const blueskyBlue = "#0085ff"
