import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { firebaseApp } from '../firebaseConfig'
const auth = getAuth(firebaseApp)

function useCurrentUser(): User | null {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsbscribe = onAuthStateChanged(auth, setUser)
    return () => unsbscribe()
  }, [])

  return user
}

export default useCurrentUser
