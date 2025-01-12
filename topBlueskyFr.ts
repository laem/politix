import { delay } from './utils.ts'

const falsePositives = [
  'labordeliere.bsky.social', // +18 ans, ne skeete que des images donc pas francophone
  'antifapuddinpop.bsky.social', // marked as french but not https://bsky.app/profile/antifapuddinpop.bsky.social/post/3lffmbgxick2x
]

let old

try {
  old = JSON.parse(Deno.readTextFileSync('bluesky-top-actors-fr.json') || '{}')
} catch (e) {
  old = { sorted: {}, dates: [] }
}

const analyse = async () => {
  const url =
    'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=lang:fr&limit=100&sort=top'

  const request = await fetch(url)
  const json = await request.json()

  const dates = new Set(
    json.posts.map((post) => post.record.createdAt.split('T')[0])
  )

  const handles = new Set(json.posts.map((post) => post.author.handle))

  const actorsFollowerCount = await Promise.all(
    [...handles].map(async (handle, i) => {
      await delay(i * 100)
      const request = await fetch(
        `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`
      )
      const json = await request.json()

      const count = json.followersCount

      const result = [handle, count]
      return result
    })
  )

  const totalEntries = {
    ...old.sorted,
    ...Object.fromEntries(actorsFollowerCount),
  }

  const sorted = Object.fromEntries(
    Object.entries(totalEntries)
      .sort(([, a], [, b]) => b - a)
      .filter(([handle]) => !falsePositives.includes(handle))
  )

  /*
  console.log(
    sortedEntries.map(
      ([handle, count]) => handle + ' : ' + Math.round(count / 1000) + 'k'
    )
  )

  console.log(dates)
  */

  const result = {
    sorted,
    dates: [...old.dates, ...[...dates.values()]],
  }

  Deno.writeTextFileSync(
    './bluesky-top-actors-fr.json',
    JSON.stringify(result, null, 2)
  )

  console.log('Fichier écrit')
}

analyse()
