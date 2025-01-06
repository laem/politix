import { parse } from 'jsr:@std/csv'

const csv = Deno.readTextFileSync('députés-datan-25-12-2024.csv')

const députésRaw0 = parse(csv, {
  skipFirstRow: true,
  strip: true,
})

const députésRandomOrder = députésRaw0
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)

export default députésRandomOrder
