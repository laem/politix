import { PageProps } from "$fresh/server.ts"
import ResultsEurope from "../../../components/ResultsEurope.tsx"
import BackToHome from "../../../components/BackToHome.tsx"

export default function GreetPage(props: PageProps) {
  let { party } = props.params
  party = party.replaceAll("-", "/")
  return (
    <main>
      <BackToHome />
      <ResultsEurope givenParty={party} />
    </main>
  )
}
