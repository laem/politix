export default function Bar({
  percentActive,
  total,
  background,
  suffix = 'testés',
}) {
  return (
    <div
      style={{
        width: percentActive + '%',
        background,
        borderRadius: '.2rem',
        paddingLeft: '.2rem',
        color: percentActive < 5 ? 'black' : 'white',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ marginLeft: '.4rem' }}>
        {percentActive}&nbsp;%{' '}
        <small style={{ opacity: '0.65' }}>
          ({Math.round((percentActive / 100) * total)} / {total} {suffix})
        </small>
      </div>
    </div>
  )
}
