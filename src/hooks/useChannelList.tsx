import { useState, useEffect } from 'react';
import useIsOnline from './useIsOnline';

import { firebaseApp } from '../firebaseConfig';
import {
  DocumentData,
  getFirestore,
  orderBy,
  QuerySnapshot,
} from 'firebase/firestore';
import { collection, query, onSnapshot } from 'firebase/firestore';
const db = getFirestore(firebaseApp);

function useChannelList(): Channel[] {
  const isOnline = useIsOnline();
  const [channelList, setChannelList] = useState<Channel[]>([]);

  useEffect(() => {
    const convert = (snapshot: QuerySnapshot) => {
      const channelList: Channel[] = [];
      snapshot.forEach((doc: DocumentData) => {
        channelList.push({
          id: doc.id,
          owner: doc.data().owner,
          name: doc.data().name,
          createdAt: doc.data().createdAt * 1000,
        });
      });
      setChannelList(channelList);
      console.log(channelList);
    };

    if (isOnline) {
      const q = query(collection(db, 'channels'), orderBy('name'));
      const unsubscribe = onSnapshot(q, convert);
      return () => unsubscribe();
    }
  }, [isOnline]);

  return isOnline ? channelList : [];
}

export default useChannelList;
