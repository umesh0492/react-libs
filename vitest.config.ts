import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // Controlled worker concurrency matching standard 2-vCPU CI runners to prevent process contention
    pool: 'forks',
    maxWorkers: process.env.CI ? 2 : 2,
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
      include: ['src/components/ui/**', 'src/lib/**', 'src/hooks/**', 'src/india/**', 'src/utils.ts'],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/stories/**',
        'src/test/**',
        'src/**/*.d.ts',
        '**/*.css',
        'node_modules/**',
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
});