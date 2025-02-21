import { PageProps } from "$fresh/server.ts"
import Results from "../../components/Results.tsx"
import BackToHome from "../../components/BackToHome.tsx"

export default function GreetPage(props: PageProps) {
  const { party } = props.params
  return (
    <main>
      <BackToHome />
      <Results givenParty={party} />
    </main>
  )
}
