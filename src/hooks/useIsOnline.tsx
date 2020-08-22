import { useState, useEffect } from 'react'
import firebase from '../firebase'

function useIsOnline() {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    const unsbscribe = firebase.auth().onAuthStateChanged(user => setIsOnline(user ? true : false))
    return () => unsbscribe()
  })

  return isOnline
}

export default useIsOnline