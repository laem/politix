import removeAccents from "npm:remove-accents"
import { filterRecentTweets } from "./date-utils.ts"
import { delay } from "./utils.ts"

export const logResultMastodon = ([député, activity]) => {
  const { nom, prenom, groupe, masto } = député
  console.log(`On recherche ${prenom} ${nom} -- de ${groupe}`)
  if (!activity) console.log(`Introuvable ou inactif`)
  else {
    console.log(`Trouvé : ${masto}`)
    console.log(`Activité`, activity)
  }
}
const falsePositives = {
  PA841825: ["technotrotteur@mastodon.social"],
  PA793362: ["jose_eduardo@mastodon.social"],
  PA795386: ["blablamlefevre@mastodon.social"],
  PA722142: ["francois_ruffin@social.jesuislibre.net"],
}

export const findMastodonAccount = async (politix, i) => {
  await delay(i * 1000)
  const { nom, prenom } = politix
  console.log(`Will analyse ${prenom} ${nom} ${i}`)

  const url = `https://piaille.fr/api/v1/accounts/search?q=${prenom} ${nom}`
  const request = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer ???", // need here a Mastodon account
    },
  })
  const json = await request.json()
  if (json.error) console.log(json.error)

  if (json.length > 0) console.log(json[0].acct)
  const actor = json.find(({ display_name: name, acct, avatar, id }) => {
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
      acct.includes("peertube") || // As Mastodon is in the Fediverse, account could be in another social media
      acct.includes("@respublicae.eu") || // Mirror of offical account
      acct.includes("@rss-parrot.net") // Clémentine Autain : clementine-autain.fr@rss-parrot.net
    ) {
      return false
    }

    console.log("ACCOUNT", acct)
    if (
      falsePositives[politix.id] &&
      falsePositives[politix.id].includes(acct)
    ) {
      return false
    }
    return true // We're expecting the Mastodon search algo to return the right account as the first
  })
  if (!actor) return [politix, null]

  if (actor.acct.search("@") == -1) {
    actor.acct += "@piaille.fr"
  }

  const postsRequest = await fetch(
    `https://piaille.fr/api/v1/accounts/${actor.id}/statuses?limit=5`,
  )

  const posts = await postsRequest.json()

  //console.log(posts)
  const activity = posts.map((post) =>
    (post.edited_at ? post.edited_at : post.created_at).split("T")[0]
  )

  const recent = filterRecentTweets(activity)
    .slice(0, 5)
    .map((date) => date.toISOString().split("T")[0])
  return [{ ...politix, masto: actor.acct, avatar: actor.avatar }, recent]
}
