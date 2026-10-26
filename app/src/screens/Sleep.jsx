import { useMemo } from 'react'
import { SAMPLE_THIS_WEEK, toHours } from '../data/sampleWeek.js'

// Timeline from 9 pm to 11 am (hours past midnight are shifted by +24).
const START = 21
const END = 35
const shift = (h) => (h < 12 ? h + 24 : h)
const pct = (h) => ((shift(h) - START) / (END - START)) * 100
const dayName = (daysAgo) => new Date(Date.now() - daysAgo * 864e5).toLocaleDateString([], { weekday: 'short' })
const fmt = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}${h < 12 ? 'a' : 'p'}`
}

function Stars() {
  const stars = useMemo(
    () => Array.from({ length: 36 }, () => ({ left: Math.random() * 100, size: 1 + Math.random() * 2.5, dur: 14 + Math.random() * 18, delay: -Math.random() * 30 })),
    [],
  )
  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s, i) => (
        <i key={i} style={{ left: `${s.left}%`, width: s.size, height: s.size, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  )
}

export default function Sleep({ bedTappedAt, onBed, settings }) {
  const bedH = toHours(settings.bed), wakeH = toHours(settings.wake)
  return (
    <div className="pad sleep">
      <Stars />
      <h1>Sleep tight</h1>
      <p className="muted">Your nights against your window: in bed by {fmt(settings.bed)}, up at {fmt(settings.wake)}.</p>

      {bedTappedAt ? (
        <div className="card goodnight">
          🌙 Good night. In bed at <b>{new Date(bedTappedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</b>. Your check-in will confirm it in the morning.
        </div>
      ) : (
        <button className="btn big bed-btn" onClick={onBed}>🛏 Going to bed</button>
      )}

      <div className="card">
        <div className="graph-head"><span>This week</span><span className="small muted" style={{ margin: 0 }}>sample data</span></div>
        <div className="bars">
          <div className="window-layer">
            <div className="window-line" style={{ left: `${pct(bedH)}%` }}><span>{fmt(settings.bed)}</span></div>
            <div className="window-line" style={{ left: `${pct(wakeH)}%` }}><span>{fmt(settings.wake)}</span></div>
          </div>
          {SAMPLE_THIS_WEEK.map((d) => {
            const a = pct(toHours(d.bed)), b = pct(toHours(d.wake))
            const inside = shift(toHours(d.bed)) <= shift(bedH) && shift(toHours(d.wake)) <= shift(wakeH)
            return (
              <div key={d.daysAgo} className="bar-row">
                <span className="bar-day">{dayName(d.daysAgo)}</span>
                <div className="bar-track">
                  <div className={`bar ${inside ? 'inside' : ''}`} style={{ left: `${a}%`, width: `${b - a}%` }}>
                    <small>{fmt(d.bed)}–{fmt(d.wake)}</small>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <p className="small muted" style={{ margin: '10px 0 0' }}>Bars inside the dashed lines are nights you fit your window.</p>
      </div>
    </div>
  )
}
