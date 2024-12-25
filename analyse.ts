import { scrape } from 'jsr:@panha/scrape/'
import { parse, stringify } from 'jsr:@std/csv'
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const alreadyDone = JSON.parse(Deno.readTextFileSync('data.json') || '{}')

const doneEntries = Object.entries(alreadyDone)
console.log(`Déjà ${doneEntries.length} comptes de députés vérifiés`)

import { launch } from 'jsr:@astral/astral'

const csv = Deno.readTextFileSync('députés-datan-25-12-2024.csv')

const députésRaw = parse(csv, {
  skipFirstRow: true,
  strip: true,
})

const députés = députésRaw.map((d) => {
  if (!d.twitter) return d
  const match = d.twitter.match(/x\.com\/(.+)$/)
  if (match) return { ...d, twitter: '@' + match[1] }
  return d
})

const hasTwitter = députés.filter((d) => d.twitter && d.twitter !== ''),
  hasNotLength = députés.length - hasTwitter.length

console.log(hasTwitter.length, hasNotLength, députés.length)

const bridés = hasTwitter
  .filter((d) => !doneEntries.find(([at]) => at === d.twitter))
  .slice(0, 10)

const atList = [...bridés.map((d) => d.twitter)]

const doFetch = async () => {
  const entries = await Promise.all(
    atList.map((at, i) => checkAt(at, i * 12000))
  )
  const o = Object.fromEntries(entries)
  Deno.writeTextFileSync(
    './data.json',
    JSON.stringify({ ...alreadyDone, ...o })
  )
  return console.log("Voilà c'est analysé dans ./data.json")
}

/* 
const ws =
  'ws://127.0.0.1:1337/devtools/browser/e82185e6-f90d-4da1-9a67-0a8445f82b85'

const browser = await launch({
  wsEndpoint: ws,
  headless: false,
})
await delay(25000 / 10)
*/

const checkAt = async (at, ms) => {
  await delay(ms)
  if (!at.startsWith('@') && at.length < 2)
    throw new Error('Problème dans le pseudo ' + at + '.')

  const netAt = at.slice(1)
  console.log('Lancement du scraping pour ', netAt)

  //const url = 'https://xcancel.com/' + netAt
  //const url = 'https://x.com/' + netAt
  const url = 'https://nitter.poast.org/' + netAt
  //const url = 'https://cartes.app/blog'
  console.log('will' + url)

  /* 
  const page = await browser.newPage(url)
  await delay(2000)
  // Run code in the context of the browser
  const value = await page.locator('small').evaluateAll((el) => el.textContent)
  console.log('sq', value)

  // Close connection
  //await browser.close()

  /*
  const browser = await launch()
  const page = await browser.newPage(url)
  await page.waitForNetworkIdle({ idleConnections: 0, idleTime: 10000 })

  // Take a screenshot of the page and save that to disk
  const screenshot = await page.screenshot()
  browser.close()
  Deno.writeFileSync('./screenshot' + at + '.png', screenshot)
  console.log('written')
  */

  let scraper = null

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
