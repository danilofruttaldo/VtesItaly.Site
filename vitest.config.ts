import { getViteConfig } from 'astro/config';

// `getViteConfig` reuses the resolved Astro Vite config so tests see the same
// alias/import.meta.glob/JSON loader rules the production build uses. This is
// required for test files that import .astro components or content.config.ts.
export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/integration/**', 'node_modules/**', 'dist/**', '.astro/**'],
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/utils/**', 'src/schemas/**'],
      exclude: ['src/**/*.test.ts'],
      thresholds: {
        lines: 90,
        functions: 95,
        branches: 85,
        statements: 90,
      },
    },
  },
});
