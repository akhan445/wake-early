import { useEffect, useRef, useState } from 'react'
import { searchDrinks } from '../data/drinks.js'
import { mgNow, limitNow, curve, bedtimeFor, SLEEP_OK_MG } from '../lib/caffeine.js'

const CUP_MAX_MG = 400
const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

export const VESSELS = [
  { id: 'mug', label: 'Coffee mug' },
  { id: 'travel', label: 'Travel mug' },
  { id: 'jar', label: 'Mason jar' },
  { id: 'paper', label: 'Paper cup' },
]

export function VesselIcon({ type }) {
  if (type === 'travel')
    return (
      <svg viewBox="0 0 24 24"><path d="M5 5h11l-1 2H6z M6 7h9l-1.2 14H7.2z" /><path d="M15 10h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2.5" fill="none" /></svg>
    )
  if (type === 'paper')
    return (
      <svg viewBox="0 0 24 24"><path d="M5.5 5h13l-.6 2.5H6.1z" className="green" /><path d="M6.2 7.5h11.6L16.3 22H7.7z" /><path d="M6.9 12h10.2l-.4 4H7.3z" className="sleeve" /></svg>
    )
  if (type === 'jar')
    return (
      <svg viewBox="0 0 24 24">
        <path d="M7 6h10v2.5c1 .8 1.5 1.8 1.5 3V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20v-8.5c0-1.2.5-2.2 1.5-3z" />
        <path d="M6.5 5h11v2.5h-11z" className="silver" />
        <path d="M14 1 15 5" className="straw" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24"><path d="M4 7h13v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" fill="none" /></svg>
  )
}

function Vessel({ mg, limit, pourKey, type }) {
  const [pouring, setPouring] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setPouring(true)
    const id = setTimeout(() => setPouring(false), 1500)
    return () => clearTimeout(id)
  }, [pourKey])

  const level = Math.min(mg / CUP_MAX_MG, 1) * 100
  const maxLine = Math.min(limit / CUP_MAX_MG, 1) * 100
  const over = mg > limit

  return (
    <div className="vessel-wrap">
      <div className={`stream ${pouring ? 'on' : ''}`} />
      <div className={`vessel vessel-${type}`}>
        {type === 'travel' && <div className="travel-lid" />}
        {type === 'jar' && <div className="straw" />}
        {type === 'jar' && <div className="jar-lid" />}
        {type === 'paper' && <div className="paper-lid" />}
        <div className="vessel-inner">
          <div className={`liquid ${over ? 'over' : ''} ${pouring ? 'pouring' : ''}`} style={{ height: `${level}%` }}>
            {mg > 0.5 && <div className="liquid-wave" />}
          </div>
          {type === 'jar' && (
            <>
              <div className="ice" style={{ left: '18%', bottom: '14%', transform: 'rotate(12deg)' }} />
              <div className="ice" style={{ left: '50%', bottom: '28%', transform: 'rotate(-8deg)' }} />
              <div className="ice" style={{ left: '30%', bottom: '44%', transform: 'rotate(20deg)' }} />
            </>
          )}
          {mg > 0.5 && (
            <div className="level-line" style={{ bottom: `${level}%` }}>
              <span>{Math.round(mg)} mg</span>
            </div>
          )}
        </div>
        {(type === 'mug' || type === 'travel') && <div className="mug-handle" />}
        {type === 'paper' && <div className="paper-sleeve" />}
        <div className="max-line" style={{ bottom: `${maxLine}%` }}>
          <span>{limit >= CUP_MAX_MG ? `${CUP_MAX_MG}+` : Math.round(limit)} mg max now</span>
        </div>
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

export default function Coffee({ now, drinks, pourCount, onAdd, onRemove, onClear, vessel, setVessel, demoHour, setDemoHour }) {
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
      <div className="vessel-picker">
        {VESSELS.map((v) => (
          <button key={v.id} className={vessel === v.id ? 'on' : ''} onClick={() => setVessel(v.id)} title={v.label} aria-label={v.label}>
            <VesselIcon type={v.id} />
          </button>
        ))}
      </div>

      <Vessel mg={mg} limit={limit} pourKey={pourCount} type={vessel} />

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
                <span className="row-end">
                  <span className="mg">{d.mg} mg</span>
                  <button className="remove" onClick={() => onRemove(d.key)} aria-label={`Remove ${d.name}`}>×</button>
                </span>
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
