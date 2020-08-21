import { useState, useEffect } from 'react'
import firebase from '../firebase'

function useCurrentUser() {
  const [user, setUser] = useState<firebase.User | null>(null)

  useEffect(() => {
    const unsbscribe = firebase.auth().onAuthStateChanged(setUser)
    return () => unsbscribe()
  }, [])

  return user
}

export default useCurrentUser