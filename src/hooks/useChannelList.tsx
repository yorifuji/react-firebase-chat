import { useState, useEffect } from 'react'
import useIsOnline from './useIsOnline';

import firebase from '../firebaseConfig'
import { firebaseApp } from '../firebaseConfig';
import { getFirestore, orderBy, QuerySnapshot } from "firebase/firestore";
import { collection, query, onSnapshot } from "firebase/firestore";
const db = getFirestore(firebaseApp);

function useChannelList() {
  const isOnline = useIsOnline()
  const [channelList, setChannelList] = useState<object[]>([]);

  useEffect(() => {
    const convert = (snapshot: QuerySnapshot) => {
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
      const q = query(collection(db, "channels"), orderBy("name"));
      const unsubscribe = onSnapshot(q, convert)
      return () => unsubscribe()
    }
  }, [isOnline])


  return isOnline ? channelList : []
}

export default useChannelList
