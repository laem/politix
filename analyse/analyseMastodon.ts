import députésRandomOrder from "../députés.ts"
import {
  findMastodonAccount,
  logResultMastodon,
} from "./findMastodonAccount.ts"

const falsePositives = {
  PA841825: ["technotrotteur@mastodon.social"],
  PA793362: [
    "jose_eduardo@mastodon.social",
    "toshioxgnu@fosstodon.org",
    "ProfeJoseRivera@mas.to",
    "jzavala@vis.social",
    "rastamaldita@universeodon.com ",
  ],
  PA795386: ["blablamlefevre@mastodon.social"],
  PA722142: ["francois_ruffin@social.jesuislibre.net"],
  PA841495: ["maximeamblard@sciences.re"],
  PA609332: ["olivierfaure@mastodon.social", "Olyfort@mastodon.social"],
  PA793102: ["christian_1955_11_16@piaille.fr"],
  PA712015: ["Ju708@piaille.fr"],
  PA267780: ["agnesfirmin@mastodon.socialspill.com"],
  PA793262: ["Alex@toot.community"],
  PA720614: ["MarineLePen@mastodon.xyz"],
}

const analyseDate = new Date().toISOString().split("T")[0]
const analyseMastodon = async () => {
  const extract = députésRandomOrder
  const results = await Promise.all(
    extract.map(async (député, i) => {
      const result = await findMastodonAccount(député, i, falsePositives)
      logResultMastodon(result)
      return result
    }),
  )

  const entries = results.map(([député, activity]) => {
    const { nom, prenom, groupe, masto, groupeAbrev } = député

    return [
      député.id,
      {
        nom,
        prenom,
        groupeAbrev,
        masto: masto || null,
        activité: activity,
        analyseDate,
      },
    ]
  })

  const o = Object.fromEntries(entries)
  Deno.writeTextFileSync(
    "data/mastodon-data.json",
    JSON.stringify(o, null, 2),
  )
}

analyseMastodon()
