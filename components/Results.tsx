const alreadyDone = JSON.parse(Deno.readTextFileSync('data.json') || '{}')
import bluesky from '../bluesky-data.json' with {type: "json"}
import {hasRecentTweets} from '../date-utils.ts'
import députésRandomOrder from '../députés.ts'
import {activeOnBluesky, onBluesky} from '../utils.ts'
import PerParty, {blueskyBlue} from './PerParty.tsx'
import {findContrastedTextColor, partyColors} from './couleurs-assemblée.ts'

const députés = députésRandomOrder

export const findDéputé = (at) =>
  députés.find((député) => député.twitter === at)

const entries = Object.entries(alreadyDone).filter(([at]) => at !== 'lastDate')

const blueskyEntries = Object.entries(bluesky)

export const centerStyle = { textAlign: 'center' }

const filteredDéputés = party => party ?  députés.filter(député => député.groupeAbrev ===party) : députés

export default function Results({givenParty=null}) {
  return (
    <section>
      <h2 style={{...centerStyle, marginTop: '1rem'}}>Les députés</h2>
		  {!givenParty && 
      <PerParty entries={entries} blueskyEntries={blueskyEntries} />
		  }

      <h3 style={centerStyle}>{givenParty ? `Liste pour le parti ${givenParty}` : `Liste complète`}</h3>
		  <a href="/bluesky" style={{"float": "right", marginRight: '1rem'}}>Voir les députés sur Bluesky</a>
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
        {filteredDéputés(givenParty).map((député) => {
const xTested =  entries.find(([at])=>at===député.twitter)
const dates = xTested && xTested[1]
const at = député.twitter
const isActiveOnBluesky = activeOnBluesky(député.id)

          const result = dates &&  hasRecentTweets(dates)
          const { prenom, nom, groupe, groupeAbrev, twitter } = député
          return (
            <li
              key={at}
              style={{
                listStyleType: 'none',
                width: '12rem',
                minHeight: '8.5rem',
                background: result ? 'crimson' : isActiveOnBluesky ? blueskyBlue : 'transparent',
                border: result ? '3px solid crimson' : (at ? '3px solid crimson' : ( isActiveOnBluesky ? `3px solid ${blueskyBlue}` : '3px solid lightgray')),
                color: (result ||isActiveOnBluesky) ? 'white' : 'black',
                borderRadius: '.4rem',
                padding: '0 .4rem',
              }}
            >
              <div style={{ maxWidth: '100%' }}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'scroll' }}>
                  {prenom} {nom}
                </div>
              </div>
              <PartyVignette party={groupeAbrev} />
              <div>
                <small style={{ color: '#f1a8b7' }}>X {twitter || ': non présent'}</small>
              </div>
              <div>
                {result ? (
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
                ) : (
                  'Non actif sur X'
                )}
              </div>
				  <div>{isActiveOnBluesky ? 
						  <div>
						  <small style={{whiteSpace: 'nowrap'}}><BlueskyHandle député={député}/></small>
                    <details>
                      <summary>Actif sur Bluesky</summary>
                      <ol>
                        {isActiveOnBluesky[1].activité.map((date, i) => (
                          <li key={date + i}>{date}</li>
                        ))}
                      </ol>
                    </details>
						  </div>

						  : 'Non actif sur Bluesky'}</div>
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
		  <a href={`/parti/${party}`}
		  style={{textDecoration: 'none'}}
		  >
    <div
      style={{
        background: partyColor,
        borderRadius: '.4rem',
        padding: '0 .2rem',
        width: 'fit-content',
        color: partyTextColor,
					  border: '2px solid white'
      }}
      title={group}
    >
      {party}
    </div>
		  </a>
  )
}
export const BlueskyHandle = ({député, invert=true})=>{

const isOnBluesky = onBluesky(député.id)

		return<a href={`https://bsky.app/profile/${isOnBluesky[1].bsky}`}><img src={'/bluesky.svg'} style={{width: '1rem', height: 'auto', filter:  invert ? 'grayscale(1) invert(1) brightness(100)' : 'none', display: 'inline', marginRight: '.2rem'}} width="10" height="10" alt="Logo Bluesky"/>{isOnBluesky[1].bsky.replace('.bsky.social', '')}</a>}

export const getPartyName = (party) => {
  const fullName = députés.find(
    ({ groupeAbrev, groupe }) => groupeAbrev === party
  ).groupe
  return fullName
}
