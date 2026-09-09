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
  // 1. Client Components & Interactive Modules
  {
    entry: {
      index: 'src/index.ts',
      'hooks/use-toast': 'src/hooks/use-toast.ts',
      'analytics/index': 'src/lib/analytics/index.ts',
      'india/index': 'src/india/index.ts',
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
  // 2. Pure Utilities (Server/Edge/RSC Safe, Zero Directive)
  {
    entry: {
      utils: 'src/utils.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    splitting: false,
    injectStyle: false,
    external: [
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'date-fns',
    ],
  },
]);

