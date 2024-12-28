import Bar from '../Bar.tsx'
import { hasRecentTweets, updateDate } from '../date-utils.ts'
import députésRandomOrder from '../députés.ts'
import {
  PartyVignette,
  centerStyle,
  findDéputé,
  getPartyName,
} from './Results.tsx'

export default function PerParty({ entries, blueskyEntries }) {
  const perParty = entries.reduce((memo, [at, dates]) => {
    const active = hasRecentTweets(dates)
    const député = findDéputé(at)
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
    const { groupeAbrev, activité } = next

    const isActive = activité && hasRecentTweets(activité)

    return { ...memo, [groupeAbrev]: [...(memo[groupeAbrev] || []), isActive] }
  }, {})
  const blueskyStats = Object.entries(blueskyPerParty)
    .map(([party, results]) => [
      party,
      results.length,
      Math.round((results.filter(Boolean).length / results.length) * 100),
    ])
    .sort(([, , a], [, , b]) => -a + b)

  return (
    <div>
      <p style={{ textAlign: 'center', color: '#980c0c' }}>
        L'analyse de X est en cours : nous avons testé {entries.length} députés
        à la date du {updateDate} grâce aux données{' '}
        <a href="https://datan.fr">datan</a>.
      </p>
      <p style={{ textAlign: 'center', color: 'darkBlue' }}>
        Concernant Bluesky, nous prenons le premier compte trouvé avec la
        recherche "prénom nom".
      </p>
      <h3 style={{ margin: '2rem 0 1rem', ...centerStyle }}>
        Résumé par parti
      </h3>
      <ul
        style={{ listStyleType: 'none', maxWidth: '50rem', margin: '0 auto' }}
      >
        {stats.map(([party, total, percentActive]) => {
          const blueskyStatsLine = blueskyStats.find(
            ([party2]) => party === party2
          )
          const [, blueskyTotal, blueskyPercentActive] = blueskyStatsLine || [
            null,
            0,
            députésRandomOrder.filter(
              ({ groupeAbrev }) => groupeAbrev === party
            ).length,
          ]
          return (
            <li
              key={party}
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '.6rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '.4rem',
                }}
              >
                <div style={{ width: '5rem', marginRight: '0rem' }}>
                  <PartyVignette party={party} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '80%',
                    gap: '.4rem',
                  }}
                >
                  <Bar {...{ percentActive, total, background: 'crimson' }} />
                  <Bar
                    {...{
                      percentActive: blueskyPercentActive,
                      total: blueskyTotal,
                      background: blueskyBlue,
                      suffix: '',
                    }}
                  />
                </div>
              </div>
              <small style={{ color: '#bbb', lineHeight: '.8rem' }}>
                {getPartyName(party)}
              </small>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const blueskyBlue = '#0085ff'
