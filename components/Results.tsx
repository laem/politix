const alreadyDone = JSON.parse(Deno.readTextFileSync("data.json") || "{}")
import bluesky from "../bluesky-data.json" with { type: "json" }
import { hasRecentTweets } from "../date-utils.ts"
import députésRandomOrder from "../députés.ts"
import { activeOnBluesky, onBluesky } from "../utils.ts"
import PerParty, { blueskyBlue } from "./PerParty.tsx"
import { findContrastedTextColor, partyColors } from "./couleurs-assemblée.ts"

const députés = députésRandomOrder

export const findDéputé = (id) => députés.find((député) => député.id === id)

const entries = Object.entries(alreadyDone)

console.log("Nombre de députés analysés pour X : ", entries.length)

const blueskyEntries = Object.entries(bluesky)

export const centerStyle = { textAlign: "center" }

const filteredDéputés = (party) =>
  party ? députés.filter((député) => député.groupeAbrev === party) : députés

export default function Results({ givenParty = null }) {
  return (
    <section>
      <h2 style={{ ...centerStyle, marginTop: "1rem" }}>Les députés</h2>
      {!givenParty &&
        <PerParty entries={entries} blueskyEntries={blueskyEntries} />}

      <h3 style={centerStyle}>
        {givenParty ? `Liste pour le parti ${givenParty}` : `Liste complète`}
      </h3>
      <a href="/bluesky" style={{ "float": "right", marginRight: "1rem" }}>
        Voir les députés sur Bluesky
      </a>
      <ul
        style={politixGridStyle}
      >
        {filteredDéputés(givenParty).map((député) => {
          const xTested = entries.find(([id, data]) =>
            data["@"] === député.twitter
          )
          const dates = xTested && xTested[1].activité
          const at = député.twitter
          const isActiveOnBluesky = activeOnBluesky(député.id)

          const result = dates && Array.isArray(dates) &&
            hasRecentTweets(dates, xTested[1]["analyseDate"])
          const notTested = !xTested
          const { prenom, nom, groupe, groupeAbrev, twitter } = député
          return (
            <li
              key={at}
              style={politixStyle(at, result, isActiveOnBluesky)}
            >
              <div style={{ maxWidth: "100%" }}>
                <div style={{ whiteSpace: "nowrap", overflow: "scroll" }}>
                  {prenom} {nom}
                </div>
              </div>
              <PartyVignette party={groupeAbrev} small={true} />
              <div>
                <small style={{ color: "#f1a8b7" }}>
                  X {twitter || ": non présent"}
                </small>
              </div>
              <div>
                {result
                  ? (
                    <div>
                      <details>
                        <summary>Actif sur X</summary>
                        <ol>
                          {dates.map((date, i) => (
                            <li key={date + i}>{date}</li>
                          ))}
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
    </section>
  )
}

export const PartyVignette = ({ party, small }) => {
  const partyColor = partyColors[party] || "chartreuse",
    partyTextColor = findContrastedTextColor(partyColor, true)
  const group = getPartyName(party)
  const simpleParty = party.replace("-NFP", "") // Les gens ne comprennent pas pourquoi seul LFI a NFP dans son nom, et ça créée une vignette de parti 2x plus grosse que les autres
  return (
    <a href={`/parti/${party}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: partyColor,
          borderRadius: ".4rem",
          padding: small ? "0 .2rem" : ".4rem .2rem",
          width: "4rem",

          textAlign: "center",
          color: partyTextColor,
          fontSize: small ? "100%" : "130%",
          border: "2px solid white",
        }}
        title={group}
      >
        {simpleParty}
      </div>
    </a>
  )
}
export const BlueskyHandle = ({ député, invert = true, at, avatar }) => {
  const handle = at || (député && onBluesky(député.id)[1].bsky)

  return (
    <a
      href={`https://bsky.app/profile/${handle}`}
      style={{
        color: "white",
      }}
    >
      <img
        src={"/bluesky.svg"}
        style={{
          width: "1rem",
          height: "auto",
          filter: invert ? "grayscale(1) invert(1) brightness(100)" : "none",
          display: "inline",
          marginRight: ".2rem",
              verticalAlign: "middle",
        }}
        width="10"
        height="10"
        alt="Logo Bluesky"
      />
      {avatar &&
        (
          <img
            src={avatar}
            style={{
              width: "1.4rem",
							border: "2px solid white",
              height: "auto",
              borderRadius: "1rem",
              display: "inline",
              verticalAlign: "middle",
              margin: "0 .3rem 0 .1rem",
            }}
          />
        )}
      {handle.replace(".bsky.social", "")}
    </a>
  )
}

export const getPartyName = (party) => {
  const fullName = députés.find(
    ({ groupeAbrev, groupe }) => groupeAbrev === party,
  ).groupe
  return fullName
}

export const politixGridStyle = {
  display: "grid",
  gridAutoColumns: "12rem",
  gridTemplateColumns: "repeat(auto-fill, 12rem)",
  alignItems: "baseline",
  gap: "1rem",
  marginTop: "2rem",
  paddingLeft: "1rem",
}

export const xColor = "#4c0815"
export const politixStyle = (at, result, isActiveOnBluesky) => ({
  listStyleType: "none",
  width: "12rem",
  minHeight: "8.5rem",
  background: result ? xColor : isActiveOnBluesky ? blueskyBlue : "transparent",
  border: (result && !isActiveOnBluesky)
    ? ("3px solid " + xColor)
    : isActiveOnBluesky
    ? `4px solid ${blueskyBlue}`
    : "3px solid lightgray",
  color: (result || isActiveOnBluesky) ? "white" : "black",
  borderRadius: ".4rem",
  padding: "0 .4rem",
})
