import removeAccents from "npm:remove-accents"
import { filterRecentTweets } from "../date-utils.ts"
import { delay } from "../utils.ts"

export const logResultMastodon = ([député, activity]) => {
  const { nom, prenom, groupe, masto, politicalGroup } = député
  console.log(`On recherche ${prenom} ${nom} -- de ${groupe || politicalGroup}`)
  if (!activity) console.log(`Introuvable ou inactif`)
  else {
    console.log(`Trouvé : ${masto}`)
    console.log(`Activité`, activity)
  }
}

const serversOutOfMastodon = [
  "peertube", // video platform in the Fediverse
  "pixelfed", // image sharing social network of the Fediverse
  "@respublicae.eu", // Mirror of X account
  "birdsite", // Idem
  "brid.gy", // Bridge of Bluesky account
  "@rss-parrot.net", // Clémentine Autain : clementine-autain.fr@rss-parrot.net
  "@kilogram.makeup", // Mirror of Instagram account
  "bird.makeup", // Mirror of Twitter account
]

let ownHeaders
if (Deno.env.has("MASTODON_TOKEN")) {
  ownHeaders = {
    Authorization: `Bearer ${Deno.env.get("MASTODON_TOKEN")}`, // need here a Mastodon account
  }
} else {
  ownHeaders = {}
}

const mastoServer = Deno.env.get("MASTODON_SERVER")

export const findMastodonAccount = async (politix, i, falsePositives) => {
  // An account token allows to make more requests whitout error
  if (ownHeaders === {}) {
    await delay(i * 5000)
  } else {
    await delay(i * 1000)
  }
  const { nom, prenom } = politix
  console.log(`Will analyse ${prenom} ${nom} ${i}`)

  let actor = await searchAccountMastodon(
    mastoServer,
    prenom,
    nom,
    politix.id,
    ownHeaders,
    falsePositives,
  )
  if (!actor) {
    actor = await searchAccountMastodon(
      "mastodon.social",
      prenom,
      nom,
      politix.id,
      {},
      falsePositives,
    )
    if (!actor) return [politix, null]
  }

  let actor_server
  if (actor.acct.search("@") == -1) {
    actor.acct += `@${mastoServer}`
    actor_server = mastoServer
  } else {
    try {
      actor_server = actor.acct.split("@")[1]
      const actor2 = await searchAccountMastodon(
        actor_server,
        nom,
        prenom,
        politix.id,
        {},
        falsePositives,
      )
      if (!actor2.id) throw new Error("actor2.id is not defined.")
      if (actor2.acct.includes("@")) {
        throw new Error("actor2 is not on actor_server")
      }
      actor = actor2
      actor.acct += `@${actor_server}`
    } catch (e) {
      actor_server = mastoServer
    }
  }
  console.log("ACCOUNT", actor.acct)

  const postsRequest = await fetch(
    `https://${actor_server}/api/v1/accounts/${actor.id}/statuses?limit=5`,
    { method: "GET" },
  )

  const posts = await postsRequest.json()
  if (posts.error) return [politix, null]

  // console.log(posts)
  const activity = posts.map((post) =>
    (post.edited_at ? post.edited_at : post.created_at).split("T")[0]
  )

  const recent = filterRecentTweets(activity)
    .slice(0, 5)
    .map((date) => date.toISOString().split("T")[0])
  return [{ ...politix, masto: actor.acct, avatar_masto: actor.avatar }, recent]
}

const searchAccountMastodon = async (
  server,
  nom,
  prenom,
  id,
  headers,
  falsePositives,
) => {
  try {
    const url =
      `https://${server}/api/v2/search?q=${prenom} ${nom}&type=accounts`
    const request = await fetch(url, { method: "GET", headers: headers })
    const json = await request.json()
    if (json.error) console.log(json.error)

    // console.log(json)
    const actor = json.accounts.find(
      ({ display_name: name, acct, avatar, bot }) => {
        if (bot) return false

        const nomSansAccents = removeAccents(nom).toLowerCase() // cf mariercd.bsky.social
        const prenomSansAccents = removeAccents(prenom).toLowerCase() // cf mariercd.bsky.social et bothorel.bsky.social
        const nameSansAccents = removeAccents(name).toLowerCase()
        if (acct.search("@") == -1) acct += `@${server}`

        if (
          !nameSansAccents.includes(nomSansAccents) ||
          !nameSansAccents.includes(prenomSansAccents)
        ) {
          //https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=pen%20marine%20le returns Marine Turchi as the first entry, and an irrelevant result as a second
          return false
        }

        if (serversOutOfMastodon.find((server2) => acct.includes(server2))) {
          return false
        }

        if (
          falsePositives[id] &&
          falsePositives[id].includes(acct)
        ) {
          return false
        }
        return true // We're expecting the Mastodon search algo to return the right account as the first
      },
    )
    return actor
  } catch (e) {}
}
