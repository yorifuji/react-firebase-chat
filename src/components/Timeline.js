import React, { useRef, useState, useEffect } from 'react'
import Message from './Message';
import {db} from '../firebase'
import { Box } from '@material-ui/core';

const Timeline = ({channel}) => {
  const messagesEndRef = useRef(null)
  const [timeline, setTimeline] = useState([]);
  const [reactions, setReactions] = useState([])

  const convertSnapshot = (snapshot) => {
    const timeline = []
    snapshot.forEach(doc => {
      const data = doc.data()
      console.log(data)
      timeline.push({
        id: doc.id,
        owner: data.owner,
        from: data.from,
        body: data.body,
        createdAt: data["createdAt"] ? data.createdAt.seconds * 1000 : Date.now(),
        metadata: data["metadata"] ? data.metadata : null,
        reactions: data["reactions"] ? data.reactions : null
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

  useEffect(() => {
    const unsubscribe = db.collectionGroup('reactions').onSnapshot(snapshot => {
      const reactions = []
      snapshot.forEach(doc => {
        reactions.push({id:doc.id, ...doc.data()})
      })
      reactions.sort((a,b) => {
        if (a.emoji > b.emoji) return 1
        else return -1
      })
      setReactions(reactions)
    })
    return () => {
      unsubscribe()
    }
  }, [timeline])

  const getReactions = (messageID) => {
    return reactions.filter(reaction => reaction.post == messageID)
  }

  // auto scroll
  useEffect(() => {
    messagesEndRef.current.scrollIntoView()
  }, [timeline])

  return (
    <Box>
      {
        timeline.map((message,index) => <Message key={index} channel={channel} message={message} reactions={getReactions(message.id)}/>)
      }
      <div ref={messagesEndRef} />
    </Box>
  )
}

export default Timeline;
