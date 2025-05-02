import europe from "../data/europe-data.json" with { type: "json" }
import { hasRecentTweets } from "../date-utils.ts"
import { europeanMembersRandomOrder } from "../députésEuropéens.ts"
import {
  activeOnBlueskyEurope,
  activeOnMastodonEurope,
  onBlueskyEurope,
  onMastodonEurope,
} from "../utils.ts"
import PerPartyEurope, {
  blueskyBlue,
  mastodonPurple,
} from "./PerPartyEurope.tsx"
import {
  findContrastedTextColor,
  partyEuropeColors,
} from "./couleurs-assemblée.ts"

const députés = europeanMembersRandomOrder

export const findDéputé = (id) => députés.find((député) => député.id === id)

const europeEntries = Object.entries(europe)

export const centerStyle = { textAlign: "center" }

const filteredDéputés = (party) =>
  party ? députés.filter((député) => député.groupeAbrev === party) : députés

export default function ResultsEurope({ givenParty = null }) {
  return (
    <section>
      <h2 style={{ ...centerStyle, marginTop: "1rem" }}>Les eurodéputés</h2>
      <PerPartyEurope
        europeEntries={europeEntries}
        givenParty={givenParty}
      />
      <h3 style={centerStyle}>
        {givenParty ? `Liste pour le parti ${givenParty}` : `Liste complète`}
      </h3>
      <div id="ContainerGrid">
        <div id="PoliticianGrid">
          {filteredDéputés(givenParty).map((député) => {
            const isActiveOnBluesky = activeOnBlueskyEurope(député.id)
            const isActiveOnMastodon = activeOnMastodonEurope(député.id)

            const at =
              (isActiveOnBluesky && onBlueskyEurope(député.id)[1].bsky) ||
              (isActiveOnMastodon && onMastodonEurope(député.id)[1].masto) ||
              député.nom + député.prenom // the key attribute must always be different
            // console.log(at)

            const isActive = Boolean(
              isActiveOnBluesky || isActiveOnMastodon,
            )
            const { prenom, nom, groupeAbrev, country } = député
            return (
              <div
                key={at}
                class="politicianBox"
                style={politixStyle(
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
                {country}
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
                            {isActiveOnBluesky[1].activité_bsky.map((
                              date,
                              i,
                            ) => <li key={date + i}>{date}</li>)}
                          </ol>
                        </details>
                      </div>
                    )
                    : onBlueskyEurope(député.id)
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
                            {isActiveOnMastodon[1].activité_masto.map((
                              date,
                              i,
                            ) => <li key={date + i}>{date}</li>)}
                          </ol>
                        </details>
                      </div>
                    )
                    : onMastodonEurope(député.id)
                    ? (
                      <div>
                        <MastodonHandle député={député} isActive={isActive} />
                        <br />
                        Non actif sur Mastodon
                      </div>
                    )
                    : "Non présent sur Mastodon"}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const PartyVignette = ({ party, small }) => {
  const partyColor = partyEuropeColors[party] || "chartreuse",
    partyTextColor = findContrastedTextColor(partyColor, true)
  const group = getPartyName(party)
  return (
    <a
      href={`/europe/parti/${party.replaceAll("/", "-")}`}
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
        {party}
      </span>
    </a>
  )
}
export const BlueskyHandle = (
  { député, invert = true, avatar, at, isActive },
) => {
  const handle = at || (député && onBlueskyEurope(député.id)[1].bsky)

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
  const acct = député && onMastodonEurope(député.id)[1].masto
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
    ({ groupeAbrev, politicalGroup }) => groupeAbrev === party,
  ).politicalGroup
  return fullName
}

export const xColor = "#4c0815"
export const politixStyle = (isActiveOnBluesky, isActiveOnMastodon) => {
  const isActive = Boolean(
    isActiveOnBluesky || isActiveOnMastodon,
  )
  return ({
    background: (isActiveOnBluesky && isActiveOnMastodon)
      ? `linear-gradient(to right bottom, ${blueskyBlue} 0%, ${blueskyBlue} 50%, ${mastodonPurple} 50%, ${mastodonPurple} 100%)`
      : isActiveOnBluesky
      ? blueskyBlue
      : isActiveOnMastodon
      ? mastodonPurple
      : "transparent",
    border: isActiveOnBluesky
      ? `4px solid ${blueskyBlue}`
      : isActiveOnMastodon
      ? `4px solid ${mastodonPurple}`
      : "3px solid lightgray",
    color: isActive ? "white" : "black",
  })
}
