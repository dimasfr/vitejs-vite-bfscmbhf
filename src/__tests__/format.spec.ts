import { describe, expect, it } from 'vitest'
import { formatChatTime, nameFromEmail } from '../utils/format'

describe('nameFromEmail', () => {
  it('title-cases the part before @', () => {
    expect(nameFromEmail('chris_evans@example.com')).toBe('Chris Evans')
    expect(nameFromEmail('JOHN.doe@x.io')).toBe('John Doe')
    expect(nameFromEmail('madonna@x.io')).toBe('Madonna')
  })
})

describe('formatChatTime', () => {
  const now = new Date(2022, 9, 10, 13, 30).getTime()
  it('shows "just now" under a minute', () => {
    expect(formatChatTime(now - 30_000, now)).toBe('just now')
  })
  it('shows HH:mm on the same day', () => {
    expect(formatChatTime(new Date(2022, 9, 10, 13, 5).getTime(), now)).toBe('13:05')
    expect(formatChatTime(new Date(2022, 9, 10, 9, 7).getTime(), now)).toBe('09:07')
  })
  it('shows d Mmm on other days', () => {
    expect(formatChatTime(new Date(2022, 9, 4, 8, 0).getTime(), now)).toBe('4 Oct')
    expect(formatChatTime(new Date(2022, 8, 29, 8, 0).getTime(), now)).toBe('29 Sep')
  })
})

import { formatDayLabel, initials } from '../utils/format'

describe('formatDayLabel / initials', () => {
  const now = new Date(2022, 9, 10, 13, 30).getTime()
  it('labels today, yesterday and older days', () => {
    expect(formatDayLabel(now - 1000, now)).toBe('Today')
    expect(formatDayLabel(new Date(2022, 9, 9, 23, 0).getTime(), now)).toBe('Yesterday')
    expect(formatDayLabel(new Date(2022, 9, 4).getTime(), now)).toBe('4 Oct')
  })
  it('builds initials', () => {
    expect(initials('Tom Holland')).toBe('TH')
    expect(initials('madonna')).toBe('M')
  })
})
