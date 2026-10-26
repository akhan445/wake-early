import { useEffect, useState } from 'react'
import Home from './screens/Home.jsx'
import Alarm from './screens/Alarm.jsx'
import Coffee from './screens/Coffee.jsx'
import Sleep from './screens/Sleep.jsx'
import Backdrop from './Backdrop.jsx'
import Onboarding from './screens/Onboarding.jsx'

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

const DEFAULT_SETTINGS = { wake: '06:00', bed: '23:00', approach: 'cold', usual: '07:30', difficulty: 'easy' }

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('we.settings'))
  } catch {
    return null
  }
}

export default function App() {
  const [settings, setSettingsState] = useState(() => loadSettings())
  const [obTheme, setObTheme] = useState('alarm')
  const setSettings = (next) => {
    setSettingsState(next)
    try {
      localStorage.setItem('we.settings', JSON.stringify(next))
    } catch {
      // ignore
    }
  }
  const onboarded = Boolean(settings)
  const s = settings || DEFAULT_SETTINGS
  const [tab, setTab] = useState(() => window.location.hash.slice(1) || 'coffee')
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
      <div className={`phone theme-${onboarded ? tab : obTheme === 'alarm' ? 'alarm' : obTheme}`}>
        <Backdrop tab={onboarded ? tab : obTheme} />
        {!onboarded ? (
          <main className="screen">
            <Onboarding
              initial={DEFAULT_SETTINGS}
              vessel={vessel}
              setVessel={setVessel}
              onTheme={setObTheme}
              onDone={(next) => {
                setSettings(next)
                setTab('home')
              }}
            />
          </main>
        ) : (
        <>
        <main className="screen">
          {tab === 'home' && (
            <Home now={now} drinks={drinks} wokeOnTime={wokeOnTime} celebrate={celebrate} onCelebrated={() => setCelebrate(false)} settings={s} onRedoOnboarding={() => { setSettingsState(null); setObTheme('alarm'); try { localStorage.removeItem('we.settings') } catch { /* ignore */ } }} />
          )}
          {tab === 'alarm' && <Alarm onSolved={handleWake} bedTappedAt={bedTappedAt} settings={s} setSettings={setSettings} />}
          {tab === 'coffee' && (
            <Coffee now={now} drinks={drinks} pourCount={pourCount} onAdd={addDrink} onRemove={(key) => setDrinks((list) => list.filter((d) => d.key !== key))} onClear={() => setDrinks([])} vessel={vessel} setVessel={setVessel} demoHour={demoHour} setDemoHour={setDemoHour} bed={s.bed} />
          )}
          {tab === 'sleep' && <Sleep bedTappedAt={bedTappedAt} onBed={() => setBedTappedAt(Date.now())} settings={s} />}
        </main>
        <nav className="nav">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        </>
        )}
      </div>
    </div>
  )
}
