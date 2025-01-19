import bluesky from "./bluesky-data.json" with { type: "json" }
import { hasRecentTweets } from "./date-utils.ts"
const blueskyEntries = Object.entries(bluesky)

export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export const onBluesky = (id) =>
  blueskyEntries.find(([id2, { bsky }]) => id2 === id && bsky)

export const activeOnBluesky = (id) =>
  blueskyEntries.find(([id2, { analyseDate, activité }]) =>
    id2 === id && activité && hasRecentTweets(activité, analyseDate)
  )

export const arrayToChunks = (array, chunkSize=10) => {
  let chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}
