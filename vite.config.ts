import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/client',
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/client/App.tsx'),
      name: 'IntelligentChat',
      fileName: (format) => `intelligent-chat.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  server: {
    port: 5174,
    cors: true
  },
  css: {
    postcss: {
      plugins: [require('tailwindcss')]
    }
  },
  publicDir: '../../public'
});