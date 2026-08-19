/// <reference types="vitest" />
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // Run only JSDOM unit tests via `npm run test` — stories are excluded via glob.
    // The @storybook/addon-vitest plugin injects its own Chromium project at runtime;
    // coverage is scoped here to only JSDOM files so it won't be overwritten.
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Explicitly exclude stories so the flat vitest run never touches them
    include: ['src/**/__tests__/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    exclude: [
      'src/**/*.stories.{ts,tsx}',
      'node_modules/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/components/ui/**', 'src/lib/**'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/test/**',
        'src/**/*.d.ts',
        'node_modules/**',
      ],
      thresholds: {
        statements: 86,
        branches: 64,
        functions: 82,
        lines: 86,
      },
    },
  },
})
