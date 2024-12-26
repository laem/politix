const threeDaysSpan = 3 * 24 * 60 * 60 * 1000

export const hasRecentTweets = (dateStrings) => {
  const dates = dateStrings.map((date) => new Date(date))

  const nowStamp = new Date().getTime()

  const recentTweets = dates.map(
    (date) => date.getTime() > nowStamp - threeDaysSpan
  )
  console.log(recentTweets)
  const hasRecentTweets = recentTweets.filter(Boolean).length > 0
  return hasRecentTweets
}
