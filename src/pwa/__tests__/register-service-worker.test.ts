import { describe, expect, it, vi } from 'vitest';

describe('service worker registration', () => {
  it('registers only when enabled and supported', async () => {
    const register = vi.fn(async () => new EventTarget() as ServiceWorkerRegistration);
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register, addEventListener: vi.fn(), controller: null },
    });
    const { registerServiceWorker } = await import('../register-service-worker');

    expect(await registerServiceWorker(false)).toBe(false);
    expect(register).not.toHaveBeenCalled();
    expect(await registerServiceWorker(true)).toBe(true);
    expect(register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
  });
});
