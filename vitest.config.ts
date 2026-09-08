import { defineConfig } from 'vitest/config';

export default defineConfig({
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
      include: ['src/components/ui/**', 'src/lib/**', 'src/hooks/**', 'src/utils.ts'],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/stories/**',
        'src/test/**',
        'src/**/*.d.ts',
        '**/*.css',
        'node_modules/**',
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
  },
});