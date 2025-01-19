import { launch } from 'jsr:@astral/astral'
import députésRandomOrder from './députés.ts'
import { arrayToChunks, delay } from './utils.ts'
import { analyseDate } from './date-utils.ts'

const limit = +Deno.args[0]
const initialDelay = +Deno.args[1] || 30
const iterationDelay = +Deno.args[2] || 20

const seconds = limit * iterationDelay + initialDelay,
  minutes = seconds / 60
console.log('Will take ' + seconds + ' seconds, donc ' + minutes)

const députés = députésRandomOrder.map((d) => {
  if (!d.twitter) return d
  const match = d.twitter.match(/x\.com\/(.+)$/)
  if (match) return { ...d, twitter: '@' + match[1] }
  return d
})
const chunkSize = 3

const doFetch = async () => {
  const chunks = arrayToChunks(députés, chunkSize)

  await Promise.all(
    chunks.map(async (chunk, chunkIndex) => {
      await delay(chunkIndex * (iterationDelay + 1) * 1000 * chunkSize)
      let alreadyDone

      try {
        alreadyDone = JSON.parse(Deno.readTextFileSync('data.json') || '{}')
      } catch (e) {
        alreadyDone = {}
      }

      const doneEntries = Object.entries(alreadyDone)
      console.log(`Déjà ${doneEntries.length} comptes de députés vérifiés`)

      const todo = chunk
        /* Instead of filtering the deleted accounts, we'll save the status of the account in the data.json file to store raw data, and potentially correct the source @ in députés-*
         */
        .filter(
          (d) =>
            !doneEntries.find(
              ([id, { analyseDate: doneAnalyseDate }]) =>
                id === d.id && doneAnalyseDate === analyseDate
            )
        )
        .slice(0, limit)

      const entries = await Promise.all(
        todo.map(async (député, i) => {
          const { nom, prenom, groupeAbrev, twitter: at } = député
          if (!at || at === '') {
            return [
              député.id,
              {
                nom,
                analyseDate,
                prenom,
                groupeAbrev,
                unknownPresence: true,
              },
            ]
          }
          const [, values] = await checkTwitterActivity(député.twitter, i)

          return [
            député.id,
            {
              nom,
              prenom,
              analyseDate,
              groupeAbrev,
              '@': député.twitter || null,
              deletedAccount: values === '!exist',
              notFoundAccount: !values,
              activité: values,
            },
          ]
        })
      )

      const o = Object.fromEntries(entries)

      write({
        ...alreadyDone,
        ...o,
      })
    })
  )

  return console.log("Voilà c'est analysé dans ./data.json")
}

const write = (data) => {
  Deno.writeTextFileSync('./data.json', JSON.stringify(data, null, 2))
  console.log('File written with ' + Object.keys(data).length + ' data points')
}

const ws =
  'ws://127.0.0.1:1337/devtools/browser/e82185e6-f90d-4da1-9a67-0a8445f82b85'

const browser = await launch({
  wsEndpoint: ws,
  headless: false,
})

await delay(initialDelay * 1000)

const checkTwitterActivity = async (at, i) => {
  await delay(i * iterationDelay * 1000)
  if (!at.startsWith('@') && at.length < 2) {
    throw new Error('Problème dans le pseudo ' + at + '.')
  }

  const netAt = at.slice(1)
  console.log('Lancement du scraping pour ', netAt)

  //const url = 'https://xcancel.com/' + netAt
  const url = 'https://x.com/' + netAt
  //const url = 'https://nitter.poast.org/' + netAt
  //const url = 'https://cartes.app/blog'
  console.log('will' + url + ' ' + i)

  try {
    const page = await browser.newPage(url)
    await delay(3000)
    // Run code in the context of the browser
    // Run code in the context of the browser
    const values = await page.evaluate(() => {
      const html = document.body.innerHTML

      if (html.includes('This account doesn’t exist')) {
        return '!exist'
      }

      return Array.from(html.matchAll(/datetime="(\d\d\d\d-\d\d-\d\d)T/g)).map(
        (match) => match[1]
      )
    })

    console.log(values)
    if (values !== '!exist' && values.length < 2) {
      throw new Error(
        "Pas assez de tweets trouvés, c'est suspect ! Investiguer " + at
      )
    }

    return [at, values]
  } catch (e) {
    console.log('Erreur pour ' + at, e)
    return [at, false]
  }
}

//<a href="/JeromeGuedj/status/1630575199975243776#m" title="Feb 28, 2023 · 2:26 PM UTC">28 Feb 2023</a>
const regex = /title="([A-Z][a-z][a-z]) (\d+), (\d\d\d\d)/
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const dateFromAttr = (str) => {
  const match = str.match(regex)

  if (match) {
    const month = match[1]
    const day = match[2]
    const year = match[3]
    //    console.log(`Day: ${day}, Month: ${month}, Year: ${year}`)

    const monthIndex = monthNames.indexOf(month)
    const date = new Date(year, monthIndex, day)
    return date
  } else {
    console.log('No match found')
    return null
  }
}

doFetch()
