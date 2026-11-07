import type { Chat } from '../stores/types'

// [name, gender, portrait number, last message, first message]
const people: [string, 'men' | 'women', number, string, string][] = [
  ['Tom Holland', 'men', 32, 'Thank you man, appreciate it', 'Can I borrow the selfies you left in the fridge?'],
  ['Robert Downey Jr', 'men', 75, 'Hey, bro. How you doing? I heard that you passed the exam!', 'Long time no see! Lunch this week?'],
  ['Mark Ruffalo', 'men', 12, "Alright. I'll keep you updated", 'Did you read the script yet?'],
  ['Chris Hemsworth', 'men', 45, "Don't worry, I got this.", 'Gym at 6 tomorrow?'],
  ['Scarlett Johansson', 'women', 44, 'See you on set!', 'Call me when you land.'],
  ['Elizabeth Olsen', 'women', 65, 'That sounds amazing 😍', 'Sending the photos now.'],
  ['Chris Evans', 'men', 52, 'Haha, classic.', 'Dog pics incoming.'],
  ['Jeremy Renner', 'men', 18, 'Bullseye!', 'Archery on Sunday?'],
  ['Paul Rudd', 'men', 60, 'Small problem, big solution.', 'Got any dad jokes?'],
  ['Brie Larson', 'women', 33, "Let's do it.", 'Meeting moved to 3pm.'],
  ['Benedict Cumberbatch', 'men', 22, 'Splendid, thank you.', 'Tea later?'],
  ['Zendaya Coleman', 'women', 21, 'Omg yes!!', 'Saw your story, so cool.'],
  ['Anthony Mackie', 'men', 68, 'On your left!', 'Running tomorrow morning.'],
  ['Sebastian Stan', 'men', 41, 'Okay, deal.', 'Where did you put my jacket?'],
  ['Don Cheadle', 'men', 85, 'Will check and revert.', 'Great job on the demo.'],
  ['Tessa Thompson', 'women', 28, 'Perfect, thanks!', 'Coffee break?'],
  ['Natalie Portman', 'women', 55, 'Of course, anytime.', 'Book club this Friday.'],
  ['Karen Gillan', 'women', 17, "Haha you're too funny", 'Check this meme out.'],
  ['Chadwick Reed', 'men', 8, 'Wakanda forever!', 'Thanks for the invite.'],
  ['Pom Klementieff', 'women', 12, 'Take care ❤️', 'Missed you at dinner.'],
  ['Dave Bautista', 'men', 90, 'Bring snacks.', 'Movie night, yes or no?'],
  ['Evangeline Lilly', 'women', 76, 'Sounds like a plan.', 'Flight lands at 9.'],
]

const filler = [
  'Hey, how have you been?',
  'Pretty good! Busy week though.',
  'Same here. Did you see the news?',
  'Yes! Wild, right?',
  'We should catch up soon.',
  'Definitely. Let me check my schedule.',
  'Sounds good, just let me know.',
  'Will do 👍',
  'By the way, thanks for the help yesterday.',
  'Anytime!',
]

export function buildDummyChats(now: number = Date.now()): Chat[] {
  const MIN = 60_000
  const H = 60 * MIN
  const D = 24 * H
  const offsets = [10_000, 25 * MIN, 2 * H, 5 * H, 1 * D, 2 * D, 4 * D, 7 * D]
  return people.map(([name, g, n, last, first], i) => {
    const ago = i < offsets.length ? offsets[i] : (8 + (i - offsets.length) * 3) * D
    const t = now - ago
    const older = 2 + (i % 4)
    const unread = i % 3 === 0 ? (i % 5) + 1 : 0
    return {
      id: i + 1,
      contact: { name, avatar: `https://randomuser.me/api/portraits/${g}/${n}.jpg` },
      unread,
      messages: [
        // older conversation on the previous day(s) so date separators show up
        ...Array.from({ length: older }, (_, k) => ({
          id: `${i}-f${k}`,
          from: (k % 2 ? 'me' : 'them') as 'me' | 'them',
          text: filler[(i + k) % filler.length],
          at: t - D - (older - k) * 7 * MIN,
        })),
        { id: `${i}-1`, from: 'them' as const, text: first, at: t - 2 * MIN },
        { id: `${i}-2`, from: i % 2 ? ('me' as const) : ('them' as const), text: last, at: t },
      ],
    }
  })
}
