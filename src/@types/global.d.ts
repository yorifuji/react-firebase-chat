interface Message {
  id: string;
  owner: string;
  from: string;
  body: string;
  createdAt: Date;
  metadata: any;
}

interface Reaction {
  id: string;
  uid: string;
  post: string;
  channel: string;
  emoji: string;
  createdAt: Date;
}

interface ReactionUI {
  emoji: string;
  items: Reaction[];
}
