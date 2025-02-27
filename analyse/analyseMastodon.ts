import députésRandomOrder from "../députés.ts"
import {
  findMastodonAccount,
  logResultMastodon,
} from "./findMastodonAccount.ts"

const analyseDate = new Date().toISOString().split("T")[0]
const analyseMastodon = async () => {
  const extract = députésRandomOrder
  const results = await Promise.all(
    extract.map(async (député, i) => {
      const result = await findMastodonAccount(député, i)
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
