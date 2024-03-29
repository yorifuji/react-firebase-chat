import { useRef, useState, useEffect } from 'react'
import Message from './Message'
import { Box } from '@material-ui/core'
import { firebaseApp } from '../firebaseConfig'
import { collectionGroup, getFirestore, orderBy, QuerySnapshot, Timestamp } from 'firebase/firestore'
import { collection, query, onSnapshot } from 'firebase/firestore'
const db = getFirestore(firebaseApp)

interface Props {
  channel: string
}

const Timeline = (props: Props): JSX.Element => {
  const channel = props.channel
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [timeline, setTimeline] = useState<Message[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])

  const convertSnapshot = (snapshot: QuerySnapshot) => {
    const timeline: Message[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      timeline.push({
        id: doc.id,
        owner: data.owner,
        from: data.from,
        body: data.body,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
        metadata: data.metadata ? data.metadata : {},
      })
    })
    setTimeline(timeline)
  }

  useEffect(() => {
    const q = query(collection(db, 'channels', channel, 'posts'), orderBy('createdAt'))
    const unsubscribe = onSnapshot(q, convertSnapshot)
    return () => unsubscribe()
  }, [channel])

  useEffect(() => {
    const q = query(collectionGroup(db, 'reactions'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reactions: Array<Reaction> = []
      querySnapshot.forEach((doc) => {
        reactions.push({
          id: doc.id,
          uid: doc.data().uid,
          post: doc.data().post,
          channel: doc.data().channel,
          emoji: doc.data().emoji,
          createdAt: doc.data().createdAt,
        })
      })
      reactions.sort((a, b) => {
        if (a.emoji > b.emoji) return 1
        else return -1
      })
      setReactions(reactions)
    })
    return () => unsubscribe()
  }, [timeline])

  const getReactions = (messageID: string) => {
    return reactions.filter((reaction) => reaction.post === messageID)
  }

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView()
  }, [timeline])

  return (
    <Box>
      {timeline.map((message, index) => (
        <Message key={index} channel={channel} message={message} reactions={getReactions(message.id)} />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  )
}

export default Timeline
