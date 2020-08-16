import { useState, useEffect } from 'react'
import { db } from '../firebase'
import useIsOnline from './useIsOnline';

function useChannelList() {
  const isOnline = useIsOnline()
  const [channelList, setChannelList] = useState([]);

  useEffect(() => {
    function handleStatusChange(channelList) {
      setChannelList(channelList);
      console.log(channelList)
    }
  
    if (isOnline) {
      const unsubscribe = db.collection("channels").orderBy("name").onSnapshot(snapshot => {
        handleStatusChange(convertChannelList(snapshot))
      })
      return () => {
        unsubscribe();
      }
    }
  }, [isOnline])
 

  return isOnline ? channelList : []
}

export default useChannelList

const convertChannelList = (snapshot) => {
  let channelList = []
  snapshot.forEach(doc => {
    channelList.push({
      id: doc.id,
      owner: doc.data().owner,
      name: doc.data().name,
      createdAt: doc.data().createdAt * 1000
    })
  })
  return channelList
}

