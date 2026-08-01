import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['utils/**/*.test.js', 'src/**/*.test.jsx'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.jsx'],
  },
});
