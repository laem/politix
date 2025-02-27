import removeAccents from "npm:remove-accents"
import { filterRecentTweets } from "../date-utils.ts"
import { delay } from "../utils.ts"

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
  PA793362: [
    "jose_eduardo@mastodon.social",
    "toshioxgnu@fosstodon.org",
    "ProfeJoseRivera@mas.to",
  ],
  PA795386: ["blablamlefevre@mastodon.social"],
  PA722142: ["francois_ruffin@social.jesuislibre.net"],
  PA841495: ["maximeamblard@sciences.re"],
  PA609332: ["olivierfaure@mastodon.social"],
  PA793102: ["christian_1955_11_16@piaille.fr"],
  PA712015: ["Ju708@piaille.fr"],
  PA267780: ["agnesfirmin@mastodon.socialspill.com"],
  PA793262: ["Alex@toot.community"],
}

const serversOutOfMastodon = [
  "peertube", // video platform in the Fediverse
  "@respublicae.eu", // Mirror of X account
  "birdsite", // Idem
  "brid.gy", // Bridge of Bluesky account
  "@rss-parrot.net", // Clémentine Autain : clementine-autain.fr@rss-parrot.net
  "@kilogram.makeup", // Mirror of Instagram account
]

let headers
if (Deno.env.has("MASTODON_TOKEN")) {
  headers = {
    Authorization: `Bearer ${Deno.env.get("MASTODON_TOKEN")}`, // need here a Mastodon account
  }
} else {
  headers = {}
}

export const findMastodonAccount = async (politix, i) => {
  // An account token allows to make more requests whitout error
  if (headers === {}) {
    await delay(i * 5000)
  } else {
    await delay(i * 1000)
  }
  const { nom, prenom } = politix
  console.log(`Will analyse ${prenom} ${nom} ${i}`)

  const url =
    `https://piaille.fr/api/v2/search?q=${prenom} ${nom}&type=accounts`
  const request = await fetch(url, { method: "GET", headers: headers })
  const json = await request.json()
  if (json.error) console.log(json.error)

  // if (json.length > 0) console.log(json[0].acct)
  const actor = json.accounts.find(
    ({ display_name: name, acct, avatar, id }) => {
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

      if (serversOutOfMastodon.find((server) => acct.includes(server))) {
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
    },
  )
  if (!actor) return [politix, null]

  if (actor.acct.search("@") == -1) {
    actor.acct += "@piaille.fr"
  }

  const postsRequest = await fetch(
    `https://piaille.fr/api/v1/accounts/${actor.id}/statuses?limit=5`,
    { method: "GET" },
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
