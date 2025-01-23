import top from "../../bluesky-top-actors-fr.json" with { type: "json" }
import { Head } from "$fresh/runtime.ts"
import BackToHome from "../../components/BackToHome.tsx"

const title = "Le Top Bluesky francophone"
const description =
  `Les plus gros comptes francophones actifs récemment sur Bluesky.`

const { sorted, dates } = top
export default function Top() {
  return (
    <main style={{ maxWidth: "40rem", margin: "1rem auto" }}>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={description}
          key="description"
        />
        <meta
          property="og:image"
          content="https://politix.top/fr.png"
          key="og:image"
        />
      </Head>
      <BackToHome />
      <header
        style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}
      >
        <span style={{ fontSize: "200%" }}>🥇</span>
        <h1>{title}</h1>
      </header>
      <p>
        Méthodologie : on surveille les skeets les plus populaires dans les
        derniers jours, et on trie leur auteurs par leur nombre d'abonnés. Les
        voici.
      </p>
      <br />
      <p>
        👉️ C'est donc un mélange entre les plus gros comptes actifs, et les
        petits comptes qui ont percé récemment.
      </p>
      <br />
		  <p style={{
							  textAlign: 'right'

		  }}>
            <a
              href={"https://bsky.app/intent/compose?text="+ encodeURIComponent(`Oh le top Bluesky francophone ! 

					  cc @mael.kont.me`)}
		  target="_blank"
              style={{
                textDecoration: 'none',
              }}
            >
            <img
              src="/bluesky.svg"
              width="10"
              height="10"
              style={{ width: '1rem', height: 'auto', display: 'inline' }}
              alt="Logo de Bluesky"
            />{' '}
              Partager sur Bluesky
            </a>

		  </p>
      <Dates />

      <br />
      <List />
    </main>
  )
}

const List = () => (
  <ol>
    {Object.entries(sorted).map(([handle, count], n) => (
      <li style={liStyle(n)} key={handle}>
        <span>
          {handle.replace(".bsky.social", "")}
          {handle.endsWith("bsky.social") && (
            <span style={{ color: "lightgray" }}>{".bsky.social"}</span>
          )}
        </span>{" "}
        <span title={count + " abonnés"}>{Math.round(count / 1000)}k</span>
      </li>
    ))}
  </ol>
)

const liStyle = (n) => ({
  display: "flex",
  justifyContent: "space-between",
  background: n % 2 ? "white" : "#fbf9ee",
  margin: ".2rem 0",
  padding: "0 .4rem",
})

const Dates = () => {
  const range = dates.sort((a, b) => new Date(a) - new Date(b))

  return (
    <div>
      <em>Du {range[0]} au {range[range.length - 1]}</em>
    </div>
  )
}
