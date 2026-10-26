import { useState } from 'react'
import { DIFFICULTY } from '../lib/maze.js'
import { VESSELS, VesselIcon } from './Coffee.jsx'
import { fmtHHMM, HALF_LIFE_HOURS } from '../lib/caffeine.js'

const STEPS = [
  { id: 'wake', theme: 'alarm', title: 'When do you want to wake up?' },
  { id: 'caffeine', theme: 'coffee', title: 'Caffeine sets up your morning' },
  { id: 'sleep', theme: 'sleep', title: 'When do you want to be in bed?' },
  { id: 'challenge', theme: 'alarm', title: 'Pick your wake-up challenge' },
]

export default function Onboarding({ initial, vessel, setVessel, onTheme, onDone }) {
  const [step, setStep] = useState(0)
  const [s, setS] = useState(initial)
  const set = (patch) => setS({ ...s, ...patch })
  const go = (i) => {
    setStep(i)
    onTheme(STEPS[i].theme)
  }
  const cur = STEPS[step]

  return (
    <div className="pad onboarding">
      <div className="progress">
        {STEPS.map((st, i) => (
          <div key={st.id} className={`dot ${i < step ? 'past' : ''} ${i === step ? 'now' : ''}`}>{i + 1}</div>
        ))}
      </div>
      <h1>{cur.title}</h1>

      {cur.id === 'wake' && (
        <>
          <div className="card">
            <label className="field">Target wake time<input type="time" value={s.wake} onChange={(e) => set({ wake: e.target.value })} /></label>
          </div>
          <div className="card">
            <div className="graph-head"><span>How do you want to get there?</span></div>
            <div className="segmented">
              <button className={s.approach === 'cold' ? 'on' : ''} onClick={() => set({ approach: 'cold' })}>Cold turkey</button>
              <button className={s.approach === 'phased' ? 'on' : ''} onClick={() => set({ approach: 'phased' })}>Phased</button>
            </div>
            <p className="small muted" style={{ margin: '10px 0 0' }}>
              {s.approach === 'cold' ? `Your alarm is ${fmtHHMM(s.wake)} from day one.` : 'Your alarm starts near your usual time and moves 15 minutes earlier each day.'}
            </p>
            {s.approach === 'phased' && (
              <label className="field" style={{ marginTop: 10 }}>I usually wake up at<input type="time" value={s.usual} onChange={(e) => set({ usual: e.target.value })} /></label>
            )}
          </div>
        </>
      )}

      {cur.id === 'caffeine' && (
        <>
          <div className="card">
            <p style={{ marginTop: 0 }}>Caffeine takes about <b>{HALF_LIFE_HOURS} hours</b> to drop by half. A coffee at 3 pm can still be in your system at bedtime and push your sleep later, which pushes your wake-up later too.</p>
            <p style={{ marginBottom: 0 }}>Wake Early shows a <b style={{ color: 'var(--warn)' }}>red line</b> in your cup: how much you can still have and be clear by bedtime. It drops as the day goes on.</p>
          </div>
          <div className="card">
            <div className="graph-head"><span>Choose your vessel</span></div>
            <div className="vessel-picker" style={{ justifyContent: 'flex-start', margin: 0 }}>
              {VESSELS.map((v) => (
                <button key={v.id} className={vessel === v.id ? 'on' : ''} onClick={() => setVessel(v.id)} title={v.label} aria-label={v.label}>
                  <VesselIcon type={v.id} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {cur.id === 'sleep' && (
        <div className="card">
          <label className="field">Bedtime<input type="time" value={s.bed} onChange={(e) => set({ bed: e.target.value })} /></label>
          <p className="small muted" style={{ margin: '10px 0 0' }}>Tap “Going to bed” on the Sleep tab each night. Your morning check-in confirms it.</p>
        </div>
      )}

      {cur.id === 'challenge' && (
        <div className="card">
          <p style={{ marginTop: 0 }}>To turn off your alarm, you'll guide a walker through a maze to the sun.</p>
          <div className="segmented">
            {Object.keys(DIFFICULTY).map((d) => (
              <button key={d} className={s.difficulty === d ? 'on' : ''} onClick={() => set({ difficulty: d })}>
                {d[0].toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ob-nav">
        {step > 0 && <button className="link" onClick={() => go(step - 1)}>Back</button>}
        <button className="btn big wake-btn" onClick={() => (step < STEPS.length - 1 ? go(step + 1) : onDone(s))}>
          {step < STEPS.length - 1 ? 'Next' : "Let's go"}
        </button>
      </div>
    </div>
  )
}
