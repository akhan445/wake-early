import { useMemo } from 'react'

// Slow, living background for each section. Sleep draws its own stars.
export default function Backdrop({ tab }) {
  const bubbles = useMemo(
    () => Array.from({ length: 18 }, () => ({ left: Math.random() * 100, size: 8 + Math.random() * 28, dur: 22 + Math.random() * 26, delay: -Math.random() * 40 })),
    [],
  )
  const orbs = useMemo(
    () => Array.from({ length: 6 }, () => ({ left: Math.random() * 90, top: Math.random() * 90, size: 120 + Math.random() * 160, dur: 9 + Math.random() * 8 })),
    [],
  )

  if (tab === 'coffee')
    return (
      <div className="backdrop">
        <div className="swirl" style={{ left: -160, top: 120 }} />
        <div className="swirl" style={{ right: -220, top: 480, animationDirection: 'reverse' }} />
        {bubbles.map((b, i) => (
          <i key={i} className="bubble" style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
        ))}
      </div>
    )
  if (tab === 'alarm')
    return (
      <div className="backdrop">
        <div className="sun" />
        {[0, 1, 2].map((i) => (
          <i key={i} className="bird" style={{ top: `${14 + i * 7}%`, animationDuration: `${26 + i * 9}s`, animationDelay: `${-i * 8}s` }} />
        ))}
      </div>
    )
  if (tab === 'home')
    return (
      <div className="backdrop">
        {orbs.map((o, i) => (
          <i key={i} className="orb" style={{ left: `${o.left}%`, top: `${o.top}%`, width: o.size, height: o.size, animationDuration: `${o.dur}s` }} />
        ))}
      </div>
    )
  return null
}
