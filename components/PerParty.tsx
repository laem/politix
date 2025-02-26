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

export default function PerParty(
  { entries, blueskyEntries, mastodonEntries, givenParty },
) {
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

  const activePerParty = (memo, [id, next]) => {
    const { groupeAbrev, activité, analyseDate } = next

    const isActive = activité && hasRecentTweets(activité, analyseDate)

    return { ...memo, [groupeAbrev]: [...(memo[groupeAbrev] || []), isActive] }
  }

  const activeAllParty = (partialSum, [id, next]) => {
    const { groupeAbrev, activité, analyseDate } = next

    const isActive = activité && hasRecentTweets(activité, analyseDate)

    return partialSum + isActive
  }

  const statsPerParty = ([party, results]) => [
    party,
    results.length,
    Math.round((results.filter(Boolean).length / results.length) * 100),
  ]

  const blueskyAllParty = blueskyEntries.reduce(activeAllParty, 0)
  const blueskyAllPartyTotal = blueskyEntries.length

  const blueskyPerParty = blueskyEntries.reduce(activePerParty, {})

  const blueskyStats = Object.entries(blueskyPerParty)
    .map(statsPerParty)
    .sort(([, , a], [, , b]) => -a + b)

  //console.log({ blueskyStats, blueskyPerParty })

  const mastodonAllParty = mastodonEntries.reduce(activeAllParty, 0)
  const mastodonAllPartyTotal = mastodonEntries.length
  console.log(mastodonAllParty, mastodonAllPartyTotal)

  const mastodonPerParty = mastodonEntries.reduce(activePerParty, {})

  const mastodonStats = Object.entries(mastodonPerParty)
    .map(statsPerParty)
    .sort(([, , a], [, , b]) => -a + b)

  //console.log({ mastodonStats, mastodonPerParty })

  const groupeBar = ([groupeAbrev, count]) => {
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

    const mastodonStatsLine = mastodonStats.find(
      ([party2]) => party === party2,
    )
    const [, mastodonTotal, mastodonPercentActive] = mastodonStatsLine || [
      null,
      0,
      députésRandomOrder.filter(
        ({ groupeAbrev }) => groupeAbrev === party,
      ).length,
    ]

    console.log(
      party,
      blueskyTotal,
      `${blueskyPercentActive}%`,
      mastodonTotal,
      `${mastodonPercentActive}%`,
    )
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
                percentActive: mastodonPercentActive,
                total: mastodonTotal,
                background: mastodonPurple,
                suffix: "",
                logo: "mastodon.svg",
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
  }

  return (
    givenParty
      ? (
        <div
          style={{ listStyleType: "none", maxWidth: "50rem", margin: "0 auto" }}
        >
          {groupeBar([givenParty, partiesCount[givenParty]])}
        </div>
      )
      : (
        <div>
          <p style={{ textAlign: "center", color: "#980c0c" }}>
            La dernière analyse X date du 12 février 2025 : nous avons testé
            {" "}
            {entries.length} députés grâce aux données{" "}
            <a href="https://datan.fr">datan</a> améliorées.
          </p>
          <p style={{ textAlign: "center", color: "darkBlue" }}>
            Concernant Bluesky, nous prenons le premier compte trouvé avec la
            recherche "prénom nom".
          </p>
          <div
            style={{
              maxWidth: "50rem",
              margin: "2rem auto",
              "padding-left": "110px",
            }}
          >
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
                  percentActive: (blueskyAllParty / blueskyAllPartyTotal * 100)
                    .toFixed(1),
                  total: blueskyAllPartyTotal,
                  background: blueskyBlue,
                  suffix: "",
                  logo: "bluesky.svg",
                }}
              />
              <Bar
                {...{
                  percentActive:
                    (mastodonAllParty / mastodonAllPartyTotal * 100).toFixed(1),
                  total: mastodonAllPartyTotal,
                  background: mastodonPurple,
                  suffix: "",
                  logo: "mastodon.svg",
                }}
              />
              <Bar
                {...{
                  percentActive: (topPartiesEntries.reduce(
                    (partialSum, [, a]) => partialSum + a,
                    0,
                  ) / firstPartyCount) * 100,
                  text: `${
                    topPartiesEntries.reduce((partialSum, [, a]) =>
                      partialSum + a, 0)
                  } députés`,
                  background: "#eee",
                  color: "#333",
                }}
              />
              <small
                style={{
                  color: "#bbb",
                  lineHeight: ".8rem",
                  textAlign: "right",
                  fontStyle: "italic",
                }}
              >
                Assemblée nationale
              </small>
            </div>
          </div>
          <h3 style={{ margin: "2rem 0 1rem", ...centerStyle }}>
            Décompte par groupe parlementaire
          </h3>
          <ul
            style={{
              listStyleType: "none",
              maxWidth: "50rem",
              margin: "0 auto",
            }}
          >
            {topPartiesEntries.map(groupeBar)}
          </ul>
        </div>
      )
  )
}

export const blueskyBlue = "#0085ff"
export const mastodonPurple = "#563acc" // "#2f0c7a" // https://joinmastodon.org/branding
