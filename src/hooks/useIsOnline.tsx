import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '../firebaseConfig';
const auth = getAuth(firebaseApp);

function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    const unsbscribe = onAuthStateChanged(auth, (user) =>
      setIsOnline(user ? true : false)
    );
    return () => unsbscribe();
  });

  return isOnline;
}

export default useIsOnline;
