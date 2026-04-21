import { defineConfig } from 'vitest/config';

// Separate config for post-build integration tests: they run against the
// already-built dist/ directory so they don't need the Astro Vite plugin
// (avoids re-running the dev server during build verification).
export default defineConfig({
  test: {
    include: ['tests/integration/**/*.test.ts'],
    environment: 'node',
  },
});
