import { useEffect, useState } from 'react';
import { activateServiceWorkerUpdate, serviceWorkerUpdateEvent } from '../pwa/register-service-worker';

export function usePwaStatus() {
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    const updateReady = () => setUpdateReady(true);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    window.addEventListener(serviceWorkerUpdateEvent, updateReady);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
      window.removeEventListener(serviceWorkerUpdateEvent, updateReady);
    };
  }, []);

  return { isOnline, updateReady, applyUpdate: activateServiceWorkerUpdate };
}
