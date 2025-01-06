export default function OpenBlueskyTabs({ ats }) {
  return (
    <button
      onClick={() =>
        ats.forEach((at, i) =>
          window.open("https://bsky.app/profile/" + at.replace("@", ""), i)
        )}
    >
      Ouvrir les profils dans des onglets
    </button>
  )
}
