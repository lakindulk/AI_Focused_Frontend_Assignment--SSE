import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy Anthropic API calls through Vite's server to bypass CORS.
      // Browser calls /api/claude/... → Vite server → api.anthropic.com/...
      '/api/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/claude/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('[claude-proxy] error:', err.message);
          });
        },
      },
    },
  },
});
