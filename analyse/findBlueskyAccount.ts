import removeAccents from "npm:remove-accents"
import { filterRecentTweets } from "../date-utils.ts"
import { delay } from "../utils.ts"

export const logResultBluesky = ([député, activity]) => {
  const { nom, prenom, groupe, bsky, politicalGroup } = député
  // console.log(`On recherche ${prenom} ${nom} -- de ${groupe || politicalGroup}`)
  const groupName = groupe?.replace("- Nouveau Front Populaire", "") || politicalGroup?.replace("- Nouveau Front Populaire", "")

  if (!activity) console.log(`Introuvable ou inactif ${prenom} ${nom} de ${groupName}`)
  else console.log(`Trouvé ${prenom} ${nom} de ${groupName} : ${bsky} avec ${activity.length} messages récents`)
}

export const findBlueskyAccount = async (politix, i, falsePositives) => {
  await delay(i * 300)
  const { nom, prenom } = politix
  console.log(`Will analyse ${prenom} ${nom} ${i} -- de ${politix.groupe || politix.politicalGroup} sur Bluesky`)

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

    if (
      falsePositives &&
      falsePositives[politix.id] &&
      falsePositives[politix.id].includes(handle)
    ) {
      return false
    }

    // console.log("HANDLE", handle)
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
  return [{ ...politix, bsky: at, avatar_bsky: actor.avatar }, recent]
}
