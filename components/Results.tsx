const alreadyDone = JSON.parse(Deno.readTextFileSync("data/data.json") || "{}")
import bluesky from "../data/bluesky-data.json" with { type: "json" }
import mastodon from "../data/mastodon-data.json" with { type: "json" }
import { hasRecentTweets } from "../date-utils.ts"
import députésRandomOrder from "../députés.ts"
import {
  activeOnBluesky,
  activeOnMastodon,
  onBluesky,
  onMastodon,
} from "../utils.ts"
import PerParty, { blueskyBlue, mastodonPurple } from "./PerParty.tsx"
import { findContrastedTextColor, partyColors } from "./couleurs-assemblée.ts"

const députés = députésRandomOrder

export const findDéputé = (id) => députés.find((député) => député.id === id)

const entries = Object.entries(alreadyDone)

console.log("Nombre de députés analysés pour X : ", entries.length)

const blueskyEntries = Object.entries(bluesky)
const mastodonEntries = Object.entries(mastodon)

export const centerStyle = { textAlign: "center" }

const filteredDéputés = (party) =>
  party ? députés.filter((député) => député.groupeAbrev === party) : députés

export default function Results({ givenParty = null }) {
  return (
    <section>
      <h2 style={{ ...centerStyle, marginTop: "1rem" }}>Les députés</h2>
      <PerParty
        entries={entries}
        blueskyEntries={blueskyEntries}
        mastodonEntries={mastodonEntries}
        givenParty={givenParty}
      />

      <h3 style={centerStyle}>
        {givenParty ? `Liste pour le parti ${givenParty}` : `Liste complète`}
      </h3>
      <ul id="PoliticianGrid">
        {filteredDéputés(givenParty).map((député) => {
          const xTested = entries.find(([id, data]) =>
            data["@"] === député.twitter
          )
          const dates = xTested && xTested[1].activité
          const isActiveOnBluesky = activeOnBluesky(député.id)
          const isActiveOnMastodon = activeOnMastodon(député.id)

          const at = (isActiveOnBluesky && onBluesky(député.id)[1].bsky) ||
            (isActiveOnMastodon && onMastodon(député.id)[1].masto) ||
            député.twitter ||
            député.nom + député.prenom // the key attribute must always be different
          // console.log(at)

          const result = dates && Array.isArray(dates) &&
            hasRecentTweets(dates, xTested[1]["analyseDate"])
          const isActive = Boolean(
            result || isActiveOnBluesky || isActiveOnMastodon,
          )
          const notTested = !xTested
          const { prenom, nom, groupe, groupeAbrev, twitter } = député
          return (
            <li
              key={at}
              class="politicianBox"
              style={politixStyle(
                result,
                isActiveOnBluesky,
                isActiveOnMastodon,
              )}
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
                  : "Non actif sur X"}
              </div>
              <div>
                {isActiveOnBluesky
                  ? (
                    <div>
                      <small style={{ whiteSpace: "nowrap" }}>
                        <BlueskyHandle député={député} isActive={isActive} />
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
                  : onBluesky(député.id)
                  ? (
                    <div>
                      <BlueskyHandle
                        invert={false}
                        député={député}
                        isActive={isActive}
                      />
                      <br />
                      Non actif sur Bluesky
                    </div>
                  )
                  : "Non présent sur Bluesky"}
              </div>
              <div>
                {isActiveOnMastodon
                  ? (
                    <div>
                      <small style={{ whiteSpace: "nowrap" }}>
                        <MastodonHandle député={député} isActive={isActive} />
                      </small>
                      <details>
                        <summary>Actif sur Mastodon</summary>
                        <ol>
                          {isActiveOnMastodon[1].activité.map((date, i) => (
                            <li key={date + i}>{date}</li>
                          ))}
                        </ol>
                      </details>
                    </div>
                  )
                  : onMastodon(député.id)
                  ? (
                    <div>
                      <MastodonHandle député={député} isActive={isActive} />
                      <br />
                      Non actif sur Mastodon
                    </div>
                  )
                  : "Non présent sur Mastodon"}
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
    <a
      href={`/parti/${party}`}
      style={{ textDecoration: "none", fontSize: small ? "100%" : "130%" }}
    >
      <span
        class="partySticker"
        style={{
          background: partyColor,
          padding: small ? "0 .3rem" : ".4rem .6rem",
          color: partyTextColor,
        }}
        title={group}
      >
        {simpleParty}
      </span>
    </a>
  )
}
export const BlueskyHandle = (
  { député, invert = true, avatar, at, isActive },
) => {
  const handle = at || (député && onBluesky(député.id)[1].bsky)

  return (
    <a
      href={`https://bsky.app/profile/${handle}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: isActive ? "white" : "black",
      }}
    >
      <img
        src="/bluesky.svg"
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

export const MastodonHandle = (
  { député, avatar, isActive, breakline = true },
) => {
  const acct = député && onMastodon(député.id)[1].masto
  const [username, server] = acct.split("@")

  return (
    <a
      href={`https://${server}/@${username}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: isActive ? "white" : "black",
      }}
    >
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
      {username}
      {breakline ? <br /> : ""}
      {`@${server}`}
    </a>
  )
}

export const getPartyName = (party) => {
  const fullName = députés.find(
    ({ groupeAbrev, groupe }) => groupeAbrev === party,
  ).groupe
  return fullName
}

export const xColor = "#4c0815"
export const politixStyle = (result, isActiveOnBluesky, isActiveOnMastodon) => {
  const isActive = Boolean(
    result || isActiveOnBluesky || isActiveOnMastodon,
  )
  return ({
    background: result
      ? xColor
      : (isActiveOnBluesky && isActiveOnMastodon)
      ? `linear-gradient(to right bottom, ${blueskyBlue} 0%, ${blueskyBlue} 50%, ${mastodonPurple} 50%, ${mastodonPurple} 100%)`
      : isActiveOnBluesky
      ? blueskyBlue
      : isActiveOnMastodon
      ? mastodonPurple
      : "transparent",
    border: (result && !isActiveOnBluesky && !isActiveOnMastodon)
      ? ("3px solid " + xColor)
      : isActiveOnBluesky
      ? `4px solid ${blueskyBlue}`
      : isActiveOnMastodon
      ? `4px solid ${mastodonPurple}`
      : "3px solid lightgray",
    color: isActive ? "white" : "black",
  })
}
