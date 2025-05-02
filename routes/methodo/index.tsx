import { Head } from "$fresh/runtime.ts"
import BackToHome from "../../components/BackToHome.tsx"

const title = "Méthodologie"
const description =
  `Description de la méthodologie utilisée pour recueillir les données concernant les réseaux sociaux où sont présents les politiciens.`

export default function Top() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "50rem" }}>
        <Head>
          <title>{title}</title>
          <meta
            name="description"
            content={description}
            key="description"
          />
        </Head>
        <BackToHome />
        <header
          style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}
        >
          <span class="emoji">&#x1F4DD;</span>
          <h1>{title}</h1>
        </header>
        <p>
          Est considéré comme actif un politicien si il a envoyé un message dans
          les 7 derniers jours.
        </p>
        <p>
        </p>
        <p>
          Pour Bluesky et Mastodon, nous considérons que le premier résultat
          retourné par l'API est le compte du politicien recherché. Pour
          Mastodon, nous utilisons le serveur{" "}
          <a href="https://piaille.fr">piaille.fr</a> .
        </p>
        <br />
        Les données viennent de <a href="https://datan.fr">datan.fr</a>{" "}
        pour les députés français et du{" "}
        <a href="https://www.europarl.europa.eu/meps/fr/full-list/all">
          site officel du parlement européen
        </a>{" "}
        pour les eurodéputés.
      </div>
    </main>
  )
}
