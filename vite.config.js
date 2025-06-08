import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: '/submit', // or whatever route you want
    // Use Opera's path (this works only with a CLI browser name Vite recognizes)
    // macOS doesn't recognize "Opera" by default, so it may not work without a workaround
  },
});
