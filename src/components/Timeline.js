import React, { useRef, useState, useEffect } from 'react'
import Message from './Message';
import {db} from '../firebase'

const Timeline = ({channel}) => {
  const messagesEndRef = useRef(null)
  const [timeline, setTimeline] = useState([]);

  const convertSnapshot = (snapshot) => {
    const timeline = []
    snapshot.forEach(doc => {
      const data = doc.data()
      timeline.push({
        owner: data.owner,
        from: data.from,
        body: data.body,
        createdAt: data["createdAt"] ? data.createdAt.seconds * 1000 : Date.now(),
        metadata: data["metadata"] ? data.metadata : null
      })
    })
    return timeline
  }

  useEffect(() => {
    const unsubscribe = db.collection("channels").doc(channel).collection("posts").orderBy("createdAt").onSnapshot(snapshot => {
      setTimeline(convertSnapshot(snapshot))
    })
    return () => {
      unsubscribe();
    }
  }, [channel])

  // auto scroll
  useEffect(() => {
    messagesEndRef.current.scrollIntoView()
  }, [timeline])

  return (
    <box>
      {
        timeline.map((message,index) => <Message message={message} key={index} />)
      }
      <div ref={messagesEndRef} />
    </box>
  )
}

export default Timeline;
