import removeAccents from "npm:remove-accents"
import { filterRecentTweets } from "../date-utils.ts"
import { delay } from "../utils.ts"

export const logResultBluesky = ([député, activity]) => {
  const { nom, prenom, groupe, bsky } = député
  console.log(`On recherche ${prenom} ${nom}`)
  console.log(`-- de ${groupe}`)
  if (!activity) console.log(`Introuvable ou inactif`)
  else {
    console.log(`Trouvé : ${bsky}`)
    console.log(`Activité`, activity)
  }
}
const falsePositives = {
  PA841825: ["patricemartin50.bsky.social"],
  PA793262: ["onesque.bsky.social"],
  PA793362: ["williamjo.se"],
  PA720614: ["mlpcdn.bsky.social"],
  PA817203: ["lauremiller.bsky.social"],
  PA793102: ["tristanhylare.bsky.social"],
  PA841833: ["davidguerin.bsky.social"],
}

export const findBlueskyAccount = async (politix, i) => {
  await delay(i * 300)
  const { nom, prenom } = politix
  console.log(`Will analyse ${prenom} ${nom} ${i}`)

  const url =
    `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${prenom} ${nom}`
  const request = await fetch(url)
  const json = await request.json()

  //console.log(json)
  const actor = json.actors.find(({ displayName: name, handle, avatar }) => {
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

    console.log("HANDLE", handle)
    if (
      falsePositives[politix.id] &&
      falsePositives[politix.id].includes(handle)
    ) {
      return false
    }
    return true // We're expecting the bluesky search algo to return the right account as the first
  })
  if (!actor) return [politix, null]
  if (
    actor.labels &&
    actor.labels.find((label) => label.val === "impersonation")
  ) {
    return [politix, null]
  }

  const at = actor.handle

  const postsRequest = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${at}`,
  )

  const posts = await postsRequest.json()

  if (!posts?.feed) return [politix, null]
  //console.log(posts.feed)
  const activity = posts.feed.map(({ post }) =>
    post.record ? post.record.createdAt.split("T")[0] : null
  )

  const recent = filterRecentTweets(activity)
    .slice(0, 5)
    .map((date) => date.toISOString().split("T")[0])
  return [{ ...politix, bsky: at, avatar: actor.avatar }, recent]
}
