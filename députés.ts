import { parse } from "jsr:@std/csv"

const csv = Deno.readTextFileSync("data/députés-datan-25-12-2024.csv")

const députésRaw = parse(csv, {
  skipFirstRow: true,
  strip: true,
})

const députésRandomOrder = députésRaw
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)

export default députésRandomOrder
