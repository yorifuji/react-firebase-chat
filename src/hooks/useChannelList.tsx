import { useState, useEffect } from 'react'
import useIsOnline from './useIsOnline'

import { firebaseApp } from '../firebaseConfig'
import { getFirestore, orderBy, Timestamp } from 'firebase/firestore'
import { collection, query, onSnapshot } from 'firebase/firestore'
const db = getFirestore(firebaseApp)

function useChannelList(): Channel[] {
  const isOnline = useIsOnline()
  const [channelList, setChannelList] = useState<Channel[]>([])

  useEffect(() => {
    if (isOnline) {
      const q = query(collection(db, 'channels'), orderBy('name'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const channelListTmp: Array<Channel> = []
        querySnapshot.forEach((doc) => {
          const data: firestoreChannel = doc.data() as firestoreChannel
          const channel: Channel = {
            channelID: data.channelID,
            owner: data.owner,
            name: data.name,
            createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
          }
          channelListTmp.push(channel)
        })
        setChannelList(channelListTmp)
      })
      return () => unsubscribe()
    }
  }, [isOnline])

  return isOnline ? channelList : []
}

export default useChannelList
