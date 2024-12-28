import { delay } from './utils.ts'
import { filterRecentTweets, hasRecentTweets } from './date-utils.ts'
import députésRandomOrder from './députés.ts'
import removeAccents from 'npm:remove-accents'

const falsePositives = { PA841825: ['@patricemartin50.bsky.social'] }

const logResult = ([député, activity]) => {
  const { nom, prenom, groupe, bsky } = député
  console.log(`On recherche ${prenom} ${nom}`)
  console.log(`-- de ${groupe}`)
  if (!activity) console.log(`Introuvable ou inactif`)
  else {
    console.log(`Trouvé : ${bsky}`)
    console.log(`Activité`, activity)
  }
}
const analyseBluesky = async () => {
  const extract = députésRandomOrder
  const results = await Promise.all(
    extract.map(async (député, i) => {
      const result = await findBlueskyAccount(député, i)
      logResult(result)
      return result
    })
  )

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

const findBlueskyAccount = async (député, i) => {
  await delay(i * 300)
  const { nom, prenom, groupe } = député
  console.log(`Will analyse ${prenom} ${nom} ${i}`)

  const request = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${prenom} ${nom}`
  )
  const json = await request.json()

  //console.log(json)
  const actor = json.actors.find(({ displayName: name, handle }) => {
    const nomSansAccents = removeAccents(nom).toLowerCase() // cf mariercd.bsky.social
    const prenomSansAccents = removeAccents(prenom).toLowerCase() // cf mariercd.bsky.social et bothorel.bsky.social
    const nameSansAccents = removeAccents(name).toLowerCase()

    if (
      !nameSansAccents.includes(nomSansAccents) ||
      !nameSansAccents.includes(prenomSansAccents)
    ) {
      //https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=pen%20marine%20le returns Marine Turchi as the first entry, and an irrelevant result as a second
      return false
    }

    if (
      falsePositives[député.id] &&
      falsePositives[député.id].includes(handle)
    ) {
      return false
    }
    return true // We're expecting the bluesky search algo to return the right account as the first
  })
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
