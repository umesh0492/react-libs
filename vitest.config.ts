import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 20000,
    hookTimeout: 20000,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/__tests__/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    exclude: [
      'src/**/*.stories.{ts,tsx}',
      'node_modules/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/components/ui/**', 'src/lib/**'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/test/**',
        'src/**/*.d.ts',
        'node_modules/**',
      ],
      thresholds: {
        statements: 75,
        branches: 60,
        functions: 70,
        lines: 75,
      },
    },
  },
});