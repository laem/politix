import data from './data.json' with { type: "json" }

export const daysSpan = 7
const threeDaysSpan = daysSpan * 24 * 60 * 60 * 1000

//"lastDate": "2024-12-26",
export const updateDate = data['lastDate']

const baseStamp = new Date(updateDate).getTime()

export const hasRecentTweets = (dateStrings) => {
  const dates = dateStrings.map((date) => new Date(date))

  const recentTweets = dates.map(
    (date) => date.getTime() > baseStamp - threeDaysSpan
  )
  console.log(recentTweets)
  const hasRecentTweets = recentTweets.filter(Boolean).length > 0
  return hasRecentTweets
}
export const filterRecentTweets = (dateStrings) => {
  const dates = dateStrings.map((date) => new Date(date))

  const recentTweets = dates.filter(
    (date) => date.getTime() > baseStamp - threeDaysSpan
  )
  return recentTweets

}
