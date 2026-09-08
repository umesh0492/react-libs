import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'hooks/use-toast': 'src/hooks/use-toast.ts',
      pdf: 'src/components/ui/data-display/pdf-viewer.tsx',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    splitting: true,
    banner: {
      js: "'use client';",
    },
    injectStyle: false,
    external: ['xlsx', 'jspdf', 'jspdf-autotable', 'react-pdf'],
  },
  {
    entry: {
      utils: 'src/utils.ts',
      'analytics/index': 'src/lib/analytics/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    splitting: true,
    injectStyle: false,
  },
]);
