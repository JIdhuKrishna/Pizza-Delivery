export default function Loader({ fullscreen = true, size = 52 }) {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `3px solid transparent`,
          borderTopColor: '#dc2626',
          borderRightColor: 'rgba(220,38,38,0.25)',
          animation: 'spin 0.85s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: `3px solid transparent`,
          borderBottomColor: '#e11d48',
          borderLeftColor: 'rgba(225,29,72,0.25)',
          animation: 'spin 1.2s linear infinite reverse',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.45,
        }}>🍕</div>
      </div>
      <p style={{ color: '#9ca3af', fontSize: '0.88rem', fontWeight: 500, letterSpacing: '0.5px' }}>
        Loading...
      </p>
    </div>
  )

  if (!fullscreen) return content

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(248,250,252,0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {content}
    </div>
  )
}
