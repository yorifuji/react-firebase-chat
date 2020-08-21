import { useState, useEffect } from 'react'
import firebase from '../firebase'

function useCurrentUser() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    function handleStatusChange(user) {
      setUser(user)
    }
    const unsbscribe = firebase.auth().onAuthStateChanged(user => {
      handleStatusChange(user)
    })
    return () => {
      unsbscribe()
    }
  })

  return user
}

export default useCurrentUser