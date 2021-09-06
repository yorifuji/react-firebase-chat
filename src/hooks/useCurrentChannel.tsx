import { useState, useEffect } from 'react';
import useIsOnline from './useIsOnline';

function useCurrentChannel(location: Location) {
  const isOnline = useIsOnline();
  const [channel, setChannel] = useState<string | null>(null);

  function handleStatusChange(channel: string) {
    setChannel(channel);
  }

  useEffect(() => {
    if (location.pathname.indexOf('/channel/') === 0) {
      handleStatusChange(location.pathname.slice('/channel/'.length));
    }
  }, [location]);

  return isOnline ? channel : null;
}

export default useCurrentChannel;
