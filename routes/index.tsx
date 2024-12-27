import { useSignal } from '@preact/signals'
import Counter from '../islands/Counter.tsx'
import Results from '../components/Results.tsx'
import { daysSpan } from '../date-utils.ts'

export default function Home() {
  const count = useSignal(3)
  return (
    <div class="px-4 py-8 mx-auto ">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <header
          style={{
            background: 'crimson',
            borderRadius: '.6rem 2rem',
            marginBottom: '3rem',
            padding: '2rem',
          }}
        >
          <div style={{ fontSize: '500%', textAlign: 'center', width: '100%' }}>
            😒
          </div>
          <h1 class="text-4xl font-bold">PolitiX</h1>
        </header>
        <p>
          Découvrez la liste des <em>politix</em>, ces élus de la République qui
          utilisaient encore activement leur compte X dans les {daysSpan}{' '}
          derniers jours.
        </p>
        <Results />
      </div>
    </div>
  )
}
