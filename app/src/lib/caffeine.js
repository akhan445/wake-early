// Approximate general values, not medical advice.
export const HALF_LIFE_HOURS = 5
export const SLEEP_OK_MG = 50
export const BEDTIME_HOUR = 23
export const WAKE_HOUR = 6

const HOUR = 3600 * 1000

export function bedtimeFor(now, bedHour = BEDTIME_HOUR) {
  const bed = new Date(now)
  bed.setHours(Math.floor(bedHour), Math.round((bedHour % 1) * 60), 0, 0)
  return bed.getTime()
}

// Caffeine still in your system at `now` from every drink logged before it.
export function mgNow(drinks, now) {
  return drinks.reduce((sum, d) => {
    if (d.time > now) return sum
    const hours = (now - d.time) / HOUR
    return sum + d.mg * Math.pow(0.5, hours / HALF_LIFE_HOURS)
  }, 0)
}

// Most caffeine you can have in your system now and still be down to SLEEP_OK_MG by bedtime.
export function limitNow(now, bedHour = BEDTIME_HOUR) {
  const hoursUntilBed = (bedtimeFor(now, bedHour) - now) / HOUR
  if (hoursUntilBed <= 0) return SLEEP_OK_MG
  return SLEEP_OK_MG * Math.pow(2, hoursUntilBed / HALF_LIFE_HOURS)
}

// Points every 30 minutes from now until bedtime, for the fade-out graph.
export function curve(drinks, now, bedHour = BEDTIME_HOUR) {
  const bed = bedtimeFor(now, bedHour)
  const points = []
  for (let t = now; t <= bed; t += HOUR / 2) points.push({ t, mg: mgNow(drinks, t) })
  if (points.length && points[points.length - 1].t < bed) points.push({ t: bed, mg: mgNow(drinks, bed) })
  return points
}

// True if you never went over the line at any moment you logged a drink.
export function stayedUnderLine(drinks, bedHour = BEDTIME_HOUR) {
  return drinks.every((d) => mgNow(drinks, d.time) <= limitNow(d.time, bedHour))
}

export const hoursOf = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h + m / 60
}

export const fmtHHMM = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return `${((h + 11) % 12) + 1}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'am' : 'pm'}`
}

// Phased: start 15 minutes earlier than your usual wake time, then 15 more each day until the target.
export function alarmSchedule(settings, days = 5) {
  if (settings.approach !== 'phased') return Array(days).fill(settings.wake)
  const target = hoursOf(settings.wake)
  let t = hoursOf(settings.usual)
  return Array.from({ length: days }, () => {
    t = Math.max(target, t - 0.25)
    const h = Math.floor(t), m = Math.round((t - h) * 60)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  })
}
