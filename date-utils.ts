export const daysSpan = 7
const threeDaysSpan = daysSpan * 24 * 60 * 60 * 1000

//"analyseDate": "2024-12-26",
export const hasRecentTweets = (dateStrings, analyseDate) => {
  if (!analyseDate) throw new Error("AnalyseDate missing")

  const baseStamp = new Date(analyseDate).getTime()

  const dates = dateStrings.map((date) => new Date(date))

  const recentTweets = dates.map(
    (date) => date.getTime() > baseStamp - threeDaysSpan,
  )
  const hasRecentTweets = recentTweets.filter(Boolean).length > 0
  return hasRecentTweets
}
export const filterRecentTweets = (dateStrings) => {
  const dates = dateStrings.map((date) => new Date(date))

  const baseStamp = new Date().getTime()

  const recentTweets = dates.filter(
    (date) => date.getTime() > baseStamp - threeDaysSpan,
  )
  return recentTweets
}
export const analyseDate = new Date().toISOString().split("T")[0]
