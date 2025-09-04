import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@apis', replacement: '/src/apis' },
      { find: '@assets', replacement: '/src/assets' },
      { find: '@components', replacement: '/src/components' },
      { find: '@constants', replacement: '/src/constants' },
      { find: '@enums', replacement: '/src/enums' },
      { find: '@hooks', replacement: '/src/hooks' },
      { find: '@layouts', replacement: '/src/layouts' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@routes', replacement: '/src/routes' },
      { find: '@types', replacement: '/src/types' },
      { find: '@utils', replacement: '/src/utils' },
    ],
  },
  server: {
    port: 5175,
    host: true,
    proxy: {
      '/api/proxy': {
        target: 'http://52.3.42.186',
        changeOrigin: true,
        rewrite: (path) => {
          // /api/proxy?path=/walk/weather -> /walk/weather
          const url = new URL(path, 'http://localhost');
          const pathParam = url.searchParams.get('path');
          return pathParam || path;
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[DEV Proxy] ${req.method} ${req.url} -> ${options.target}${proxyReq.path}`);
            
            // 인증 헤더 전달
            if (req.headers.jsessionid) {
              proxyReq.setHeader('JSESSIONID', req.headers.jsessionid);
            }
            if (req.headers['x-session-id']) {
              proxyReq.setHeader('X-Session-ID', req.headers['x-session-id']);
            }
          });
        }
      }
    }
  },
});
