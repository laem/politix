const alreadyDone = JSON.parse(Deno.readTextFileSync('data.json') || '{}')
const csv = Deno.readTextFileSync('députés-datan-25-12-2024.csv')
import { parse } from 'jsr:@std/csv'
import { hasRecentTweets } from '../date-utils.ts'
const députés = parse(csv, {
  skipFirstRow: true,
  strip: true,
})

const findDéputé = (at) => députés.find((député) => député.twitter === at)

export default function Results() {
  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Les députés</h2>
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          width: '90vw',
          marginTop: '2rem',
        }}
      >
        {Object.entries(alreadyDone)
          .filter(([at]) => at !== 'lastDate')
          .map(([at, dates]) => {
            console.log('DATES', dates)
            const result = hasRecentTweets(dates)
            const député = findDéputé(at)
            const { prenom, nom, groupe, groupeAbrev, twitter } = député
            return (
              <li
                key={at}
                style={{
                  listStyleType: 'none',
                  width: '12rem',
                  height: '7rem',
                  background: result ? 'crimson' : 'transparent',
                  border: result ? '1px solid crimson' : '1px solid gray',
                  color: result ? 'white' : 'black',
                  borderRadius: '.4rem',
                  margin: '.4rem 0',
                  padding: '0 .4rem',
                }}
              >
                <div>
                  <small style={{ color: '#f1a8b7' }}>{twitter}</small>
                </div>
                <div>
                  {prenom} {nom}
                </div>
                <div
                  style={{
                    background: result ? '#333' : '#888',
                    borderRadius: '.4rem',
                    padding: '0 .2rem',
                    width: 'fit-content',
                    color: 'white',
                  }}
                >
                  {groupeAbrev}
                </div>
                <div>
                  {result ? (
                    <div>
                      <details>
                        <summary>Actif</summary>
                        <ol>
                          {dates.map((date) => (
                            <li key={date}>{date}</li>
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
