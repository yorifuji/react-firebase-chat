interface Message {
  id: string
  owner: string
  from: string
  body: string
  createdAt: Date
  metadata: Meeting | null
}

interface Meeting {
  meeting: {
    url: string
  }
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
  channelID: string
  owner: string
  name: string
  createdAt: number
}
