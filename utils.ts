import bluesky from "./data/bluesky-data.json" with { type: "json" }
import mastodon from "./data/mastodon-data.json" with { type: "json" }
import { hasRecentTweets } from "./date-utils.ts"
const blueskyEntries = Object.entries(bluesky)
const mastodonEntries = Object.entries(mastodon)

export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export const onBluesky = (id) =>
  blueskyEntries.find(([id2, { bsky }]) => id2 === id && bsky)

export const activeOnBluesky = (id) =>
  blueskyEntries.find(([id2, { analyseDate, activité }]) =>
    id2 === id && activité && hasRecentTweets(activité, analyseDate)
  )

export const onMastodon = (id) =>
  mastodonEntries.find(([id2, { masto }]) => id2 === id && masto)

export const activeOnMastodon = (id) =>
  mastodonEntries.find(([id2, { analyseDate, activité }]) =>
    id2 === id && activité && hasRecentTweets(activité, analyseDate)
  )

export const arrayToChunks = (array, chunkSize = 10) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}
