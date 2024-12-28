import Results from '../components/Results.tsx'
import { daysSpan } from '../date-utils.ts'

export default function Home() {
  return (
    <div>
      <header
        style={{
          maxWidth: '12rem',
          background: 'crimson',
          color: 'white',
          borderRadius: '.6rem 2rem',
          margin: '1rem auto 3rem',
          padding: '2rem',
        }}
      >
        <div style={{ fontSize: '500%', textAlign: 'center', width: '100%' }}>
          😒
        </div>
        <h1
          style={{
            filter: 'drop-shadow(0 0 0.75rem #000)',
          }}
        >
          Politi
          <span
            style={{
              color: 'black',
              filter: 'drop-shadow(0 0 0.75rem #fff)',
            }}
          >
            X
          </span>
        </h1>
      </header>
      <p>
        Découvrez la liste des <em>politix</em>, ces élus de la République qui
        utilisaient encore activement leur compte X dans les {daysSpan} derniers
        jours.
      </p>
      <Results />
    </div>
  )
}
