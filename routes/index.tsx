import { blueskyBlue } from '../components/PerParty.tsx'
import Results from '../components/Results.tsx'
import { daysSpan } from '../date-utils.ts'

export default function Home() {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
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
      <p style={{ maxWidth: '40rem', margin: '0 auto' }}>
        Découvrez qui sont les <em>politix</em>, ces élus de la République
        <br />
        <Em background={'crimson'}>qui sont actifs sur X</Em> dans les{' '}
        {daysSpan} derniers jours.
      </p>
      <p style={{ maxWidth: '40rem', margin: '0 auto' }}>
        Découvrez aussi ceux{' '}
        <Em background={blueskyBlue}>qui sont actifs sur Bluesky</Em>.
      </p>
      <Results />
    </div>
  )
}

const Em = ({ background, children }) => (
  <em
    style={{
      background,
      padding: '0 .2rem',
      color: 'white',
      whiteSpace: 'nowrap',
      borderRadius: '.2rem',
    }}
  >
    {children}
  </em>
)
