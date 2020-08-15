import { useState, useEffect } from 'react'
import firebase from '../firebase'
import useIsOnline from './useIsOnline';

function useCurrentUser() {
  const isOnline = useIsOnline()
  const [user, setUser] = useState(firebase.auth().currentUser);

  function handleStatusChange(user) {
    setUser(user)
  }

  useEffect(() => {
    handleStatusChange(firebase.auth().currentUser)
  }, [isOnline])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      handleStatusChange(user)
    })
  })

  return isOnline ? user : null
}

export default useCurrentUser