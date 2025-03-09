import {
  europeanMembersRandomOrder,
  groupesAbrevEurope,
} from "../députésEuropéens.ts"
import { findBlueskyAccount, logResultBluesky } from "./findBlueskyAccount.ts"
import {
  findMastodonAccount,
  logResultMastodon,
} from "./findMastodonAccount.ts"

const falsePositivesBluesky = {}
const falsePositivesMastodon = {
  125052: ["astro_jcm@mastodon.online"],
  257131: ["siwa@pol.social"],
  125106: ["bitsgalore@digipres.club", "johanvdw@hachyderm.io"],
  96668: ["nutjob4life@fosstodon.org"],
  256920: ["ileglaz@masto.bike"],
  197780: ["bartgroothuis@mastodon.online"],
  197621: ["euribates@tkz.one"],
}

const analyseDate = new Date().toISOString().split("T")[0]

const analyseEurope = async () => {
  const extract = europeanMembersRandomOrder
  const results = await Promise.all(
    extract.map(async (député, i) => {
      const resultMastodon = await findMastodonAccount(
        député,
        i,
        falsePositivesMastodon,
      )
      logResultMastodon(resultMastodon)
      const resultBluesky = await findBlueskyAccount(
        député,
        0,
        falsePositivesBluesky,
      )
      logResultBluesky(resultBluesky)
      const result = [
        {
          ...resultBluesky[0],
          masto: resultMastodon[0].masto,
          avatar_masto: resultMastodon[0].avatar_masto,
        },
        resultBluesky[1],
        resultMastodon[1],
      ]
      return result
    }),
  )

  const entries = results.map(([député, activity_bsky, activity_masto]) => {
    const {
      nom,
      prenom,
      groupe,
      bsky,
      masto,
      country,
      politicalGroup,
      nationalPoliticalGroup,
    } = député

    return [
      député.id,
      {
        nom,
        prenom,
        bsky: bsky || null,
        masto: masto || null,
        activité_bsky: activity_bsky,
        activité_masto: activity_masto,
        analyseDate,
        country,
        politicalGroup,
        nationalPoliticalGroup,
        groupeAbrev: groupesAbrevEurope[politicalGroup],
      },
    ]
  })

  const o = Object.fromEntries(entries)
  Deno.writeTextFileSync(
    "data/europe-data.json",
    JSON.stringify(o, null, 2),
  )
}

analyseEurope()
