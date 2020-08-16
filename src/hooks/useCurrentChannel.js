import { useState, useEffect } from 'react'
import useIsOnline from './useIsOnline';

function useCurrentChannel(location) {
  const isOnline = useIsOnline()
  const [channel, setChannel] = useState(null);

  function handleStatusChange(user) {
    setChannel(user)
  }

  useEffect(() => {
    if (location.pathname.indexOf("/channel/") === 0) {
      handleStatusChange(location.pathname.slice("/channel/".length))
    }
  }, [location])

  return isOnline ? channel : null
}

export default useCurrentChannel