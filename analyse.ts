import { scrape } from 'jsr:@panha/scrape/'
import { parse, stringify } from 'jsr:@std/csv'
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

import { launch } from 'jsr:@astral/astral'

const csv = Deno.readTextFileSync('députés-datan-25-12-2024.csv')

const députés = parse(csv, {
  skipFirstRow: true,
  strip: true,
})

const hasTwitter = députés.filter((d) => d.twitter && d.twitter !== '').length,
  hasNot = députés.length - hasTwitter

console.log(hasTwitter, hasNot, députés.length)

const bridés = députés.slice(0, 2)

const atList = [...bridés.map((d) => d.twitter), '@ALeaument']

const doFetch = async () => {
  const entries = await Promise.all(atList.map(checkAt))
  const o = Object.fromEntries(entries)
  Deno.writeTextFileSync('./data.json', JSON.stringify(o))
  return console.log("Voilà c'est analysé dans ./data.json")
}

const checkAt = async (at) => {
  if (!at.startsWith('@') && at.length < 2)
    throw new Error('Problème dans le pseudo ' + at)

  const netAt = at.slice(1)
  console.log('Lancement du scraping pour ', netAt)

  //const url = 'https://xcancel.com/' + netAt
  const url = 'https://x.com/' + netAt
  console.log('will' + url)
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

    const result = scraper.attr('title', '.tweet-date')
    console.log(result)
    //"2024-12-24T10:52:26.000Z"
    const dates = result.map((date) => new Date(date))

    const nowStamp = new Date().getTime()
    const threeDaysSpan = 24 * 60 * 60 * 1000

    const recentTweets = dates.map(
      (date) => date.getTime() > nowStamp - threeDaysSpan
    )
    const hasRecentTweets = recentTweets.filter(Boolean).length > 0

    return [at, hasRecentTweets]
  } catch (e) {
    if (!scraper) return console.log(e, 'Problème de scrap') || [at, 'error']
    console.log(scraper.html('body'))
  }
}

doFetch()
