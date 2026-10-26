import { useEffect } from 'react'
import { stayedUnderLine, hoursOf, fmtHHMM } from '../lib/caffeine.js'
import { SAMPLE_THIS_WEEK, SAMPLE_LAST_WEEK, wokeOnTime as dayWokeOnTime, bedOnTime } from '../data/sampleWeek.js'

const GOALS = [1, 2, 4, 7, 30]

function Ring({ r, value, color }) {
  const c = 2 * Math.PI * r
  return (
    <>
      <circle r={r} className="ring-track" />
      <circle r={r} className="ring-fill" stroke={color} strokeDasharray={`${c * value} ${c}`} style={{ opacity: value > 0 ? 1 : 0 }} />
    </>
  )
}

export default function Home({ now, drinks, wokeOnTime, celebrate, onCelebrated, settings, onRedoOnboarding }) {
  useEffect(() => {
    if (!celebrate) return
    const id = setTimeout(onCelebrated, 3200)
    return () => clearTimeout(id)
  }, [celebrate, onCelebrated])

  const bedHour = hoursOf(settings.bed)
  const wakeHour = hoursOf(settings.wake)
  const underLine = stayedUnderLine(drinks, bedHour)
  const hour = new Date(now).getHours() + new Date(now).getMinutes() / 60
  const dayProgress = Math.min(Math.max((hour - wakeHour) / (bedHour - wakeHour), 0), 1)

  const pastOnTime = SAMPLE_THIS_WEEK.filter(dayWokeOnTime).length
  const thisWeekOnTime = pastOnTime + (wokeOnTime ? 1 : 0)
  const total = SAMPLE_LAST_WEEK.onTime + thisWeekOnTime
  const nextGoal = GOALS.find((g) => g > total) ?? GOALS[GOALS.length - 1]
  const justHitGoal = celebrate && GOALS.includes(total)

  const underCount = SAMPLE_THIS_WEEK.filter((d) => d.underLine).length
  const bedCount = SAMPLE_THIS_WEEK.filter(bedOnTime).length
  const colMax = Math.max(SAMPLE_LAST_WEEK.onTime, thisWeekOnTime, 4)

  return (
    <div className="pad">
      <h1>Today</h1>
      <p className="muted">
        {wokeOnTime
          ? `You woke up on time! Keep caffeine under the line and be in bed by ${fmtHHMM(settings.bed)} to complete today.`
          : 'Start today by beating your alarm on the Alarm tab.'}
      </p>

      <div className={`rings ${celebrate ? 'celebrate' : ''}`}>
        <svg viewBox="-110 -110 220 220">
          <g transform="rotate(-90)">
            <Ring r={92} value={wokeOnTime ? 1 : 0} color="var(--wake)" />
            <Ring r={68} value={underLine ? dayProgress : 0} color="var(--caf)" />
            <Ring r={44} value={0} color="var(--bed)" />
          </g>
        </svg>
        <div className="rings-center">
          <b>{(wokeOnTime ? 1 : 0)}/3</b>
          <span>rings</span>
        </div>
        {celebrate && (
          <div className="sparkles">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ '--a': `${(360 / 14) * i}deg`, '--d': `${(i % 3) * 0.12}s` }} />
            ))}
          </div>
        )}
      </div>

      <div className="path">
        <div className={`step ${underLine ? 'done caf' : 'miss'}`}>
          <span>☕</span>
          <small>{underLine ? 'Under the line' : 'Over the line'}</small>
        </div>
        <div className="path-line" />
        <div className="step">
          <span>🛏</span>
          <small>Bed by {fmtHHMM(settings.bed)}</small>
        </div>
        <div className="path-line" />
        <div className={`step ${wokeOnTime ? 'done wake' : ''}`}>
          <span>☀️</span>
          <small>Up on time</small>
        </div>
      </div>

      <div className="card">
        <div className="graph-head">
          <span>On-time wake-ups</span>
          <span>{total} so far</span>
        </div>
        <div className="ladder">
          {GOALS.map((g) => (
            <div key={g} className={`rung ${total >= g ? 'hit' : ''} ${g === nextGoal ? 'next' : ''} ${justHitGoal && g === total ? 'pop' : ''}`}>
              {g}
            </div>
          ))}
        </div>
        <p className="small center ladder-msg">
          {justHitGoal ? `Goal reached: ${total} on-time wake-ups! Next up: ${nextGoal}.` : `Next goal: wake up on time ${nextGoal} times.`}
        </p>
      </div>

      <div className="card">
        <div className="graph-head"><span>This week</span></div>
        <p className="stat">☕ Under your caffeine line <b>{underCount + (underLine && drinks.length ? 1 : 0)} days</b></p>
        <p className="stat">🛏 In bed on time <b>{bedCount} {bedCount === 1 ? 'day' : 'days'}</b></p>
      </div>

      <div className="card">
        <div className="graph-head">
          <span>Week over week</span>
          {thisWeekOnTime > SAMPLE_LAST_WEEK.onTime && <span className="good">You're ahead of last week</span>}
        </div>
        <div className="cols">
          {[
            ['Last week', SAMPLE_LAST_WEEK.onTime, 'last'],
            ['This week', thisWeekOnTime, 'this'],
          ].map(([label, v, cls]) => (
            <div key={label} className="col">
              <div className="col-bar-wrap">
                <div className={`col-bar ${cls}`} style={{ height: `${(v / colMax) * 100}%` }}>
                  <b>{v}</b>
                </div>
              </div>
              <small>{label}</small>
            </div>
          ))}
        </div>
        <p className="small muted center" style={{ margin: '8px 0 0' }}>On-time wake-ups · history is sample data</p>
      </div>
      <p className="center"><button className="link" onClick={onRedoOnboarding}>Redo onboarding</button></p>
    </div>
  )
}
