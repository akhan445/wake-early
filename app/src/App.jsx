import { useEffect, useState } from 'react'
import Home from './screens/Home.jsx'
import Alarm from './screens/Alarm.jsx'
import Coffee from './screens/Coffee.jsx'
import Sleep from './screens/Sleep.jsx'

const TABS = [
  { id: 'home', label: 'Home', icon: '☀️' },
  { id: 'alarm', label: 'Alarm', icon: '⏰' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'sleep', label: 'Sleep', icon: '🛏' },
]

const todayKey = (t) => new Date(t).toDateString()

function load(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return saved && saved.day === todayKey(Date.now()) ? saved.value : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ day: todayKey(Date.now()), value }))
  } catch {
    // Storage unavailable: the app still works, data just resets on refresh.
  }
}

export default function App() {
  const [tab, setTab] = useState('coffee')
  const [drinks, setDrinks] = useState(() => load('we.today', []))
  const [wokeOnTime, setWokeOnTime] = useState(() => load('we.wake', false))
  const [bedTappedAt, setBedTappedAt] = useState(() => load('we.bed', null))
  const [celebrate, setCelebrate] = useState(false)
  const [vessel, setVesselState] = useState(() => {
    try {
      return localStorage.getItem('we.vessel') || 'mug'
    } catch {
      return 'mug'
    }
  })
  const setVessel = (v) => {
    setVesselState(v)
    try {
      localStorage.setItem('we.vessel', v)
    } catch {
      // ignore
    }
  }
  // Demo clock: lets the video show the cup draining across a day.
  const [demoHour, setDemoHour] = useState(null)
  const [tick, setTick] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 60 * 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => save('we.today', drinks), [drinks])
  useEffect(() => save('we.wake', wokeOnTime), [wokeOnTime])
  useEffect(() => save('we.bed', bedTappedAt), [bedTappedAt])

  const now = (() => {
    if (demoHour === null) return tick
    const d = new Date(tick)
    d.setHours(Math.floor(demoHour), Math.round((demoHour % 1) * 60), 0, 0)
    return d.getTime()
  })()

  const [pourCount, setPourCount] = useState(0)
  const addDrink = (drink) => {
    setPourCount((n) => n + 1)
    setDrinks((list) => [...list, { ...drink, time: now, key: `${drink.id}-${now}-${list.length}` }])
  }

  const handleWake = () => {
    setWokeOnTime(true)
    setCelebrate(true)
    setTab('home')
  }

  return (
    <div className="stage">
      <div className={`phone theme-${tab}`}>
        <main className="screen">
          {tab === 'home' && (
            <Home now={now} drinks={drinks} wokeOnTime={wokeOnTime} celebrate={celebrate} onCelebrated={() => setCelebrate(false)} />
          )}
          {tab === 'alarm' && <Alarm onSolved={handleWake} />}
          {tab === 'coffee' && (
            <Coffee now={now} drinks={drinks} pourCount={pourCount} onAdd={addDrink} onRemove={(key) => setDrinks((list) => list.filter((d) => d.key !== key))} onClear={() => setDrinks([])} vessel={vessel} setVessel={setVessel} demoHour={demoHour} setDemoHour={setDemoHour} />
          )}
          {tab === 'sleep' && <Sleep bedTappedAt={bedTappedAt} onBed={() => setBedTappedAt(Date.now())} />}
        </main>
        <nav className="nav">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
