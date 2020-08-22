import { useState, useEffect } from 'react'
import { db } from '../firebase'
import useIsOnline from './useIsOnline';

function useChannelList() {
  const isOnline = useIsOnline()
  const [channelList, setChannelList] = useState<object[]>([]);

  useEffect(() => {
    const convert = (snapshot: firebase.firestore.QuerySnapshot) => {
      let channelList: object[] = []
      snapshot.forEach((doc: firebase.firestore.DocumentData) => {
        channelList.push({
          id: doc.id,
          owner: doc.data().owner,
          name: doc.data().name,
          createdAt: doc.data().createdAt * 1000
        })
      })
      setChannelList(channelList);
      console.log(channelList)
    }

    if (isOnline) {
      const unsubscribe = db.collection("channels").orderBy("name").onSnapshot(convert)
      return () => unsubscribe()
    }
  }, [isOnline])


  return isOnline ? channelList : []
}

export default useChannelList
