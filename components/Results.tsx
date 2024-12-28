const alreadyDone = JSON.parse(Deno.readTextFileSync('data.json') || '{}')
const csv = Deno.readTextFileSync('députés-datan-25-12-2024.csv')
import { parse } from 'jsr:@std/csv'
import { hasRecentTweets } from '../date-utils.ts'
import { findContrastedTextColor, partyColors } from './couleurs-assemblée.ts'
import bluesky from '../bluesky-data.json' with { type: "json" }
import PerParty from './PerParty.tsx'

const députés = parse(csv, {
  skipFirstRow: true,
  strip: true,
})

export const findDéputé = (at) =>
  députés.find((député) => député.twitter === at)
const entries = Object.entries(alreadyDone).filter(([at]) => at !== 'lastDate')

const blueskyEntries = Object.entries(bluesky)

export const centerStyle = { textAlign: 'center' }
export default function Results() {
  return (
    <section>
      <h2 style={{...centerStyle, marginTop: '1rem'}}>Les députés</h2>
      <PerParty entries={entries} blueskyEntries={blueskyEntries} />

      <h3 style={centerStyle}>Liste complète</h3>
      <ul
        style={{
          display: 'grid',
          gridAutoColumns: '12rem',
          gridTemplateColumns: 'repeat(auto-fill, 12rem)',
          alignItems: 'baseline',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        {entries.map(([at, dates]) => {
          const result = hasRecentTweets(dates)
          const député = findDéputé(at)
          if (!député) throw new Error('Député non trouvé ' + at)
          const { prenom, nom, groupe, groupeAbrev, twitter } = député
          return (
            <li
              key={at}
              style={{
                listStyleType: 'none',
                width: '12rem',
                minHeight: '7rem',
                background: result ? 'crimson' : 'transparent',
                border: result ? '1px solid crimson' : '1px solid gray',
                color: result ? 'white' : 'black',
                borderRadius: '.4rem',
                padding: '0 .4rem',
              }}
            >
              <div>
                <small style={{ color: '#f1a8b7' }}>{twitter}</small>
              </div>
              <div style={{ maxWidth: '100%' }}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'scroll' }}>
                  {prenom} {nom}
                </div>
              </div>
              <PartyVignette party={groupeAbrev} />
              <div>
                {result ? (
                  <div>
                    <details>
                      <summary>Actif</summary>
                      <ol>
                        {dates.map((date, i) => (
                          <li key={date + i}>{date}</li>
                        ))}
                      </ol>
                    </details>
                  </div>
                ) : (
                  'Non actif'
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export const PartyVignette = ({ party }) => {
  const partyColor = partyColors[party] || 'chartreuse',
    partyTextColor = findContrastedTextColor(partyColor, true)
  const group = getPartyName(party)
  return (
    <div
      style={{
        background: partyColor,
        borderRadius: '.4rem',
        padding: '0 .2rem',
        width: 'fit-content',
        color: partyTextColor,
      }}
      title={group}
    >
      {party}
    </div>
  )
}

export const getPartyName = (party) => {
  const fullName = députés.find(
    ({ groupeAbrev, groupe }) => groupeAbrev === party
  ).groupe
  return fullName
}
