import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

const template = readFileSync(resolve(process.cwd(), 'src/pwa/service-worker.js'), 'utf8');
const assetList = ['/index.html', '/assets/app.js', '/manifest.webmanifest'];
const source = template
  .replace('__CACHE_NAME__', 'atomic-explorer-shell-test')
  .replace('__PRECACHE_URLS__', JSON.stringify(assetList));

interface WorkerEvent {
  data?: { type?: string };
  request?: { method: string; url: string; mode: string };
  waitUntil?: (promise: Promise<void>) => void;
  respondWith?: (promise: Promise<unknown>) => void;
}

function loadWorker() {
  const handlers: Record<string, (event: WorkerEvent) => void> = {};
  const cache = {
    addAll: vi.fn(async () => undefined),
    match: vi.fn(async (key: string) => key === 'https://example.test/index.html' ? { cached: true } : undefined),
    put: vi.fn(async () => undefined),
  };
  const caches = {
    open: vi.fn(async () => cache),
    keys: vi.fn(async () => ['atomic-explorer-shell-test']),
    delete: vi.fn(async () => true),
  };
  const self = {
    location: { origin: 'https://example.test' },
    clients: { claim: vi.fn(async () => undefined) },
    skipWaiting: vi.fn(),
    addEventListener: (type: string, handler: (event: WorkerEvent) => void) => { handlers[type] = handler; },
  };
  const responseApi = { error: () => ({ offlineError: true }) };
  const fetcher = vi.fn(async () => { throw new Error('offline'); });
  new Function('self', 'caches', 'fetch', 'URL', 'Response', source)(self, caches, fetcher, URL, responseApi);
  const trigger = (type: string, event: WorkerEvent) => {
    const handler = handlers[type];
    if (!handler) throw new Error(`No ${type} handler registered`);
    handler(event);
  };
  return { trigger, cache, caches, self, fetcher };
}

describe('generated offline service worker', () => {
  it('precaches only the production app shell and static assets', async () => {
    const { trigger, cache } = loadWorker();
    let install: Promise<void> | undefined;
    trigger('install', { waitUntil: (promise: Promise<void>) => { install = promise; } });
    await install;
    expect(cache.addAll).toHaveBeenCalledWith(assetList);
  });

  it('serves a cached app shell when navigation is offline', async () => {
    const { trigger } = loadWorker();
    let response: Promise<unknown> | undefined;
    trigger('fetch', {
      request: { method: 'GET', url: 'https://example.test/some-path', mode: 'navigate' },
      respondWith: (promise: Promise<unknown>) => { response = promise; },
    });
    expect(await response).toEqual({ cached: true });
  });

  it('does not intercept API or cross-origin resources and supports prompted updates', () => {
    const { trigger, self, caches, fetcher } = loadWorker();
    const respondWith = vi.fn();
    trigger('fetch', { request: { method: 'GET', url: 'https://example.test/api/data', mode: 'cors' }, respondWith });
    trigger('fetch', { request: { method: 'GET', url: 'https://cdn.example.test/app.js', mode: 'cors' }, respondWith });
    expect(respondWith).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();

    trigger('message', { data: { type: 'SKIP_WAITING' } });
    expect(self.skipWaiting).toHaveBeenCalledOnce();
    expect(caches.delete).not.toHaveBeenCalled();
  });
});
