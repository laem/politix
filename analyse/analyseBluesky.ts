import députésRandomOrder from "../députés.ts"
import { findBlueskyAccount, logResultBluesky } from "./findBlueskyAccount.ts"

const falsePositives = {
  PA841825: ["patricemartin50.bsky.social"],
  PA793262: ["onesque.bsky.social"],
  PA793362: [
    "williamjo.se",
    "jose-eduardo.bsky.social", // need to be connected to be seen
  ],
  PA720614: ["mlpcdn.bsky.social", "mlp-jail.bsky.social"],
  PA817203: ["lauremiller.bsky.social"],
  PA793102: ["tristanhylare.bsky.social"],
  PA841833: ["davidguerin.bsky.social"],
  PA842255: ["cbourgonsicard.bsky.social"],
  PA794886: ["sceauphie.bsky.social"],
}

const analyseDate = new Date().toISOString().split("T")[0]
const analyseBluesky = async () => {
  const extract = députésRandomOrder
  const results = await Promise.all(
    extract.map(async (député, i) => {
      const result = await findBlueskyAccount(député, i, falsePositives)
      logResultBluesky(result)
      return result
    }),
  )

  const entries = results.map(([député, activity]) => {
    const { nom, prenom, groupe, bsky, groupeAbrev } = député

    return [
      député.id,
      {
        nom,
        prenom,
        groupeAbrev,
        bsky: bsky || null,
        activité: activity,
        analyseDate,
      },
    ]
  })

  const o = Object.fromEntries(entries)
  Deno.writeTextFileSync(
    "data/bluesky-data.json",
    JSON.stringify(o, null, 2),
  )
}

analyseBluesky()
