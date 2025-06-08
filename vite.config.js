import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/nyt-leaderboard/',  // for GitHub Pages
  plugins: [react()],
  server: {
    open: '/nyt-leaderboard/', // opens the root inside the base
  },
});
