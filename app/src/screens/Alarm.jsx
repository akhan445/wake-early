import { useEffect, useRef, useState } from 'react'
import { DIFFICULTY, generateMaze, canMove } from '../lib/maze.js'
import { SAMPLE_THIS_WEEK } from '../data/sampleWeek.js'
import { alarmSchedule, fmtHHMM } from '../lib/caffeine.js'

// Gentle repeating two-tone alarm made with the Web Audio API.
function startAlarmSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const beep = () => {
      ;[0, 0.22].forEach((offset, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.frequency.value = i ? 880 : 660
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset)
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + offset + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.18)
        osc.connect(gain).connect(ctx.destination)
        osc.start(ctx.currentTime + offset)
        osc.stop(ctx.currentTime + offset + 0.2)
      })
    }
    beep()
    const id = setInterval(beep, 1000)
    return () => {
      clearInterval(id)
      ctx.close()
    }
  } catch {
    return () => {}
  }
}

function Walker({ x, y, s }) {
  // A simple walking figure with no face.
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 24})`} className="walker">
      <circle cx="0" cy="-7" r="3" />
      <path d="M0 -4 L0 3 M0 -2 L-4 1 M0 -2 L4 -1 M0 3 L-3 9 M0 3 L4 8" />
    </g>
  )
}

function Maze({ difficulty, onSolved }) {
  const [maze] = useState(() => generateMaze(DIFFICULTY[difficulty]))
  const [trail, setTrail] = useState([[0, 0]])
  const [done, setDone] = useState(false)
  const svgRef = useRef(null)
  const dragging = useRef(false)
  const N = maze.size
  const W = 320
  const cell = W / N
  const pos = trail[trail.length - 1]

  const step = (target) => {
    if (done) return
    setTrail((t) => {
      const cur = t[t.length - 1]
      const prev = t[t.length - 2]
      if (prev && prev[0] === target[0] && prev[1] === target[1]) return t.slice(0, -1)
      if (!canMove(maze, cur, target)) return t
      const next = [...t, target]
      if (target[0] === N - 1 && target[1] === N - 1) {
        setDone(true)
        setTimeout(onSolved, 2800)
      }
      return next
    })
  }

  const cellFromPointer = (e) => {
    const box = svgRef.current.getBoundingClientRect()
    const c = Math.floor(((e.clientX - box.left) / box.width) * N)
    const r = Math.floor(((e.clientY - box.top) / box.height) * N)
    return r >= 0 && r < N && c >= 0 && c < N ? [r, c] : null
  }

  const onMove = (e) => {
    if (!dragging.current) return
    const target = cellFromPointer(e)
    if (!target) return
    const [r, c] = pos
    if (Math.abs(target[0] - r) + Math.abs(target[1] - c) === 1) step(target)
  }

  useEffect(() => {
    const keys = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }
    const onKey = (e) => {
      const d = keys[e.key]
      if (!d) return
      e.preventDefault()
      step([pos[0] + d[0], pos[1] + d[1]])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const center = ([r, c]) => [c * cell + cell / 2, r * cell + cell / 2]
  const walls = []
  maze.cells.forEach((w, i) => {
    const r = Math.floor(i / N), c = i % N
    const x = c * cell, y = r * cell
    if (w.n && r > 0) walls.push(`M${x},${y}h${cell}`)
    if (w.w && c > 0) walls.push(`M${x},${y}v${cell}`)
  })
  const [wx, wy] = center(pos)

  return (
    <div className={`maze-wrap ${done ? 'done' : ''}`}>
      {done && (
        <div className="sunrise">
          <div className="big-sun" />
          <p>Good morning ☀️</p>
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox={`-3 -3 ${W + 6} ${W + 6}`}
        className="maze"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          onMove(e)
        }}
        onPointerMove={onMove}
        onPointerUp={() => (dragging.current = false)}
      >
        <rect x="0" y="0" width={W} height={W} rx="6" className="maze-floor" />
        <rect x={(N - 1) * cell} y={(N - 1) * cell} width={cell} height={cell} className="maze-goal" />
        <text x={(N - 0.5) * cell} y={(N - 0.5) * cell + cell * 0.18} textAnchor="middle" fontSize={cell * 0.55}>☀️</text>
        <path d={walls.join(' ')} className="maze-walls" />
        <rect x="0" y="0" width={W} height={W} rx="6" className="maze-border" />
        <polyline points={trail.map((p) => center(p).join(',')).join(' ')} className="maze-trail" />
        <Walker x={wx} y={wy} s={cell * 0.9} />
      </svg>
      <p className="maze-hint">{done ? "You're up! ☀️" : 'Drag the walker from the top-left to the sun.'}</p>
    </div>
  )
}

const fmt12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

// Morning check-in: confirms yesterday's caffeine and bedtime in two taps.
function CheckIn({ bedTappedAt, onDone }) {
  const yesterday = SAMPLE_THIS_WEEK.find((d) => d.daysAgo === 1)
  const [drinks, setDrinks] = useState(yesterday.drinks)
  const [caffeineDone, setCaffeineDone] = useState(false)
  const [adding, setAdding] = useState(false)
  const [extra, setExtra] = useState({ name: '', mg: '' })
  const tapped = bedTappedAt ? new Date(bedTappedAt) : null
  const initialBed = tapped ? `${String(tapped.getHours()).padStart(2, '0')}:${String(tapped.getMinutes()).padStart(2, '0')}` : yesterday.bed
  const [bed, setBed] = useState(initialBed)
  const [bedDone, setBedDone] = useState(false)
  const [editingBed, setEditingBed] = useState(false)
  const total = drinks.reduce((s, d) => s + d.mg, 0)
  const [bh] = bed.split(':').map(Number)
  const bedOnTime = bh >= 12 && bed <= '23:00'

  const addExtra = (e) => {
    e.preventDefault()
    const mg = Number(extra.mg)
    if (!mg) return
    setDrinks([...drinks, { name: extra.name.trim() || 'Other drink', mg, time: 'later' }])
    setExtra({ name: '', mg: '' })
    setAdding(false)
    setCaffeineDone(true)
  }

  return (
    <div className="pad ringing">
      <h1 className="center">Quick check-in</h1>
      <p className="muted center">Let's close out yesterday.</p>

      <div className="card checkin">
        <h3>☕ Yesterday's caffeine · {total} mg</h3>
        <ul className="log">
          {drinks.map((d, i) => (
            <li key={i}><span>{d.time} · {d.name}</span><span className="mg">{d.mg} mg</span></li>
          ))}
        </ul>
        {!caffeineDone && !adding && (
          <div className="row">
            <button className="primary" onClick={() => setCaffeineDone(true)}>That's everything</button>
            <button onClick={() => setAdding(true)}>Add one</button>
          </div>
        )}
        {adding && (
          <form className="row" onSubmit={addExtra}>
            <input placeholder="Drink" value={extra.name} onChange={(e) => setExtra({ ...extra, name: e.target.value })} />
            <input placeholder="mg" type="number" style={{ flex: '0 0 70px' }} value={extra.mg} onChange={(e) => setExtra({ ...extra, mg: e.target.value })} />
            <button className="primary" type="submit" style={{ flex: '0 0 auto' }}>Add</button>
          </form>
        )}
        {caffeineDone && <p className="answer">Under your line all day ✓</p>}
      </div>

      <div className="card checkin">
        <h3>🛏 In bed at {fmt12(bed)}?</h3>
        {!bedDone && !editingBed && (
          <div className="row">
            <button className="primary" onClick={() => setBedDone(true)}>Yes</button>
            <button onClick={() => setEditingBed(true)}>Edit</button>
          </div>
        )}
        {editingBed && (
          <div className="row">
            <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} />
            <button className="primary" style={{ flex: '0 0 auto' }} onClick={() => { setEditingBed(false); setBedDone(true) }}>Save</button>
          </div>
        )}
        {bedDone && <p className="answer">{bedOnTime ? 'In bed on time ✓' : 'A little after 11. Tonight is a fresh chance.'}</p>}
      </div>

      {caffeineDone && bedDone && (
        <button className="btn big wake-btn" onClick={onDone}>See today →</button>
      )}
    </div>
  )
}

export default function Alarm({ onSolved, bedTappedAt, settings, setSettings }) {
  const difficulty = settings.difficulty
  const setDifficulty = (d) => setSettings({ ...settings, difficulty: d })
  const schedule = alarmSchedule(settings)
  const days = ['Tomorrow', ...Array.from({ length: 4 }, (_, i) => new Date(Date.now() + (i + 2) * 864e5).toLocaleDateString([], { weekday: 'short' }))]
  const [ringing, setRinging] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)

  useEffect(() => {
    if (!ringing) return
    return startAlarmSound()
  }, [ringing])

  if (checkingIn) return <CheckIn bedTappedAt={bedTappedAt} onDone={() => { setCheckingIn(false); onSolved() }} />

  if (ringing) {
    return (
      <div className="pad ringing">
        <div className="alarm-clock shake">⏰</div>
        <h1 className="center">{fmtHHMM(schedule[0])} · Rise and shine</h1>
        <p className="muted center">Solve the maze to turn off the alarm.</p>
        <Maze
          difficulty={difficulty}
          onSolved={() => {
            setRinging(false)
            setCheckingIn(true)
          }}
        />
      </div>
    )
  }

  return (
    <div className="pad">
      <h1>Wake early</h1>
      <p className="muted">Your alarm, and the challenge that turns it off.</p>
      <div className="card alarm-card">
        <div className="alarm-clock wiggle">⏰</div>
        <div>
          <div className="alarm-time">{fmtHHMM(schedule[0])}</div>
          <div className="muted small" style={{ margin: 0 }}>Next alarm · {settings.approach === 'phased' ? 'phased' : 'cold turkey'}</div>
        </div>
      </div>
      <div className="card">
        <label className="field">Target wake time<input type="time" value={settings.wake} onChange={(e) => setSettings({ ...settings, wake: e.target.value })} /></label>
        <div className="segmented" style={{ marginTop: 10 }}>
          <button className={settings.approach === 'cold' ? 'on' : ''} onClick={() => setSettings({ ...settings, approach: 'cold' })}>Cold turkey</button>
          <button className={settings.approach === 'phased' ? 'on' : ''} onClick={() => setSettings({ ...settings, approach: 'phased' })}>Phased</button>
        </div>
        {settings.approach === 'phased' && (
          <>
            <label className="field" style={{ marginTop: 10 }}>Usual wake time<input type="time" value={settings.usual} onChange={(e) => setSettings({ ...settings, usual: e.target.value })} /></label>
            <div className="schedule">
              {schedule.map((t, i) => (
                <div key={i}><small>{days[i]}</small><b>{fmtHHMM(t)}</b></div>
              ))}
            </div>
            <p className="small" style={{ margin: '8px 0 0' }}>15 minutes earlier each day. Keep it up and you'll hit {fmtHHMM(settings.wake)}.</p>
          </>
        )}
      </div>
      <div className="card">
        <div className="graph-head"><span>Maze difficulty</span></div>
        <div className="segmented">
          {Object.keys(DIFFICULTY).map((d) => (
            <button key={d} className={difficulty === d ? 'on' : ''} onClick={() => setDifficulty(d)}>
              {d[0].toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <button className="btn big wake-btn" onClick={() => setRinging(true)}>Ring alarm now (demo)</button>
    </div>
  )
}
