import { useId } from 'react'

const HEART =
  'M50 86C22 66 4 50 4 28 4 14 15 4 28 4c10 0 18 5 22 13 4-8 12-13 22-13 13 0 24 10 24 24 0 22-18 38-46 58z'

// Ngôi sao 4 cánh lấp lánh
const SPARKLE = 'M0-6C.6-1.2 1.2-.6 6 0 1.2.6.6 1.2 0 6-.6 1.2-1.2.6-6 0-1.2-.6-.6-1.2 0-6z'

export default function GlowHeart({ intense = false }: { intense?: boolean }) {
  const id = useId().replace(/:/g, '')

  return (
    <div className={`glow-heart${intense ? ' is-intense' : ''}`}>
      <span className="glow-heart__halo" />
      <span className="glow-heart__halo glow-heart__halo--outer" />

      <svg className="glow-heart__orbit" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="94" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.1 9" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(236,213,162,0.25)" strokeWidth="0.6" />
        {[
          [100, 6, 1.1],
          [181, 120, 0.8],
          [36, 168, 0.9],
          [22, 62, 0.6],
        ].map(([x, y, s], i) => (
          <path key={i} d={SPARKLE} transform={`translate(${x} ${y}) scale(${s})`} fill="#f6e8c8" />
        ))}
        <defs>
          <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e8c8" />
            <stop offset="0.5" stopColor="#c39a52" stopOpacity="0.4" />
            <stop offset="1" stopColor="#f6e8c8" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="glow-heart__svg" viewBox="-6 -6 112 102" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-fill`} cx="38%" cy="30%" r="80%">
            <stop offset="0" stopColor="#ffe3ea" />
            <stop offset="0.35" stopColor="#f3aec0" />
            <stop offset="0.75" stopColor="#c23c63" />
            <stop offset="1" stopColor="#7f1f3e" />
          </radialGradient>
          <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e8c8" />
            <stop offset="0.45" stopColor="#c39a52" />
            <stop offset="1" stopColor="#ecd5a2" />
          </linearGradient>
          <radialGradient id={`${id}-shine`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={HEART} transform="translate(50 45) scale(1.1) translate(-50 -45)" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="0.8" opacity="0.8" />
        <path d={HEART} fill={`url(#${id}-fill)`} />
        <path d={HEART} fill="none" stroke={`url(#${id}-gold)`} strokeWidth="1.2" />
        <ellipse cx="30" cy="24" rx="13" ry="8" transform="rotate(-28 30 24)" fill={`url(#${id}-shine)`} />
        <path d={SPARKLE} transform="translate(70 22) scale(0.7)" fill="#fff" opacity="0.9" />
      </svg>
    </div>
  )
}
