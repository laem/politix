import { hasRecentTweets } from '../date-utils.ts'
import { findDéputé } from './Results.tsx'
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
      <ul>
        {stats.map(([party, total, percentActive]) => (
          <li key={party}>
            <span style={{ color: 'white', background: partyColors[party] }}>
              {party}
            </span>{' '}
            : {percentActive} %
          </li>
        ))}
      </ul>
    </div>
  )
}
