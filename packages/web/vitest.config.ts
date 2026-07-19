import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Vitest picks this up in preference to vite.config.ts, so the reading-pane
// component tests run in jsdom without pulling in the dev server / Tailwind
// plugin config. Tailwind classes aren't evaluated in tests — behaviour, not
// styling, is what's asserted.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    css: false,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
