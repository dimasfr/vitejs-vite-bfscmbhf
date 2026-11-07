export interface Message {
  id: string
  from: 'me' | 'them'
  text: string
  at: number
}
export interface Contact {
  name: string
  avatar: string
}
export interface Chat {
  id: number
  contact: Contact
  unread: number
  messages: Message[]
}
