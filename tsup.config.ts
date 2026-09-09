import { defineConfig } from 'tsup';

const CLIENT_EXTERNAL = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'date-fns',
  'pdfjs-dist',
  'xlsx',
  'jspdf',
  'jspdf-autotable',
  'react-pdf',
  'recharts',
  'canvas-confetti',
  'embla-carousel-react',
  'cmdk',
  'vaul',
  'react-hook-form',
  'react-day-picker',
  'next-themes',
  'lucide-react',
  'sonner',
  'input-otp',
  'react-resizable-panels',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  /^@radix-ui\/.+/,
];

export default defineConfig([
  // 1. Client Components & Interactive Modules ('use client' banner)
  {
    entry: {
      index: 'src/index.ts',
      'india/react/index': 'src/india/react/index.ts',
      pdf: 'src/components/ui/data-display/pdf-viewer.tsx',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    splitting: false,
    banner: {
      js: "'use client';",
    },
    injectStyle: false,
    external: CLIENT_EXTERNAL,
  },
  // 2. Dedicated Hook Entry Point (Isolated build eliminates shared DTS chunks e.g. use-toast-[hash].d.ts)
  {
    entry: {
      'hooks/use-toast': 'src/hooks/use-toast.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    splitting: false,
    banner: {
      js: "'use client';",
    },
    injectStyle: false,
    external: CLIENT_EXTERNAL,
  },
  // 3. Universal / Server Modules (Pure Utilities, India Pure Domain & Universal Analytics, Zero Directive)
  {
    entry: {
      utils: 'src/utils.ts',
      'analytics/index': 'src/lib/analytics/index.ts',
      'india/index': 'src/india/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    splitting: false,
    injectStyle: false,
    external: CLIENT_EXTERNAL,
  },
]);

