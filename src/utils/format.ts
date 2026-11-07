/** "chris_evans@example.com" -> "Chris Evans" */
export function nameFromEmail(email: string): string {
  const local = email.trim().split('@')[0] ?? ''
  return local
    .split(/[._\-\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n: number) => String(n).padStart(2, '0')

export function formatClock(ts: number): string {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** <1 min: "just now", same day: HH:mm, else "d Mmm" */
export function formatChatTime(ts: number, now: number = Date.now()): string {
  if (now - ts < 60_000) return 'just now'
  const d = new Date(ts)
  const n = new Date(now)
  const sameDay =
    d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
  return sameDay ? formatClock(ts) : `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

const dayKey = (ts: number) => {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}
export const isSameDay = (a: number, b: number) => dayKey(a) === dayKey(b)

/** "Today", "Yesterday", or "d Mmm" — used for date separators in a chat */
export function formatDayLabel(ts: number, now: number = Date.now()): string {
  if (isSameDay(ts, now)) return 'Today'
  if (isSameDay(ts, now - 24 * 3_600_000)) return 'Yesterday'
  const d = new Date(ts)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}
