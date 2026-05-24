export default function Bar({
  active,
  total,
  background,
  suffix = "testés",
  text,
  color,
  logo,
  digit = 0,
}) {
  const percentActive = ((active / total) * 100).toFixed(digit)

  return (
    <div class="barContainer">
      {logo
        ? (
          <img
            src={`/${logo}`}
            alt={logo}
            style={{ width: "1rem", height: "1rem" }}
          />
        )
        : <div style={{ width: "1rem" }}></div>}
      <div
        class="bar"
        style={{
          width: ((percentActive != null && !isNaN(percentActive)) ? percentActive : 100) + "%",
          background,
        }}
      >
        <div style={{ marginLeft: ".4rem" }}>
          {text ? <small>{text}</small> : (
            <>
              <span
                style={{
                  color: color || (percentActive < 5 ? "black" : "white"),
                }}
              >
                {percentActive}%
              </span>
              &nbsp;
              <small
                style={{
                  opacity: "0.65",
                  color: color || (percentActive < 15 ? "black" : "white"),
                }}
              >
                ({active} / {total} {suffix})
              </small>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
