// Approximate general values, not medical advice.
export const HALF_LIFE_HOURS = 5
export const SLEEP_OK_MG = 50
export const BEDTIME_HOUR = 23
export const WAKE_HOUR = 6

const HOUR = 3600 * 1000

export function bedtimeFor(now) {
  const bed = new Date(now)
  bed.setHours(BEDTIME_HOUR, 0, 0, 0)
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
export function limitNow(now) {
  const hoursUntilBed = (bedtimeFor(now) - now) / HOUR
  if (hoursUntilBed <= 0) return SLEEP_OK_MG
  return SLEEP_OK_MG * Math.pow(2, hoursUntilBed / HALF_LIFE_HOURS)
}

// Points every 30 minutes from now until bedtime, for the fade-out graph.
export function curve(drinks, now) {
  const bed = bedtimeFor(now)
  const points = []
  for (let t = now; t <= bed; t += HOUR / 2) points.push({ t, mg: mgNow(drinks, t) })
  if (points.length && points[points.length - 1].t < bed) points.push({ t: bed, mg: mgNow(drinks, bed) })
  return points
}

// True if you never went over the line at any moment you logged a drink.
export function stayedUnderLine(drinks) {
  return drinks.every((d) => mgNow(drinks, d.time) <= limitNow(d.time))
}
