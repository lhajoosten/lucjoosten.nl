import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { pages } from './src/app/metadata.ts';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'prerendered-page-preview',
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url ?? '/', 'http://localhost');
          const path = url.pathname.replace(/\/$/, '') || '/';
          if (path !== '/' && pages.some((page) => page.path === path)) {
            request.url = `${path}/index.html${url.search}`;
          }
          next();
        });
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
