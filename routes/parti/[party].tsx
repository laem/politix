import { PageProps } from '$fresh/server.ts'
import Results from '../../components/Results.tsx'

export default function GreetPage(props: PageProps) {
  const { party } = props.params
  return <Results givenParty={party} />
}
