// SAMPLE DATA for the demo: the six days before today, plus a summary of last week.
export const SAMPLE_THIS_WEEK = [
  { daysAgo: 6, bed: '00:30', wake: '08:10', underLine: false },
  { daysAgo: 5, bed: '23:50', wake: '07:20', underLine: true },
  { daysAgo: 4, bed: '23:10', wake: '06:00', underLine: true },
  { daysAgo: 3, bed: '00:15', wake: '07:45', underLine: false },
  { daysAgo: 2, bed: '22:55', wake: '05:55', underLine: true },
  { daysAgo: 1, bed: '23:30', wake: '06:40', underLine: true },
]

export const SAMPLE_LAST_WEEK = { onTime: 1 }

export const toHours = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h + m / 60
}

export const wokeOnTime = (day) => toHours(day.wake) <= 6
export const bedOnTime = (day) => {
  const h = toHours(day.bed)
  return h >= 12 && h <= 23
}
