const UPDATE_READY_EVENT = 'atomic-explorer-update-ready';

let registration: ServiceWorkerRegistration | null = null;
let reloadAfterUpdate = false;
let listenerInstalled = false;

function announceUpdate(): void {
  window.dispatchEvent(new Event(UPDATE_READY_EVENT));
}

export async function registerServiceWorker(enabled = import.meta.env.PROD): Promise<boolean> {
  if (!enabled || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return false;

  try {
    registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    if (!listenerInstalled) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloadAfterUpdate) window.location.reload();
      });
      listenerInstalled = true;
    }
    if (registration.waiting && navigator.serviceWorker.controller) announceUpdate();
    registration.addEventListener('updatefound', () => {
      const worker = registration?.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) announceUpdate();
      });
    });
    return true;
  } catch {
    // The application remains usable online when service worker registration is blocked.
    return false;
  }
}

export function activateServiceWorkerUpdate(): boolean {
  if (!registration?.waiting) return false;
  reloadAfterUpdate = true;
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  return true;
}

export const serviceWorkerUpdateEvent = UPDATE_READY_EVENT;
