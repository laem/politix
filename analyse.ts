import { scrape } from 'jsr:@panha/scrape/'
import { delay } from './utils.ts'
import { launch } from 'jsr:@astral/astral'
import députésRandomOrder from './députés.ts'

const alreadyDone = JSON.parse(Deno.readTextFileSync('data.json') || '{}')

const deleted = [
  '@JCGrelier',
  '@AndyKerbrat2022',
  '@Peioizate',
  '@stephan1Rambaud',
  '@AnnaigLeMeur_AN',
]

const doneEntries = Object.entries(alreadyDone)
console.log(`Déjà ${doneEntries.length} comptes de députés vérifiés`)

const députés = députésRandomOrder.map((d) => {
  if (!d.twitter) return d
  const match = d.twitter.match(/x\.com\/(.+)$/)
  if (match) return { ...d, twitter: '@' + match[1] }
  return d
})

const hasTwitter = députés.filter((d) => d.twitter && d.twitter !== ''),
  hasNotLength = députés.length - hasTwitter.length

console.log(hasTwitter.length, hasNotLength, députés.length)

const bridés = hasTwitter
  .filter(
    (d) =>
      !(
        deleted.includes(d.twitter) ||
        doneEntries.find(([at]) => at === d.twitter)
      )
  )
  .slice(0, 200)

const atList = [...bridés.map((d) => d.twitter)]

const doFetch = async () => {
  const entries = await Promise.all(
    atList.map((at, i) => checkTwitterActivity(at, i))
  )

  const o = Object.fromEntries(entries.filter(Boolean))

  const lastDate = new Date().toISOString().split('T')[0]
  Deno.writeTextFileSync(
    './data.json',
    JSON.stringify({
      ...alreadyDone,
      ...o,
      lastDate,
    })
  )
  return console.log("Voilà c'est analysé dans ./data.json")
}

const ws =
  'ws://127.0.0.1:1337/devtools/browser/e82185e6-f90d-4da1-9a67-0a8445f82b85'

const browser = await launch({
  wsEndpoint: ws,
  headless: false,
})
await delay(30000 / 1)

const checkTwitterActivity = async (at, i) => {
  await delay(i * 20000)
  if (!at.startsWith('@') && at.length < 2)
    throw new Error('Problème dans le pseudo ' + at + '.')

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

      return Array.from(html.matchAll(/datetime="(\d\d\d\d-\d\d-\d\d)T/g)).map(
        (match) => match[1]
      )
    })
    console.log(values)
    if (values.length < 2)
      throw new Error(
        "Pas assez de tweets trouvés, c'est suspect ! Investiguer " + at
      )

    return [at, values]
  } catch (e) {
    console.log('Erreur pour ' + at)
    return false
  }

  return
  try {
    // Wait for 1 second or wait for an <h1> element to appear
    scraper = await scrape(url, {
      //waitForElement: 'date',
      waitFor: 10000,
    })

    console.log('Succès du scraping pour ', at)
    Deno.writeTextFileSync(
      './html-' + netAt + '.html',
      `<html>${scraper.html('html')}</html`
    )

    const innerHTMLList = scraper.html('.tweet-date')
    if (innerHTMLList.length < 3)
      throw new Error(
        "Pas assez de tweets trouvés, c'est suspect ! Investiguer " + at
      )
    console.log('inner', innerHTMLList)
    const dates = innerHTMLList.map(dateFromAttr)
    /* 
    //"2024-12-24T10:52:26.000Z"
    const dates = result.map((date) => new Date(date))
	*/

    const nowStamp = new Date().getTime()
    const threeDaysSpan = 3 * 24 * 60 * 60 * 1000

    const recentTweets = dates.map(
      (date) => date.getTime() > nowStamp - threeDaysSpan
    )
    const hasRecentTweets = recentTweets.filter(Boolean).length > 0

    return [at, hasRecentTweets]
  } catch (e) {
    if (!scraper) return console.log(e, 'Problème de scrap') || [at, 'error']
    console.log('Voir le fichier HTML créé pour ' + at)
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
