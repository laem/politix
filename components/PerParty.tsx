import { hasRecentTweets, updateDate } from '../date-utils.ts'
import {
  PartyVignette,
  centerStyle,
  findDéputé,
  getPartyName,
} from './Results.tsx'
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
      <p style={{ textAlign: 'center', color: '#980c0c' }}>
        L'analyse est en cours : nous avons pour l'instant testé{' '}
        {entries.length} députés à la date du {updateDate}.
      </p>
      <h3 style={{ margin: '2rem 0 1rem', ...centerStyle }}>
        Résumé par parti
      </h3>
      <ul
        style={{ listStyleType: 'none', maxWidth: '50rem', margin: '0 auto' }}
      >
        {stats.map(([party, total, percentActive]) => (
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
                    <small style={{ color: '#f8b8c5' }}>
                      ({Math.round((percentActive / 100) * total)} / {total}{' '}
                      testés)
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <small style={{ color: '#bbb', lineHeight: '.8rem' }}>
              {getPartyName(party)}
            </small>
          </li>
        ))}
      </ul>
    </div>
  )
}
