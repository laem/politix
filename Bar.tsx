export default function Bar({
  percentActive,
  total,
  background,
  suffix = "testés",
  text,
  color,
  logo,
}) {
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
          width: (percentActive != null ? percentActive : 100) + "%",
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
                ({Math.round((percentActive / 100) * total)} / {total} {suffix})
              </small>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
