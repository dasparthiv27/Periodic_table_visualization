import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function offlineShellPlugin(): Plugin {
  const workerTemplate = readFileSync(path.resolve(projectRoot, 'src/pwa/service-worker.js'), 'utf8');

  return {
    name: 'atomic-explorer-offline-shell',
    apply: 'build',
    generateBundle(_options, bundle) {
      const bundledAssets = Object.values(bundle)
        .filter((file) => file.fileName !== 'sw.js' && !file.fileName.endsWith('.map'))
        .map((file) => `/${file.fileName}`);
      const assets = [...new Set(['/index.html', ...bundledAssets, '/favicon.svg', '/app-icon.svg', '/manifest.webmanifest'])];
      const buildId = createHash('sha256').update(assets.join('\n')).digest('hex').slice(0, 12);
      const cacheName = `atomic-explorer-shell-${Date.now()}-${buildId}`;
      const worker = workerTemplate
        .replace('__CACHE_NAME__', cacheName)
        .replace('__PRECACHE_URLS__', JSON.stringify(assets));

      this.emitFile({ type: 'asset', fileName: 'sw.js', source: worker });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlineShellPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
