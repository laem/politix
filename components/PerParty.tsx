import { hasRecentTweets } from '../date-utils.ts'
import { PartyVignette, findDéputé } from './Results.tsx'
import { partyColors } from './couleurs-assemblée.ts'

export default function PerParty({ entries }) {
  const perParty = entries.reduce((memo, [at, dates]) => {
    console.log('pour', at)
    const active = hasRecentTweets(dates)
    const député = findDéputé(at)
    const { prenom, nom, groupe, groupeAbrev, twitter } = député
    return { ...memo, [groupeAbrev]: [...(memo[groupeAbrev] || []), active] }
  }, {})
  console.log('yoyo', perParty)
  const stats = Object.entries(perParty)
    .map(([party, results]) => [
      party,
      results.length,
      Math.round((results.filter(Boolean).length / results.length) * 100),
    ])
    .sort(([, , a], [, , b]) => -a + b)
  return (
    <div>
      <h3>Résumé par parti</h3>
      <ul style={{ listStyleType: 'none' }}>
        {stats.map(([party, total, percentActive]) => (
          <li
            key={party}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '.4rem',
            }}
          >
            <div style={{ width: '5rem', marginRight: '0rem' }}>
              <PartyVignette party={party} />
            </div>
            <div style={{ width: '80%' }}>
              <div
                style={{
                  width: percentActive + '%',
                  background: 'crimson',
                  borderRadius: '.2rem',
                  paddingLeft: '.2rem',
                  color: percentActive < 5 ? 'black' : 'white',
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{ marginLeft: '.4rem' }}>
                  {percentActive}&nbsp;%{' '}
                  <small style={{ color: '#ff9aae' }}>
                    ({Math.round(percentActive * total)} / {total})
                  </small>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
