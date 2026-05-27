import { useEffect } from 'react';
import { useInspirationStore } from '../store/useInspirationStore';

export function useInspirations() {
  const store = useInspirationStore();

  useEffect(() => {
    store.fetchInspirations();
  }, []);

  return store;
}
