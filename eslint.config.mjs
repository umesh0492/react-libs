// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';

/**
 * Custom rule: ban hardcoded hex/rgb/hsl color literals in component source files.
 *
 * All colours in react-lib must be sourced from the design token system via
 * semantic Tailwind classes (e.g. `bg-primary`, `text-muted-foreground`) or CSS
 * custom properties (e.g. `var(--primary)`).
 *
 * ✅ Allowed:  className="bg-primary text-muted-foreground"
 * ✅ Allowed:  style={{ color: 'var(--destructive)' }}
 * ❌ Banned:   style={{ color: '#ef4444' }}
 * ❌ Banned:   style={{ background: 'rgb(239, 68, 68)' }}
 * ❌ Banned:   className="text-[#ef4444]"   (arbitrary Tailwind value)
 */
const noHardcodedColors = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow hardcoded color literals. Use design tokens (CSS custom properties or Tailwind semantic classes) instead.',
      url: 'https://github.com/umesh0492/react-libs/blob/main/CONTRIBUTING.md#design-tokens',
    },
    schema: [],
    messages: {
      hexColor:
        'Hardcoded hex color "{{value}}" found. Use a design token instead (e.g. `bg-primary`, `text-destructive`, `var(--primary)`).',
      rgbColor:
        'Hardcoded rgb/rgba/hsl/hsla color "{{value}}" found. Use a design token instead.',
      arbitraryTailwind:
        'Arbitrary Tailwind color value "{{value}}" found. Use a semantic Tailwind class instead.',
    },
  },
  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    const HEX_RE = /(?<![a-zA-Z0-9_-])#([0-9a-fA-F]{3,8})\b/;
    const RGB_RE = /\b(rgb|rgba|hsl|hsla)\s*\(/i;
    // Arbitrary Tailwind color: text-[#fff], bg-[rgb(...)], border-[hsl(...)] etc.
    const ARBITRARY_COLOR_RE =
      /\b(?:text|bg|border|ring|fill|stroke|shadow|outline|decoration|from|via|to)-\[(?:#|rgb|rgba|hsl|hsla)/i;

    /**
     * @param {import('eslint').Rule.Node} node
     * @param {string} value
     */
    function checkStringValue(node, value) {
      if (HEX_RE.test(value)) {
        context.report({
          node,
          messageId: 'hexColor',
          data: { value: (value.match(HEX_RE) || [''])[0] },
        });
      } else if (RGB_RE.test(value)) {
        context.report({
          node,
          messageId: 'rgbColor',
          data: { value: (value.match(RGB_RE) || [''])[0] + '...' },
        });
      } else if (ARBITRARY_COLOR_RE.test(value)) {
        context.report({
          node,
          messageId: 'arbitraryTailwind',
          data: { value: (value.match(ARBITRARY_COLOR_RE) || [''])[0] },
        });
      }
    }

    return {
      /** @param {import('eslint').Rule.Node & {value: unknown}} node */
      Literal(node) {
        if (typeof node.value === 'string') checkStringValue(node, /** @type {string} */ (node.value));
      },
      /** @param {import('eslint').Rule.Node & {quasis: Array<{value: {raw: string}}>}} node */
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          checkStringValue(node, quasi.value.raw);
        }
      },
    };
  },
};

/**
 * Custom rule: ban hardcoded font families.
 * All typography must use design token variables.
 */
const noHardcodedFonts = {
  meta: {
    type: 'suggestion',
    messages: {
      hardcodedFont: 'Hardcoded font family "{{value}}" found. Use var(--font-sans) or var(--font-display) instead.',
    },
  },
  create(context) {
    const FONT_RE = /font-family:\s*['"]([^'"]+)['"]/;
    return {
      Literal(node) {
        if (typeof node.value === 'string' && FONT_RE.test(node.value)) {
          context.report({
            node,
            messageId: 'hardcodedFont',
            data: { value: node.value.match(FONT_RE)[1] },
          });
        }
      },
    };
  },
};

/**
 * Custom rule: prevent JWT/tokens in URL query strings.
 */
const noUnsafeTokens = {
  meta: {
    type: 'problem',
    messages: {
      unsafeToken: 'Potential security risk: Raw tokens found in URL string. Use Authorization headers instead.',
    },
  },
  create(context) {
    const TOKEN_URL_RE = /[?&](token|jwt|auth)=/i;
    return {
      Literal(node) {
        if (typeof node.value === 'string' && TOKEN_URL_RE.test(node.value)) {
          context.report({
            node,
            messageId: 'unsafeToken',
          });
        }
      },
    };
  },
};

export default tseslint.config(
  // ─── Global ignores ────────────────────────────────────────────────────────
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'storybook-static/**',
      'coverage/**',
      '.storybook/**',
      'scripts/**',
      '**/*.test.{ts,tsx}',
      '**/*.stories.{ts,tsx}',  // stories use raw values for demos
      'src/stories/**',         // docs stories also excluded
      '**/*.d.ts',
    ],
  },

  // ─── Base JS rules ─────────────────────────────────────────────────────────
  js.configs.recommended,

  // ─── TypeScript rules ──────────────────────────────────────────────────────
  ...tseslint.configs.recommended,

  // ─── React Hooks rules ─────────────────────────────────────────────────────
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // ─── Free Security & A11y Reviewer ──────────────────────────────────────────
  jsxA11y.flatConfigs.recommended,
  security.configs.recommended,
  // @ts-ignore - sonarjs.configs is defined at runtime but missing from some type definitions
  sonarjs.configs?.recommended || {},

  // ─── Component source: design token enforcement ────────────────────────────
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/lib/**/*.{ts,tsx}'],
    plugins: {
      'design-tokens': {
        rules: { 
          'no-hardcoded-colors': noHardcodedColors,
          'no-hardcoded-fonts': noHardcodedFonts,
          'no-unsafe-tokens': noUnsafeTokens
        },
      },
    },
    rules: {
      // Design token system — no raw hex/rgb/hsl in component files
      'design-tokens/no-hardcoded-colors': 'warn',
      'design-tokens/no-hardcoded-fonts': 'error',
      'design-tokens/no-unsafe-tokens': 'error',

      // TypeScript quality
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Prefer React.ComponentRef over the deprecated React.ElementRef
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='React'][property.name='ElementRef']",
          message:
            'React.ElementRef is deprecated in React 19. Use React.ComponentRef<typeof X> instead.',
        },
      ],
    },
  },
);
