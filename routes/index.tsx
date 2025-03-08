import { blueskyBlue, mastodonPurple } from "../components/PerParty.tsx"
import Results, { xColor } from "../components/Results.tsx"
import { daysSpan } from "../date-utils.ts"

export default function Home() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 .4rem",
      }}
    >
      <header
        style={{
          maxWidth: "12rem",
          background: "crimson",
          color: "white",
          borderRadius: ".6rem 2rem",
          margin: "1rem auto 3rem",
          padding: "2rem",
        }}
      >
        <div style={{ fontSize: "500%", textAlign: "center", width: "100%" }}>
          &#128530;
        </div>
        <h1
          style={{
            filter: "drop-shadow(0 0 0.75rem #000)",
          }}
        >
          Politi
          <span
            style={{
              color: "black",
              filter: "drop-shadow(0 0 0.75rem #fff)",
            }}
          >
            X
          </span>
        </h1>
      </header>
      <p style={{ maxWidth: "40rem", margin: "0 auto" }}>
        Découvrez qui sont les <em>politix</em>, ces élus de la République
        <br />
        <Em background={xColor}>qui sont actifs sur X</Em> dans les {daysSpan}
        {" "}
        derniers jours.
      </p>
      <p style={{ maxWidth: "40rem", margin: "0 auto" }}>
        Découvrez aussi ceux{" "}
        <Em background={blueskyBlue}>qui sont actifs sur Bluesky</Em>{" "}
        <Em background={mastodonPurple}>ou sur Mastodon</Em>.
      </p>
      <p
        style={{
          textAlign: "right",
        }}
      >
        <small
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <span>
            <img
              src={"/git.svg"}
              style={{
                width: "1rem",
                height: "1rem",
                filter: "grayscale(1) invert(0)",
                display: "inline",
                marginRight: ".2rem",
                verticalAlign: "middle",
              }}
              width="10"
              height="10"
              alt="Logo Git"
            />

            <a
              href="https://github.com/laem/politix"
              style={{
                textDecoration: "none",
              }}
            >
              Code source
            </a>
          </span>
          <span>
            👤{" "}
            <a
              href="https://kont.me"
              style={{
                textDecoration: "none",
              }}
            >
              Par Maël
            </a>
          </span>
          <span>
            <img
              src="/bluesky.svg"
              width="10"
              height="10"
              style={{ width: "1rem", height: "auto", display: "inline" }}
              alt="Logo de Bluesky"
            />{" "}
            <a
              href="https://bsky.app/profile/mael.kont.me"
              style={{
                textDecoration: "none",
              }}
            >
              Suivre sur Bluesky
            </a>
          </span>
          <span>
            <img
              src="/mastodon.svg"
              width="10"
              height="10"
              style={{ width: "1rem", height: "auto", display: "inline" }}
              alt="Logo de Mastodon"
            />{" "}
            <a
              href="https://piaille.fr/@viango"
              style={{
                textDecoration: "none",
              }}
            >
              Suivre sur Mastodon (Viango)
            </a>
          </span>
        </small>
      </p>
      <nav style={{ margin: "1rem auto", maxWidth: "22rem" }}>
        <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {menuEntries.map(([href, text]) => <Li {...{ href, text }} />)}
        </ul>
      </nav>
    </div>
  )
}

const Li = ({ href, text }) => (
  <li
    key={href}
    style={{
      maxWidth: "16rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      listStyleType: "none",
      position: "relative",
      fontSize: "13O%",
    }}
  >
    <a
      href={"/" + href}
      style={{
        height: "5rem",
        padding: "1rem",
        background: "#fffafb",
        color: "#4c0815",
        textDecoration: "none",
        border: "2px solid crimson",
        borderRadius: ".6rem",
        boxShadow: "rgba(0, 0, 0, 0.25) 0px 1px 2px",
      }}
    >
      {text}
    </a>
    {href === "fr" && (
      <div
        style={{
          position: "absolute",
          left: "-1.7rem",
          top: "-.1rem",
          transform: "rotate(-25deg)",
          background: "crimson",
          color: "white",
          borderRadius: ".2rem",
          padding: "0 .4rem",
        }}
      >
        Bonus
      </div>
    )}
  </li>
)
const menuEntries = [
  ["gouvernement", "Le gouvernement"],
  ["parlement", "Le parlement"],
  ["fr", "Le top des comptes Bluesky 🇫🇷"],
]

const Em = ({ background, children }) => (
  <em
    style={{
      background,
      padding: "0 .2rem",
      color: "white",
      whiteSpace: "nowrap",
      borderRadius: ".2rem",
    }}
  >
    {children}
  </em>
)
