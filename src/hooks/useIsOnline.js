import { useState, useEffect } from 'react'
import firebase from '../firebase'

function useIsOnline() {
  const [isOnline, setIsOnline] = useState(false);

  function handleStatusChange(user) {
    setIsOnline(user ? true : false);
    console.log(isOnline)
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      handleStatusChange(user)
    })
  })

  return isOnline
}

export default useIsOnline