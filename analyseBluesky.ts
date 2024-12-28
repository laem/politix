import { filterRecentTweets, hasRecentTweets } from './date-utils.ts'
import députésRandomOrder from './députés.ts'

const analyseBluesky = async () => {
  const extract = députésRandomOrder.slice(0, 10)
  const results = await Promise.all(
    extract.map((député) => findBlueskyAccount(député))
  )

  results.forEach(([député, activity]) => {
    const { nom, prenom, groupe, bsky } = député
    console.log(`On recherche ${prenom} ${nom}`)
    console.log(`-- de ${groupe}`)
    if (!activity) console.log(`Introuvable ou inactif`)
    else {
      console.log(`Trouvé : ${bsky}`)
      console.log(`Activité`, activity)
    }
  })
  const entries = results.map(([député, activity]) => {
    const { nom, prenom, groupe, bsky, groupeAbrev } = député

    return [
      député.id,
      { nom, prenom, groupeAbrev, bsky: bsky || null, activité: activity },
    ]
  })

  const o = Object.fromEntries(entries)
  Deno.writeTextFileSync('./bluesky-data.json', JSON.stringify(o, null, 2))
}

const findBlueskyAccount = async (député) => {
  const { nom, prenom, groupe } = député

  const request = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${prenom} ${nom}`
  )
  const json = await request.json()

  //console.log(json)
  const actor = json.actors[0] // We're expecting the bluesky search algo to return the right account as the first
  if (!actor) return [député, null]
  if (
    actor.labels &&
    actor.labels.find((label) => label.val === 'impersonation')
  )
    return [député, null]

  const at = actor.handle

  const postsRequest = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${at}`
  )

  const posts = await postsRequest.json()

  if (!posts?.feed) return [député, null]
  //console.log(posts.feed)
  const activity = posts.feed.map(({ post }) =>
    post.record ? post.record.createdAt.split('T')[0] : null
  )

  const recent = filterRecentTweets(activity)
    .slice(0, 5)
    .map((date) => date.toISOString().split('T')[0])
  return [{ ...député, bsky: at }, recent]
}

analyseBluesky()
