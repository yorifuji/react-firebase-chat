interface Message {
  id: string
  owner: string
  from: string
  body: string
  createdAt: Date
  metadata: any
}

interface Reaction {
  id: string
  uid: string
  post: string
  channel: string
  emoji: string
  createdAt: Date
}

interface ReactionUI {
  emoji: string
  items: Reaction[]
}

interface Channel {
  id: string
  owner: string
  name: string
  createdAt: number
}
