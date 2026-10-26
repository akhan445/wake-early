import { useEffect, useRef, useState } from 'react'
import { searchDrinks } from '../data/drinks.js'
import { mgNow, limitNow, curve, bedtimeFor, SLEEP_OK_MG } from '../lib/caffeine.js'

const CUP_MAX_MG = 400
const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

function Vessel({ mg, limit, pourKey }) {
  const [pouring, setPouring] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setPouring(true)
    const id = setTimeout(() => setPouring(false), 1400)
    return () => clearTimeout(id)
  }, [pourKey])

  const level = Math.min(mg / CUP_MAX_MG, 1) * 100
  const maxLine = Math.min(limit / CUP_MAX_MG, 1) * 100
  const over = mg > limit

  return (
    <div className="vessel-wrap">
      <div className={`stream ${pouring ? 'on' : ''}`} />
      <div className="mug">
        <div className="mug-inner">
          <div className={`liquid ${over ? 'over' : ''} ${pouring ? 'pouring' : ''}`} style={{ height: `${level}%` }}>
            <div className="liquid-wave" />
          </div>
          {mg > 0.5 && (
            <div className="level-line" style={{ bottom: `${level}%` }}>
              <span>{Math.round(mg)} mg</span>
            </div>
          )}
          <div className="max-line" style={{ bottom: `${maxLine}%` }}>
            <span>{limit >= CUP_MAX_MG ? `${CUP_MAX_MG}+` : Math.round(limit)} mg max now</span>
          </div>
        </div>
        <div className="mug-handle" />
      </div>
    </div>
  )
}

function FadeGraph({ drinks, now }) {
  const points = curve(drinks, now)
  if (points.length < 2) return <p className="muted small">It's past bedtime. Tomorrow starts fresh.</p>
  const W = 320, H = 110, P = 8
  const peak = Math.max(120, ...points.map((p) => p.mg))
  const x = (t) => P + ((t - now) / (bedtimeFor(now) - now)) * (W - 2 * P)
  const y = (mg) => H - P - (mg / peak) * (H - 2 * P)
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.mg).toFixed(1)}`).join(' ')
  const atBed = points[points.length - 1].mg
  return (
    <div className="graph card">
      <div className="graph-head">
        <span>Caffeine until bedtime</span>
        <span className={atBed <= SLEEP_OK_MG ? 'good' : 'warn'}>{Math.round(atBed)} mg at 11 pm</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`}>
        <line x1={P} x2={W - P} y1={y(SLEEP_OK_MG)} y2={y(SLEEP_OK_MG)} className="graph-ok" />
        <text x={P + 2} y={y(SLEEP_OK_MG) - 4} className="graph-label">sleep-ready ~{SLEEP_OK_MG} mg</text>
        <path d={`${path} L${x(points[points.length - 1].t)},${H - P} L${P},${H - P} Z`} className="graph-fill" />
        <path d={path} className="graph-line" />
        <text x={P} y={H - 1} className="graph-label">now</text>
        <text x={W - P} y={H - 1} textAnchor="end" className="graph-label">11 pm</text>
      </svg>
    </div>
  )
}

export default function Coffee({ now, drinks, onAdd, onClear, demoHour, setDemoHour }) {
  const [query, setQuery] = useState('')
  const [custom, setCustom] = useState({ name: '', mg: '' })
  const mg = mgNow(drinks, now)
  const limit = limitNow(now)
  const room = limit - mg
  const results = searchDrinks(query).slice(0, query ? 8 : 5)

  const addCustom = (e) => {
    e.preventDefault()
    const amount = Number(custom.mg)
    if (!amount || amount <= 0) return
    onAdd({ id: 'custom', brand: 'Custom', name: custom.name.trim() || 'Custom drink', mg: amount })
    setCustom({ name: '', mg: '' })
  }

  return (
    <div className="pad">
      <h1>Drink right</h1>
      <p className="muted">Log a drink and watch it pour in. The red line drops as bedtime gets closer.</p>

      <Vessel mg={mg} limit={limit} pourKey={drinks.length} />

      <p className={`room ${room < 0 ? 'warn' : ''}`}>
        {room >= 0
          ? `You can have about ${Math.round(room)} mg more right now.`
          : `You're ${Math.round(-room)} mg over the line. This much may make it harder to fall asleep by 11.`}
      </p>

      <FadeGraph drinks={drinks} now={now} />

      <div className="card">
        <input className="search" placeholder="Search drinks: Tim Hortons, Starbucks, espresso…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <ul className="results">
          {results.map((d) => (
            <li key={d.id}>
              <button onClick={() => onAdd(d)}>
                <span>
                  <b>{d.brand}</b> {d.name}
                </span>
                <span className="mg">{d.mg} mg</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="muted small">No match. Add it as a custom drink below.</li>}
        </ul>
        <form className="custom" onSubmit={addCustom}>
          <input placeholder="Custom drink" value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} />
          <input placeholder="mg" type="number" min="1" value={custom.mg} onChange={(e) => setCustom({ ...custom, mg: e.target.value })} />
          <button type="submit">Add</button>
        </form>
      </div>

      {drinks.length > 0 && (
        <div className="card">
          <div className="graph-head">
            <span>Today</span>
            <button className="link" onClick={onClear}>Clear</button>
          </div>
          <ul className="log">
            {drinks.map((d) => (
              <li key={d.key}>
                <span>{fmtTime(d.time)} · {d.name}</span>
                <span className="mg">{d.mg} mg</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card demo">
        <div className="graph-head">
          <span>Demo clock (sample time)</span>
          <span>{fmtTime(now)}</span>
        </div>
        <input type="range" min="6" max="23" step="0.5" value={demoHour ?? new Date(now).getHours()} onChange={(e) => setDemoHour(Number(e.target.value))} />
        {demoHour !== null && <button className="link" onClick={() => setDemoHour(null)}>Back to real time</button>}
      </div>
    </div>
  )
}
