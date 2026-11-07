const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(v: string): string {
  if (!v.trim()) return 'Email is required'
  if (!EMAIL_RE.test(v.trim())) return 'Enter a valid email, e.g. chris_evans@example.com'
  return ''
}

export function validatePassword(v: string): string {
  return v ? '' : 'Password is required'
}
