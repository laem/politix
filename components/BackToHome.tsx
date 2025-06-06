export default function BackToHome({ linkBack = null, textBack = null }) {
  return (linkBack && textBack)
    ? (
      <div style={{ display: "flex", "justify-content": "space-between" }}>
        <a href="/">Revenir à l'accueil</a>
        <a href={linkBack}>{textBack}</a>
      </div>
    )
    : <a href="/">Revenir à l'accueil</a>
}
