export const calcTime = offset => {
  const d = new Date()
  const utc = d.getTime() + d.getTimezoneOffset() * 60000
  const nd = new Date(utc + 3600000 * offset)
  return nd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
export const calcDate = () => {
  const d = new Date()
  const utc = d.getTime() + d.getTimezoneOffset() * 60000
  const nd = new Date(utc + 3600000 * '+9')
  return nd
}
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const mockDate = new Date(2020, 11, 24)
