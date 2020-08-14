import { useState, useEffect } from 'react'
import {db} from '../firebase'

function useTimeline(channel) {
  const [timeline, setTimeline] = useState([]);

  function handleStatusChange(timeline) {
    setTimeline(timeline)
    console.log(timeline)
  }

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
      handleStatusChange(convertSnapshot(snapshot))
    })
    return () => {
      unsubscribe();
    }
  }, [channel])

  return timeline
}

export default useTimeline