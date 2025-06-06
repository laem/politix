import Bar from "../Bar.tsx"
import { hasRecentTweets } from "../date-utils.ts"
import europeanMembersRandomOrder from "../députésEuropéens.ts"
import {
  centerStyle,
  findDéputé,
  getPartyName,
  PartyVignette,
} from "./ResultsEurope.tsx"

const partiesCount = europeanMembersRandomOrder.reduce((memo, next) => {
  const { groupeAbrev } = next

  return { ...memo, [groupeAbrev]: (memo[groupeAbrev] || 0) + 1 }
}, {})

const topPartiesEntries = Object.entries(partiesCount).sort(
  ([, a], [, b]) => b - a,
)

const totalCount = topPartiesEntries.length,
  firstPartyCount = topPartiesEntries[0][1]

export default function PerPartyEurope({ europeEntries, givenParty }) {
  const activePerParty = (ac) => (memo, [id, next]) => {
    const { groupeAbrev, analyseDate } = next
    const activité = next[ac]

    const isActive = activité && hasRecentTweets(activité, analyseDate)

    return { ...memo, [groupeAbrev]: [...(memo[groupeAbrev] || []), isActive] }
  }

  const activeAllParty = (ac) => (partialSum, [id, next]) => {
    const { groupeAbrev, analyseDate } = next
    const activité = next[ac]

    const isActive = activité && hasRecentTweets(activité, analyseDate)

    return partialSum + isActive
  }

  const statsPerParty = ([party, results]) => [
    party,
    results.length,
    Math.round((results.filter(Boolean).length / results.length) * 100),
  ]

  const blueskyAllParty = europeEntries.reduce(
    activeAllParty("activité_bsky"),
    0,
  )
  const blueskyAllPartyTotal = europeEntries.length

  const blueskyPerParty = europeEntries.reduce(
    activePerParty("activité_bsky"),
    {},
  )

  const blueskyStats = Object.entries(blueskyPerParty)
    .map(statsPerParty)
    .sort(([, , a], [, , b]) => -a + b)

  //console.log({ blueskyStats, blueskyPerParty })

  const mastodonAllParty = europeEntries.reduce(
    activeAllParty("activité_masto"),
    0,
  )
  const mastodonAllPartyTotal = europeEntries.length

  const mastodonPerParty = europeEntries.reduce(
    activePerParty("activité_masto"),
    {},
  )

  const mastodonStats = Object.entries(mastodonPerParty)
    .map(statsPerParty)
    .sort(([, , a], [, , b]) => -a + b)

  //console.log({ mastodonStats, mastodonPerParty })

  const groupeBar = ([groupeAbrev, count]) => {
    const blueskyStatsLine = blueskyStats.find(
      ([party]) => groupeAbrev === party,
    )
    const [, blueskyTotal, blueskyPercentActive] = blueskyStatsLine || [
      null,
      0,
      europeanMembersRandomOrder.filter(
        ({ groupeAbrev }) => groupeAbrev === party,
      ).length,
    ]

    const mastodonStatsLine = mastodonStats.find(
      ([party]) => groupeAbrev === party,
    )
    const [, mastodonTotal, mastodonPercentActive] = mastodonStatsLine || [
      null,
      0,
      europeanMembersRandomOrder.filter(
        ({ groupeAbrev }) => groupeAbrev === party,
      ).length,
    ]

    console.log(
      groupeAbrev,
      blueskyTotal,
      `${blueskyPercentActive}%`,
      mastodonTotal,
      `${mastodonPercentActive}%`,
    )
    return (
      <li
        key={groupeAbrev}
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
          <div
            style={{
              width: "8rem",
              marginRight: "0rem",
              "text-align": "center",
            }}
          >
            <PartyVignette party={groupeAbrev} />
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
        <small class="smallPartyName">
          {getPartyName(groupeAbrev)}
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
          <p style={{ textAlign: "center", color: "darkBlue" }}>
            Concernant Bluesky et Mastodon, nous prenons le premier compte
            trouvé avec la recherche "prénom nom".
          </p>
          <div
            style={{
              maxWidth: "50rem",
              margin: "2rem auto",
              "padding-left": "50px",
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
                    topPartiesEntries.reduce(
                      (partialSum, [, a]) => partialSum + a,
                      0,
                    )
                  } députés`,
                  background: "#eee",
                  color: "#333",
                }}
              />
              <small class="smallPartyName">
                Parlement européen
              </small>
            </div>
          </div>
          <a
            href="/europe/bluesky"
            style={{ "float": "right", marginRight: "1rem" }}
          >
            Voir les députés sur Bluesky &nbsp;
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
          <br />
          <a
            href="/europe/mastodon"
            style={{ "float": "right", marginRight: "1rem" }}
          >
            Voir les députés sur Mastodon &nbsp;
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
